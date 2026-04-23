# Docs search contract

Machine-oriented rules for **docs-search** scripts when only this skill folder is available. Durable markdown frontmatter and index prose remain normative in [`.agents/docs/MAINTENANCE.md`](../../docs/MAINTENANCE.md). For overlapping topics, see [Portable skill contracts](../../docs/MAINTENANCE.md#portable-skill-contracts) in `MAINTENANCE.md`.

## Scripts

| Script                   | Role                                     |
| ------------------------ | ---------------------------------------- |
| `scripts/index-docs.py`  | Build or refresh the search index JSON   |
| `scripts/search-docs.py` | Rank sections from that JSON for a query |

Run from repo root (or any directory under it) using paths like `python3 .agents/skills/docs-search/scripts/index-docs.py` when the full kit layout exists.

## Discovery

Both scripts resolve the target **`.agents`** directory by:

1. `--agents-root` argument, else
2. `AGENTS_ROOT` environment variable, else
3. Walk parents of the current working directory for a directory named `.agents`

`AGENTS_ROOT` and `--agents-root` may point at the repo root or at `.agents`; if the basename is not `.agents`, `.agents` is appended.

## Index output path

`index-docs.py` always writes:

- `<agents-root>/skills/docs-search/docs-search-index.json`

Treat this file as **repo-local cache**; keep it gitignored. `search-docs.py` loads the index from the same repo’s `.agents/skills/docs-search/` when it can resolve that repo’s `agents_root` (so search stays scoped even if the script lives in another checkout).

## `index-docs.py` flags

| Flag                 | Behavior                                                                 |
| -------------------- | ------------------------------------------------------------------------ |
| `--agents-root PATH` | Override auto-discovery                                                  |
| `--dry-run`          | Print a truncated JSON sample to stderr; **do not** write the index file |

Requires **Python 3.9+** and **PyYAML** (`pip install pyyaml`).

## Indexed sources

Under the resolved `repo_root` (= parent of `.agents`):

- Every `*.md` under `.agents/docs/` (recursive)
- Every `*.md` directly under `.agents/playbooks/`
- `.agents/AGENTS.md` when present

## `docs-search-index.json` shape

Top-level object:

| Field          | Type   | Notes                       |
| -------------- | ------ | --------------------------- |
| `version`      | int    | Currently **2**             |
| `docs_root`    | string | Constant `".agents/docs"`   |
| `generated_at` | string | UTC ISO-8601 timestamp      |
| `sections`     | array  | One object per indexed file |

Each element of `sections`:

| Field         | Type   | Notes                                                                                                            |
| ------------- | ------ | ---------------------------------------------------------------------------------------------------------------- |
| `id`          | string | Frontmatter `id` when present, else file stem                                                                    |
| `title`       | string | Frontmatter `title`, else first `# ` heading, else stem-derived                                                  |
| `description` | string | Frontmatter `description`, else first body paragraph heuristic                                                   |
| `path`        | string | Path relative to **repo root** (posix)                                                                           |
| `docs_path`   | string | Path under `.agents/docs/` when applicable; else `""`                                                            |
| `folder`      | string | Immediate subdirectory of `docs/` (for example `decisions`); `""` at docs root                                   |
| `kind`        | string | Frontmatter `kind` when set; else inferred (`decision`, `plan`, `playbook`, `agents`, section folder name, etc.) |

`search-docs.py` still accepts legacy filename `wiki-index.json` if `docs-search-index.json` is missing.

## `search-docs.py` CLI

| Argument / flag      | Notes                                 |
| -------------------- | ------------------------------------- |
| `query`              | Positional; required non-empty string |
| `-n` / `--limit`     | Max hits (default **5**, minimum 1)   |
| `--agents-root PATH` | Same resolution as indexer            |

Exit **2** when no index file is found; run `index-docs.py` first.
