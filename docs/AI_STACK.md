# AI Stack

> Read before adding ANY AI feature. The rule: **reuse the shared stack; never a new client
> or key.** One logged, routed, safety-gated chokepoint — that's the win, not per-token price.

## The chokepoint  〔FILL with your impl〕
- **`runChatCompletion({ feature, ...params })`** — single entry for all text/vision calls.
  Routes by `feature` key to the right model, logs usage to an admin page, and
  **auto-falls-back** to a default provider on rate-limit/error so callers never see a 500.
- **`screenContent({ text, direction })`** — safety classifier run before publishing anything
  outbound. **Fail-open:** unconfigured/errored → `{ safe: true, checked: false }`. Callers
  gate on `checked && !safe`, **never bare `!safe`** (an outage must not block all traffic) —
  and log the `checked: false` rate so a silent gate failure is visible.

## Configuration
- **Env-gated:** with the routing key unset, everything stays on the default provider,
  byte-identical to before. Setting the key turns on the routed/cheaper/safer path.
- **Provider split by capability:** one provider for text/vision/safety, another only for
  voice/audio — each behind an `isXConfigured()` gate with fail-soft when unset.
- **Gate unauthenticated AI endpoints** behind the rate-limiter (cost-DoS).
- Default to the most capable model for the task; document the choice. Don't churn providers
  to "save money" — document the real spend instead.
