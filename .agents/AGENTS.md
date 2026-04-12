# AGENTS.md

Consult this file first for repo-wide operational guidance.

This file is template content for `.agents/AGENTS.md`.

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
- Move rationale to `.agents/docs/repo-decisions.md`.
- Move recurring failure details to `.agents/docs/troubleshooting.md`.
- Move multi-step procedures to `.agents/playbooks/` (sibling of `.agents/docs/`, not inside it).
- Keep temporary task artifacts in `.agents/sessions/`, not in durable knowledge files.

## This repository (agent-knowledge-starter)

- `scaffold/` in git is the **distributable kit**: it should read like a consumer’s `.agents/` tree only (no starter-repo narration inside those files).
- An optional `.agents/` here is **maintainer dogfood** and may diverge from `scaffold/`; do not treat parity with `scaffold/` as a requirement.
- Edit `scaffold/` when improving the generic template; use `.agents/` for lessons and workflow that apply to maintaining **this** repo.
- **Skills:** add portable kit skills under `scaffold/skills/` (they sync into `.agents/skills/`). Add maintainer-only skills only under `.agents/skills/`, never under `scaffold/`; keep any helper script beside `SKILL.md` in that skill folder so adopters do not receive them.
- Treat per-task bundle subfolders under `.agents/sessions/` as gitignored working memory unless deliberately force-added; a tracked `.agents/sessions/README.md` may exist per kit layout.

## Placeholder sections

### Build and test

- Add repo-specific commands here.

### Coding conventions

- Add repo-specific conventions here.

### Recurring pitfalls

- The maintainer often mistypes `.agent/` when they mean `.agents/`. If a request mentions `.agent/`, verify whether the existing `.agents/` path is intended before creating a new `.agent/` tree.

### Before submitting changes

- Run relevant tests.
- Validate generated outputs if applicable.
- Check for updates needed in `.agents/` when durable lessons were learned.
