# AGENTS.md

Consult this file first for repo-wide operational guidance.

## Disclaimer

This kit was produced with the help of AI tools. It is provided **as-is**; **use at your own risk**. Treat every file as a starting point: validate instructions, commands, and policies against your own project before you rely on them.

## Purpose

This file contains concise, high-signal instructions for future agents working in this repository.

## Routing Directives

- **UPON STARTUP:** You MUST read `openwiki/index.md` and `.agents/AGENTS.md` before executing any file modifications. This ensures you understand the repository layout and available tools.
- **WHEN DEBUGGING:** If you encounter a failing test, build error, or runtime exception, your FIRST action MUST be to search durable knowledge for it: `grep -ri "<error or symptom>" openwiki/ .agents/` before debugging blind.
- **BEFORE ARCHITECTURAL CHANGES:** You MUST search `openwiki/decisions/` for recorded decisions to ensure your proposed changes do not violate established design patterns.

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
- Move rationale into curated OpenWiki decision pages under `openwiki/decisions/` (per `learning-distill`).
- Move recurring failure details into curated pages under `openwiki/troubleshooting/`.
- Move multi-step procedures to `.agents/playbooks/`.
- Keep temporary task artifacts in `.agents/sessions/`, not in durable knowledge files.
- Do not hand-edit OpenWiki-owned files (`openwiki/index.md`, run metadata); index refresh happens via the kit's sync script during distillation.

## Self-improvement loop

This repository uses the AKSK knowledge loop for durable learning:

1. **Analyze** — was a rule missing from `.agents/AGENTS.md` or ignored?
2. **Closeout** — bundle the session under `.agents/sessions/` per `task-closeout`.
3. **Distill** — promote stable lessons: decisions/troubleshooting to `openwiki/`, behavior rules to `.agents/AGENTS.md` or playbooks.
4. **Prune** — remove guidance that no longer prevents mistakes.

See `.agents/AGENTS.md` for the full loop and `openwiki/` for curated decisions.

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
