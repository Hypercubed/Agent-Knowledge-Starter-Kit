#!/usr/bin/env bash
# Refresh derived docs artifacts (optional durable indexes + docs-search cache).
# Run from anywhere inside the repository.
set -euo pipefail

find_agents_root() {
  local dir="$PWD"
  while [[ "$dir" != "/" ]]; do
    if [[ -d "$dir/.agents" ]]; then
      printf '%s\n' "$dir/.agents"
      return 0
    fi
    dir="$(dirname "$dir")"
  done
  return 1
}

agents_root="$(find_agents_root)" || {
  echo "ERROR: docs-compile.sh must run from a path inside a tree containing .agents/." >&2
  exit 1
}
repo_root="$(dirname "$agents_root")"
cd "$repo_root"

if [[ -f ".agents/skills/docs-compile/scripts/generate-durable-indexes.py" ]]; then
  python3 ".agents/skills/docs-compile/scripts/generate-durable-indexes.py"
else
  echo "docs-compile: durable index generator not found, skipping."
fi

if [[ -f ".agents/skills/docs-search/scripts/index-docs.py" ]]; then
  python3 ".agents/skills/docs-search/scripts/index-docs.py"
else
  echo "docs-compile: docs-search indexer not found, skipping."
fi

echo "docs-compile: done."
