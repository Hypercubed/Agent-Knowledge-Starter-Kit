#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
target="${repo_root}/_test-target-repo"
skills_bin="${repo_root}/node_modules/.bin/skills"

if [[ ! -x "${skills_bin}" ]]; then
  echo "error: skills CLI not found at ${skills_bin}" >&2
  echo "hint: run npm install in repo root first" >&2
  exit 1
fi

echo "== Recreate test target =="
rm -rf "${target}"
mkdir -p "${target}"
cd "${target}"
git init >/dev/null
printf '%s\n' '# Test target repository' '' 'Synthetic consumer repo for validating Agent Knowledge Starter Kit install.' > README.md

echo
echo "== List discoverable skills (expect 3) =="
list_output="$("${skills_bin}" add "${repo_root}" -l -y 2>&1)"
printf '%s\n' "${list_output}"
if ! printf '%s' "${list_output}" | rg -q 'Found 3 skills'; then
  echo "FAIL: expected 'Found 3 skills' in list output" >&2
  exit 1
fi

echo
echo "== Install without --all =="
install_output="$("${skills_bin}" add "${repo_root}" -y --copy --agent cursor 2>&1)"
printf '%s\n' "${install_output}"
if ! printf '%s' "${install_output}" | rg -q 'Installing all 3 skills'; then
  echo "FAIL: expected install to include exactly 3 skills" >&2
  exit 1
fi

echo
echo "== Bootstrap required artifacts =="
LD="${target}/.agents/skills/learning-distill"
TC="${target}/.agents/skills/task-closeout"
KL="${target}/.agents/skills/knowledge-lint"

mkdir -p "${target}/.agents/playbooks" "${target}/.agents/docs" "${target}/.agents/sessions"
[[ -f "${target}/.agents/playbooks/README.md" ]] || cp "${LD}/bootstrap/playbooks/README.md" "${target}/.agents/playbooks/README.md"
for f in index.md MAINTENANCE.md log.md repo-decisions.md troubleshooting.md; do
  [[ -f "${target}/.agents/docs/${f}" ]] || cp "${LD}/bootstrap/docs/${f}" "${target}/.agents/docs/${f}"
done
[[ -f "${target}/.agents/sessions/README.md" ]] || cp "${LD}/bootstrap/sessions/README.md" "${target}/.agents/sessions/README.md"
[[ -f "${target}/.agents/AGENTS.md" ]] || cp "${LD}/bootstrap/AGENTS.md" "${target}/.agents/AGENTS.md"
if [[ ! -f "${target}/.agents/.gitignore" ]]; then
  printf '%s\n' 'sessions/*' '!sessions/README.md' > "${target}/.agents/.gitignore"
else
  rg -q '^sessions/\*$' "${target}/.agents/.gitignore" || echo 'sessions/*' >> "${target}/.agents/.gitignore"
  rg -q '^!sessions/README\.md$' "${target}/.agents/.gitignore" || echo '!sessions/README.md' >> "${target}/.agents/.gitignore"
fi

[[ -f "${target}/.agents/sessions/README.md" ]] || cp "${TC}/bootstrap/sessions/README.md" "${target}/.agents/sessions/README.md"

mkdir -p "${target}/.agents/playbooks" "${target}/.agents/docs"
[[ -f "${target}/.agents/playbooks/README.md" ]] || cp "${KL}/bootstrap/playbooks/README.md" "${target}/.agents/playbooks/README.md"
for f in index.md MAINTENANCE.md log.md repo-decisions.md troubleshooting.md; do
  [[ -f "${target}/.agents/docs/${f}" ]] || cp "${KL}/bootstrap/docs/${f}" "${target}/.agents/docs/${f}"
done
[[ -f "${target}/.agents/AGENTS.md" ]] || cp "${KL}/bootstrap/AGENTS.md" "${target}/.agents/AGENTS.md"

echo
echo "== Validate artifacts =="
pass() { echo "PASS: $1"; }
fail() { echo "FAIL: $1" >&2; exit 1; }

rg -q '^sessions/\*$' "${target}/.agents/.gitignore" && pass ".agents/.gitignore has sessions/*" || fail ".agents/.gitignore missing sessions/*"
rg -q '^!sessions/README\.md$' "${target}/.agents/.gitignore" && pass ".agents/.gitignore has !sessions/README.md" || fail ".agents/.gitignore missing !sessions/README.md"
[[ -f "${target}/.agents/sessions/README.md" ]] && pass "sessions README exists" || fail "sessions README missing"
[[ -f "${target}/.agents/AGENTS.md" ]] && pass "AGENTS.md exists" || fail "AGENTS.md missing"
for f in index.md MAINTENANCE.md log.md repo-decisions.md troubleshooting.md; do
  [[ -f "${target}/.agents/docs/${f}" ]] && pass "docs/${f} exists" || fail "docs/${f} missing"
done
[[ -f "${target}/.agents/playbooks/README.md" ]] && pass "playbooks README exists" || fail "playbooks README missing"
if rg -q 'sync-scaffold-agents-skills' "${target}/.agents/skills"; then
  fail "maintainer-only skill leaked into target"
else
  pass "maintainer-only skill absent from target"
fi

echo
echo "Smoke test complete."
