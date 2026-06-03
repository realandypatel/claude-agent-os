import "server-only";
/**
 * Fire-and-forget error/alert pipe. Best-effort production visibility that NEVER wedges a
 * request. Call as `void reportError(...)` in catch blocks. See docs/FOUNDATION.md §14.
 *
 * Contract:
 *  - no-op when SLACK_ALERTS_WEBHOOK_URL is unset
 *  - no-op when process.env.VERCEL_ENV !== "production"
 *  - rate-limited per `${scope}:${message}` (<=1 / 5 min) via a module-scope Map
 *  - hard POST timeout (~3s) via AbortController so a stuck endpoint can't block a request
 *  - NEVER throws (it is added to existing error paths; a throwing alerter doubles failures)
 *  - reportEscalation(alert): same contract, ticket-shaped, deduped by ticketId
 */

const WINDOW_MS = 5 * 60_000;
const lastSent = new Map<string, number>();

function shouldSend(key: string): boolean {
  const now = Date.now();
  const prev = lastSent.get(key) ?? 0;
  if (now - prev < WINDOW_MS) return false;
  lastSent.set(key, now);
  return true;
}

function normalize(err: unknown): { message: string; stack?: string } {
  if (err instanceof Error) return { message: err.message, stack: err.stack };
  return { message: String(err) };
}

export async function reportError(
  scope: string,
  err: unknown,
  extra?: Record<string, unknown>,
): Promise<void> {
  try {
    const url = process.env.SLACK_ALERTS_WEBHOOK_URL;
    if (!url) return;
    if (process.env.VERCEL_ENV !== "production") return;
    const { message, stack } = normalize(err);
    if (!shouldSend(`${scope}:${message}`)) return;

    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    try {
      await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          text: `:rotating_light: [${scope}] ${message}`,
          blocks: undefined, // shape to taste
          extra,
          stack: stack?.slice(0, 2000),
        }),
        signal: ctrl.signal,
      });
    } finally {
      clearTimeout(t);
    }
  } catch {
    // swallow — best-effort by design
  }
}

export async function reportEscalation(alert: {
  ticketId: string;
  title: string;
  body?: string;
}): Promise<void> {
  // same contract; dedupe by ticketId instead of message
  return reportError(`escalation:${alert.ticketId}`, new Error(alert.title), {
    body: alert.body,
  });
}
