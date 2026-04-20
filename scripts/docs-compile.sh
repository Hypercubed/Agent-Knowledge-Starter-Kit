#!/usr/bin/env bash
# Refresh derived documentation artifacts (durable indexes + docs search cache).
# Run from anywhere inside the repository.
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "ERROR: docs-compile.sh must run inside a git repository." >&2
  exit 1
}
cd "$repo_root"

if [[ -f scripts/generate-durable-indexes.py ]]; then
  python3 scripts/generate-durable-indexes.py
fi

if [[ -f .agents/skills/docs-search/scripts/index-docs.py ]]; then
  python3 .agents/skills/docs-search/scripts/index-docs.py
fi

echo "docs-compile: done."
