---
name: docs-compile
description: Regenerate optional durable docs indexes and rebuild docs-search cache from local markdown sources. Use after editing `.agents/docs/` (any section), and before maintenance passes that validate index alignment.
---

# Docs Compile

## Goal

Regenerate derived documentation artifacts from `.agents/` markdown.

Discovery, subprocess order, and outputs are specified in [`CONTRACT.md`](CONTRACT.md) and implemented by `scripts/docs-compile.py` and its helpers; see **What it does** and **Command** below. [`.agents/docs/MAINTENANCE.md`](../../docs/MAINTENANCE.md) remains authoritative for durable entry shape and index prose; when guidance overlaps, follow [Portable skill contracts](../../docs/MAINTENANCE.md#portable-skill-contracts).

## Requirements

- Python 3.9+
- PyYAML (`pip install pyyaml` or equivalent)

## What it does

1. Regenerates optional durable `index.md` files — one per **immediate subdirectory** of `.agents/docs/` (for example `decisions/`, `troubleshooting/`, and any future top-level sections).

## Command

From the target repository (or any subdirectory under it):

```bash
python .agents/skills/docs-compile/scripts/docs-compile.py
```

Auto-discovery uses the nearest parent containing `.agents/`. Override with `AGENTS_ROOT=/path/to/.agents` when needed.

## Notes

- `docs-search` does not require durable `index.md` files; this compile step is optional for search correctness.
- `docs-lint` and `learning-distill` should run this when available to keep human-oriented indexes fresh.

## When to run

- After **learning-distill** adds, removes, or renames durable docs under `.agents/docs/`.
- Before **docs-lint** when you want optional durable `index.md` files kept fresh.
- After changing section `index.md` files under `.agents/docs/` if you rely on human index navigation.
