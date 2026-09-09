## Why

`aksk-bootstrap` was split into a global lane (`bootstrap-global.mjs`) and a per-repo lane (`aksk-init/bootstrap-repo.mjs`), but the compat shim `aksk-bootstrap/scripts/bootstrap.mjs` that sequentially runs both lanes was kept. It now causes the exact confusion seen in this repo: `aksk-bootstrap` was observed modifying `AGENTS.md` (a per-repo file) because the shim silently fell through to the repo lane, violating the documented invariant that the global lane must not touch per-repo files. Eliminating the shim and making the two skills explicitly independent removes the hidden coupling and forces the correct two-step workflow to be visible in docs.

## What Changes

- **BREAKING** — Delete `.agents/skills/aksk-bootstrap/scripts/bootstrap.mjs` (the shim that spawns `bootstrap-global.mjs` then `aksk-init/scripts/bootstrap-repo.mjs`). No replacement executable is added; the two lanes become the only entry points.
- Make `aksk-bootstrap` and `aksk-init` fully independent: `aksk-bootstrap` owns only per-user globals (Node check, `npm i -g`, skill spread, PATH verification); `aksk-init` owns only per-repo scaffolding (`.agents/` + `AGENTS.md` baseline, `openspec init`, `openwiki --init`, routing/lifecycle/contract attachment). Neither invokes the other and neither fails silently through to the other.
- Update all user-facing docs that reference the shim as the preferred EXECUTE lane — `README.md`, `INSTALL.md`, `openwiki/quickstart.md`, `openwiki/architecture/overview.md`, `openwiki/integrations/distribution-and-tool-wiring.md`, `openwiki/integrations/distribution-and-agent-spread.md`, `openwiki/workflows/bootstrap-and-attachment.md`, `openwiki/skills/aksk-bootstrap.md`, `openwiki/skills/aksk-init.md`, `openwiki/governance/agent-entrypoints.md`, plus the two skill `SKILL.md` files — to show the two explicit commands (`bootstrap-global.mjs` then `bootstrap-repo.mjs`) and clearly state that `aksk-bootstrap` does not scaffold a repo.
- Update `openwiki` and any tests/scripts that `grep` for `bootstrap.mjs` as a validation target (`scripts/check-agents-structure.sh`, `scripts/check-publish.sh`, `verify-install` skill) to point at `bootstrap-global.mjs` / `bootstrap-repo.mjs`.

## Capabilities

### New Capabilities
- None — this is a removal and clarification; no new behavior is introduced.

### Modified Capabilities
- `aksk-bootstrap`: Remove shim ownership; narrow the spec to the global-only lane and clarify that per-repo steps are exclusively in `aksk-init`. Requirements around global lane scope, idempotency, and never-half-install remain but examples referencing the shim are removed.
- `aksk-init`: Clarify independence — per-repo lane no longer reachable via `aksk-bootstrap` shim; docs must show standalone invocation and explicit ordering (bootstrap globals first, then init repo).
- `install-lanes`: Update the preferred agent-assisted lane documentation to present the two-lane sequence explicitly rather than the single `bootstrap.mjs` EXECUTE lane; remove `bootstrap.mjs` as a documented checkout alternative.

## Impact

- Code: Single file deletion (`aksk-bootstrap/scripts/bootstrap.mjs`) plus small edits to `aksk-bootstrap/SKILL.md` and `aksk-init/SKILL.md` (lane descriptions).
- Docs: ~12 markdown files across `README.md`, `INSTALL.md`, and `openwiki/{quickstart,architecture,integrations,skills,workflows,governance}` that currently present `bootstrap.mjs` as the shim entry point. No API or spec behavior change beyond removing the combined invocation.
- Tooling: `scripts/check-agents-structure.sh` / `check-publish.sh`, `verify-install` skill scripts that assert `bootstrap.mjs` exists.
- **BREAKING** for consumers invoking `node .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs` — they must run the two explicit lane scripts in order. Migration is a one-line doc change (replace shim call with the two commands).
