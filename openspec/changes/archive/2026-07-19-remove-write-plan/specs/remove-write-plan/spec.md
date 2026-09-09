## ADDED Requirements

### Requirement: MUST remove write-plan skill
The `write-plan` skill MUST be completely removed from the workspace.

#### Scenario: Verify skill deletion
- **WHEN** the `write-plan` removal task is applied
- **THEN** the `.agents/skills/write-plan/` directory should no longer exist.

### Requirement: MUST clean documentation references
All references to the `write-plan` skill MUST be removed from knowledge and documentation files.

#### Scenario: Verify docs are clean
- **WHEN** searching the `.agents/` and `example/` directories for `write-plan`
- **THEN** no references should be found.

### Requirement: MUST retain plans directory
The `.agents/docs/plans` directory MUST NOT be removed.

#### Scenario: Verify plans exist
- **WHEN** the `write-plan` removal task is applied
- **THEN** the `.agents/docs/plans` directory should still exist.
