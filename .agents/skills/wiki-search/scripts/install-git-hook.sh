#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "ERROR: not inside a git repository." >&2
  exit 1
}

hook_dir="${repo_root}/.git/hooks"
mkdir -p "$hook_dir"
hook="${hook_dir}/post-commit"

marker="# wiki-search auto-index"

if [[ -f "$hook" ]] && grep -qF "$marker" "$hook"; then
  echo "Hook already installed: $hook"
  exit 0
fi

cat >>"$hook" <<'EOF'

# wiki-search auto-index
if git diff-tree --no-commit-id --name-only -r HEAD | grep -q '^\.agents/docs/'; then
  python3 "$(git rev-parse --show-toplevel)/.agents/skills/wiki-search/scripts/index-wiki.py" || true
fi
EOF

chmod +x "$hook" 2>/dev/null || true
echo "Appended wiki-search block to: $hook"
