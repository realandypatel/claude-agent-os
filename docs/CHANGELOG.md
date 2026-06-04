# CHANGELOG

One section per shipped round (R-number). The `memory-agent` appends these. Newest on top.

## R19 (2026-06-03) — media capture tool + memory front-runner
- Adopted **OpenScreen** (siddharthvaddem/openscreen) into `docs/ADOPTIONS.md` as a
  TOOL (no round): cinematic screen capture for human clips/reels — auto-zoom, click
  highlights, blur for sensitive regions, 9:16 export. Rule: brand videos → HyperFrames
  (deterministic/auditable); human reels → OpenScreen with blur ON; music → ASSET-LICENSES.
- Evaluation notes on record (no adoption): hivemind, LongCat-Video → SKIP (not our
  domain / generative-video gates). **memanto** (moorcheh-ai) → named front-runner for
  the deferred memory trial (recall-only, when beads+handoff reveal episodic gaps).
- Design remains frozen; this is registry maintenance, not a new pillar.

## R6–R18 (2026-06-03) — capability + proof + resilience wave (OS_VERSION 1.1.0)
- **R6 spec-kit · R7 beads · R8 playwright-mcp · R11 chrome-devtools-mcp:** adopted via
  `docs/ADOPTIONS.md` registry (pinned-SHA policy); AGENTS.md working rules updated
  (spec-first, beads work memory, browser-MCP scoping fence); architect-agent owns
  constitution review; qa-agent wired to playwright; performance-agent + investigate
  wired to devtools traces/runtime evidence.
- **R9 HyperFrames (revised from Remotion):** video-producer composes via HyperFrames
  (real captures embedded; Brand Kit CSS; deterministic); auditor adds determinism
  re-render check + `docs/ASSET-LICENSES.md` ledger enforcement. Fallbacks: Remotion→Revideo.
- **R10 pocock skills:** cherry-picked caveman / grill-me / handoff (registry entry).
- **R12 OS evals:** `evals/` suite (4 golden cases: investigate, security, code-review,
  build gate) + `/eval` command — mandatory before any `.claude/`/AGENTS.md change;
  `docs/METRICS.jsonl` (memory-agent appends per round; pm-agent quantitative); GTM
  feedback loop added to BUSINESS-ENGINE (campaign metrics → INSTINCTS).
- **R13 law linter:** `scripts/lint-os.sh` in CI (AGENTS ≤300, agent sections, INSTINCTS
  scar+evidence, eval structure, VERSION semver); model routing (opus: architect,
  investigate; haiku: build, pm, api-finder).
- **R14 propagation:** `VERSION` 1.1.0 + OS_VERSION stamp + `setup.sh --update`
  (syncs OS-owned files; never touches project FILLs; records .claude/os-version).
- **R15 supply chain:** SECURITY.md — skill vetting before activation (security-agent
  hard rule, pinned SHAs in ADOPTIONS), lockfiles + `npm audit` in CI, pin-Actions-by-SHA
  policy.
- **R16 resilience:** `docs/RESILIENCE.md` — backups + quarterly restore drills, RPO/RTO,
  secrets inventory + rotation calendar, break-glass, spend kill-switch.
- **R17 agent containment:** scoped agent credentials (blast radius), `/freeze` command,
  agent incident runbook → postmortems feed INSTINCTS.
- **R18 data lifecycle:** `docs/DATA-LIFECYCLE.md` — PII map, retention (scraped-lead
  purge), CCPA deletion-request runbook, suppression-forever.
- **Design freeze on record:** no new pillars until a 90-day landscape re-review.

## R5 (2026-06-03) — hallmark adoption (design, fenced)
- Adopted Nutlope/hallmark for landing pages + marketing experiments. Hard brand fence
  documented in BUSINESS-ENGINE: Brand Kit / locked palette / canonical CTA outrank it;
  never restyles product UI.

## R4 (2026-06-03) — claude-seo adoption
- Adopted AgriciDaniel/claude-seo (MIT) as the SEO skill pack, routed via marketing-agent.
  Priority: local SEO + maps intelligence for merchant acquisition. Claims still audit
  against docs/WEBSITE.md.
- Evaluation batch on record: ADOPT claude-seo + hallmark; tool-only OpenCut; SKIP
  Open-Generative-AI, evolver, openhuman, ruflo, ViMax; DEFER TimesFM (trigger: 3–6 mo
  visit data + committed lapse-prediction feature; managed BigQuery path first).

## R3 (2026-06-03) — Instincts layer (continuous learning)
- Added docs/INSTINCTS.md: append-only ledger of auto-extracted lessons
  (candidate → confirmed → promoted-with-human-GO | retired). Pattern adapted from ECC,
  hardened with evidence discipline; only promoted instincts enter always-loaded law.
- memory-agent: new workflow step 5 (extract instincts each round) + hard rules
  (append-only, no auto-promotion, scar+evidence required).
- Seeded with 4 real instincts from the publish rounds (web-commit verification,
  sandbox-git mount, GitHub ProTip button shift, skills-over-systems adoption rule).

## R2 (2026-06-02) — Publish hardening
- Published to GitHub as `realandypatel/claude-agent-os` (kept `claude-token-efficient-setup` as the OS tagline).
- Renamed repo references in README, setup.sh, and mcp/README to the new repo URL.
- Added `.github/workflows/ci.yml`: builds the MCP server (install → tsc → verify dist) and
  smoke-tests the destructive-command hook (flags force-push, allows safe artifact deletes) on every push/PR.

## R1 (2026-06-02) — MCP server + installer
- Added `setup.sh` one-command installer (copies the OS into any repo, self-tests the hook).
- Added `mcp/` — `cstack-mcp-server` (TypeScript, stdio): serves agents/docs/law + install
  bundle as 7 read-only MCP tools. Built, smoke-tested (23 agents, bundle truncation fallback),
  with `mcp/evaluation.xml` (10 read-only eval questions).

## R0 (2026-06-02) — Foundation bootstrap
- Installed the claude-token-efficient-setup operating system: AGENTS.md + CLAUDE.md,
  .claude/{settings.json, hooks/check-destructive.sh, agents/×23}, docs library, templates.
- 23-agent swarm: engineering (investigate, backend, ui, unit-test, architect, refactor,
  performance, devops), research (api-finder), reviewers (security, code-review, qa, build),
  meta (pm, memory, website-keeper), business (marketing, sales, sales-followup, legal),
  media (video planner/producer/auditor).
- Next: fill the 〔FILL〕 blocks in AGENTS.md + BUSINESS-ENGINE.md, add project-specific
  patterns to check-destructive.sh.
