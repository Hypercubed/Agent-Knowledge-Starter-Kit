---
type: skill-reference
title: "learning-distill Skill"
description: "Converts a gitignored session bundle into durable .agents/ knowledge via classification, duplication checks, minimal edits, log.md append, and index refresh."
tags: [skills, learning-distill, distillation, knowledge]
timestamp: 2026-08-23T18:30:00Z
---

# learning-distill

**Folder:** `.agents/skills/learning-distill/` · **Files:** `SKILL.md`, `references/CONTRACT.md`, `references/*.schema.json`, `bootstrap/` (AGENTS.md, docs/, playbooks/, sessions/)

## Goal and inputs

Convert raw task evidence into concise, durable repo knowledge. Inputs are one session bundle under `.agents/sessions/<bundle>/` (layout per [task-closeout](task-closeout.md)) plus the existing durable tree: `.agents/AGENTS.md`, `.agents/docs/MAINTENANCE.md`, `index.md`, `log.md`, `decisions/`, `troubleshooting/`, and `.agents/playbooks/`. The canonical identity is the bundle's `summary.json` `task_id` — never the folder name.

## Skill initialization — single scaffold source

Initialization creates everything a consumer repo needs, copying from this skill's `bootstrap/` tree only files that don't already exist (never overwriting):

- `.agents/playbooks/README.md`
- `.agents/docs/{index.md, MAINTENANCE.md, log.md}` and the full `decisions/` / `troubleshooting/` starter folders
- `.agents/sessions/README.md`
- `.agents/AGENTS.md` template
- session ignore rules in `.agents/.gitignore`

Step 4a additionally keeps the **Skills docs registry** row for learning-distill current inside an existing `MAINTENANCE.md`. This bootstrap tree is the **canonical** template source for docs-lint initialization too — docs-lint never duplicates templates ([docs-lint](docs-lint.md)).

## Finding bundles under gitignore

**Invariant:** per-task folders under `.agents/sessions/` are deliberately gitignored (only `README.md` tracked), so many search and listing tools skip them by default. **Never conclude that no bundles exist based on an ignore-aware search or glob.** Locate bundles with at least one method that sees ignored files:

- filesystem listing (`ls`, `find`, shell APIs) rather than an IDE index;
- ripgrep with `--no-ignore-vcs` (or `--no-ignore` when scoped to the sessions subtree).

Then open each candidate's `summary.json`: treat `task_id` as canonical and filter/prioritize using state fields (`distilled`, `status`, `distillation_status`) instead of folder names. This failure mode also has a durable entry at [`.agents/docs/troubleshooting/session-discovery-fails-during-distillation-or-closeout.md`](../../.agents/docs/troubleshooting/session-discovery-fails-during-distillation-or-closeout.md).

## Procedure

1. Locate the correct bundle per the invariant above; read its files.
2. Read `summary.json`; use its `task_id` in notes and log entries.
   2a. **Search before comparing:** with docs-search available, query each candidate lesson topic first — `python3 .agents/skills/docs-search/scripts/search-docs.py "<lesson topic>"` — then open returned paths as primary input to the compare/dedup steps. This avoids loading the whole `.agents/` tree into context.
3. Compare candidates against existing knowledge; remove duplication.
4. Classify each lesson.
5. Draft minimal updates to the right destination(s).
6. Update `.agents/docs/index.md` if structure changed.
7. Append a concise, non-sensitive row to `.agents/docs/log.md`.
8. Mark the bundle distilled (update its `summary.json` distillation flags).

## Classification categories

Each candidate becomes one of:

| Category | Destination | Bar |
| --- | --- | --- |
| ephemeral | stays in bundle | one-off detail |
| AGENTS guidance | `.agents/AGENTS.md` | high confidence, broadly useful, likely to recur, concise, actionable |
| troubleshooting | `.agents/docs/troubleshooting/<slug>.md` | recurring failure + fix |
| repo decision | `.agents/docs/decisions/<slug>.md` | rationale needing explanation later |
| playbook | `.agents/playbooks/<name>.md` | multi-step procedure |

Entry-file rules: filename stem must equal frontmatter `id`; collision checks happen **only within** the target folder; `depends_on` uses qualified form `decisions/<slug>` or `troubleshooting/<slug>`. Validation against the JSON Schemas in `references/` (`decision-frontmatter.schema.json`, `troubleshooting-frontmatter.schema.json`) is available.

## Allowed writes (contract)

- `.agents/AGENTS.md` (only lessons meeting the AGENTS criteria)
- `.agents/docs/decisions/*.md` + its `index.md`
- `.agents/docs/troubleshooting/*.md` + its `index.md`
- `.agents/docs/index.md`, `.agents/playbooks/*.md`
- append-only rows to `.agents/docs/log.md`
- the bundle's own `summary.json` distillation flags

**Never:** modify source code outside the knowledge layer; invent rules unsupported by evidence; expand AGENTS.md with narrative; copy secrets/private data into durable docs.

## Post-write refresh

After changing durable entries, run the optional compiler so human-oriented indexes stay aligned:

```bash
python .agents/skills/docs-compile/scripts/docs-compile.py
```

Details in [docs-compile](docs-compile.md); docs-lint depends on fresh indexes for its alignment checks.

## Evidence of behavior

Real runs recorded in `.agents/docs/log.md` show accepted/rejected accounting, e.g. session `20260423-220116-deep-review-v2` produced two accepted lessons (a Windows ripgrep troubleshooting entry plus a major-version-release playbook step) with zero rejections; `formalize-superseded-obsolete` was distilled to "no net durable edits" because the change had landed during the task itself.

## Rewrite horizon (2.0)

Active change `adopt-openspec-openwiki` rewrites this skill around a descriptive/prescriptive split (`distill-routing` capability): **descriptive** lessons about the repository (facts, rationale, architecture, troubleshooting patterns) become OKF-format wiki pages under `openwiki/`, authored directly by the distilling agent using runtime-loaded upstream guidance and validated with OpenWiki's deterministic OKF helpers; **prescriptive** agent-behavior rules keep landing here in `.agents/`. Missing prerequisites (no `openwiki` binary, uninitialized wiki, no curation contract attached to `INSTRUCTIONS.md`) fail closed before any wiki write. See [OpenSpec workflow](../governance/openspec-workflow.md).
