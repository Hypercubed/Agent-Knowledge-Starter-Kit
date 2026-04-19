# Template .agents Maintenance Rules

## Purpose

This file belongs in `.agents/docs/`, alongside `.agents/AGENTS.md`.

## Knowledge model

- Session bundles under `.agents/sessions/` are raw evidence.
- Files in `.agents/` are synthesized durable knowledge.
- Durable knowledge should be incremental, concise, and reviewable.
- Architectural decisions live under `.agents/docs/repo-decisions/` (one file per decision plus `index.md`). Troubleshooting patterns live under `.agents/docs/troubleshooting/` (one file per pattern plus `index.md`). Each entry file carries minimal YAML frontmatter (`id`, `title`, `last_updated`).

## Entry shape

When adding a new markdown file under `repo-decisions/` or `troubleshooting/`, follow the frontmatter and body headings used by existing entries in that folder. Required YAML keys: `id`, `title`, `last_updated`. Use a stable `id` aligned with the filename slug; it must be **unique across both** `repo-decisions/` and `troubleshooting/` (not only within one folder).

**Repository decisions** typically use body sections: `### Decision`, `### Status` (Accepted | superseded | provisional), `### Context`, `### Rationale`, `### Consequences`.

**Troubleshooting** typically uses: `#### Symptom`, `#### Likely causes`, `#### Fix`, `#### Validation`.

## File roles

### `.agents/AGENTS.md`

Compact, high-signal operational guidance.

### `.agents/docs/repo-decisions/`

Durable rationale, tradeoffs, and architectural choices. Each decision is a markdown file; [index.md](repo-decisions/index.md) lists them.

### `.agents/docs/troubleshooting/`

Recurring issue patterns, causes, fixes, and validations. Each pattern is a markdown file; [index.md](troubleshooting/index.md) lists them.

### `.agents/playbooks/`

Durable multi-step procedures.

### `.agents/docs/index.md`

Catalog of durable knowledge assets.

### `.agents/docs/log.md`

Append-only maintenance log.

### `.agents/plans/`

Active task planning, research documents, and implementation plans.

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

Keep bundle subfolders under `.agents/sessions/` gitignored. The kit may track a single `.agents/sessions/README.md` for human-facing guidance while every per-task bundle folder stays local-only.

Use one session folder per task-closeout bundle and name folders with a sortable pattern such as `YYYYMMDD-HHMMSS-short-topic`.

## Logging policy

**Who may edit:** In general, do not append to `.agents/docs/log.md` unless the user explicitly instructs you to, or you are executing the **learning-distill** workflow after distilling a session bundle. Periodic **knowledge-lint** passes and other routine edits do **not** get a log row by default.

Each successful **learning-distill** run should append a concise entry to `.agents/docs/log.md`.

Treat `.agents/docs/log.md` as a **minimal maintenance audit trail**, not a narrative summary.

Include only what future maintainers need to understand that a distillation happened:

- date
- task id
- high-level outcome
- files updated
- short accepted/rejected lesson counts or labels
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

### Mechanical hygiene (after bulk edits or migrations)

Automated **knowledge-lint** runs are still human-guided; they do not prove prose is sensible. After any wide find-and-replace across markdown:

- Re-read a sample of `repo-decisions/` and `troubleshooting/` entries for broken sentences or doubled kit path segments (the `.agents` directory name repeated in one filesystem path).
- Run `bash scripts/check-publish.sh` when `rg` is available; it fails on the common mechanical typo where that segment appears twice in a row.
- Prefer scoped replacements (limit to `.agents/docs/`, or a single file), whole-word or whole-path patterns, and commit-sized diffs instead of repo-wide blind replace.
