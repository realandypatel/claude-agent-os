# ADOPTIONS — external tool registry (pinned + fenced)

> Single source of truth for every third-party tool/skill the OS adopts. Per R15:
> **security-agent reviews every third-party skill/agent file BEFORE activation**, the
> vetted commit SHA is pinned here, and updates are re-reviewed before re-pinning.
> Anything not in this table is not adopted.

| Tool | What / why | Wiring | License | Pinned SHA 〔FILL at install〕 |
|---|---|---|---|---|
| **spec-kit** (github/spec-kit) | Spec-driven dev: constitution→spec→plan→tasks→implement | `/specify` `/plan` `/tasks` map to UNDERSTAND→PLAN phases; `architect-agent` owns constitution review; constitution must not contradict AGENTS.md (AGENTS.md wins) | MIT | 〔FILL〕 |
| **beads** (steveyegge/beads) | Git-backed dependency-aware issue tracker = persistent work memory | Rounds/sub-tasks tracked as bead issues (`bd`); handoffs reference bead ids; complements INSTINCTS (lessons) | check at install | 〔FILL〕 |
| **playwright-mcp** (microsoft/playwright-mcp) | Standard browser automation for agents (a11y-tree) | `qa-agent` E2E + godmode sweeps; QA/E2E rounds ONLY (scoping fence) | Apache-2.0 | 〔FILL〕 |
| **chrome-devtools-mcp** (ChromeDevTools) | DevTools lens: perf traces (LCP/CLS), network, console | `performance-agent` before/after measurements + `investigate` runtime evidence; debug/perf rounds ONLY (scoping fence); never attach to a logged-in personal profile | Apache-2.0 | 〔FILL〕 |
| **HyperFrames** (heygen-com/hyperframes) | HTML-native deterministic video rendering, built for agents | `video-producer` composes; `video-quality-auditor` verifies deterministic frames + ASSET-LICENSES ledger; real captures embedded (doctrine intact). Fallbacks: Remotion (BUSL, $0<$1M ARR) → Revideo (MIT) | Apache-2.0 | 〔FILL〕 |
| **pocock skills** (mattpocock/skills) | Cherry-pick THREE only: `caveman` (token-compressed comms), `grill-me` (adversarial plan interrogation in REVIEW(plan)), `handoff` (session continuity; pairs with beads) | Install under `.claude/skills/`; rest of pack skipped (agent overlap) | MIT | 〔FILL〕 |
| **claude-seo** (AgriciDaniel/claude-seo) | SEO skill pack; priority: local SEO + maps for merchant acquisition | Routed via `marketing-agent`; claims audit against WEBSITE.md | MIT | 〔FILL〕 |
| **hallmark** (Nutlope/hallmark) | Anti-slop design for landing pages/marketing only | **Brand fence:** Brand Kit / palette / canonical CTA OUTRANK it; never restyles product UI | check at install | 〔FILL〕 |
| **OpenCut** (OpenCut-app) | Free human video editor for touch-ups | Tool only — no integration | MIT | n/a |

**Browser-MCP scoping fence (token doctrine):** playwright-mcp loads for QA/E2E rounds;
chrome-devtools-mcp loads for debug/perf rounds; **never both by default.**

**Deferred (triggers on record in CHANGELOG):** TimesFM (3–6 mo visit data + committed
lapse-prediction feature; managed BigQuery path first) · agentmemory (if episodic gaps
persist after beads+handoff run ~1 month → search-only trial) · harness (one-off DRAFT
roster generator for unfamiliar domains; output passes §6 review).
