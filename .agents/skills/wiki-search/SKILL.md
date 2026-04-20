---
name: wiki-search
description: Maintainer-only skill to index `.agents/docs/` as the wiki and run lightweight ranked search over section titles and descriptions.
metadata:
  internal: true
---

# Wiki Search (maintainer-only)

Search the **wiki** at `.agents/docs/`: each first-level subdirectory with an `index.md` is one section (plus optional root `index.md`). Results point agents at the right `index.md` to open next.

This skill is **`internal: true`** — not for consumer installs.

## Quickstart

From the repository root:

```bash
python3 .agents/skills/wiki-search/scripts/index-wiki.py
python3 .agents/skills/wiki-search/scripts/search-wiki.py "auth troubleshooting"
```

Default output lists up to **5** matches; use `--limit 3` for top-3.

## Agent workflow (3 steps)

1. **Index** — Run `index-wiki.py` so `wiki-index.json` reflects the current tree (or rely on a recent index after wiki edits).
2. **Search** — Run `search-wiki.py "<query>"` to get ranked sections (title, short description, relative path to the section `index.md`).
3. **Read** — Open the reported `index.md` (and linked entry files under that folder) for full content.

## Index refresh and durable subfolders

`index-wiki.py` first calls the repo’s **`scripts/generate-durable-indexes.py`** for `.agents/docs/decisions/` and `.agents/docs/troubleshooting/` so each folder’s `index.md` stays aligned with entry frontmatter (see `.agents/docs/MAINTENANCE.md`), then scans `.agents/docs/*/index.md`.

Re-run indexing after adding or renaming wiki sections or durable entries.

## Example queries

- `deployment steps` — surfaces sections whose title/description/path match.
- `auth errors` — matches authentication-related troubleshooting/decisions when descriptions mention auth.
- `knowledge lint` — routes toward docs that mention linting or the skill.

## Automation (optional)

- **VS Code:** run the **wiki-index** task (`.vscode/tasks.json`) after editing `.agents/docs/`.
- **Git hook:** run `.agents/skills/wiki-search/scripts/install-git-hook.sh` once per clone to append a `post-commit` hook that re-indexes when a commit touches `.agents/docs/`.

## Constraints

- Search is **heuristic** (token overlap + substring), not full-text semantic search.
- `wiki-index.json` is a local cache; see `README.md` for git ignore rules.
