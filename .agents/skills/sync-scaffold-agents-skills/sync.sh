#!/usr/bin/env bash
set -euo pipefail

# One-way merge: scaffold/agents and scaffold/skills -> .agents/agents and .agents/skills.
# Does not delete extra files under .agents; does not touch other .agents paths.

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/../../.." && pwd)"

src_agents="${repo_root}/scaffold/agents"
src_skills="${repo_root}/scaffold/skills"
dst_agents="${repo_root}/.agents/agents"
dst_skills="${repo_root}/.agents/skills"

if [[ ! -d "${src_agents}" || ! -d "${src_skills}" ]]; then
  echo "error: expected ${src_agents} and ${src_skills} to exist" >&2
  exit 1
fi

mkdir -p "${dst_agents}" "${dst_skills}"

sync_dir() {
  local src="$1"
  local dst="$2"
  if command -v rsync >/dev/null 2>&1; then
    rsync -a "${src}/" "${dst}/"
  else
    cp -a "${src}/." "${dst}/"
  fi
}

sync_dir "${src_agents}" "${dst_agents}"
sync_dir "${src_skills}" "${dst_skills}"

echo "Synced scaffold/agents -> .agents/agents"
echo "Synced scaffold/skills -> .agents/skills"
