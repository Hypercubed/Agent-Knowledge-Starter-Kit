## ADDED Requirements

### Requirement: Direct Document Writing
The system SHALL provide a skill named `docs-capture` that allows agents to write directly into `.agents/docs/` subdirectories (`decisions`, `troubleshooting`, `playbooks`) when instructed by the user, skipping the `task-closeout` and `learning-distill` flow.

#### Scenario: User requests a direct decision capture
- **WHEN** the user instructs the agent: "Capture this into the architecture decisions"
- **THEN** the agent writes a newly reasoned `.md` file into `.agents/docs/decisions/` and executes index generation.

### Requirement: Index Maintenance
The `docs-capture` skill SHALL execute `generate-durable-indexes.py` immediately after drafting any markdown file to ensure the system indexes remain perfectly up to date.

#### Scenario: Index regeneration executes successfully
- **WHEN** the markdown file is flushed to the `.agents/docs/...` directory
- **THEN** the skill instructions trigger `.agents/skills/docs-compile/scripts/generate-durable-indexes.py`, regenerating `index.md`.

### Requirement: Example Sink Alignment
The skill SHALL ensure the `example/` mock tree is synchronized with the new toolkit asset.

#### Scenario: Example tree reflects new kit updates
- **WHEN** the new skill is built in the source `.agents/`
- **THEN** `.agents/skills/generate-example/run.sh` is executed to align the example payload.
