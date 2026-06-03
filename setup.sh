#!/usr/bin/env bash
# setup.sh — install the claude-token-efficient-setup operating system into a project.
#
# Usage:
#   # from inside a target repo:
#   bash /path/to/claude-token-efficient-setup/setup.sh
#
#   # or one-liner (clones, installs into the current dir, cleans up):
#   git clone https://github.com/realandypatel/claude-token-efficient-setup.git /tmp/_cstack \
#     && bash /tmp/_cstack/setup.sh --from /tmp/_cstack && rm -rf /tmp/_cstack
#
# It copies .claude/ + AGENTS.md + CLAUDE.md + docs/ + templates/ into the target,
# never overwriting an existing file without asking, then prints the FILL checklist.
set -euo pipefail

# --- resolve source (this repo) and target (cwd) -------------------------------------
SRC=""
TARGET="$(pwd)"
while [ $# -gt 0 ]; do case "$1" in
  --from) SRC="$2"; shift 2;;
  --target) TARGET="$2"; shift 2;;
  -h|--help) grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0;;
  *) echo "unknown arg: $1"; exit 1;;
esac; done
[ -z "$SRC" ] && SRC="$(cd "$(dirname "$0")" && pwd)"

if [ "$SRC" = "$TARGET" ]; then
  echo "Refusing to install into the source repo itself. cd into your project first,"
  echo "or pass --target <dir>."; exit 1
fi

echo "Installing claude-token-efficient-setup"
echo "  from:   $SRC"
echo "  into:   $TARGET"
echo

# --- copy helper: never clobber without consent --------------------------------------
copy() { # copy <relpath>
  local rel="$1" s="$SRC/$1" d="$TARGET/$1"
  [ -e "$s" ] || return 0
  if [ -e "$d" ]; then
    read -r -p "  exists: $rel — overwrite? [y/N] " a < /dev/tty || a="n"
    case "$a" in y|Y) ;; *) echo "  skipped $rel"; return 0;; esac
  fi
  mkdir -p "$(dirname "$d")"
  cp -R "$s" "$d"
  echo "  + $rel"
}

copy ".claude"
copy "AGENTS.md"
copy "CLAUDE.md"
copy "docs"
copy "templates"

chmod +x "$TARGET/.claude/hooks/check-destructive.sh" 2>/dev/null || true

# --- self-test the hook ---------------------------------------------------------------
echo
echo "Hook self-test:"
if printf '{"tool_input":{"command":"git push --force"}}' \
   | bash "$TARGET/.claude/hooks/check-destructive.sh" | grep -q '"ask"'; then
  echo "  ok — destructive guardrail is live"
else
  echo "  WARN — hook did not flag a force-push; check python3 / bash availability"
fi

# --- the FILL checklist ---------------------------------------------------------------
cat <<'EOF'

Installed. Next, make it yours (the only required steps):

  1. AGENTS.md           — fill every 〔FILL〕: stack, folder map, framework-docs path,
                            brand rules, project state, pending-on-human.
  2. docs/BUSINESS-ENGINE.md — fill 〔FILL〕: ICP, value props, pricing guardrails, voice.
  3. docs/WEBSITE.md     — fill the claims ledger (or delete if you have no marketing site).
  4. .claude/hooks/check-destructive.sh — add YOUR production table + provider names.
  5. (optional) trim .claude/agents/ to the agents this project actually needs.

Grep your remaining blanks any time:   grep -rn "〔FILL〕" AGENTS.md docs/

Then just start working — Claude Code reads AGENTS.md first and inherits the whole model.
EOF
