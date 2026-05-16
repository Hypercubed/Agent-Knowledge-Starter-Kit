## ADDED Requirements

### Requirement: Task initialization
The system SHALL provide a `task-start` capability that generates a unique `task_id` and initializes a session folder path: `.agents/sessions/<timestamp>-<task_id>/`.

#### Scenario: Successful initialization
- **WHEN** user or agent invokes `task-start`
- **THEN** system creates the session directory and initializes a `manifest.json` file.

### Requirement: Persistent Manifest
The system SHALL persist task state in a `manifest.json` file inside the session folder, tracking core metadata.

#### Scenario: Manifest population
- **WHEN** `task-start` is invoked
- **THEN** `manifest.json` is created with a `task_id`, `start_time`, `origin_prompt` fields and an empty `session_log` array.

### Requirement: Task State Continuity
The system SHALL ensure `task-closeout` updates the existing `manifest.json` rather than generating new metadata, maintaining a single source of truth for the task.

#### Scenario: Closeout integration
- **WHEN** `task-closeout` is invoked after `task-start`
- **THEN** it detects the manifest in `.agents/sessions/`, appends final status, and bundles the content into the final session bundle.
