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

Each successful distillation should append a concise entry to `.agents/docs/log.md`.

## Lint policy

Periodically review `.agents/` for:

- duplication
- contradictions
- stale entries
- oversized `.agents/AGENTS.md` sections
- missing index coverage
- misplaced content
