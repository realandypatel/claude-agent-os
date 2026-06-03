---
description: Run the pre-deploy gate, then deploy and verify in prod (with confirmation).
---

# /ship — gate → deploy → verify

Run the full release flow for the current round:

1. Invoke **build-agent** (typecheck → lint → test → build, stop on first failure). If RED,
   stop and report the exact failure — do not proceed.
2. If GREEN and the round touched auth/data/payments/webhooks, invoke **security-agent** and
   **qa-agent**. Block on any HIGH/CRITICAL.
3. Confirm with the human before the push (push-to-deploy is irreversible to users).
4. After deploy, poll the host API for `state: READY` (don't curl the URL), then **verify in
   prod with evidence** (fetch the real route/artifact and assert on its contents).
5. Invoke **memory-agent** to append a `docs/CHANGELOG.md` round entry.

Close with a completion status (DONE only with prod-verified evidence). Never use bypass
flags; never force-push the default branch.
