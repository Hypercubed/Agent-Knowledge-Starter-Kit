## ADDED Requirements

### Requirement: Task initialization
The system SHALL provide a `task-start` capability that generates a unique `task_id` and initializes a session folder at `.agents/sessions/YYYYMMDD-HHMMSS-short-topic/` per the `task-closeout` `CONTRACT.md` naming convention.

#### Scenario: Successful initialization
- **WHEN** user or agent invokes `task-start` (optionally with `short-topic` slug and `openspec_change`)
- **THEN** system creates the session directory, ensures `.agents/sessions/README.md` and `.agents/.gitignore` entries exist, and seeds `summary.json` with `task_id`, `created_at`, `status: in_progress`, and any provided `openspec_change`.

### Requirement: Seeded summary.json
The system SHALL seed `summary.json` as defined in `.agents/skills/task-closeout/CONTRACT.md`, tracking `task_id` (canonical), `created_at`, `status`, and optionally `repo_id`, `openspec_change`, `agent`, and `agent_session_id`.

#### Scenario: Manifest population
- **WHEN** `task-start` is invoked
- **THEN** `summary.json` is created with `task_id`, `created_at`, `status: "in_progress"`, and optional `openspec_change`/`repo_id` fields; it does NOT yet contain `completed_at` or final validation/changed-files content, which are reserved for closeout.

### Requirement: Task State Continuity
The system SHALL ensure `task-closeout` finalizes the existing seeded `summary.json` rather than generating new identity, maintaining a single source of truth for the task. If no seeded bundle exists, `task-closeout` SHALL fall back to its current generation behavior.

#### Scenario: Closeout integration
- **WHEN** `task-closeout` is invoked after `task-start`
- **THEN** it detects the seeded `summary.json` in `.agents/sessions/`, preserves `task_id` (and `openspec_change` if seeded), appends `completed_at`, final `status`, and remaining bundle files, and treats the bundle as the finalized handoff for `learning-distill`.

### Requirement: No durable writes at start/closeout
The system SHALL NOT create or edit durable knowledge (`openwiki/`, `.agents/AGENTS.md`, `.agents/playbooks/`, `.agents/skills/`) during `task-start` or `task-closeout`; proposed durable changes SHALL be captured as prose inside the bundle for `learning-distill` to apply.

#### Scenario: Scope guard
- **WHEN** `task-start` or `task-closeout` runs
- **THEN** only files under `.agents/sessions/<session-folder>/` (and idempotent init artifacts `README.md`/`.gitignore`) are written.
