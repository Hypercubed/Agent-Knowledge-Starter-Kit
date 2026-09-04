# aksk-bootstrap Specification — Delta

## MODIFIED Requirements

### Requirement: Global lane scope

The system MUST restrict the `aksk-bootstrap` global lane to per-user operations: Node >=22 check, `npm i -g` for `openspec`/`openwiki` from caret ranges in `references/versions.json`, PATH verification, global skill spread for the kit **and for OpenSpec skills** (`npx skills add -g -a <agent>` / `-g --all`), and host integration spread. It MUST NOT create or modify per-repo files (`.agents/`, `openspec/`, `AGENTS.md`, `openwiki/INSTRUCTIONS.md`) except as needed to verify receipts.

#### Scenario: Happy path

- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

### Requirement: Global skills default

Global skill installs (`npx skills add -g -a`, `openwiki integrations install`) MUST be performed by the global lane by default **and MUST include OpenSpec skills** (`openspec-*`). Repo lane MUST NOT install global skills.

#### Scenario: Happy path

- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

### Requirement: Never half-install

When any bootstrap step cannot be executed locally, the bootstrap flow SHALL print the exact commands for the remaining steps and exit cleanly without leaving partial state from the failed step. It MUST NOT continue past a failed prerequisite step. For the skill-spread steps this includes printing exact `npx skills add` commands for the kit and for OpenSpec skills.

#### Scenario: No execution capability

- **WHEN** bootstrap cannot run a step locally (no execution bridge)
- **THEN** it prints every remaining step as copy-paste commands, exits cleanly, and has applied only steps that completed in full

### Requirement: Idempotent global re-run

Re-running the global lane when tools and **skills (kit + OpenSpec)** are already present at compatible versions MUST be a no-op (skip installs, report versions).

#### Scenario: Happy path

- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

### Requirement: Bootstrap now global-only

The system MUST ensure previous bootstrap behavior that performed repo scaffolding and contract attachment is removed from `aksk-bootstrap`; that behavior is now specified under `aksk-init`. **Global OpenSpec skill installation remains in `aksk-bootstrap`; per-repo skill generation via `openspec init --tools` remains suppressed (`--tools none`) in `aksk-init` by default.**

#### Scenario: Happy path

- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied
