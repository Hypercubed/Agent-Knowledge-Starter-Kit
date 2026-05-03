## ADDED Requirements

### Requirement: write-plan skill removal
The `write-plan` skill must be completely removed from the workspace.

#### Scenario: Verify skill deletion
- **WHEN** the `write-plan` removal task is applied
- **THEN** the `.agents/skills/write-plan/` directory should no longer exist.

### Requirement: clean documentation references
All references to the `write-plan` skill must be removed from knowledge and documentation files.

#### Scenario: Verify docs are clean
- **WHEN** searching the `.agents/` and `example/` directories for `write-plan`
- **THEN** no references should be found.

### Requirement: retain plans directory
The `.agents/docs/plans` directory must not be removed.

#### Scenario: Verify plans exist
- **WHEN** the `write-plan` removal task is applied
- **THEN** the `.agents/docs/plans` directory should still exist.
