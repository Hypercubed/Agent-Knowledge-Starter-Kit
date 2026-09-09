## Why

The AKSK 2.0 refactor (`adopt-openspec-openwiki`) established OpenSpec and OpenWiki as peer dependencies with fail-fast preconditions - but adopting it means hand-running every setup step: global installs, repo initialization, `.agents/` scaffolding, curation-contract attachment, and per-agent wiring of the OpenWiki skill bundle and MCP registration. That manual path is exactly right for dogfooding and wrong for consumers.

This change adds an opinionated bootstrap system that automates those steps: one idempotent entry point (skill plus deterministic JS script) that takes a repo from bare to fully wired, preferring global per-user installs with per-repo bootstrapping on demand, never half-installing, and falling back to printed instructions (INSTRUCT lane) when local execution is not possible.

**Dependency:** requires `adopt-openspec-openwiki` to be applied first. Bootstrap copies that change's finalized skill set into consumer repos and reuses its curation-contract attachment rather than defining its own.

## What Changes

- Add an `aksk-bootstrap` skill (+ deterministic JS consumer script per `js-preference-for-consumer-scripts` / Node) that:
  - Preflights Node >= 22 and detects existing `.agents/`, `openspec/`, `openwiki/`, and `.openwiki-install.json` receipts.
  - Performs a once-per-user global lane in user scope: `npm i -g @fission-ai/openspec@latest openwiki@latest` (`npm i -g` per-user, not repo-local `npx` or `node_modules`).
  - Bootstraps per-repo on demand: `openspec init` when missing, scaffolds minimal `.agents/` from the finalized kit templates, attaches the AKSK curation contract to `openwiki/INSTRUCTIONS.md` (append-only merge per `adopt-openspec-openwiki`), merges a thin routing block into root `AGENTS.md`.
  - Never half-installs: any step that cannot run prints exact commands and exits clean.
- Spread OpenWiki agent integration over detected agents using `openwiki integrations install <codex|claude|opencode>` (skill + MCP atomically, v0.4.3+), enforcing the ownership-partition rule (receipt `.openwiki-install.json` present -> official lane owns that agent -> skip), and falling back to headless CLI usage (`openwiki --init -p` / `--update -p`) for agents without a supported integration.
- Regenerate `example/` so the consumer-path example includes the bootstrap skill.
- Revise integration guides to name bootstrap as the primary wiring path.

## Capabilities

### New Capabilities
- `aksk-bootstrap`: The orchestrator skill and JS consumer script - preflight detection, global tool install lane, per-repo scaffolding (`openspec init`, `.agents/` scaffold, curation-contract attachment, AGENTS.md routing block), idempotent re-runs, and clean-exit INSTRUCT fallback.
- `agent-integration-spread`: Distribution of OpenWiki's coding-agent integration across detected agents via `openwiki integrations install <codex|claude|opencode>` (v0.4.3+; skill + MCP installed atomically with `.openwiki-install.json` receipt), including the ownership-partition rule, receipt handling, and lane selection (official codex|claude|opencode vs headless CLI ladder).

### Modified Capabilities

(None - `distill-routing` and `cross-tool-lint` live in the prerequisite change.)

## Impact

- **Skills:** new `.agents/skills/aksk-bootstrap/`; templates under it copy the finalized skill set from the prerequisite change.
- **Scripts:** new deterministic bootstrap script following existing consumer-script conventions (JS — `*.mjs`, Node >=22).
- **Docs:** README/INSTALL gain the bootstrap-first happy path (manual peer-dependency steps remain documented as fallback); integration guides updated; `example/` regenerated.
- **Dependencies:** runtime dependency on globally installed `@fission-ai/openspec` (Node >= 20.19) and `openwiki` v0.4.3+ (Node >= 22); `openwiki integrations install` and `openwiki mcp --host <target>` as spread vehicles (skill + MCP atomically; no `npx skills add` or `add-mcp` required).
- **Related changes:** depends on `adopt-openspec-openwiki`; supersedes installer scope formerly proposed in `aksk-install-tools` (archived 2026-08-23).
