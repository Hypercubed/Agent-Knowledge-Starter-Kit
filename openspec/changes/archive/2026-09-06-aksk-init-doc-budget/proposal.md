# Proposal: Bake Documentation Budget into aksk-init (Phase 2)

## Why

Phase 1 fixes this repo only. New consumer repos created via `aksk-init` would still start without the documentation budget, recreating wiki bloat. Baking the brief and a proper `.openwikiignore` installer into `aksk-init` makes every future init produce a budget-constrained wiki by default.

## What Changes

- Expand `references/wiki-contract-template.md` Option A: Documentation brief lives inside `AKSK:WIKI-CONTRACT` markers so `attach_wiki_contract.mjs` distributes it. Single marker, single refresh path.
- Add `references/openwikiignore-template.md` (anchored starter list with comments, categories: dependencies/build products/caches, generated/vendor, machine-local/secrets, low-value for agent wiki) — merge-not-clobber semantics.
- Add installer script `scripts/init_openwikiignore.mjs` (or extend existing attach logic): if no `.openwikiignore`, write template; if `.openwikiignore` exists without AKSK markers, append tagged section; if markers exist, refresh tagged section only; never clobber user additions outside markers.
- Wire installer into `scripts/bootstrap-repo.mjs` orchestration (after `openwiki --init` and contract attach) and ensure non-interactive + idempotent re-run is no-op.
- Update specs: `wiki-contract` (budget + ignore ownership) and `aksk-init` (new step, execution model, idempotence).

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `wiki-contract`: same Documentation budget as Phase 1 plus `.openwikiignore` ownership/idempotence requirement
- `aksk-init`: add repo scaffolding step for Documentation budget distribution (template + ignore installer), versioned via `aksk-bootstrap/references/versions.json` and non-interactive execution model

## Impact

- `.agents/skills/aksk-init/references/wiki-contract-template.md` — expanded (if not already by Phase 1, canonical home)
- `.agents/skills/aksk-init/references/openwikiignore-template.md` — new
- `.agents/skills/aksk-init/scripts/init_openwikiignore.mjs` — new (or equivalent)
- `.agents/skills/aksk-init/scripts/bootstrap-repo.mjs` — new step
- `.agents/skills/aksk-init/scripts/attach_wiki_contract.mjs` — unchanged behavior, but refresh now carries budget
- `openspec/specs/wiki-contract/spec.md` and `openspec/specs/aksk-init/spec.md` — requirements
- Consumer repos benefit on next `aksk-init`; existing repos migrate by re-running init (idempotent).
