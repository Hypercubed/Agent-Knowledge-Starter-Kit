## Why

Currently, the Agent Knowledge Starter Kit (AKSK) lacks a formal, fully-specified process for handling deprecated durable knowledge (like superseded decisions and obsolete troubleshooting entries) in its markdown indices. Simply removing these entries hurts discoverability of historical context, and simply marking them with YAML frontmatter `status: superseded` is insufficient since agents primarily navigate via the `index.md` files and may not pick up on nuanced inline context. A triple-lock semantic approach (section headers, textual prefixes, and markdown strikethroughs) ensures that both human developers and LLM agents correctly identify inactive guidance.

## What Changes

We formalize the procedure for deprecating durable knowledge inside the AKSK, adapted to the consolidated layout (curated pages under `openwiki/{decisions,troubleshooting}/`; hand-built indexes and `.agents/docs/log.md` are removed by `adopt-openspec-openwiki`). When a decision is superseded or a troubleshooting entry becomes obsolete:

1. Its frontmatter carries `aksk_status: superseded` (plus optional `aksk_superseded_note` / `aksk_superseded_by`) on the curated wiki page - this is the machine-readable lock and replaces any log-bookkeeping leg.
2. Listings that surface the page (the curated overview page, other pages linking to it) prefix the title with a bold textual tag (`**[SUPERSEDED]**` / `**[OBSOLETE]**`).
3. The markdown link itself is struck through (`~~[Title](file.md)~~`).

The `docs-lint` stale-decision check verifies this convention against curated pages instead of index files; there is no compiler automation to update.

## Capabilities

### New Capabilities
- `deprecated-knowledge-convention`: Establish the triple-lock convention (Section heading, text prefix, strikethrough) for superseded and obsolete durable knowledge in index files.

### Modified Capabilities

(None directly; the convention is verified by the cross-tool lint's stale-decision check rather than automated in an index generator. `docs-compile` was retired by `adopt-openspec-openwiki`.)

## Impact

- The schema reference for curated entries lives at `openwiki/maintenance-format.md` (migrated from the former `.agents/docs/MAINTENANCE.md`); the triple-lock convention is documented there.
- `.agents/skills/docs-lint/SKILL.md` already verifies staleness marking as part of its stale-decision check (implemented by `adopt-openspec-openwiki` task 3.2).
