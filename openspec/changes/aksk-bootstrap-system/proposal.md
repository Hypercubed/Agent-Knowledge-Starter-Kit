## Why

The AKSK 2.0 refactor (`adopt-openspec-openwiki`) established OpenSpec and OpenWiki as peer dependencies with fail-fast preconditions - but adopting it means hand-running every setup step: global installs, repo initialization, `.agents/` scaffolding, curation-contract attachment, and per-agent wiring of the OpenWiki skill bundle and MCP registration. That manual path is exactly right for dogfooding and wrong for consumers.

This change adds an opinionated bootstrap system that automates those steps: one idempotent entry point (skill plus deterministic Python script) that takes a repo from bare to fully wired, preferring global per-user installs with per-repo bootstrapping on demand, never half-installing, and falling back to printed instructions (INSTRUCT lane) when local execution is not possible.

**Dependency:** requires `adopt-openspec-openwiki` to be applied first. Bootstrap copies that change's finalized skill set into consumer repos and reuses its curation-contract attachment rather than defining its own.

## What Changes

- Add an `aksk-bootstrap` skill (+ deterministic consumer script per `python-preference-for-consumer-scripts`) that:
  - Preflights Node >= 22 and detects existing `.agents/`, `openspec/`, `openwiki/`, and `.openwiki-install.json` receipts.
  - Performs a once-per-user global lane: `npm i -g @fission-ai/openspec@latest openwiki`.
  - Bootstraps per-repo on demand: `openspec init` when missing, scaffolds minimal `.agents/` from the finalized kit templates, attaches the AKSK curation contract to `openwiki/INSTRUCTIONS.md` (append-only merge per `adopt-openspec-openwiki`), merges a thin routing block into root `AGENTS.md`.
  - Never half-installs: any step that cannot run prints exact commands and exits clean.
- Spread OpenWiki agent integration over detected agents using `npx skills add` plus `add-mcp`, preferring official claude/codex lanes, enforcing the ownership-partition rule (receipt present -> official lane owns that agent -> skip), and falling back to headless CLI usage for agents without MCP support.
- Regenerate `example/` so the consumer-path example includes the bootstrap skill.
- Revise integration guides to name bootstrap as the primary wiring path.

## Capabilities

### New Capabilities
- `aksk-bootstrap`: The orchestrator skill and consumer script - preflight detection, global tool install lane, per-repo scaffolding (`openspec init`, `.agents/` scaffold, curation-contract attachment, AGENTS.md routing block), idempotent re-runs, and clean-exit INSTRUCT fallback.
- `agent-integration-spread`: Distribution of OpenWiki's coding-agent integration across detected agents via the skills CLI and `add-mcp`, including the ownership-partition rule, receipt handling, and lane selection (official claude/codex vs generic MCP vs headless CLI ladder).

### Modified Capabilities

(None - `distill-routing` and `cross-tool-lint` live in the prerequisite change.)

## Impact

- **Skills:** new `.agents/skills/aksk-bootstrap/`; templates under it copy the finalized skill set from the prerequisite change.
- **Scripts:** new deterministic bootstrap script following existing consumer-script conventions (Python).
- **Docs:** README/INSTALL gain the bootstrap-first happy path (manual peer-dependency steps remain documented as fallback); integration guides updated; `example/` regenerated.
- **Dependencies:** runtime dependency on globally installed `@fission-ai/openspec` (Node >= 20.19) and `openwiki` (Node >= 22); `npx skills` and `add-mcp` as spread vehicles.
- **Related changes:** depends on `adopt-openspec-openwiki`; supersedes installer scope formerly proposed in `aksk-install-tools` (archived 2026-08-23).
