---
name: docs-compile
description: Regenerate optional durable docs indexes and rebuild docs-search cache from local markdown sources. Use after editing `.agents/docs/decisions/` or `.agents/docs/troubleshooting/`, and before maintenance passes that validate index alignment.
---

# Docs Compile

## Goal

Regenerate derived documentation artifacts from `.agents/` markdown.

## What it does

1. Regenerates optional durable indexes:
   - `.agents/docs/decisions/index.md`
   - `.agents/docs/troubleshooting/index.md`
2. Rebuilds `.agents/skills/docs-search/docs-search-index.json`.

## Command

From the repository root:

```bash
bash .agents/skills/docs-compile/scripts/docs-compile.sh
```

## Notes

- `docs-search` does not require durable `index.md` files; this compile step is optional for search correctness.
- `knowledge-lint` and `learning-distill` should run this when available to keep human-oriented indexes fresh.

## When to run

- After **learning-distill** adds, removes, or renames decision or troubleshooting entry files.
- Before **knowledge-lint** when you want optional durable `index.md` files kept fresh.
- After changing section `index.md` files under `.agents/docs/` if you rely on human index navigation.
