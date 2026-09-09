> **SUPERSEDED 2026-08-23** - closed without implementation. This change was built entirely on the retired `docs-compile` index generator and hand-built `## Quick Reference` blurbs. Under AKSK 2.0 those are replaced by OpenWiki's deterministic index sync (`okf/index-sync`), which has no curated-blurb mechanism; the hand-curated entry point role moved to `openwiki/overview.md`. Auto-pinning has no equivalent today; revisit only if OpenWiki grows a pinning concept. See `adopt-openspec-openwiki` decision `knowledge-consolidation-into-openwiki`.

## Why

Currently, when the auto-indexing functionality generates `index.md` files (such as `decisions/index.md` or `troubleshooting/index.md`), it compiles an alphabetical directory but requires humans to manually curate the `## Quick Reference` list. I want `learning-distill` (or `docs-lint`) to algorithmically escalate critical, highly-relevant, or frequently accessed "Important" troubleshooting entries and decisions to the Quick Reference section on behalf of the maintainer.

## What Changes

- Modify `learning-distill` (or `docs-compile`) to analyze documentation updates and automatically inject or update references within the `Quick Reference` block.
- Define a criteria mechanism (such as frontmatter fields like `featured: true` or `importance: high`) on individual target markdown files.
- Ensure that the Quick Reference block maintains human readability and doesn't clobber manually pinned items.

## Capabilities

### New Capabilities
- `auto-quick-reference-pinning`: Automatically pin important decision and troubleshooting articles to the Quick Reference board in the index during generation.

### Modified Capabilities
- `docs-compile`: The existing index generator script must support injecting auto-escalated entries seamlessly into the top of the `parsed["blurb"]` section (the Quick Reference space) while preserving other manual elements.

## Impact

- Affects `.agents/skills/docs-compile/scripts/generate-durable-indexes.py`.
- Affects the knowledge ingestion processes (`learning-distill`) deciding when to trigger `docs-compile`.
- Potentially expands the internal metadata schema for `.agents/docs/decisions/` and `.agents/docs/troubleshooting/` frontmatters.
