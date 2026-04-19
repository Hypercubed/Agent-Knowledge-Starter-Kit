---
name: knowledge-lint
description: Check the `.agents/` knowledge layer for duplication, contradiction, staleness, oversized guidance, missing links, and uncategorized knowledge. Use as a periodic maintenance pass.
---

# Knowledge Lint

## Goal

Keep the compiled repo knowledge layer coherent, minimal, and current.

## Inputs

- `.agents/AGENTS.md`
- `.agents/docs/MAINTENANCE.md`
- `.agents/docs/index.md`
- `.agents/docs/log.md`
- `.agents/docs/repo-decisions.md`
- `.agents/docs/troubleshooting.md`
- `.agents/playbooks/`

## Skill initialization (before first lint pass)

Run this once per target repo after the skill files are present under `.agents/skills/knowledge-lint/` (for example after copying only that skill folder or after an `npx`/package install drops it there). Idempotent: safe to repeat.

1. Resolve the repo root (the directory that contains `.git/` in normal layouts).
2. Ensure `.agents/` exists.
3. Ensure `.agents/playbooks/` exists. If `.agents/playbooks/README.md` is missing, copy `bootstrap/playbooks/README.md` from this skill folder into place.
4. Ensure `.agents/docs/` exists. For each of `index.md`, `MAINTENANCE.md`, `log.md`, `repo-decisions.md`, and `troubleshooting.md`, if the file is missing under `.agents/docs/`, copy the matching file from `bootstrap/docs/` in this skill folder. If a file already exists, do not overwrite it.
5. If `.agents/AGENTS.md` is missing, copy `bootstrap/AGENTS.md` from this skill folder into place. If it already exists, do not overwrite it.

If `.agents/sessions/` or `.agents/.gitignore` session rules are missing, prefer running `task-closeout` initialization (sessions + ignore rules) or `learning-distill` initialization (broader `.agents/` scaffold including sessions).

## Checks

- duplicate guidance
- contradictions
- stale or superseded rules
- oversized AGENTS sections
- missing index coverage
- troubleshooting entries that should be decisions or playbooks
- decisions that should be compressed into AGENTS guidance

## Output

Produce:

- a lint report
- optional minimal edits
- a log entry in `.agents/docs/log.md`

## Constraints

- Prefer reclassification and compression over adding more text.
- Do not modify source code.
- Do not delete knowledge without explicit justification.
