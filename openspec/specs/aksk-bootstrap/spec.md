# aksk-bootstrap Specification

## Purpose
Provides the once-per-user global lane for the Agent Knowledge Starter Kit: Node >=22 preflight, per-user global installs of `openspec` and `openwiki` from caret ranges in `references/versions.json`, PATH verification, and global skill spread, with idempotent re-run and non-interactive execution. Per-repo scaffolding, routing, and wiki contract attachment are handled by `aksk-init`.

## Requirements

### Requirement: Preflight environment detection
The bootstrap flow SHALL detect, before making any change: the Node.js major version, whether `openspec` and `openwiki` are available on PATH, whether `.agents/`, `openspec/`, and `openwiki/` exist in the target repo, and whether OpenWiki install receipts (`.openwiki-install.json`) exist in known skill directories. It SHALL report this state to the user before acting.

#### Scenario: Fresh machine preflight
- **WHEN** bootstrap runs on a machine with Node >= 22 and neither tool installed
- **THEN** it reports Node is sufficient, both tools are missing, and proceeds to the global install lane

#### Scenario: Unsupported Node version
- **WHEN** bootstrap runs with Node < 22
- **THEN** it stops before installing anything and prints the required Node version and how to upgrade

### Requirement: Global tool installation lane
The bootstrap flow SHALL install `@fission-ai/openspec@latest` and `openwiki@latest` in user scope (per-user global via `npm i -g`, not repo-local `npx` or repo-local `node_modules`) once per user (Node >=22 for openwiki), and SHALL skip installation for any tool already present at a compatible version.

#### Scenario: First global install
- **WHEN** neither tool is globally installed
- **THEN** bootstrap runs the global npm install for both tools exactly once

#### Scenario: Tools already installed
- **WHEN** both tools are already globally installed
- **THEN** bootstrap performs no global installation and reports the detected versions

### Requirement: Never half-install
When any bootstrap step cannot be executed locally, the bootstrap flow SHALL print the exact commands for the remaining steps and exit cleanly without leaving partial state from the failed step. It MUST NOT continue past a failed prerequisite step. For the skill-spread steps this includes printing exact `npx skills add` commands for the kit and for OpenSpec skills.

#### Scenario: No execution capability
- **WHEN** bootstrap cannot run a step locally (no execution bridge)
- **THEN** it prints every remaining step as copy-paste commands, exits cleanly, and has applied only steps that completed in full

### Requirement: Global lane scope
The system MUST restrict the `aksk-bootstrap` global lane to per-user operations: Node >=22 check, `npm i -g` for `openspec`/`openwiki` from caret ranges in `references/versions.json`, PATH verification, global skill spread for the kit **and for OpenSpec skills** (`npx skills add -g -a <agent>` / `-g --all`), and host integration spread. It MUST NOT create or modify per-repo files (`.agents/`, `openspec/`, `AGENTS.md`, `openwiki/INSTRUCTIONS.md`) except as needed to verify receipts.

#### Scenario: Happy path
- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

### Requirement: Host integrations ownership
The `openwiki integrations install <host>` spread (codex/claude/opencode, receipt-partitioned) MUST NOT be part of the global lane script; it is manual opt-in. The global lane MUST NOT auto-install host integrations.

#### Scenario: Happy path
- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

### Requirement: Global skills default
Global skill installs (`npx skills add -g -a`, `openwiki integrations install`) MUST be performed by the global lane by default **and MUST include OpenSpec skills** (`openspec-*`). Repo lane MUST NOT install global skills.

#### Scenario: Happy path
- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

### Requirement: Idempotent global re-run
Re-running the global lane when tools and **skills (kit + OpenSpec)** are already present at compatible versions MUST be a no-op (skip installs, report versions).

#### Scenario: Happy path
- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

### Requirement: Global lane execution model
The global lane script MUST be non-interactive (no TTY prompts); the `aksk-bootstrap` skill (agent) describes each planned action and prompts [Y/n/skip] before invoking the script. The script MAY support `--yes` / `AKSK_YES=1` as passthrough but MUST NOT block on stdin. Host integrations (`openwiki integrations install <host>`) are NOT part of the global lane; users run them manually when needed.

#### Scenario: Happy path
- **WHEN** the agent invokes the global lane script
- **THEN** it completes without blocking and without host-spread

### Requirement: Bootstrap now global-only
The system MUST ensure previous bootstrap behavior that performed repo scaffolding and contract attachment is removed from `aksk-bootstrap`; that behavior is now specified under `aksk-init`. **The compat shim `aksk-bootstrap/scripts/bootstrap.mjs` that sequentially invoked both lanes MUST NOT exist.** `aksk-bootstrap` SHALL expose only `bootstrap-global.mjs` (and leaf helpers `check_peer_tools.mjs`, `attach_*` for host verification) and MUST NOT delegate to `aksk-init` under any condition. **Global OpenSpec skill installation remains in `aksk-bootstrap`; per-repo skill generation via `openspec init --tools` remains suppressed (`--tools none`) in `aksk-init` by default.**

#### Scenario: Happy path
- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

#### Scenario: Shim invocation after removal
- **WHEN** a consumer runs `node .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs`
- **THEN** it fails with file-not-found and the docs direct them to run `node .agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs [repo-root]` followed by `node .agents/skills/aksk-init/scripts/bootstrap-repo.mjs [repo-root]`
