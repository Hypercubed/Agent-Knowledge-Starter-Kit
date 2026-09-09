## ADDED Requirements

### Requirement: Standard Rules Directory
The AKSK structure SHALL include a dedicated directory for normative agent instructions that are too specific or numerous for `AGENTS.md`.

#### Scenario: Rules directory existence
- **WHEN** a repository is initialized with AKSK
- **THEN** an `.agents/rules/` directory exists or is documented as the standard location

### Requirement: Rules Taxonomy and Decision Boundary
The documentation SHALL clearly define when to use `AGENTS.md`, `.agents/rules/`, `.agents/docs/decisions/`, and playbooks.

#### Scenario: Documentation of boundaries
- **WHEN** a user reads the AKSK documentation (e.g., `AGENTS.md` or `docs/index.md`)
- **THEN** they find explicit guidance on where to place different types of instructions and rationale

### Requirement: Distillation Routing to Rules
The `learning-distill` process (or its documentation) SHALL support routing distilled normative instructions to the rules directory.

#### Scenario: Routing a lesson to rules
- **WHEN** a lesson is identified as a specific, normative rule during distillation
- **THEN** the system recommends or performs an update to a file within `.agents/rules/`

### Requirement: Example Integration
The `generate-example` skill SHALL include example rules in the `.agents/rules/` directory to demonstrate the pattern.

#### Scenario: Example generation includes rules
- **WHEN** the `generate-example` skill is executed
- **THEN** the resulting `example/.agents/rules/` directory contains sample rule files
