# AGENTS.md

Consult this file first for repo-wide operational guidance.

This file is template content for `.agents/AGENTS.md`. The **This repository (agent-knowledge-starter)** section below applies only to this starter repository (dogfood), not to generic consumer installs.

## Disclaimer

This kit was produced with the help of AI tools. It is provided **as-is**; **use at your own risk**. Treat every file as a starting point: validate instructions, commands, and policies against your own project before you rely on them.

## Purpose

This file contains concise, high-signal instructions for future agents working in this repository.

## What belongs here

- build and test commands
- architecture constraints
- recurring high-confidence pitfalls
- concise, actionable repo conventions
- short validation or review checklists

## What does not belong here

- task history
- long explanations
- one-off debugging notes
- speculative ideas
- low-confidence lessons

## Maintenance rules

- Keep this file concise.
- Prefer bullets over prose.
- Add guidance only when it is stable and broadly useful.
- Move rationale into a new or existing file under `.agents/docs/decisions/` (update `decisions/index.md` when adding a decision).
- Move recurring failure details into a new or existing file under `.agents/docs/troubleshooting/` (update `troubleshooting/index.md` when adding a pattern).
- Move multi-step procedures to `.agents/playbooks/` (sibling of `.agents/docs/`, not inside it).
- Keep temporary task artifacts in `.agents/sessions/`, not in durable knowledge files.
- Do not append to `.agents/docs/log.md` except when running **learning-distill** after a session bundle, or when the user explicitly asks you to record there.

## This repository (agent-knowledge-starter)

- **Skills:** Add portable kit skills under `.agents/skills/`. Maintainer-only skills should include `internal: true` in their metadata.
- Treat per-task bundle subfolders under `.agents/sessions/` as gitignored working memory unless deliberately force-added; a tracked `.agents/sessions/README.md` may exist per kit layout.
- **Plan-only work:** Files under `.agents/plans/` are proposals and roadmaps. Do not change operational skills (for example `task-closeout`) or other shipped kit behavior based on a plan alone unless the maintainer explicitly asks for implementation.
- **Maintainer requests vs durable knowledge:** If the maintainer asks for a change that appears inconsistent with existing kit guidance (this file, `.agents/docs/` including `decisions/` and `troubleshooting/`, playbooks, or root `docs/` that define the kit), say so plainly, point to the conflicting sources, and ask follow-up questions as needed. Do not ignore the tension or silently contradict established guidance unless they explicitly choose to supersede or replace it.

## Placeholder sections

### Build and test

- Add repo-specific commands here.

### Coding conventions

- Add repo-specific conventions here.

### Recurring pitfalls

- After a mass in-place Markdown formatter run (for example `npm run remark:fix` over tracked `*.md`), undo with `git restore` scoped to the same path set the command touched. Avoid `git restore .` or other broad restores when `git status` lists paths outside that set; confirm with the maintainer before discarding unrelated work.
- The maintainer often mistypes `.agent/` when they mean `.agents/`. If a request mentions `.agent/`, verify whether the existing `.agents/` path is intended before creating a new `.agent/` tree.
- **Do not run editor-wide Replace All** of legacy path tokens (for example `scaffold/` → `.agents/`) without a **path-scoped** search and a full diff review. The substring appears in normal English (“scaffolding”), historical audit lines, and deliberate mentions of removed layout; bulk replace can duplicate the kit directory segment in one path and corrupts durable docs. After wide edits, run `bash scripts/check-publish.sh` (includes a doubled-segment scan).

### Before submitting changes

- DO NOT stage or commit changes. The maintainer will handle all git staging and commits.
- Run relevant tests.
- Validate generated outputs if applicable.
- Check for updates needed in `.agents/` when durable lessons were learned.
