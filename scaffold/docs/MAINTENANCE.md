# Template .agents Maintenance Rules

## Purpose

This file belongs in `.agents/docs/`, alongside `.agents/AGENTS.md`.

## Knowledge model

- Session bundles under `.agents/sessions/` are raw evidence.
- Files in `.agents/` are synthesized durable knowledge.
- Durable knowledge should be incremental, concise, and reviewable.

## File roles

### `.agents/AGENTS.md`

Compact, high-signal operational guidance.

### `.agents/docs/repo-decisions.md`

Durable rationale, tradeoffs, and architectural choices.

### `.agents/docs/troubleshooting.md`

Recurring issue patterns, causes, fixes, and validations.

### `.agents/playbooks/`

Durable multi-step procedures.

### `.agents/docs/index.md`

Catalog of durable knowledge assets.

### `.agents/docs/log.md`

Append-only maintenance log.

## Classification matrix

Use this matrix when distilling candidate lessons.

### `.agents/AGENTS.md`

Use for concise, broadly applicable instructions agents should see before normal work.

Do not use for long rationale, task history, or low-confidence guesses.

Example: "Run `npm test` after changing parser fixtures."

### `.agents/docs/troubleshooting.md`

Use for recurring symptoms, likely causes, known fixes, and validation steps.

Do not use for architectural rationale or one-time command failures.

Example: "Symptom: JSON editor fails to load. Fix: verify Monaco JSON worker wiring."

### `.agents/docs/repo-decisions.md`

Use for durable rationale, tradeoffs, exceptions, and why a convention exists.

Do not use for step-by-step procedures or incident logs.

Example: "The repo uses package-root Monaco imports because narrower imports did not expose JSON defaults."

### `.agents/playbooks/`

Use for ordered, repeatable procedures that need multiple steps.

Do not use for one-line rules or background rationale without actions.

Example: "Refresh generated API fixtures and validate snapshots."

### `.agents/docs/log.md`

Use for append-only records of distillation and maintenance actions.

Do not use for the durable lesson itself.

Example: "Distilled task `t-...`; accepted 2 candidates, rejected 1."

If two destinations seem plausible, choose the one future agents would consult first during the relevant work.

## Distillation policy

A lesson belongs in `.agents/AGENTS.md` only if it is:

- stable
- concise
- broadly applicable
- actionable
- high confidence

## Task bundle policy

Task bundles live in `.agents/sessions/` and are temporary.

After closeout, treat them as immutable except for status fields in `summary.json`.

The canonical task/session identifier is the `task_id` field inside each bundle's `summary.json`. The session folder name is only a sortable storage label, even when it resembles the task ID.

Keep bundle subfolders under `.agents/sessions/` gitignored. The kit may track a single `.agents/sessions/README.md` for human-facing guidance while every per-task bundle folder stays local-only.

Use one session folder per task-closeout bundle and name folders with a sortable pattern such as `YYYYMMDD-HHMMSS-short-topic`.

Repo-local storage is the default because bundles stay close to the work they describe. In cloud, ephemeral, or shared-agent environments, adapt the storage location or backup process if local bundles may disappear before distillation.

## Logging policy

Each successful distillation should append a concise entry to `.agents/docs/log.md`.

Treat `.agents/docs/log.md` as a **minimal maintenance audit trail**, not a narrative summary.

Include only what future maintainers need to understand that a distillation happened:

- date
- task ID
- source session bundle path when useful
- high-level outcome
- files changed
- short classification counts or labels
- whether changes were accepted, proposed only, or rejected
- one brief maintenance note if needed

Do **not** include:

- secrets, tokens, credentials, or auth material
- personal data, customer data, or private business details
- private URLs, hostnames, inbox contents, or externally identifying strings unless they are already intended to be public repo knowledge
- long copied command output, stack traces, transcripts, or raw error text
- narrative task history better left in the session bundle

## Lint policy

Periodically review `.agents/` for:

- duplication
- contradictions
- stale entries
- oversized `.agents/AGENTS.md` sections
- missing index coverage
- misplaced content
