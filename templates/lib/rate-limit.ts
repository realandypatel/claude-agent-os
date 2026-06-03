/**
 * In-memory fixed-window rate limiter for UNAUTHENTICATED / AI endpoints (cost-DoS guard).
 * See docs/FOUNDATION.md §11. NOT cross-instance accurate — documented trade-off; a
 * distributed attacker is handled at the CDN/WAF tier. For anonymous surfaces only.
 *
 * Usage in a route:
 *   const r = rateLimit(ip, { bucket: "help-chat", max: 20, windowMs: 60_000 });
 *   if (!r.allowed) return new Response("Too Many Requests", { status: 429 });
 */

const MAX_ENTRIES = 10_000; // LRU cap so an IP-spraying attacker can't OOM the lambda

type Entry = { count: number; resetAt: number; firstHit: boolean };
const store = new Map<string, Entry>();

export function rateLimit(
  ip: string,
  opts: { max: number; windowMs: number; bucket: string; now?: number },
): { allowed: boolean; remaining: number; resetAt: number; firstHit: boolean } {
  const now = opts.now ?? Date.now();
  const key = `${opts.bucket}:${ip}`;

  let e = store.get(key);
  if (!e || now >= e.resetAt) {
    e = { count: 0, resetAt: now + opts.windowMs, firstHit: true };
  } else {
    e.firstHit = false;
  }
  e.count += 1;

  // LRU-ish eviction: refresh insertion order, evict oldest past the cap
  store.delete(key);
  store.set(key, e);
  if (store.size > MAX_ENTRIES) {
    const oldest = store.keys().next().value as string | undefined;
    if (oldest) store.delete(oldest);
  }

  const allowed = e.count <= opts.max;
  return {
    allowed,
    remaining: Math.max(0, opts.max - e.count),
    resetAt: e.resetAt,
    firstHit: e.firstHit, // log real abuse without per-request spam
  };
}
