# Wiki Search (maintainer)

Indexes **`.agents/docs/`** as the wiki and writes **`wiki-index.json`** next to this skill for fast CLI search.

## Requirements

- Python 3.9+
- PyYAML (`pip install pyyaml`)

## Commands

From the **repository root**:

```bash
python3 .agents/skills/wiki-search/scripts/index-wiki.py
python3 .agents/skills/wiki-search/scripts/search-wiki.py "your query here"
```

Options for `index-wiki.py`:

- `--dry-run` — print sample JSON only; durable-index refresh obeys `--dry-run` when wired.
- `--no-refresh-indexes` — skip `scripts/generate-durable-indexes.py` (decisions + troubleshooting only).

Options for `search-wiki.py`:

- `-n 3` / `--limit 3` — return fewer matches (default 5).

## Git ignore

`wiki-index.json` is listed in the repo root `.gitignore` so generated indexes are not committed.

## Optional: post-commit hook

```bash
bash .agents/skills/wiki-search/scripts/install-git-hook.sh
```

Re-runs indexing when the last commit touched paths under `.agents/docs/`.
