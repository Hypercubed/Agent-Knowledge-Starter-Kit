---
name: docs-search
description: Maintainer-only skill to search `.agents/docs/` using a local JSON index (titles and short descriptions). Use after running docs-compile or index-docs.
metadata:
  internal: true
---

# Docs search (maintainer-only)

Search the **docs tree** at `.agents/docs/`: each first-level subdirectory with an `index.md` is one section, plus optional root `docs/index.md`. Results point agents at the right `index.md` to open next.

This skill is **`internal: true`** — not for consumer installs.

## Quickstart

From the repository root:

```bash
bash scripts/docs-compile.sh
python3 .agents/skills/docs-search/scripts/search-docs.py "auth troubleshooting"
```

`docs-compile.sh` refreshes durable `decisions/` and `troubleshooting/` indexes and rebuilds the search cache. If you only need the search cache (indexes already current):

```bash
python3 .agents/skills/docs-search/scripts/index-docs.py
```

Default search output lists up to **5** matches; use `--limit 3` for top-3.

## Agent workflow (3 steps)

1. **Compile** — Run [`docs-compile`](../../playbooks/docs-compile.md) (or `index-docs.py` alone) so `docs-search-index.json` reflects the current tree.
2. **Search** — Run `search-docs.py "<query>"` to get ranked sections (title, short description, relative path to the section `index.md`).
3. **Read** — Open the reported `index.md` (and linked entry files under that folder) for full content.

## Example queries

- `deployment steps`
- `auth errors`
- `knowledge lint`

## Index refresh

- **Canonical:** `bash scripts/docs-compile.sh` from the repo root (see [`.agents/playbooks/docs-compile.md`](../../playbooks/docs-compile.md)).
- **VS Code:** run the **docs-compile** task (`.vscode/tasks.json`) after editing `.agents/docs/`.
- **Git hook:** run `.agents/skills/docs-search/scripts/install-git-hook.sh` once per clone to append a `post-commit` hook that runs `docs-compile.sh` when a commit touches `.agents/docs/`.

## Constraints

- Search is **heuristic** (token overlap + substring), not semantic embeddings.
- `docs-search-index.json` is a local cache; see `README.md` for git ignore rules.
