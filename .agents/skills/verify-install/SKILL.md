---
name: verify-install
description: Run the AKSK install lanes in isolated Docker sandboxes and prove they land a valid kit. Covers fresh npx, local-path mount, clone-and-copy fallback (no-npx), -a/-g/--all scoping, and tool-lane skip vs global-npm cases.
metadata:
  internal: true
---

# Verify Install (Docker Sandbox)

## Goal

Prove every supported AKSK install lane still lands a valid kit when run from a clean machine. This is maintainer-only (`metadata.internal: true`) — it is not shipped to consumers, does not modify `openspec/` itself, and never calls `openwiki --update`.

Use it after touching `README.md`, `INSTALL.md`, `.claude-plugin/plugin.json`, `.agents/skills/*` (especially `aksk-bootstrap/scripts/*`), or `scripts/check-*`.

## Prerequisites

- `docker` available and runnable (`docker version`).
- `node:24` image reachable (pulls automatically on first run).
- Host kit checkout at repo root (mounted read-only as `/kit:ro`).
- No credential or network assumptions beyond pulling `node:24` and the one `npm i -g` inside the fresh container for the global lane.

## What it proves

- Discovery finds the 4 consumer skills (`aksk-bootstrap`, `learning-distill`, `task-closeout`, `docs-lint`) via `.claude-plugin/plugin.json` and that each carries its `scripts/*.mjs` + `references/`.
- Agent-assisted `npx skills add <kit>` from the **target** repo works, and that `npx skills add .` does not (it reinstalls into the kit itself).
- `npx` is required; no `git clone --depth 1 && cp -r` fallback (INSTRUCT prints prerequisite).
- Scope is `~/.agents/skills` (universal) + self-reported host via `-g -a <self-reported>`; `-g` → only `~/.agents/skills`, `--all` wide is negative case.
- Tool lane: fresh has no `openspec`/`openwiki` → `bootstrap.mjs` runs `npm i -g` (caret from `references/versions.json`); present → skips; openwiki two-track: `openwiki integrations install <self-reported>` when that host is supported else `npx skills add -g` + `npx add-mcp`.
- Final tree passes `bash /kit/scripts/check-agents-structure.sh .agents` and the per-target `AGENTS.md` baseline is present.

## Quick use

```bash
# all scenarios (fresh global lane + skipped global lane)
bash .agents/skills/verify-install/scripts/run.sh

# only a subset — pass scenarios by name (substring match)
bash .agents/skills/verify-install/scripts/run.sh fresh
bash .agents/skills/verify-install/scripts/run.sh fresh-skip
bash .agents/skills/verify-install/scripts/run.sh scoping
bash .agents/skills/verify-install/scripts/run.sh local-path
bash .agents/skills/verify-install/scripts/run.sh user-scope

# keep containers for inspection (default: --rm)
bash .agents/skills/verify-install/scripts/run.sh --keep

# verbose bootstrap (set -x per scenario)
bash .agents/skills/verify-install/scripts/run.sh -v
```

## Scenarios

| # | Name | How it exercises the README/INSTALL prompt | Success signal |
|---|------|----------------------------------------------|----------------|
| 1 | `fresh` | `npx --yes skills add -g,codex /kit -y --copy` from blank `node:24` (`which openspec` → not found) | Found 4 under `~/.agents/skills` + `~/.codex/skills`, `bootstrap.mjs` does `npm i -g` and seeds `AGENTS.md`/`openspec/` |
| 2 | `fresh-skip` | same as 1 but `openspec`/`openwiki` already on PATH → global lane skipped | bootstrap logs `skipping user-scope install` and still seeds `AGENTS.md` + `openspec/` |
| 3 | `user-scope` | `npx --yes skills add -g /kit` → only `~/.agents/skills` | `~/.agents/skills/*/SKILL.md` present, `~/.codex/skills` not written |
| 4 | `local-path` | `npx skills add /kit` vs `npx skills add .` — probes cwd bug | `/kit -l` → Found 4; `npx skills add .` from target without kit path → not equivalent (documents that `<path-to-kit>` must be used when a checkout is present) |
| 5 | `scoping` | `-g` / `-g -a codex` / `-g --all` | universal-only vs host mirror vs wide 56 |

## Procedure (what `run.sh` does)

For each requested scenario the script does, inside the container:

1. `mkdir -p /tmp/target && cd /tmp/target && git init -q && git config user.email/name`.
2. Run the lane under test (see table). Report `Found X skills`.
3. Manual Skill initialization per `INSTALL.md` (idempotent): `cp -r /kit/.agents/skills/task-closeout/bootstrap/sessions/README.md` → `.agents/sessions/README.md` when missing, `printf "sessions/*\n!sessions/README.md\n" > .agents/.gitignore` when missing, `learning-distill/bootstrap/{AGENTS.md,playbooks/README.md,sessions/README.md}` when missing.
4. Run `node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki` then `node .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs /tmp/target` (fresh → does `npm i -g`; skip → does not).
5. Validate: `bash /kit/scripts/check-agents-structure.sh .agents` (exit 0), `test -f .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs`, `test -f AGENTS.md` (AKSK:AGENTS-BASELINE), `git status --short` shows only untracked (no `git add`).
6. Print per-scenario `PASS`/`FAIL` and, on failure, keep enough output to reproduce locally with the printed `docker run …` one-liner.

## Output

- Each scenario prints `--- SCENARIO: <name> ---` and ends with `PASS <name>` or `FAIL <name>`.
- Final summary: `X/Y passed`.

## Constraints

- The skill is a **test harness** — it must not `git add`, `git commit`, `npm i -g` on the host, or modify `openspec/` or the kit's own `.agents/`.
- All writes happen inside the ephemeral container's `/tmp/target`; mount the kit as `:ro` so it cannot be mutated.
- Keep docker invocations to `node:24` only — no devcontainer or Dockerfile is required (this repo ships none).
- When contributing, reference the skill in task-closeout `validation.txt` (e.g. `bash .agents/skills/verify-install/scripts/run.sh fresh`) rather than pasting long container logs.

## Maintainer notes

- `skills-lock.json` is gitignored (and should not exist in the kit checkout) — if it does, `npx skills add <local-path> -l` will report `Found 1` (filters `isInstalledProjectSkill` against the source lock) instead of 4; `run.sh` warns when `/kit/skills-lock.json` is present.
- Remote `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit` fetches from `main` (old `scaffold/...`) until `develop` is merged — this harness tests the local mount path `npx skills add /kit` to avoid that lag.
