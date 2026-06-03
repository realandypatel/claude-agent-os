# RESILIENCE — backups, secrets lifecycle, agent blast radius, incidents (R16/R17)

> A backup that has never been restored is a hope, not a backup.

## 1. Backups & restore drills  〔FILL per project〕

- **Cadence:** DB automated backups 〔FILL: e.g. daily + PITR〕; file/asset storage 〔FILL〕.
- **RPO / RTO statement:** we lose at most **〔FILL: X hours〕** of data and restore within
  **〔FILL: Y hours〕**. This line is a promise — test it.
- **Quarterly restore drill (mandatory):** restore the latest backup to an isolated
  instance, run smoke checks, time it, log below. A failed/skipped drill = 🔴 in pm-agent.

| Date | Backup restored | Time-to-restore | Result | Notes |
|---|---|---|---|---|
| 〔FILL〕 | | | PASS/FAIL | |

## 2. Secrets lifecycle

- **Inventory (names only — NEVER values):**

| Secret (env name) | Consumer | Scope | Last rotated | Next rotation |
|---|---|---|---|---|
| 〔FILL〕 | | | | |

- **Rotation calendar:** every secret has a next-rotation date (default: 90d for
  high-privilege, 180d others). Rotation is a normal round, not an emergency.
- **On leak:** rotate immediately, surface loudly (never bury), add an INSTINCTS entry.
- **Break-glass:** 〔FILL: where emergency credentials live, who can access, how access
  is logged〕.

## 3. Agent blast radius (R17)

Assume one day an agent is wrong or prompt-injected despite ADOPTIONS vetting. Its
credentials must already limit the damage:

- **Deploy token:** deploy-only — cannot delete the project or change billing.
- **DB role for agent paths:** DML only — no DDL (cannot DROP/ALTER), no superuser.
- **Git:** no force-push rights to default branch (enforce via branch protection).
- **External accounts (payments/SMS):** restricted API keys where the provider supports
  them; never the master key.
- Review this list whenever a new credential is issued (add to the inventory above).

## 4. Agent incident runbook (R17)

When an **agent** causes the incident (bad deploy, wrong outreach sent, leak into a
public repo, runaway loop):

1. **FREEZE** — run `/freeze`: halt all agent activity; agents finish nothing further.
2. **Contain** — revoke/rotate the credentials the agent was holding (see §3 scopes).
3. **Assess** — pull the agent's action trail (git history, tool logs, CHANGELOG,
   METRICS.jsonl) and establish blast radius with evidence.
4. **Recover** — rollback deploy (known-good id) / restore data (§1) / send correction
   comms (human approves).
5. **Postmortem** — blameless, written, root-cause per Iron Law #1; every lesson lands
   in `docs/INSTINCTS.md` (and promotes to law with GO where warranted).
6. **Unfreeze** only after the postmortem's containment actions are verified.

## 5. Spend kill-switch (fold from R12)

`docs/METRICS.jsonl` carries per-round usage. Alarm threshold: 〔FILL: e.g. >$X/day or
>N rounds/day with RED gates〕 → pause autonomous rounds, page the human. A runaway agent
loop is an abuse vector against your own wallet — treat it like the rate limiter treats bots.
