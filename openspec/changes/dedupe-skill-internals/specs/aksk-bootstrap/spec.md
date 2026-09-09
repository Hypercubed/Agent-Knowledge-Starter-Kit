## ADDED Requirements

### Requirement: Canonical shared executor ownership
The `aksk-bootstrap` skill SHALL be the canonical owner of the shared repo-wiring scripts `attach_section.mjs`, `attach_wiki_contract.mjs`, and `init_agents_md.mjs` and the reference templates `agents-md-baseline-template.md`, `lifecycle-template.md`, `routing-note-template.md`, and `wiki-contract-template.md`. Changes to these files SHALL be made only under `aksk-bootstrap/{scripts,references}/`; no other skill folder SHALL maintain a second copy.

#### Scenario: Fix to a shared script
- **WHEN** a maintainer fixes a bug in a shared wiring script
- **THEN** the edit lands once, under `aksk-bootstrap/scripts/`, and consumers via `aksk-init`, `docs-lint`, and `learning-distill` observe the fix without any mirrored file being updated

#### Scenario: Template change
- **WHEN** a maintainer updates a shared reference template
- **THEN** the canonical template under `aksk-bootstrap/references/` changes and no mirrored template exists to drift

### Requirement: Global lane scope preserved
Canonical file ownership of the shared scripts and templates SHALL NOT grant the `aksk-bootstrap` global lane permission to run repo-scaffolding or contract-attachment steps; the lane-scope requirement (global lane MUST NOT create or modify per-repo files) SHALL remain in force.

#### Scenario: Global lane runs on a target repo
- **WHEN** the global lane executes
- **THEN** it still performs only per-user operations and never invokes the shared repo-wiring scripts against the target repo