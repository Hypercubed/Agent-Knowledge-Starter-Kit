---
name: learning-distill
description: Read a completed temporary session bundle from `.agents/sessions/` and distill durable repo knowledge into `.agents/` files. Use only after task-closeout has produced a bundle and when the goal is to separate stable guidance from temporary task notes.
---

# Learning Distill

## Goal

Convert raw task evidence into concise, durable repo knowledge.

## Inputs

- session bundle directory under `.agents/sessions/`
- `.agents/AGENTS.md`
- `.agents/docs/MAINTENANCE.md`
- `.agents/docs/index.md`
- `.agents/docs/log.md`
- `.agents/docs/repo-decisions.md`
- `.agents/docs/troubleshooting.md`
- `.agents/playbooks/`

Read the canonical task/session identifier from the `task_id` field in the bundle's `summary.json`. Do not infer identity from the session folder name.

## Classification categories

Classify each candidate lesson as one of:

- ephemeral
- AGENTS guidance
- troubleshooting
- repo decision
- playbook

## Distillation rules

- Preserve only stable, reusable knowledge.
- Do not copy task history into `.agents/AGENTS.md`.
- Use `.agents/docs/repo-decisions.md` for rationale and nuance.
- Use `.agents/docs/troubleshooting.md` for recurring failures and fixes.
- Use `.agents/playbooks/` for durable multi-step procedures.
- Add to `.agents/AGENTS.md` only if the lesson is broad, stable, concise, and actionable.
- Reject low-confidence or one-off lessons.
- Keep `.agents/docs/log.md` minimal: no secrets, personal data, private business details, long raw outputs, or copied transcript text.

## Procedure

1. Read the session bundle.
2. Read `summary.json` and use its `task_id` in notes and log entries.
3. Compare candidates against the existing `.agents/` files.
4. Remove duplication.
5. Classify each lesson.
6. Draft minimal updates to the appropriate file or files.
7. Update `.agents/docs/index.md` if durable knowledge structure changed.
8. Append a concise, non-sensitive entry to `.agents/docs/log.md`.
9. Mark the session bundle as distilled.

## Constraints

- Do not modify source code.
- Do not invent new repo rules unsupported by the task evidence.
- Do not expand `.agents/AGENTS.md` with rationale or narrative.
- Do not copy secrets, private identifiers, personal data, customer data, or long raw command/error output into durable docs, especially `.agents/docs/log.md`.
- Prefer small edits over large rewrites.

## AGENTS criteria

A lesson belongs in `.agents/AGENTS.md` only if it is:

- high confidence
- broadly useful in this repo
- likely to recur
- concise
- actionable
