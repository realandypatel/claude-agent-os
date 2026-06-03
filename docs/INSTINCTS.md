# INSTINCTS — auto-extracted lessons ledger

> **Append-only.** After each round, the `memory-agent` extracts **candidate** instincts
> from what actually happened: human corrections, repeated failures, surprising tool
> behavior. Candidates bind nothing. A candidate becomes **confirmed** when seen 2+ times
> or human-confirmed, and is **promoted** only with an explicit human GO — landing in an
> agent's hard-rules, `AGENTS.md`, or the destructive-command hook. Wrong candidates are
> **retired**, never deleted (the record is the point).
>
> **Token rule:** only PROMOTED instincts may be quoted into always-loaded files.
> Candidates live here only. This keeps per-session context flat.
>
> Pattern adapted from ECC's continuous-learning "instincts", hardened with this OS's
> evidence discipline (Iron Law #3: nothing is true without evidence).

## Format

```
### I-<n> — <one-line rule>
Status:    candidate | confirmed | promoted → <where> | retired (<why>)
Scar:      <what happened, concretely>
Evidence:  <round/date/link — the proof>
Date:      YYYY-MM-DD
```

---

### I-1 — Verify every web-UI commit landed before claiming it; connection blips drop clicks silently
Status:    confirmed
Scar:      During the initial GitHub upload, two commits (settings.json, hooks) appeared
           to succeed but never landed — browser-extension reconnects swallowed the
           button clicks. Caught only because the repo tree showed `.claude/agents`
           collapsed (single child). Re-pushed and verified.
Evidence:  R-publish round, 2026-06-02; repo history shows the re-commits.
Date:      2026-06-02

### I-2 — Don't run git on the sandbox-mounted folder; treat the mount as files-only
Status:    confirmed
Scar:      git commits on the mounted outputs folder repeatedly timed out and wedged on
           `.git/*.lock` files the sandbox user couldn't delete ("Operation not
           permitted"). Builds/installs in /tmp were fast and clean.
Evidence:  Multiple failed commits + lock errors, 2026-06-02; /tmp build succeeded first try.
Date:      2026-06-02

### I-3 — GitHub's commit button moves when the ProTip hint appears; re-screenshot before clicking
Status:    candidate
Scar:      Typing a >50-char commit summary inserts a ProTip line that shifts the
           "Commit changes" button ~17px down; a coordinate click then misses silently.
Evidence:  Root-files commit attempt, 2026-06-02 (click landed above button; form still open).
Date:      2026-06-02

### I-4 — Adopt skills that slot INTO the OS; reject systems that replace parts of it
Status:    candidate
Scar:      8-repo evaluation batch: every adoption-worthy repo (claude-seo, hallmark) was
           a skill pack that complements the swarm; every rejected one (ruflo, evolver,
           Open-Generative-AI) was a competing system that would displace the laws.
Evidence:  Evaluation batch verdicts, 2026-06-03 (CHANGELOG R4/R5).
Date:      2026-06-03
