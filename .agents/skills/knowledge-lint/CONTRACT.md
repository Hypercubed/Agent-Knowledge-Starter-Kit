# Knowledge lint contract

Machine-oriented rules for **knowledge-lint** when only this skill folder is present. This skill is procedure and checklist only: there is **no** bundled executable script.

Use this file plus `SKILL.md` for the maintainer verification list.

Normative rules for durable YAML, logging, graph edges, and index shape live in [`.agents/docs/MAINTENANCE.md`](../../docs/MAINTENANCE.md). For precedence over per-skill contracts, see [Portable skill contracts](../../docs/MAINTENANCE.md#portable-skill-contracts).

## Inputs (read-only scope)

The lint pass is scoped to the repo’s `.agents/` knowledge layer, including at minimum:

- `.agents/AGENTS.md`
- `.agents/docs/MAINTENANCE.md`, `index.md`, `log.md`
- `.agents/docs/decisions/` (entries + `index.md`)
- `.agents/docs/troubleshooting/` (entries + `index.md`)
- `.agents/playbooks/`

Optional: `.agents/docs/plans/` when present.

## Commands used during a lint pass (optional skills)

When sibling skills exist, typical **refresh-before-lint** commands are:

```bash
bash .agents/skills/docs-compile/scripts/docs-compile.sh
```

If **docs-compile** is missing but **docs-search** is present:

```bash
python3 .agents/skills/docs-search/scripts/search-docs.py "<topic>"
```

Exact flags and JSON shape for those tools: [docs-compile `CONTRACT.md`](../docs-compile/CONTRACT.md), [docs-search `CONTRACT.md`](../docs-search/CONTRACT.md).

## Outputs

- A **lint report** (human-oriented); optionally minimal edits to `.agents/` markdown.
- **Do not** append to `.agents/docs/log.md` unless the user explicitly requested a log row (distillation logging belongs to **learning-distill**; see `MAINTENANCE.md` Logging policy).

## Hard constraints

- Do not modify non-knowledge-layer **source code** (application code outside the agreed scope in `SKILL.md`).
- Prefer deduplication and reclassification over adding bulk prose.
