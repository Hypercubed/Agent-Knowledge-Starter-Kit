## ADDED Requirements

### Requirement: Global lane scope
The system MUST restrict the `aksk-bootstrap` global lane to per-user operations: Node >=22 check, `npm i -g` for `openspec`/`openwiki` from caret ranges in `references/versions.json`, PATH verification, and host integration spread. It MUST NOT create or modify per-repo files (`.agents/`, `openspec/`, `AGENTS.md`, `openwiki/INSTRUCTIONS.md`) except as needed to verify receipts.

#### Scenario: Happy path
- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

### Requirement: Host integrations ownership
The `openwiki integrations install <host>` spread (codex/claude/opencode, receipt-partitioned) MUST NOT be part of the global lane script; it is manual opt-in. The global lane MUST NOT auto-install host integrations.

#### Scenario: Happy path
- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

### Requirement: Global skills default
Global skill installs (`npx skills add -g -a`, `openwiki integrations install`) MUST be performed by the global lane by default. Repo lane MUST NOT install global skills.

#### Scenario: Happy path
- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

### Requirement: Idempotent global re-run
Re-running the global lane when tools and integrations are already present at compatible versions MUST be a no-op (skip installs, report versions).

#### Scenario: Happy path
- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

### Requirement: Global lane execution model
The global lane script MUST be non-interactive (no TTY prompts); the `aksk-bootstrap` skill (agent) describes each planned action and prompts [Y/n/skip] before invoking the script. The script MAY support `--yes` / `AKSK_YES=1` as passthrough but MUST NOT block on stdin. Host integrations (`openwiki integrations install <host>`) are NOT part of the global lane; users run them manually when needed.

#### Scenario: Happy path
- **WHEN** the agent invokes the global lane script
- **THEN** it completes without blocking and without host-spread


## MODIFIED Requirements

### Requirement: Bootstrap now global-only
The system MUST ensure previous bootstrap behavior that performed repo scaffolding and contract attachment is removed from `aksk-bootstrap`; that behavior is now specified under `aksk-init`.

#### Scenario: Happy path
- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied
