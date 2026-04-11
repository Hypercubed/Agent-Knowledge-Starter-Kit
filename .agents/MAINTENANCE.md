# .agents Maintenance Rules

## Purpose

This directory contains the compiled knowledge layer for agents working in this repository.

## Knowledge model

- External task bundles are raw evidence.
- Files in `.agents/` are synthesized durable knowledge.
- Durable knowledge should be incremental, concise, and reviewable.

## File roles

### `AGENTS.md`
Compact, high-signal operational guidance.

### `repo-decisions.md`
Durable rationale, tradeoffs, and architectural choices.

### `troubleshooting.md`
Recurring issue patterns, causes, fixes, and validations.

### `playbooks/`
Durable multi-step procedures.

### `index.md`
Catalog of durable knowledge assets.

### `log.md`
Append-only maintenance log.

## Distillation policy

A lesson belongs in `AGENTS.md` only if it is:

- stable
- concise
- broadly applicable
- actionable
- high confidence

## Task bundle policy

Task bundles are external and temporary.

After closeout, treat them as immutable except for status fields in `summary.json`.

## Logging policy

Each successful distillation should append a concise entry to `.agents/log.md`.

## Lint policy

Periodically review `.agents/` for:

- duplication
- contradictions
- stale entries
- oversized `AGENTS.md` sections
- missing index coverage
- misplaced content
