#!/usr/bin/env bash
set -euo pipefail

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
TC="${target}/.agents/skills/task-closeout"
KL="${target}/.agents/skills/knowledge-lint"

mkdir -p "${target}/.agents/playbooks" "${target}/.agents/docs" "${target}/.agents/sessions"
[[ -f "${target}/.agents/playbooks/README.md" ]] || cp "${LD}/bootstrap/playbooks/README.md" "${target}/.agents/playbooks/README.md"
for f in index.md MAINTENANCE.md log.md; do
  [[ -f "${target}/.agents/docs/${f}" ]] || cp "${LD}/bootstrap/docs/${f}" "${target}/.agents/docs/${f}"
done
sync_docs_subtree() {
  local src_root="$1" dest_root="$2"
  [[ -d "$src_root" ]] || return 0
  mkdir -p "$dest_root"
  while IFS= read -r -d '' f; do
    rel="${f#"${src_root}/"}"
    mkdir -p "$(dirname "${dest_root}/${rel}")"
    [[ -f "${dest_root}/${rel}" ]] || cp "${src_root}/${rel}" "${dest_root}/${rel}"
  done < <(find "$src_root" -type f -print0)
}
sync_docs_subtree "${LD}/bootstrap/docs/repo-decisions" "${target}/.agents/docs/repo-decisions"
sync_docs_subtree "${LD}/bootstrap/docs/troubleshooting" "${target}/.agents/docs/troubleshooting"
[[ -f "${target}/.agents/sessions/README.md" ]] || cp "${LD}/bootstrap/sessions/README.md" "${target}/.agents/sessions/README.md"
[[ -f "${target}/.agents/AGENTS.md" ]] || cp "${LD}/bootstrap/AGENTS.md" "${target}/.agents/AGENTS.md"

printf '%s\n' 'sessions/*' '!sessions/README.md' > "${target}/.agents/.gitignore"

[[ -f "${target}/.agents/sessions/README.md" ]] || cp "${TC}/bootstrap/sessions/README.md" "${target}/.agents/sessions/README.md"

[[ -f "${target}/.agents/playbooks/README.md" ]] || cp "${KL}/bootstrap/playbooks/README.md" "${target}/.agents/playbooks/README.md"
for f in index.md MAINTENANCE.md log.md; do
  [[ -f "${target}/.agents/docs/${f}" ]] || cp "${KL}/bootstrap/docs/${f}" "${target}/.agents/docs/${f}"
done
sync_docs_subtree "${KL}/bootstrap/docs/repo-decisions" "${target}/.agents/docs/repo-decisions"
sync_docs_subtree "${KL}/bootstrap/docs/troubleshooting" "${target}/.agents/docs/troubleshooting"
[[ -f "${target}/.agents/AGENTS.md" ]] || cp "${KL}/bootstrap/AGENTS.md" "${target}/.agents/AGENTS.md"

mkdir -p "${target}/.agents/agents"
cp "${repo_root}/.agents/agents/"*.md "${target}/.agents/agents/"

echo
echo "Example folder generated successfully at ${target}."
