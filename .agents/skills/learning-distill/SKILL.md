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
- `.agents/docs/decisions/` (per-decision markdown files; see `index.md` there)
- `.agents/docs/troubleshooting/` (per-pattern markdown files; see `index.md` there)
- `.agents/playbooks/`

Read the canonical task/session identifier from the `task_id` field in the bundle's `summary.json`. Do not infer identity from the session folder name.

## Skill initialization (before first distillation)

Run this once per target repo after the skill files are present under `.agents/skills/learning-distill/` (for example after copying only that skill folder or after an `npx`/package install drops it there). Idempotent: safe to repeat.

1. Resolve the repo root (the directory that contains `.git/` in normal layouts).

2. Ensure `.agents/` exists.

3. Ensure `.agents/playbooks/` exists. If `.agents/playbooks/README.md` is missing, copy `bootstrap/playbooks/README.md` from this skill folder into place.

4. Ensure `.agents/docs/` exists. For each of `index.md`, `MAINTENANCE.md`, and `log.md`, if the file is missing under `.agents/docs/`, copy it from `bootstrap/docs/` in this skill folder. If `.agents/docs/decisions/index.md` or `.agents/docs/troubleshooting/index.md` is missing, copy the entire contents of `bootstrap/docs/decisions/` and `bootstrap/docs/troubleshooting/` respectively, creating only files that do not already exist (do not overwrite). If a file already exists, do not overwrite it.

5. Ensure `.agents/sessions/` exists. If `.agents/sessions/README.md` is missing, copy `bootstrap/sessions/README.md` from this skill folder into place.

6. If `.agents/AGENTS.md` is missing, copy `bootstrap/AGENTS.md` from this skill folder into place. If it already exists, do not overwrite it.

7. Ensure `.agents/.gitignore` exists. If it is missing, create it with exactly:

   ```gitignore
   sessions/*
   !sessions/README.md
   ```

   If `.agents/.gitignore` already exists, merge these two lines if they are absent; do not remove unrelated ignore rules.

8. If the repo does not track `.agents/.gitignore` and the user relies on the repo root `.gitignore`, ensure equivalent patterns exist there: `.agents/sessions/*` and `!.agents/sessions/README.md`.

This initialization supplies the durable doc scaffold the distill procedure expects. It does not fabricate repo-specific guidance beyond the kit templates. The same `bootstrap/` tree is the canonical source for **knowledge-lint** initialization when both skills are installed (see that skill’s `SKILL.md`).

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
- Add or edit a file under `.agents/docs/decisions/` for rationale and nuance (use a stable filename slug; keep `id` in frontmatter aligned with the slug; update `decisions/index.md` when adding a new decision).
- Add or edit a file under `.agents/docs/troubleshooting/` for recurring failures and fixes (same index and frontmatter conventions).
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
8. Append a concise, non-sensitive entry to `.agents/docs/log.md` (distillation is the routine workflow that updates this file; see `.agents/docs/MAINTENANCE.md` Logging policy).
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
