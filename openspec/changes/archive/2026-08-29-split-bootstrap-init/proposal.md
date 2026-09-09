## Why

`aksk-bootstrap` currently does two unrelated jobs in one script: installing global tools (openspec/openwiki binaries + global skills, once per machine) and initializing a repo (.agents scaffold, agents.md, openwiki init, routing). The conflation makes CI/sandbox use awkward (globals already present), hides failure scope, and mixes permission models.

## What Changes

- Split `aksk-bootstrap` into two skills: `aksk-bootstrap` (global/env lane, usually run once) and `aksk-init` (per-repo lane, run per repo).
- Global lane (`aksk-bootstrap`) — interactive: Node >=22 check, prompt to `npm i -g` for openspec/openwiki from caret ranges in `references/versions.json`, verify on PATH, `openwiki integrations install <host>` (receipt-partitioned), global skill installs (`npx skills add -g`).
- Repo lane (`aksk-init`) — interactive: preflight verifies bootstrap ready (fail-fast with "run aksk-bootstrap first"), `.agents/` scaffold + `AGENTS.md` baseline (first), then `openspec init`, `attach_wiki_contract` (now wrapping `openwiki --init` when needed), `attach_section` routing+lifecycle, optional repo-local skill install flag.
- `bootstrap.mjs` becomes a thin wrapper or is replaced by two lane scripts (`bootstrap-global.mjs` / `bootstrap-repo.mjs`) with backward-compat shim.
- Both skills are interactive: the agent describes each planned action and prompts the user to confirm/skip/change options before executing (e.g. "Run openwiki --init now? [Y/n/skip]"). Non-interactive mode via --yes / --non-interactive for CI/sandbox uses current defaults.
- INSTRUCT lane partitioned per skill.
- Shared `references/versions.json` (single source of truth, read by both lanes).

## Capabilities

### New Capabilities
- `aksk-init`: Per-repo initialization — scaffolding, contract/routing attachment, and repo-scoped integration that requires global tools to already be present.

### Modified Capabilities
- `aksk-bootstrap`: Narrowed to global/env responsibilities; repo-scoped steps removed. Now owns version resolution, global skill spread, and host integrations.

## Impact

- `.agents/skills/aksk-bootstrap/` narrowed; new `.agents/skills/aksk-init/` added.
- `scripts/bootstrap.mjs` split into `bootstrap-global.mjs` + `bootstrap-repo.mjs` (or equivalent).
- `references/versions.json` kept shared (symlink or copy with lint guard).
- Docs, install-lanes, and `check_peer_tools` references updated.
- No breaking change to already-bootstrapped repos (idempotent re-run is no-op).
