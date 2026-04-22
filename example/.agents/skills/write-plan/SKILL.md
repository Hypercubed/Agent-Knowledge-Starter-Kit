---
name: write-plan
description: Scaffold a new maintainer plan under `.agents/docs/plans/<id>.md` with valid YAML frontmatter, collision-checked ids, optional related_decision suggestions, and stub body sections. Use when starting a tracked initiative that should appear in docs-search.
---

# Write plan

## Goal

Create a **plan-only** markdown file under `.agents/docs/plans/` that matches the contract in [`.agents/docs/MAINTENANCE.md`](../../docs/MAINTENANCE.md#frontmatter-contract-plans) and the narrative in [plans-as-first-class-artifacts](../../docs/plans/plans-as-first-class-artifacts.md), without hand-copying frontmatter.

## When to use

- A multi-step initiative needs a durable roadmap (not a session bundle, not an ADR).
- You want the plan indexed by **docs-search** immediately after creation.

## Inputs (collect before running)

Gather from the maintainer or task context:

1. **`id`** — stable slug, lowercase `[a-z0-9_-]`, **must equal** the filename stem (`<id>.md`). Must **not** collide with any `id` under `.agents/docs/decisions/`, `.agents/docs/troubleshooting/`, or an existing plan stem.
2. **`title`** — short human title.
3. **`description`** — one or two sentences (machine-oriented; docs-search shows this).
4. **`tags`** — non-empty list of lowercase `[a-z0-9_-]` labels.
5. **`status`** — one of `draft`, `active`, `paused`, `completed`, `cancelled`, `superseded`, `archived` (plans only; do not reuse decision status strings).
6. Optional: **`kind`** (`initiative` \| `meta` \| `exploration`), **`related_decisions`** (decision ids), **`consumer_portable`** (boolean; default false for maintainer-only roadmaps).

## Procedure

1. Resolve the repository root (directory containing `.agents/`).

2. Choose `id` and confirm it is not already used:
   - Search filenames under `.agents/docs/decisions/`, `.agents/docs/troubleshooting/`, and `.agents/docs/plans/` (ignore `plans/index.md`).
   - If unsure, run the script once with `--dry-run` after picking a candidate id; collisions exit with an error.

3. Optionally infer **`related_decisions`** by skimming nearby decisions whose titles overlap the plan topic (the script can suggest candidates with `--auto-related`).

4. Generate the file from the repo root:

   ```bash
   python3 .agents/skills/write-plan/scripts/write-plan.py \
     --id "<slug>" \
     --title "<title>" \
     --description "<one or two sentences>" \
     --tags "tag-one,tag-two" \
     --status draft \
     --kind initiative \
     --auto-related
   ```

   Add explicit links to decisions when you already know them:

   ```bash
   python3 .agents/skills/write-plan/scripts/write-plan.py \
     --id "plan-example" \
     --title "Example initiative" \
     --description "Short machine-oriented summary for search results." \
     --tags "docs,plans" \
     --related single-tree-architecture-agents
   ```

5. Open the new file and replace the **TODO** sections (Goal, Scope, Approach, milestones, success criteria, risks, knowledge routing).

6. Refresh indexes so humans see it in `plans/index.md`:

   ```bash
   bash .agents/skills/docs-compile/scripts/docs-compile.sh
   ```

## Script reference

- `--dry-run` — print the markdown that would be written; do not create the file.
- `--force` — overwrite an existing `.agents/docs/plans/<id>.md` only (still refuses collisions with decisions/troubleshooting/other ids).
- `--agents-root` — path to `.agents` when running outside the usual layout.

## Constraints

- **Plan-only:** creating or editing a plan does **not** authorize changing shipped skill behavior; implementation still needs an explicit maintainer request.
- **Global ids:** plan `id` values share a namespace with decisions and troubleshooting; prefix (`plan-…`) when collision risk exists.

## Related

- [docs-search](../docs-search/SKILL.md) — refresh `docs-search-index.json` after substantive plan edits.
- [docs-compile](../docs-compile/SKILL.md) — regenerate `plans/index.md` and the search index together.
