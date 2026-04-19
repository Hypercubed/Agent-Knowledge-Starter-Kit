#!/usr/bin/env bash
#
# Tool requirements:
# - Required: bash, sed, grep, find
# - Required for git-aware session tracking: git
# - Optional: jq validates JSON when installed; otherwise JSON validation is skipped.

set -u

target="${1:-.agents}"
target="${target%/}"

failures=0
warnings=0

section() {
  printf '\n== %s ==\n' "$1"
}

fail() {
  failures=$((failures + 1))
  printf 'FAIL: %s\n' "$1"
}

warn() {
  warnings=$((warnings + 1))
  printf 'WARN: %s\n' "$1"
}

pass() {
  printf 'PASS: %s\n' "$1"
}

in_git_repo() {
  git rev-parse --is-inside-work-tree >/dev/null 2>&1
}

tracked_files_under() {
  path="$1"
  git ls-files -- "$path" 2>/dev/null
}

json_files_under() {
  if in_git_repo; then
    tracked_files_under "$target" | sed -n '/\.json$/p'
  else
    find "$target" -path "$target/sessions/[0-9]*" -prune -o -type f -name '*.json' -print
  fi
}

section "Agent Knowledge Structure"
printf 'Target: %s\n' "$target"

if [ ! -d "$target" ]; then
  fail "Target directory does not exist: $target"
else
  pass "Target directory exists."
fi

section "Required Files"
  required_files="
AGENTS.md
.gitignore
docs/MAINTENANCE.md
docs/index.md
docs/log.md
docs/repo-decisions/index.md
docs/troubleshooting/index.md
agents/coding-agent.md
agents/learning-agent.md
agents/lint-agent.md
playbooks/README.md
sessions/README.md
skills/knowledge-lint/SKILL.md
skills/learning-distill/SKILL.md
skills/task-closeout/SKILL.md
skills/task-closeout/example/task-bundle/summary.json
skills/task-closeout/example/task-bundle/active-task.md
skills/task-closeout/example/task-bundle/learning-candidate.md
skills/task-closeout/example/task-bundle/changed-files.txt
skills/task-closeout/example/task-bundle/validation.txt
"

while IFS= read -r relative_path; do
  [ -z "$relative_path" ] && continue
  if [ -f "$target/$relative_path" ]; then
    printf 'PASS: %s\n' "$target/$relative_path"
  else
    fail "Missing required file: $target/$relative_path"
  fi
done <<EOF
$required_files
EOF

section "Session Tracking"
if in_git_repo; then
  if [ -d "$target/sessions" ]; then
    expected_session_file="$target/sessions/README.md"
    actual_session_files="$(tracked_files_under "$target/sessions" | sort)"
    printf '%s\n' "$actual_session_files"

    if [ "$actual_session_files" = "$expected_session_file" ]; then
      pass "Only sessions/README.md is tracked for $target."
    else
      fail "Tracked session files differ from expected list for $target."
      printf '\nExpected:\n%s\n' "$expected_session_file"
    fi

    ignored_sessions="$(git status --short --ignored -- "$target/sessions" | sed -n 's/^!! //p')"
    if [ -n "$ignored_sessions" ]; then
      printf '\nIgnored session bundles:\n%s\n' "$ignored_sessions"
    else
      printf '\nNo ignored session bundles reported.\n'
    fi
  else
    pass "No sessions directory present for $target; skipping session tracking checks."
  fi
else
  warn "Not inside a git work tree; skipping tracked/ignored session checks."
fi

section "Skill Frontmatter"
skill_files="$(find "$target/skills" -type f -name 'SKILL.md' 2>/dev/null | sort)"
if [ -z "$skill_files" ]; then
  fail "No SKILL.md files found under $target/skills."
else
  while IFS= read -r skill_file; do
    [ -z "$skill_file" ] && continue
    first_line="$(sed -n '1p' "$skill_file")"
    if [ "$first_line" != "---" ]; then
      fail "$skill_file does not start with YAML frontmatter."
      continue
    fi
    if ! sed -n '1,12p' "$skill_file" | grep -q '^name: '; then
      fail "$skill_file frontmatter is missing name."
      continue
    fi
    if ! sed -n '1,12p' "$skill_file" | grep -q '^description: '; then
      fail "$skill_file frontmatter is missing description."
      continue
    fi
    printf 'PASS: %s\n' "$skill_file"
  done <<EOF
$skill_files
EOF
fi

section "JSON"
json_files="$(json_files_under)"
if ! command -v jq >/dev/null 2>&1; then
  warn "jq is not installed; skipping JSON validation."
elif [ -z "$json_files" ]; then
  pass "No JSON files found under $target."
else
  json_failed=0
  while IFS= read -r json_file; do
    [ -z "$json_file" ] && continue
    if jq empty "$json_file" >/dev/null; then
      printf 'PASS: %s\n' "$json_file"
    else
      printf 'FAIL: %s\n' "$json_file"
      json_failed=1
    fi
  done <<EOF
$json_files
EOF
  if [ "$json_failed" -eq 0 ]; then
    pass "JSON validation passed for $target."
  else
    fail "One or more JSON files are invalid under $target."
  fi
fi

section "Summary"
printf 'Failures: %s\n' "$failures"
printf 'Warnings: %s\n' "$warnings"

if [ "$failures" -eq 0 ]; then
  pass "Agent knowledge structure checks passed for $target."
  exit 0
fi

fail "Agent knowledge structure checks found blocking failures for $target."
exit 1
