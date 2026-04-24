# Docs search contract

Machine-oriented rules for **docs-search** scripts when only this skill folder is available. Durable markdown frontmatter and index prose remain normative in [`.agents/docs/MAINTENANCE.md`](../../docs/MAINTENANCE.md). For overlapping topics, see [Portable skill contracts](../../docs/MAINTENANCE.md#portable-skill-contracts) in `MAINTENANCE.md`.

## Scripts

| Script                   | Role                                     |
| ------------------------ | ---------------------------------------- |
| `scripts/search-docs.py` | Search durable docs with layered fallbacks |

Run from repo root (or any directory under it) using paths like `python3 .agents/skills/docs-search/scripts/search-docs.py` when the full kit layout exists.

## Discovery

The script resolves the target **`.agents`** directory by:

1. `--agents-root` argument, else
2. `AGENTS_ROOT` environment variable, else
3. Walk parents of the current working directory for a directory named `.agents`

`AGENTS_ROOT` and `--agents-root` may point at the repo root or at `.agents`; if the basename is not `.agents`, `.agents` is appended.

## Search Strategy

The search uses a layered fallback strategy:
1. **ripgrep (rg)**: Primary high-performance search.
2. **git grep**: Secondary fallback if inside a git repository.
3. **grep**: Tertiary fallback.
4. **Python implementation**: Final fallback using native Python for environments without CLI tools.

## `search-docs.py` CLI

| Argument / flag      | Notes                                 |
| -------------------- | ------------------------------------- |
| `query`              | Positional; required non-empty string |
| `-n` / `--limit`     | Max hits (default **5**, minimum 1)   |
| `--agents-root PATH` | Same resolution as discovery          |
