## Why

Currently, the Agent Knowledge Starter Kit (AKSK) lacks a formal, fully-specified process for handling deprecated durable knowledge (like superseded decisions and obsolete troubleshooting entries) in its markdown indices. Simply removing these entries hurts discoverability of historical context, and simply marking them with YAML frontmatter `status: superseded` is insufficient since agents primarily navigate via the `index.md` files and may not pick up on nuanced inline context. A triple-lock semantic approach (section headers, textual prefixes, and markdown strikethroughs) ensures that both human developers and LLM agents correctly identify inactive guidance.

## What Changes

We will formalize the procedure for deprecating durable knowledge inside the AKSK.
Specifically, when a decision is superseded or a troubleshooting entry becomes obsolete:
1. It is moved to a `## Superseded` or `## Obsolete` section at the bottom of the respective index file.
2. The list item is prefixed with a bold textual tag (`**[SUPERSEDED]**` or `**[OBSOLETE]**`).
3. The markdown link itself is struck through (`~~[Title](file.md)~~`).

We will update `.agents/docs/MAINTENANCE.md` and related `.agents/` documentation to capture this convention.

## Capabilities

### New Capabilities
- `deprecated-knowledge-convention`: Establish the triple-lock convention (Section heading, text prefix, strikethrough) for superseded and obsolete durable knowledge in index files.

### Modified Capabilities
- `docs-compile`: The `generate-durable-indexes.py` script will be updated to automatically group files marked as `superseded` or `obsolete` into the correct sections at the bottom of the index, applying the triple-lock formatting natively during generation.

## Impact

- `.agents/docs/MAINTENANCE.md` will be updated to document the triple-lock convention.
- `.agents/skills/docs-compile/scripts/generate-durable-indexes.py` will be modified to support the convention automatically.
- `.agents/skills/docs-lint/SKILL.md` (and related contracts) may need minor updates if we automate verification of this new convention in the future, but the primary impact is on the standard `MAINTENANCE.md` rulebook.
