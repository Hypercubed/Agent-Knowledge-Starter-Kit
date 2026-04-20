---
name: knowledge-lint
description: Check the `.agents/` knowledge layer for duplication, contradiction, staleness, oversized guidance, broken or stale links, missing index coverage, uncategorized or misplaced knowledge, and consistency between `decisions/` and `troubleshooting/` indexes and their entry files. Use as a periodic maintenance pass.
---

# Knowledge Lint

## Goal

Keep the compiled repo knowledge layer coherent, minimal, and current.

## Inputs

- `.agents/AGENTS.md`
- `.agents/docs/MAINTENANCE.md`
- `.agents/docs/index.md`
- `.agents/docs/log.md`
- `.agents/docs/decisions/` (including `index.md` and per-decision markdown files)
- `.agents/docs/troubleshooting/` (including `index.md` and per-pattern markdown files)
- `.agents/playbooks/`

## Skill initialization (before first lint pass)

Run this once per target repo after the skill files are present under `.agents/skills/knowledge-lint/` (for example after copying only that skill folder or after an `npx`/package install drops it there). Idempotent: safe to repeat.

1. Resolve the repo root (the directory that contains `.git/` in normal layouts).
2. Ensure `.agents/` exists.
3. Ensure `.agents/playbooks/` exists. If `.agents/playbooks/README.md` is missing, copy `bootstrap/playbooks/README.md` from this skill folder into place.
4. Ensure `.agents/docs/` exists. For each of `index.md`, `MAINTENANCE.md`, and `log.md`, if the file is missing under `.agents/docs/`, copy the matching file from `bootstrap/docs/` in this skill folder. If `.agents/docs/decisions/index.md` or `.agents/docs/troubleshooting/index.md` is missing, copy the entire contents of `bootstrap/docs/decisions/` and `bootstrap/docs/troubleshooting/` respectively, creating only files that do not already exist (do not overwrite). If a file already exists, do not overwrite it.
5. If `.agents/AGENTS.md` is missing, copy `bootstrap/AGENTS.md` from this skill folder into place. If it already exists, do not overwrite it.

If `.agents/sessions/` or `.agents/.gitignore` session rules are missing, prefer running `task-closeout` initialization (sessions + ignore rules) or `learning-distill` initialization (broader `.agents/` bootstrap layout including sessions).

## Checks

- duplicate guidance
- contradictions
- stale or superseded rules
- oversized AGENTS sections
- missing index coverage in `.agents/docs/index.md` for durable assets
- broken links in indexes and cross-links between docs
- `decisions/index.md` and `troubleshooting/index.md` list only files that exist; each entry file has frontmatter `id` aligned with its filename slug where applicable, and **`id` values are unique across both directories** (not only within one)
- troubleshooting entries that should be decisions or playbooks
- decisions that should be compressed into AGENTS guidance
- uncategorized knowledge (content with no clear home in AGENTS, a decision file, troubleshooting file, or playbook)
- **Mechanical path hygiene (especially after migrations or Replace All):** from the repository root, run `rg -n '\\.agents/\\.agents' .agents README.md INSTALL.md docs` (or equivalent). Hits usually mean a bad global replace or copy/paste error. This skill does **not** execute `rg` for you; `scripts/check-publish.sh` includes a blocking check when `rg` is available.

## Index refresh (optional)

After adding or renaming durable entry files under `.agents/docs/decisions/` or `.agents/docs/troubleshooting/`, you may rebuild each folder’s `index.md` from entry YAML frontmatter (see `.agents/docs/MAINTENANCE.md`) by running from the repository root:

`python3 scripts/generate-durable-indexes.py`

To update a single folder (any path that follows the same entry + `index.md` layout):

`python3 scripts/generate-durable-indexes.py --target .agents/docs/decisions`

Use the same command with `--target .agents/docs/troubleshooting` for troubleshooting. This does not replace **knowledge-lint**; run a lint pass afterward to validate contracts, prose, and cross-links.

## Output

Produce:

- a lint report
- optional minimal edits

Do **not** append to `.agents/docs/log.md` as part of this skill unless the user explicitly asked for a log entry. Distillation logging belongs to **learning-distill**; see `.agents/docs/MAINTENANCE.md` (Logging policy).

## Constraints

- Prefer reclassification and compression over adding more text.
- Do not modify source code.
- Do not delete knowledge without explicit justification.
