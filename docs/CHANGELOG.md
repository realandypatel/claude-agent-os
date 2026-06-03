# CHANGELOG

One section per shipped round (R-number). The `memory-agent` appends these. Newest on top.

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
