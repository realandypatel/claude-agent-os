---
description: EMERGENCY - halt all agent activity now (agent incident containment).
---

# /freeze — agent incident containment (RESILIENCE §4)

Effective immediately:

1. **STOP all work.** Do not finish in-flight edits, commits, sends, or deploys. Do not
   spawn sub-agents. Acknowledge the freeze in one line.
2. **State, with evidence:** what was in flight, what (if anything) already reached an
   external system (deploy, message, commit, API call), and which credentials were in use.
3. **Propose containment** per `docs/RESILIENCE.md` §4 (revoke/rotate, rollback target,
   correction comms) — but EXECUTE NOTHING without an explicit human GO.
4. Remain frozen until the human says **unfreeze**. The postmortem (root cause →
   INSTINCTS) is mandatory before normal rounds resume.
