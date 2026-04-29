# AGENTS.md

Consult this file first for repo-wide operational guidance.

## Disclaimer

This kit was produced with the help of AI tools. It is provided **as-is**; **use at your own risk**. Treat every file as a starting point: validate instructions, commands, and policies against your own project before you rely on them.

## Purpose

This file contains concise, high-signal instructions for future agents working in this repository.

## Routing Directives

- **UPON STARTUP:** You MUST read `.agents/docs/index.md` before executing any file modifications. This ensures you understand the repository layout and available tools.
- **WHEN DEBUGGING:** If you encounter a failing test, build error, or runtime exception, your FIRST action MUST be to execute `.agents/skills/docs-search` using the error output as your query.
- **BEFORE ARCHITECTURAL CHANGES:** You MUST search `.agents/docs/decisions/` or read its `index.md` to ensure your proposed changes do not violate established design patterns.

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

## Placeholder sections

### Build and test

- Add repo-specific commands here.

### Coding conventions

- Add repo-specific conventions here.

### Recurring pitfalls

- Add stable pitfalls here.

### Before submitting changes

- Run relevant tests.
- Validate generated outputs if applicable.
- Check for updates needed in `.agents/` when durable lessons were learned.
