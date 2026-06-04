#!/usr/bin/env bash
# post-compact-recall (R20): re-ground the agent immediately after context compaction.
# Wired as a SessionStart hook (matcher: "compact") — stdout is injected into context.
# Root cause it fixes: standing instructions silently lost to compaction mid-session
# ("it forgot my command"). Keep this output SHORT — it loads into every post-compact
# context, so every line here costs tokens forever (token doctrine).
set -uo pipefail

cat <<'EOF'
[post-compact recall — R20 hook]
Context was just COMPACTED. Before continuing:
1. Re-read AGENTS.md (CLAUDE.md) — the operating law and any standing user commands
   live THERE, not in the compacted chat. The file always wins over your summary.
2. Resume from durable work memory: open bead issues (`bd` / beads) and the latest
   handoff doc, if installed. Do not re-plan finished work; do not re-do shipped steps.
3. If the user gave a session-specific instruction you can no longer see verbatim,
   ASK for it again rather than guessing (Iron Law: no half-work on assumptions).
4. Round discipline unchanged: evidence before DONE; destructive ops still gated.
EOF

# Optional breadcrumb for METRICS (append-only, no PII; ignore failures silently).
if [ -n "${CLAUDE_PROJECT_DIR:-}" ] && [ -d "${CLAUDE_PROJECT_DIR}/docs" ]; then
  echo "{\"event\":\"compaction\",\"hook\":\"post-compact-recall\",\"ts\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
    >> "${CLAUDE_PROJECT_DIR}/docs/METRICS.jsonl" 2>/dev/null || true
fi

exit 0
