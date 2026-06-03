#!/usr/bin/env bash
# PreToolUse guardrail for Bash. Reads the tool-call JSON on stdin, extracts the
# command, exempts safe build-artifact deletes, then flags generic + project-specific
# destructive patterns. Emits {} to allow, or {"permissionDecision":"ask","message":...}
# to make the harness prompt the human. Override is one tap — the point is to SURFACE
# risk, not block. Add a pattern every time you discover a new way to shoot your foot.
set -euo pipefail

INPUT=$(cat)
CMD=$(printf '%s' "$INPUT" | python3 -c 'import sys,json; print(json.loads(sys.stdin.read()).get("tool_input",{}).get("command",""))' 2>/dev/null || true)
# regex fallback if python is unavailable
[ -z "$CMD" ] && CMD=$(printf '%s' "$INPUT" | grep -oE '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | sed -E 's/.*:[[:space:]]*"(.*)"/\1/' || true)
[ -z "$CMD" ] && { echo '{}'; exit 0; }
CMD_LOWER=$(printf '%s' "$CMD" | tr '[:upper:]' '[:lower:]')

# --- Exempt safe `rm -rf <build artifact>` so the prompt never fires on routine cleanup ---
if printf '%s' "$CMD" | grep -qE 'rm\s+(-[a-zA-Z]*r[a-zA-Z]*\s+|--recursive\s+)'; then
  SAFE_ONLY=true
  RM_ARGS=$(printf '%s' "$CMD" | sed -E 's/.*rm[[:space:]]+(-[a-zA-Z]+[[:space:]]+)*//')
  for t in $RM_ARGS; do case "$t" in
    */node_modules|node_modules|*/.next|.next|*/dist|dist|*/.cache|.cache|*/coverage|coverage|*/build|build|*/.turbo|.turbo|*/out|out|/tmp/*|*/tmp/*) ;;
    -*) ;; *) SAFE_ONLY=false; break;; esac; done
  [ "$SAFE_ONLY" = true ] && { echo '{}'; exit 0; }
fi

WARN=""
# --- Generic destructive patterns ---
[ -z "$WARN" ] && printf '%s' "$CMD"       | grep -qE 'rm\s+(-[a-zA-Z]*r|--recursive)'                                          && WARN="Recursive delete outside the build-artifact whitelist. Permanent — verify the target path."
[ -z "$WARN" ] && printf '%s' "$CMD_LOWER" | grep -qE 'drop\s+(table|database|schema|index|column|policy|view|function|trigger)' && WARN="SQL DROP permanently removes a schema object. Verify the target and that you have a backup."
[ -z "$WARN" ] && printf '%s' "$CMD_LOWER" | grep -qE '\btruncate\b'                                                            && WARN="SQL TRUNCATE empties a table with no row-level rollback after commit."
[ -z "$WARN" ] && printf '%s' "$CMD_LOWER" | grep -qE 'delete\s+from\s+'                                                        && WARN="DELETE FROM a table — confirm the WHERE clause and that this is not a production table."
[ -z "$WARN" ] && printf '%s' "$CMD"       | grep -qE 'git\s+push\s+.*(-f\b|--force)'                                           && WARN="git force-push rewrites remote history; with push-to-deploy this can ship a regression instantly. NEVER force-push main."
[ -z "$WARN" ] && printf '%s' "$CMD"       | grep -qE 'git\s+reset\s+--hard'                                                    && WARN="git reset --hard discards all uncommitted changes irreversibly."
[ -z "$WARN" ] && printf '%s' "$CMD"       | grep -qE 'git\s+(checkout|restore)\s+\.'                                           && WARN="git checkout/restore . discards all uncommitted edits."
[ -z "$WARN" ] && printf '%s' "$CMD"       | grep -qE 'git\s+clean\s+(-[a-zA-Z]*f|--force)'                                     && WARN="git clean -f permanently deletes untracked files."
[ -z "$WARN" ] && printf '%s' "$CMD"       | grep -qE 'git\s+branch\s+-D'                                                       && WARN="git branch -D force-deletes a branch even if unmerged."

# --- Project-specific patterns (uncomment/extend with YOUR stack's landmines) ---
# Payments (shared accounts: metadata is the source of truth, not names — Iron Law #4):
[ -z "$WARN" ] && printf '%s' "$CMD_LOWER" | grep -qE 'stripe.*(delete|archive|deactivate).*(product|price|coupon|customer|subscription)' && WARN="Stripe archive/delete on a possibly-shared account. Metadata is the source of truth, not the name — verify ownership + list active dependents before flipping anything."
# Managed DB:
[ -z "$WARN" ] && printf '%s' "$CMD_LOWER" | grep -qE 'supabase.*(projects?\s+(delete|pause)|db\s+reset)'                       && WARN="Supabase project reset/pause/delete affects live data. Confirm the project ref."
# Hosting:
[ -z "$WARN" ] && printf '%s' "$CMD_LOWER" | grep -qE 'vercel.*(remove|rm)\b'                                                   && WARN="Vercel project/deployment removal. Confirm the target project."
# Messaging / A2P (re-vetting costs money + days):
[ -z "$WARN" ] && printf '%s' "$CMD_LOWER" | grep -qE 'twilio.*(delete|release).*(number|campaign|messaging-service)'           && WARN="Twilio number/campaign deletion — A2P re-vetting costs money and days. Confirm before deleting."
# Containers / k8s:
[ -z "$WARN" ] && printf '%s' "$CMD_LOWER" | grep -qE '(docker\s+(rm\s+-f|system\s+prune)|kubectl\s+delete)'                    && WARN="Container/cluster destruction. Confirm the target."

[ -z "$WARN" ] && { echo '{}'; exit 0; }
WARN_JSON=$(printf '%s' "$WARN" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read().strip()))' 2>/dev/null || printf '"%s"' "$WARN")
cat <<EOF
{"permissionDecision":"ask","message":${WARN_JSON}}
EOF
