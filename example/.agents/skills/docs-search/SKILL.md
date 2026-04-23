---
name: docs-search
description: Search `.agents/` durable knowledge using a layered search approach (ripgrep, git grep, grep, or Node fallback).
---

# Docs search

Search durable guidance under `.agents/` using a multi-tier search backend strategy.

Search logic and script flags are normative in [`CONTRACT.md`](CONTRACT.md). [`.agents/docs/MAINTENANCE.md`](../../docs/MAINTENANCE.md) remains authoritative for durable docs policy; when guidance overlaps, follow [Portable skill contracts](../../docs/MAINTENANCE.md#portable-skill-contracts). Human-oriented steps: **Requirements**, **Quickstart**, and scripts under this skill folder.

## Requirements

- Node.js
- (Optional) ripgrep (`rg`) for highest performance.

## Quickstart

From the target repository (or any subdirectory under it):

```bash
node .agents/skills/docs-search/scripts/search-docs.js "auth troubleshooting"
```

Default search output lists up to **5** matches; use `--limit 3` for top-3.

## Agent workflow (2 steps)

1. **Search** — Run `search-docs.js "<query>"` to get ranked results (title, short description, path).
2. **Read** — Open the reported file paths for full content.

## Example queries

- `deployment steps`
- `auth errors`
- `knowledge lint`

## Command options

- `search-docs.js --agents-root /path/to/.agents` overrides auto-discovery (equivalent to `AGENTS_ROOT=/path/to/.agents`).
- `search-docs.js --limit 3` returns fewer matches (default is 5).

## Constraints

- Search uses a layered fallback strategy: `rg` -> `git grep` -> `grep` -> Node.js.
- Results are ranked based on tool output or heuristic matches in the Node.js fallback.
