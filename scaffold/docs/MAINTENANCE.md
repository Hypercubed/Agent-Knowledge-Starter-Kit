# Template .agents Maintenance Rules

## Purpose

This file belongs in `.agents/docs/`, alongside `.agents/AGENTS.md`.

## Knowledge model

- Session bundles under `.agents/sessions/` are raw evidence.
- Files in `.agents/` are synthesized durable knowledge.
- Durable knowledge should be incremental, concise, and reviewable.

## File roles

### `AGENTS.md`
Compact, high-signal operational guidance.

### `docs/repo-decisions.md`
Durable rationale, tradeoffs, and architectural choices.

### `docs/troubleshooting.md`
Recurring issue patterns, causes, fixes, and validations.

### `../playbooks/`
Durable multi-step procedures.

### `docs/index.md`
Catalog of durable knowledge assets.

### `docs/log.md`
Append-only maintenance log.

## Distillation policy

A lesson belongs in `AGENTS.md` only if it is:

- stable
- concise
- broadly applicable
- actionable
- high confidence

## Task bundle policy

Task bundles live in `.agents/sessions/` and are temporary.

After closeout, treat them as immutable except for status fields in `summary.json`.

Keep `.agents/sessions/` in the repo but ignored by git so temporary working-memory artifacts do not become committed durable knowledge.

Use one session folder per task-closeout bundle and name folders with a sortable pattern such as `YYYYMMDD-HHMMSS-short-topic`.

## Logging policy

Each successful distillation should append a concise entry to `.agents/docs/log.md`.

## Lint policy

Periodically review `.agents/` for:

- duplication
- contradictions
- stale entries
- oversized `AGENTS.md` sections
- missing index coverage
- misplaced content
