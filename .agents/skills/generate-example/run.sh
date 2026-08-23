#!/usr/bin/env bash
set -euo pipefail

# Enable verbose mode if -v or --verbose is passed
if [[ "${1:-}" == "-v" || "${1:-}" == "--verbose" ]]; then
  set -x
fi

echo "== Starting example generation =="

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
target="${repo_root}/example"

echo "== Recreate example target =="
rm -rf "${target}"
mkdir -p "${target}"
cd "${target}"
printf '%s\n' '# Example Target' '' 'This folder contains an example installation of the Agent Knowledge Starter Kit.' > README.md

echo
echo "== Install skills =="
npx skills add "${repo_root}" -y --copy --agent cursor

echo
echo "== Bootstrap required artifacts (simulating initialization) =="
LD="${target}/.agents/skills/learning-distill"

mkdir -p "${target}/.agents/playbooks" "${target}/.agents/sessions"
[[ -f "${target}/.agents/playbooks/README.md" ]] || cp "${LD}/bootstrap/playbooks/README.md" "${target}/.agents/playbooks/README.md"


[[ -f "${target}/.agents/sessions/README.md" ]] || cp "${LD}/bootstrap/sessions/README.md" "${target}/.agents/sessions/README.md"
[[ -f "${target}/.agents/AGENTS.md" ]] || cp "${LD}/bootstrap/AGENTS.md" "${target}/.agents/AGENTS.md"

printf '%s\n' 'sessions/*' '!sessions/README.md' > "${target}/.agents/.gitignore"


echo
echo "Example folder generated successfully at ${target}."
