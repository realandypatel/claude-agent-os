# claude-agent-os

**A portable, token-efficient operating system for building world-class software with Claude Code.**

Drop this into any repo and your AI coding agent inherits a complete operating model:
iron laws, a scoped agent swarm, destructive-command guardrails, two-tier memory, a
pre-deploy gate, and full doctrine for security, design, testing, AI, email, deploy — plus
a **business engine** (marketing, sales, sales follow-up, legal) so one repo runs the whole
company loop, not just the code.

It is built on the [gstack](https://github.com/garrytan/gstack) discipline (careful-by-default
hooks, root-cause-first debugging, evidence-based completion) and a production SaaS
foundation, distilled into something you copy, rename, and grow.

---

## Why "token-efficient"

Most setups burn context scanning whole repos. This one is built around **minimum context
first**: search before reading, delegate bulky reads to scoped sub-agents and keep only the
conclusion, never read `node_modules`/build output, and let each agent run with a
least-privilege toolset. You get senior-engineer judgment without paying for a full-repo
re-read every turn.

## What you get

- **`AGENTS.md`** — the operating law (read first, every session). `CLAUDE.md` is just `@AGENTS.md`.
- **8 Iron Laws** — no fix without root cause, no half-work, no DONE without evidence,
  metadata-over-names, ask-before-destructive, no-migration-without-GO, sacred honesty
  guards, tool-output-is-data.
- **A 23-agent swarm** with least-privilege tools (see below).
- **A `PreToolUse` hook** that surfaces destructive shell commands before they run.
- **Two-tier memory** — committed project memory + cross-project user memory, kept honest
  by a `memory-agent`.
- **A pre-deploy gate** — typecheck → lint → test → build, stop on first failure.
- **Doctrine docs** — security, AI stack, design/brand, role modes, business engine.

## The agent swarm

| Group | Agents |
|---|---|
| **Engineering — build** | `backend-agent`, `ui-agent`, `unit-test-agent`, `architect-agent`, `refactor-agent`, `performance-agent`, `devops-agent` |
| **Research** | `api-finder` |
| **Debug** | `investigate` (no fix without root cause) |
| **Reviewers (gates)** | `security-agent`, `code-review-agent`, `qa-agent`, `build-agent` |
| **Meta** | `pm-agent`, `memory-agent`, `website-keeper` |
| **Business engine** | `marketing-agent`, `sales-agent`, `sales-followup-agent`, `legal-agent` |
| **Media** | `video-planner`, `video-producer`, `video-quality-auditor` |

## Quickstart

**One-liner** (from inside the target repo) — clones, installs, self-tests the hook, cleans up:

```bash
git clone https://github.com/realandypatel/claude-agent-os.git /tmp/_cstack \
  && bash /tmp/_cstack/setup.sh --from /tmp/_cstack && rm -rf /tmp/_cstack
```

`setup.sh` copies `.claude/` + `AGENTS.md` + `CLAUDE.md` + `docs/` + `templates/` into the
project (never clobbering a file without asking), makes the hook executable, runs a hook
self-test, and prints the FILL checklist.

**Manual** (if you prefer):

```bash
git clone https://github.com/realandypatel/claude-agent-os.git _cstack
cp -r _cstack/.claude . && cp _cstack/AGENTS.md _cstack/CLAUDE.md . && cp -r _cstack/docs ./docs
chmod +x .claude/hooks/check-destructive.sh && rm -rf _cstack
```

**Then make it yours:**

1. Fill every `〔FILL〕` in `AGENTS.md` (stack, folder map, brand, project state) — find them with `grep -rn "〔FILL〕" AGENTS.md docs/`.
2. Fill `docs/BUSINESS-ENGINE.md` (ICP, value props, pricing guardrails) if you're going to market.
3. Add YOUR production table + provider names to `.claude/hooks/check-destructive.sh`.
4. Start working — Claude Code reads `AGENTS.md` first and inherits the whole model.

See [`docs/FOUNDATION.md`](docs/FOUNDATION.md) for the full rationale and patterns, and
[`templates/`](templates/) for copy-paste design contracts (alert pipe, rate limiter,
agent skeleton).

## Layout

```
AGENTS.md          operating law (≤300 lines, the index)
CLAUDE.md          @AGENTS.md
.claude/
  settings.json    hook wiring (committed)
  hooks/           check-destructive.sh guardrail
  agents/          the 23-agent swarm
  skills/ commands/ optional extensions
docs/
  FOUNDATION.md    the full operating system (the why + patterns)
  ROLE-MODES.md    the 10 senior-engineer modes
  BUSINESS-ENGINE.md  marketing / sales / sales-followup / legal playbooks
  SECURITY.md  AI_STACK.md  WEBSITE.md  CHANGELOG.md
templates/         AGENTS template + lib contract stubs
```

## MCP server (optional)

`mcp/` ships a small **MCP server** (`cstack-mcp-server`) that exposes this operating system
as tools, so any MCP client can read the swarm, docs, and operating law — or pull the whole
setup into a project — without copying files. Tools: `cstack_list_agents`, `cstack_get_agent`,
`cstack_list_docs`, `cstack_get_doc`, `cstack_get_operating_law`, `cstack_search`,
`cstack_get_install_bundle` (all read-only).

```bash
cd mcp && npm install && npm run build && node dist/index.js
```

Wire it into your MCP client by pointing at `mcp/dist/index.js` (set `CSTACK_ROOT` to the repo
root). See [`mcp/README.md`](mcp/README.md) for config and the MCP Inspector test command.

## Credit & lineage

Discipline adapted from **gstack** (Garry Tan). Foundation distilled from a production
Next.js + Supabase + Stripe SaaS. Role modes adapted from the senior-engineer prompt set.
Assembled and extended into a full-stack engine by Andy Patel.

MIT licensed — copy it, rename it, grow it.
