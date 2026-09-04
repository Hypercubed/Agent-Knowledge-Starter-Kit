## ADDED Requirements

### Requirement: Shared wiring scripts single source
The `aksk-init` repo lane SHALL NOT ship duplicate implementations of the shared wiring scripts `attach_section.mjs`, `attach_wiki_contract.mjs`, and `init_agents_md.mjs`. It SHALL ship thin resolver scripts under those same names that locate the canonical copies under `aksk-bootstrap/scripts/`, execute them with the exact same arguments, and propagate stdout, stderr, and exit codes unchanged so callers observe identical behavior.

#### Scenario: Repo lane invokes a shared script
- **WHEN** the repo lane (or an agent) runs `aksk-init/scripts/attach_section.mjs <root> <target> <template>`
- **THEN** the resolver executes the canonical `aksk-bootstrap/scripts/attach_section.mjs` with the same arguments and the call succeeds with output and exit code identical to running the canonical script directly

#### Scenario: Behavior contract unchanged
- **WHEN** a caller relies on the documented behavior of any shared script (idempotent attach, refresh-only-between-markers, fail-closed combine prompt)
- **THEN** the delegated execution preserves that behavior exactly

### Requirement: Shared templates single source
The `aksk-init` skill SHALL NOT ship the reference templates `agents-md-baseline-template.md`, `lifecycle-template.md`, `routing-note-template.md`, or `wiki-contract-template.md` under `aksk-init/references/`. The canonical templates SHALL exist only under `aksk-bootstrap/references/`, and the resolvers SHALL read templates from the canonical location.

#### Scenario: Template consumed by a resolver
- **WHEN** a resolver delegates to the canonical script
- **THEN** the canonical script reads its templates from `aksk-bootstrap/references/` and no template file exists under `aksk-init/references/`

### Requirement: Missing canonical sibling fail-fast
When the canonical sibling skill (`aksk-bootstrap`) is absent from an installation, the resolver scripts MUST exit 2 without performing any writes and MUST print remediation naming both skills and the dependency between them.

#### Scenario: Only aksk-init installed
- **WHEN** an environment contains `aksk-init` but not `aksk-bootstrap` and a resolver is invoked
- **THEN** the resolver exits 2, writes nothing, and prints instructions to install `aksk-bootstrap` (which owns the canonical scripts)

### Requirement: Version source unchanged
The single-source rule for tool versions (per-repo lane MUST use `aksk-bootstrap/references/versions.json` and MUST NOT duplicate it) SHALL remain in force and is unaffected by this change.

#### Scenario: Version lookup
- **WHEN** the repo lane reports tool versions in diagnostics
- **THEN** it continues to read them from `aksk-bootstrap/references/versions.json` as the single source