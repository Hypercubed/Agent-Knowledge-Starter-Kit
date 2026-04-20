# Docs search (maintainer)

Builds **`docs-search-index.json`** next to this skill for fast CLI search over **`.agents/docs/`**.

## Requirements

- Python 3.9+
- PyYAML (`pip install pyyaml`)

## Commands

From the **repository root** (recommended — refreshes durable indexes + search cache):

```bash
bash scripts/docs-compile.sh
python3 .agents/skills/docs-search/scripts/search-docs.py "your query here"
```

Search cache only:

```bash
python3 .agents/skills/docs-search/scripts/index-docs.py
```

Options for `index-docs.py`:

- `--dry-run` — print sample JSON to stderr; do not write `docs-search-index.json`.

Options for `search-docs.py`:

- `-n 3` / `--limit 3` — return fewer matches (default 5).

## Git ignore

`docs-search-index.json` is listed in the repo root `.gitignore` so generated indexes are not committed.

## Optional: post-commit hook

```bash
bash .agents/skills/docs-search/scripts/install-git-hook.sh
```

Runs `bash scripts/docs-compile.sh` when the last commit touched paths under `.agents/docs/`.
