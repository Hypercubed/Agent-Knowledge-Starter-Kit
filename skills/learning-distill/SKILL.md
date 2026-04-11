---
name: learning-distill
description: Read a completed temporary task bundle and distill durable repo knowledge into .agents/ files. Use only after task-closeout has produced a bundle and when the goal is to separate stable guidance from temporary task notes.
---

# Learning Distill

## Goal
Convert raw task evidence into concise, durable repo knowledge.

## Inputs
- task bundle directory
- .agents/AGENTS.md
- .agents/MAINTENANCE.md
- .agents/index.md
- .agents/log.md
- .agents/repo-decisions.md
- .agents/troubleshooting.md
- .agents/playbooks/

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
- Use `.agents/repo-decisions.md` for rationale and nuance.
- Use `.agents/troubleshooting.md` for recurring failures and fixes.
- Use `.agents/playbooks/` for durable multi-step procedures.
- Add to `.agents/AGENTS.md` only if the lesson is broad, stable, concise, and actionable.
- Reject low-confidence or one-off lessons.

## Procedure
1. Read the task bundle.
2. Compare candidates against existing `.agents/` files.
3. Remove duplication.
4. Classify each lesson.
5. Draft minimal updates to the appropriate file or files.
6. Update `.agents/index.md` if durable knowledge structure changed.
7. Append a concise entry to `.agents/log.md`.
8. Mark the task bundle as distilled.

## Constraints
- Do not modify source code.
- Do not invent new repo rules unsupported by the task evidence.
- Do not expand `.agents/AGENTS.md` with rationale or narrative.
- Prefer small edits over large rewrites.

## AGENTS criteria
A lesson belongs in `.agents/AGENTS.md` only if it is:
- high confidence
- broadly useful in this repo
- likely to recur
- concise
- actionable
