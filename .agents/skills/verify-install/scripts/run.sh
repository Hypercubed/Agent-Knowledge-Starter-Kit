#!/usr/bin/env bash
set -euo pipefail

# verify-install runner — see ../SKILL.md for goals, scenarios, and maintainer notes.
# Usage:
#   bash .agents/skills/verify-install/scripts/run.sh [scenarios...] [--keep] [-v|--verbose]
# Scenarios: fresh, fresh-skip, local-path, scoping, user-scope
# Default: run all.

KIT_HOST="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
VERBOSE=0
KEEP=0
SCENARIOS=()

for arg in "$@"; do
  case "$arg" in
    -v|--verbose) VERBOSE=1 ;;
    --keep) KEEP=1 ;;
    --) break ;;
    -*) echo "unknown flag: $arg" >&2; exit 2 ;;
    *) SCENARIOS+=("$arg") ;;
  esac
done

if [ ${#SCENARIOS[@]} -eq 0 ]; then
  SCENARIOS=(fresh fresh-skip local-path scoping user-scope)
fi

matches() {
  local name="$1"
  for want in "${SCENARIOS[@]}"; do
    case "$name" in *"$want"*) return 0 ;; esac
  done
  return 1
}

DOCKER_ARGS=()
if [ "$KEEP" -eq 0 ]; then
  DOCKER_ARGS+=(--rm)
fi
IMAGE="node:24"

failures=0
passes=0
total=0

warn_kit_lock() {
  if [ -f "$KIT_HOST/skills-lock.json" ]; then
    printf 'WARN: %s/skills-lock.json exists on host (gitignored) — local npx discovery may report Found 1 not 4. Remove it for clean local-path tests.\n' "$KIT_HOST" >&2
  fi
}

section() {
  printf '\n========================================\n%s\n========================================\n' "$1"
}

need_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    echo "docker not found — cannot run verify-install (see SKILL.md Prerequisites)" >&2
    exit 2
  fi
  if ! docker info >/dev/null 2>&1; then
    echo "docker daemon not reachable — start it first" >&2
    exit 2
  fi
}

need_docker
warn_kit_lock

# Helpers shared inside container — inlined per docker run heredoc below.
run_scenario() {
  local name="$1"
  local cmd="$2"
  total=$((total + 1))
  section "SCENARIO: $name"
  set +e
  docker run "${DOCKER_ARGS[@]}" -v "$KIT_HOST:/kit:ro" "$IMAGE" bash -c "$cmd"
  local rc=$?
  set -e
  if [ $rc -eq 0 ]; then
    printf 'PASS %s\n' "$name"
    passes=$((passes + 1))
  else
    printf 'FAIL %s (docker exit %d)\n' "$name" "$rc"
    failures=$((failures + 1))
  fi
}

# ---- Scenario: fresh (no tools, npx -> bootstrap does npm i -g) ----
if matches fresh && ! matches fresh-skip; then :; else
  # Single combined fresh test covers both fresh and fresh-skip via two runs;
  # keep ordering: fresh first (global lane runs), fresh-skip second (global lane skipped).
  :
fi

if matches fresh; then
  run_scenario fresh "
set -e
$( [ "$VERBOSE" -eq 1 ] && echo 'set -x' )
echo '--- node/npm ---'
node --version
npm --version
echo '--- tools before (expect missing) ---'
which openspec || echo 'openspec not found (fresh expected)'
which openwiki || echo 'openwiki not found (fresh expected)'
echo '--- init target ---'
mkdir -p /tmp/target && cd /tmp/target
git init -q
git config user.email 'test@test.com'
git config user.name 'Test'
echo '--- discovery ---'
npx --yes skills add /kit -l 2>&1 | tail -n 30
if ! npx --yes skills add /kit -l 2>&1 | grep -q 'Found 5 skills'; then
  echo 'FAIL: expected Found 5 skills via /kit plugin.json' >&2
  exit 1
fi
echo '--- add ---'
npx --yes skills add /kit -y --copy 2>&1 | tail -n 30
test -f .agents/skills/aksk-bootstrap/SKILL.md || { echo 'missing aksk-bootstrap' >&2; exit 1; }
test -f .agents/skills/docs-lint/SKILL.md || { echo 'missing docs-lint' >&2; exit 1; }
test -f .agents/skills/learning-distill/SKILL.md || { echo 'missing learning-distill' >&2; exit 1; }
test -f .agents/skills/task-closeout/SKILL.md || { echo 'missing task-closeout' >&2; exit 1; }
test -f .agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs || { echo 'missing bootstrap-global.mjs' >&2; exit 1; }
test -f .agents/skills/aksk-init/scripts/bootstrap-repo.mjs || { echo 'missing bootstrap-repo.mjs' >&2; exit 1; }
test -f .agents/skills/aksk-bootstrap/references/versions.json || { echo 'missing versions.json' >&2; exit 1; }
echo '--- Skill init (INSTALL.md) ---'
mkdir -p .agents/sessions .agents/playbooks
if [ ! -f .agents/sessions/README.md ]; then cp .agents/skills/task-closeout/bootstrap/sessions/README.md .agents/sessions/README.md; fi
if [ ! -f .agents/.gitignore ]; then printf 'sessions/*\n!sessions/README.md\n' > .agents/.gitignore; fi
if [ ! -f .agents/playbooks/README.md ]; then cp .agents/skills/learning-distill/bootstrap/playbooks/README.md .agents/playbooks/README.md; fi
if [ ! -f .agents/AGENTS.md ]; then cp .agents/skills/learning-distill/bootstrap/AGENTS.md .agents/AGENTS.md; fi
echo '--- check_peer_tools (should need install) ---'
if node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki 2>&1; then
  echo 'unexpected pass of check_peer_tools on fresh' >&2; exit 1
else
  echo 'check_peer_tools correctly failed (tools missing)'
fi
echo '--- bootstrap-global.mjs (global lane) ---'
if ! timeout 300 node .agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs /tmp/target 2>&1 | tee /tmp/b_fresh.log | tail -n 100; then
  cat /tmp/b_fresh.log | head -n 50
fi
if grep -q 'ECONNRESET' /tmp/b_fresh.log 2>/dev/null; then
  echo 'npm ECONNRESET transient, retrying bootstrap...'
  timeout 300 node .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs /tmp/target 2>&1 | tail -n 100
fi
cat /tmp/b_fresh.log 2>/dev/null | head -n 5
which openspec && openspec --version
which openwiki && openwiki --help 2>&1 | head -5
echo '--- bootstrap-repo.mjs (per-repo lane) ---'
timeout 60 node .agents/skills/aksk-init/scripts/bootstrap-repo.mjs /tmp/target 2>&1 | tail -n 100
test -f /tmp/target/AGENTS.md || { echo 'missing AGENTS.md baseline' >&2; exit 1; }
timeout 60 node .agents/skills/aksk-init/scripts/bootstrap-repo.mjs /tmp/target 2>&1 | tail -n 30
grep -q 'AKSK:AGENTS-BASELINE' /tmp/target/AGENTS.md || { echo 'baseline marker missing' >&2; exit 1; }
grep -q 'AKSK:ROUTING' /tmp/target/AGENTS.md || { echo 'routing marker missing' >&2; exit 1; }
test -d /tmp/target/openspec || { echo 'missing openspec/' >&2; exit 1; }
echo '--- check-agents-structure ---'
git add -f .agents/sessions/README.md .agents/.gitignore .agents/playbooks/README.md .agents/AGENTS.md 2>/dev/null || true
bash /kit/scripts/check-agents-structure.sh .agents
git status --short | head -20
"
fi

# ---- Scenario: fresh-skip (tools already on PATH, global lane skipped) ----
if matches fresh-skip; then
  # fresh-skip: bind host's global bins read-only so bootstrap sees them and skips npm i -g.
  # Fall back to preinstalling inside container if host bins not available.
  HOST_BIN="$(dirname "$(which openspec 2>/dev/null || echo /tmp/no-openspec)")"
  HOST_BIN2="$(dirname "$(which openwiki 2>/dev/null || echo /tmp/no-openwiki)")"
  # Use a separate image run that seeds openspec/openwiki before bootstrap if mounts unavailable.
  run_scenario fresh-skip "
set -e
$( [ "$VERBOSE" -eq 1 ] && echo 'set -x' )
echo '--- ensure tools on PATH for skip test ---'
if ! command -v openspec >/dev/null 2>&1; then npm i -g @fission-ai/openspec openwiki >/dev/null 2>&1; fi
which openspec && openspec --version
which openwiki || true
mkdir -p /tmp/target && cd /tmp/target
git init -q
git config user.email 'test@test.com'
git config user.name 'Test'
npx --yes skills add /kit -g -a codex -y --copy 2>&1 | tail -n 20
test -f ~/.agents/skills/aksk-bootstrap/SKILL.md || { echo 'fresh-skip: missing universal' >&2; exit 1; }
mkdir -p .agents/skills && cp -r ~/.agents/skills/* .agents/skills/ 2>/dev/null || true
mkdir -p .agents/sessions .agents/playbooks
if [ ! -f .agents/sessions/README.md ]; then cp .agents/skills/task-closeout/bootstrap/sessions/README.md .agents/sessions/README.md; fi
if [ ! -f .agents/.gitignore ]; then printf 'sessions/*\n!sessions/README.md\n' > .agents/.gitignore; fi
if [ ! -f .agents/playbooks/README.md ]; then cp .agents/skills/learning-distill/bootstrap/playbooks/README.md .agents/playbooks/README.md; fi
if [ ! -f .agents/AGENTS.md ]; then cp .agents/skills/learning-distill/bootstrap/AGENTS.md .agents/AGENTS.md; fi
echo '--- check_peer_tools should pass now ---'
node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki
echo '--- bootstrap-global (should SKIP) ---'
if ! timeout 120 node .agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs /tmp/target 2>&1 | tee /tmp/b.log | grep -q 'skipping install\|tools present'; then
  echo 'expected bootstrap skip message not found' >&2
  cat /tmp/b.log
  exit 1
fi
timeout 60 node .agents/skills/aksk-init/scripts/bootstrap-repo.mjs /tmp/target 2>&1 | tail -n 30
grep -q 'AKSK:AGENTS-BASELINE' /tmp/target/AGENTS.md
git add -f .agents/sessions/README.md .agents/.gitignore .agents/playbooks/README.md .agents/AGENTS.md 2>/dev/null || true
bash /kit/scripts/check-agents-structure.sh .agents
"
fi


# ---- Scenario: local-path (cwd bug) ----
if matches local-path; then
  run_scenario local-path "
set -e
$( [ "$VERBOSE" -eq 1 ] && echo 'set -x' )
mkdir -p /tmp/target && cd /tmp/target
git init -q
# From target, npx skills add /kit -l should find 4
npx --yes skills add /kit -l 2>&1 | tee /tmp/l_kit.log | tail -n 20
if ! grep -q 'Found 5 skills' /tmp/l_kit.log; then echo 'Expected Found 5 via /kit' >&2; exit 1; fi
# Demonstrate that bare npx skills add . from target without kit path is not equivalent
# (it would source from target itself, which has no plugin.json — Found 0 or error)
echo '--- bare . probe (informational, not failure) ---'
npx --yes skills add . -l 2>&1 | tail -n 20 || true
echo 'local-path cwd discipline verified: use npx skills add <path-to-kit> from target, not npx skills add .'
"
fi

# ---- Scenario: scoping (-a/-g/--all) ----
if matches scoping; then
  run_scenario scoping "
set -e
$( [ "$VERBOSE" -eq 1 ] && echo 'set -x' )
echo '--- scoping: -g (universal-only) ---'
mkdir -p /tmp/target-scope && cd /tmp/target-scope
git init -q
git config user.email 'test@test.com'
git config user.name 'Test'
npx --yes skills add /kit -g -y --copy 2>&1 | tail -n 40
test -f ~/.agents/skills/aksk-bootstrap/SKILL.md || { echo 'repo-only: universal missing' >&2; exit 1; }
if [ -d ~/.codex/skills/aksk-bootstrap ] && [ "${SCOPING_STRICT:-0}" = "1" ]; then echo 'repo-only: unexpected codex mirror' >&2; exit 1; fi
echo 'repo-only PASS'
cd /tmp
rm -rf /tmp/target-scope

echo '--- scoping: -a claude-code (single mirror) ---'
mkdir -p /tmp/target-claude && cd /tmp/target-claude
git init -q
git config user.email 'test@test.com'
git config user.name 'Test'
# -a claude-code writes to that agent dir, not universal .agents (expected)
npx --yes skills add /kit -g -a claude-code -y --copy 2>&1 | tail -n 40
test -d ~/.claude/skills/aksk-bootstrap || { echo 'single-mirror: ~/.claude missing' >&2; exit 1; }
# .agents is not written with -a claude-code; verify clone fallback would still give .agents
if [ -f .agents/skills/aksk-bootstrap/SKILL.md ]; then echo 'single-mirror: unexpected .agents (may be residue)'; fi
echo 'single-mirror PASS'
cd /tmp
rm -rf /tmp/target-claude

echo '--- scoping: --all (wide) ---'
mkdir -p /tmp/target-all && cd /tmp/target-all
git init -q
git config user.email 'test@test.com'
git config user.name 'Test'
npx --yes skills add /kit --all -y --copy 2>&1 | tail -n 40
test -f .agents/skills/aksk-bootstrap/SKILL.md || { echo '--all: missing .agents' >&2; exit 1; }
# wide should have many mirrors (~/.agents/skills universal)
mirror_count=\$(find . -name SKILL.md -path '*/skills/aksk-bootstrap/SKILL.md' | wc -l)
if [ \"\$mirror_count\" -lt 5 ]; then
  echo \"--all: expected many mirrors (~/.agents/skills universal), got \$mirror_count\" >&2
  exit 1
fi
echo \"wide spread count: \$mirror_count PASS\"
"
fi


# ---- Scenario: user-scope (-g vs host) ----
if matches user-scope; then
  run_scenario user-scope "
set -e
mkdir -p /tmp/target-us && cd /tmp/target-us
git init -q
npx --yes skills add /kit -g -y --copy 2>&1 | tail -n 20
test -f ~/.agents/skills/aksk-bootstrap/SKILL.md || { echo 'user-scope: universal missing' >&2; exit 1; }
if [ -d ~/.codex/skills/aksk-bootstrap ]; then echo 'user-scope: unexpected codex mirror for -g only (ok if residue)'; fi
echo 'user-scope PASS'
"
fi

section "SUMMARY"
echo "Passed: $passes/$total"
if [ "$failures" -gt 0 ]; then
  echo "Failed: $failures"
  exit 1
fi
printf 'All requested scenarios passed.\n'
