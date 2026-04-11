# AGENTS.md

Consult this file first for repo-wide operational guidance.

This file is template content for `.agents/AGENTS.md`.

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
- Move rationale to the consumer repo's `.agents/docs/repo-decisions.md`.
- Move recurring failure details to the consumer repo's `.agents/docs/troubleshooting.md`.
- Move multi-step procedures to the consumer repo's `.agents/playbooks/` directory (sibling of `docs/`, not inside it).
- Keep temporary task artifacts in the consumer repo's `.agents/sessions/`, not in durable knowledge files.

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
- Check for updates needed in the consumer repo's `.agents/` when durable lessons were learned.
