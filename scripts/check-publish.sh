#!/usr/bin/env bash
#
# Tool requirements:
# - Required: bash, git, find, sed
# - Required local helper: scripts/check-agents-structure.sh
# - Optional: timeout bounds optional npx probes when installed.
# - Optional: globally installed or npx-available remark checks Markdown formatting.
# - Optional: .remarkrc.json configures frontmatter/GFM support and Markdown style.
# - Optional: npx with locally available markdown-link-check validates Markdown links.
# - Optional: rg runs publish leakage scans.
# - Optional via check-agents-structure.sh: jq validates JSON when installed.

set -u

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT_DIR" || exit 1

source "${SCRIPT_DIR}/utils.sh"

timeout_cmd() {
  seconds="$1"
  shift

  if command -v timeout >/dev/null 2>&1; then
    timeout "$seconds" "$@"
  else
    "$@"
  fi
}

npx_package_available() {
  package="$1"
  shift

  command -v npx >/dev/null 2>&1 || return 1
  timeout_cmd 15s npx --no-install "$package" "$@" >/dev/null 2>&1
}

run_warning_scan() {
  label="$1"
  pattern="$2"
  shift 2

  printf '\n-- %s --\n' "$label"
  if rg -n --hidden --glob '!*sessions/[0-9]*' "$pattern" "$@"; then
    warn "$label produced hits; review each hit before publishing."
  else
    pass "$label produced no hits."
  fi
}

run_structure_check() {
  target="$1"

  if bash scripts/check-agents-structure.sh "$target"; then
    pass "Structure check passed for $target."
  else
    fail "Structure check failed for $target."
  fi
}

section "Repository"
printf 'Root: %s\n' "$ROOT_DIR"

section "Portable Agent Structure"
run_structure_check scaffold
run_structure_check .agents

section "Markdown Formatting"
md_files="$(git ls-files '*.md')"
if ! command -v npx >/dev/null 2>&1; then
  warn "npx is not installed; skipping Remark Markdown check."
elif [ -z "$md_files" ]; then
  pass "No tracked Markdown files found."
elif command -v remark >/dev/null 2>&1; then
  if timeout_cmd 60s remark $md_files --frail; then
    pass "Remark Markdown check passed."
  else
    fail "Remark Markdown check failed."
  fi
else
  warn "remark is not installed; skipping Markdown formatting check."
fi

section "Markdown Links"
if ! command -v npx >/dev/null 2>&1; then
  warn "npx is not installed; skipping markdown-link-check."
elif [ -z "$md_files" ]; then
  pass "No tracked Markdown files found."
elif npx_package_available markdown-link-check --help; then
  link_failed=0
  while IFS= read -r md_file; do
    [ -z "$md_file" ] && continue
    if ! timeout_cmd 30s npx --no-install markdown-link-check --alive 200,0 "$md_file"; then
      link_failed=1
    fi
  done <<EOF
$md_files
EOF
  if [ "$link_failed" -eq 0 ]; then
    pass "Markdown link check passed."
  else
    fail "Markdown link check failed."
  fi
else
  warn "markdown-link-check is not available to npx without installation; skipping link validation."
fi

section "Scaffold File List"
find scaffold -maxdepth 4 -type f | sort

section "Publish Leakage Scans"
if ! command -v rg >/dev/null 2>&1; then
  warn "rg is not installed; skipping leakage scans."
else
  run_warning_scan \
    "Starter-repo-only language in scaffold" \
    'agent-knowledge-starter|dogfood|sync-scaffold|\.agents/plans' \
    scaffold

  run_warning_scan \
    "High-signal secret or local path patterns" \
    'Bearer [A-Za-z0-9._-]{20,}|sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|-----BEGIN .*PRIVATE KEY-----|/home/[A-Za-z0-9._-]+/|C:\\Users\\' \
    README.md INSTALL.md docs scaffold .agents
fi

section "Summary"
printf 'Failures: %s\n' "$failures"
printf 'Warnings: %s\n' "$warnings"

if [ "$failures" -eq 0 ]; then
  pass "Pre-publish checks completed without blocking failures."
  exit 0
fi

fail "Pre-publish checks found blocking failures."
exit 1
