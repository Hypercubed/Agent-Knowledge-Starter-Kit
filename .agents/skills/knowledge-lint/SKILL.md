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

Run this once per target repo after the skill files are present under `.agents/skills/knowledge-lint/`. Idempotent: safe to repeat.

**Bootstrap source:** this kit keeps a **single** copy of scaffold templates under **learning-distill** at `.agents/skills/learning-distill/bootstrap/`. Run **learning-distill** skill initialization first when that skill is present; do not duplicate those files under **knowledge-lint**. If `learning-distill/` is missing from `.agents/skills/`, install or copy that skill before lint initialization, or copy missing templates from an upstream kit checkout.

Let `LD` denote `.agents/skills/learning-distill`.

1. Resolve the repo root (the directory that contains `.git/` in normal layouts).
2. Ensure `.agents/` exists and `LD/bootstrap/` is present; otherwise stop and add **learning-distill** (see above).
3. Ensure `.agents/playbooks/` exists. If `.agents/playbooks/README.md` is missing, copy `LD/bootstrap/playbooks/README.md` into place.
4. Ensure `.agents/docs/` exists. For each of `index.md`, `MAINTENANCE.md`, and `log.md`, if the file is missing under `.agents/docs/`, copy it from `LD/bootstrap/docs/`. If `.agents/docs/decisions/index.md` or `.agents/docs/troubleshooting/index.md` is missing, copy the entire contents of `LD/bootstrap/docs/decisions/` or `LD/bootstrap/docs/troubleshooting/` respectively, creating only files that do not already exist (do not overwrite).
5. If `.agents/AGENTS.md` is missing, copy `LD/bootstrap/AGENTS.md` into place. If it already exists, do not overwrite it.

If `.agents/sessions/` or `.agents/.gitignore` session rules are missing, run **learning-distill** initialization steps for sessions and ignore rules, or **task-closeout** initialization when you need closeout-first layout.

## Checks

- duplicate guidance
- contradictions
- stale or superseded rules
- oversized AGENTS sections
- missing index coverage in `.agents/docs/index.md` for durable assets
- broken links in indexes and cross-links between docs
- `decisions/index.md` and `troubleshooting/index.md` list only files that exist; each entry file has frontmatter `id` aligned with its filename slug where applicable, and **`id` values are unique across both directories** (not only within one)
- **Durable entry metadata contract:** each `decisions/*.md` and `troubleshooting/*.md` entry (excluding each folder’s `index.md`) follows `.agents/docs/MAINTENANCE.md` — required `id`, `title`, `last_updated`, `description`, and YAML list `tags`; `decisions/` entries also have `status` (`accepted`, `superseded`, or `provisional`); no `status` on troubleshooting entries; `tags` is never a single scalar string meant to hold a list; optional `depends_on` is a YAML list when present. Confirm by reading frontmatter, not only prose.
- troubleshooting entries that should be decisions or playbooks
- decisions that should be compressed into AGENTS guidance
- uncategorized knowledge (content with no clear home in AGENTS, a decision file, troubleshooting file, or playbook)
- **Mechanical path hygiene (especially after migrations or Replace All):** search for doubled `.agents/` path segments (for example `.agents/.agents` in paths) under `.agents/`, `README.md`, `INSTALL.md`, and `docs/`. Hits usually mean a bad global replace or copy/paste error.

## Derived indexes (before lint)

When `decisions/` or `troubleshooting/` entry files were added, removed, or renamed, refresh generated indexes and the maintainer **docs-search** cache so mechanical checks reflect the tree:

`bash scripts/docs-compile.sh`

See [`.agents/playbooks/docs-compile.md`](../playbooks/docs-compile.md).

## Output

Produce:

- a lint report
- optional minimal edits

Do **not** append to `.agents/docs/log.md` as part of this skill unless the user explicitly asked for a log entry. Distillation logging belongs to **learning-distill**; see `.agents/docs/MAINTENANCE.md` (Logging policy).

## Constraints

- Prefer reclassification and compression over adding more text.
- Do not modify source code.
- Do not delete knowledge without explicit justification.
