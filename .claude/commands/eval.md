---
description: Run the doctrine regression evals (evals/cases/*) and report PASS/FAIL.
---

# /eval — run the OS eval suite

Mandatory before committing any change to `.claude/agents/*`, `AGENTS.md`, or the hook.

1. For each case in `evals/cases/` (in order): load the fixture, spawn the agent under
   test with exactly the fixture scenario, and score the result against the case's
   "Expected outcome" — every numbered requirement must hold for a PASS.
2. Score strictly: a partially-met expectation is a FAIL with the missed requirement
   quoted.
3. Report a table: `case | agent | PASS/FAIL | missed requirement (if any)`.
4. Append one line to `docs/METRICS.jsonl`:
   `{"round":"<id>","date":"<date>","eval":"<n>/<total> PASS","gate":null,...}`
5. **Any FAIL blocks the pending `.claude/`/AGENTS.md change** — fix the prompt, or
   prove the eval wrong and update the eval with a one-line "why" (evals are law too).
