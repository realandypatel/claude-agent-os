#!/usr/bin/env bash
# Law linter (R13): mechanical enforcement that the OS structure can't silently rot.
# Run in CI on every push; also runnable locally: bash scripts/lint-os.sh
set -uo pipefail
shopt -s nullglob   # empty globs expand to nothing, never to a literal pattern (CI-safe)
cd "$(dirname "$0")/.."
FAIL=0
err() { echo "LINT FAIL: $1"; FAIL=1; }

# 1. AGENTS.md ≤300 lines
LINES=$(wc -l < AGENTS.md | tr -d ' ')
[ "$LINES" -le 300 ] || err "AGENTS.md is ${LINES} lines (cap 300 — factor detail into docs/)"

# 2. Every agent file has required sections
for f in .claude/agents/*.md; do
  head -1 "$f" | grep -q '^---$'        || err "$f: missing frontmatter"
  grep -q '^tools:' "$f"                || err "$f: missing tools (least-privilege) line"
  grep -q '^## Hard rules' "$f"         || err "$f: missing '## Hard rules' section"
  grep -q '^## Completion status' "$f"  || err "$f: missing '## Completion status' section"
done

# 3. INSTINCTS entries carry Scar + Evidence
if [ -f docs/INSTINCTS.md ]; then
  N_INST=$(grep -c '^### I-' docs/INSTINCTS.md || true)
  N_SCAR=$(grep -c '^Scar:' docs/INSTINCTS.md || true)
  N_EVID=$(grep -c '^Evidence:' docs/INSTINCTS.md || true)
  [ "$N_INST" -eq "$N_SCAR" ] || err "INSTINCTS: $N_INST entries but $N_SCAR Scar lines"
  [ "$N_INST" -eq "$N_EVID" ] || err "INSTINCTS: $N_INST entries but $N_EVID Evidence lines"
fi

# 4. Eval cases have the required blocks
for f in evals/cases/*.md; do
  grep -q '^## Fixture' "$f"           || err "$f: missing '## Fixture'"
  grep -q '^## Expected outcome' "$f"  || err "$f: missing '## Expected outcome'"
done

# 5. VERSION file exists and is semver-ish
grep -qE '^[0-9]+\.[0-9]+\.[0-9]+' VERSION || err "VERSION missing or not semver"

# 6. Hook is executable-intent (shebang) and settings.json parses
head -1 .claude/hooks/check-destructive.sh | grep -q bash || err "hook missing bash shebang"
python3 -c "import json;json.load(open('.claude/settings.json'))" 2>/dev/null || err ".claude/settings.json invalid JSON"

[ "$FAIL" -eq 0 ] && echo "LINT OK: law structure intact" || exit 1
