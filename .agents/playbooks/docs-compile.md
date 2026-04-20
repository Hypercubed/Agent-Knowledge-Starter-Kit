# Docs compile (derived indexes)

Use after editing durable entries under `.agents/docs/decisions/` or `.agents/docs/troubleshooting/`, or when you want an up-to-date local search index over `.agents/docs/`.

## What it does

1. Regenerates `decisions/index.md` and `troubleshooting/index.md` from entry YAML frontmatter via `scripts/generate-durable-indexes.py` (see `.agents/docs/MAINTENANCE.md`).
2. Rebuilds the maintainer **docs-search** cache (`.agents/skills/docs-search/docs-search-index.json`) by scanning `.agents/docs/index.md` and each `.agents/docs/*/index.md`.

## Command

From the repository root:

```bash
bash scripts/docs-compile.sh
```

## When to run

- After **learning-distill** adds or renames decision or troubleshooting entry files (before or as part of **knowledge-lint**).
- Before a **knowledge-lint** pass when indexes may be stale.
- After changing section `index.md` files under `.agents/docs/` if you rely on **docs-search** for navigation.

## Related

- [`.agents/skills/docs-search/SKILL.md`](../skills/docs-search/SKILL.md) — query the search cache.
- `scripts/generate-durable-indexes.py` — durable index generator only (no search cache).
