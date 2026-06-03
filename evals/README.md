# evals/ — doctrine regression tests (R12)

> Anyone can copy prompts; nobody can copy your test suite. These golden tasks prove the
> agents still behave when `.claude/` or `AGENTS.md` changes.

## How it works
- Each case in `cases/` defines: **fixture** (a seeded defect), **agent under test**,
  **expected outcome** (what a PASS looks like, concretely), and **failure meaning**.
- **Run:** `/eval` (slash command) — the lead spawns each agent against its fixture and
  scores PASS/FAIL against the expected outcome. Report appended to `docs/METRICS.jsonl`.
- **When:** mandatory before committing any change to `.claude/agents/*`, `AGENTS.md`,
  or the hook. CI's law-linter validates eval *structure*; `/eval` validates *behavior*
  (CI has no model access — behavior runs in-session).

## Rules
- An agent-prompt change with a failing eval does not ship. Fix the prompt or prove the
  eval wrong (then update the eval with a "why" — evals are law too).
- New scar → consider a new case. The suite grows with the instincts ledger.
- Cases must be deterministic in expectation: "names the planted root cause" — never
  "gives a good answer."

| Case | Agent | Proves |
|---|---|---|
| 01-investigate-seeded-bug | investigate | root-cause-first discipline |
| 02-security-secret-block | security-agent | HIGH on planted live key, blocks ship |
| 03-code-review-n-plus-1 | code-review-agent | catches N+1 + floating promise |
| 04-build-gate-broken-import | build-agent | stops at first failure, exact file:line |
