## Why

Install docs currently present four lanes (bootstrap-first, manual `npm i -g`, `cp example/.agents`, agent-assisted prompt) as peers. Exploration showed `example/` is a stale snapshot that duplicates what `npx skills add --full-depth` plus `bootstrap.mjs` already do (and does not include `openwiki/`/`openspec/`), while both preferred lanes converge on `aksk-bootstrap/SKILL.md` + its `scripts/*.mjs`. Consumers need a clear two-lane order (agent-first preferred, `npx skills add` fallback) and the repo needs to stop maintaining the `generate-example` → `example/` generator.

## What Changes

- **BREAKING**: Remove `example/` directory (38 tracked files) and all references to it as an install method from `README.md`, `INSTALL.md`, and playbooks.
- **BREAKING**: Delete maintainer-only skill `.agents/skills/generate-example/` (`SKILL.md` + `run.sh`, `internal:true`) and its playbook `.agents/playbooks/generate-example.md`.
- Update `README.md` Quick start and `INSTALL.md` to reorder: **1) Agent-assisted via `aksk-bootstrap` (preferred)** — agent clones kit (if needed) and runs `node .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs`; **2) `npx skills add` with `--full-depth` (fallback)** — human manual, both lanes delegate peer checks to `aksk-bootstrap/scripts/check_peer_tools.mjs` and `attach_*`. Document that `npx skills add` copies `scripts/*.mjs` + `references/` when skills are discovered (requires `--full-depth` for this repo layout).
- Clean shell scripts: remove `example/*) continue` link-check bypass from `scripts/check-publish.sh` and remove `example/.agents` checks from `.agents/playbooks/pre-publish.md` and `major-version-release.md`; keep `.openwikiignore /example/` only if `example/` is gone (remove it).
- Clarify that `.claude-plugin/plugin.json` lists the 4 user skills and is loaded by default; remote `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit` without a ref fetches `main` (old `scaffold/...` paths) — document `@develop` or post-merge `main` expectation.

## Capabilities

### New Capabilities
- `install-lanes`: Ordering and content of supported install lanes (agent-assisted preferred, `npx skills add --full-depth` fallback), that `npx skills add` includes `scripts/*.mjs` and `references/` for discovered skills, and that `example/` + `generate-example` are no longer supported.

### Modified Capabilities
- `aksk-bootstrap`: Clarify that both lanes use the bootstrap orchestrator's `scripts/` and that the recommended entry is agent-driven execution of `bootstrap.mjs` with INSTRUCT fallback, not human direct bootstrap as the primary human quick-start.

## Impact

- Docs: `README.md`, `INSTALL.md`, `docs/integrations/README.md` if needed, `.agents/playbooks/*`.
- Repo tree: `example/` deleted, `.agents/skills/generate-example/` deleted, `.agents/playbooks/generate-example.md` deleted.
- Scripts: `scripts/check-publish.sh`, `scripts/check-agents-structure.sh` usage in docs, `.openwikiignore`.
- No change to runtime of `aksk-bootstrap` scripts themselves; `.claude-plugin/plugin.json` unchanged (already excludes `generate-example`).
- Consumers using `cp example/.agents` will need to switch to agent-assisted or `npx skills add --full-depth` (migration note).
