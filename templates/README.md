# templates/

Copy-paste starting points.

- **`agent.template.md`** — the skeleton for a new `.claude/agents/<name>.md`. Frontmatter
  is the routing contract; the body is the behavior. Least-privilege tools.
- **`lib/alert.ts`** — design contract for the fire-and-forget error/alert pipe (§14).
- **`lib/rate-limit.ts`** — design contract for the in-memory rate limiter (§11).

The `AGENTS.md` at the repo root **is** the template — every `〔FILL〕` is a blank to complete
per project. Copy it, fill it, keep it ≤300 lines.
