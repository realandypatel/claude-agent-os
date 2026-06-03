# CHANGELOG

One section per shipped round (R-number). The `memory-agent` appends these. Newest on top.

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
