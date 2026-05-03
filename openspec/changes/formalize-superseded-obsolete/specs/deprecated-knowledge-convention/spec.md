# Deprecated Knowledge Convention Spec

## Overview
This spec formalizes the procedure for deprecating durable knowledge inside the Agent Knowledge Starter Kit (AKSK). The convention establishes a consistent way to handle superseded architectural decisions and obsolete troubleshooting patterns so that both humans and AI agents can accurately identify inactive guidance without losing historical context.

## Requirements

### R1. Vocabulary Rules
1. For architectural decisions (`.agents/docs/decisions/`): The term `Superseded` (and `[SUPERSEDED]`) MUST be used when deprecating a decision. The frontmatter MUST use `status: superseded`.
2. For troubleshooting patterns (`.agents/docs/troubleshooting/`): The term `Obsolete` (and `[OBSOLETE]`) MUST be used when deprecating a pattern. Troubleshooting patterns DO NOT use the `status` field in their frontmatter.

### R2. Index File Representation (Triple-Lock)
When an entry is deprecated, its representation in the respective `index.md` MUST conform to the following triple-lock format:
1. **Section Heading**: The entry MUST be moved under a dedicated section at the bottom of the index (`## Superseded` or `## Obsolete`).
2. **Textual Prefix**: The list item MUST begin with a bolded textual marker (`**[SUPERSEDED]**` or `**[OBSOLETE]**`).
3. **Markdown Strikethrough**: The markdown link to the file MUST be fully enclosed in strikethrough tags (`~~[Link Title](file.md)~~`).

Example for a decision:
```markdown
## Superseded

- **[SUPERSEDED]** ~~[Maintainer plans live under `.agents/docs/plans/`, not `.agents/plans/`](plans-live-under-docs-plans-not-agents-plans.md)~~
```

### R3. File Retention
Deprecated files MUST remain in their respective directories (`decisions/` or `troubleshooting/`) and MUST NOT be deleted or moved to an `archive/` folder. This ensures `docs-search` and historical cross-links continue to function.

## Dependencies & Out of Scope
- Out of scope: Automated migration scripts to proactively sweep for obsolete troubleshooting entries.
- Out of scope: Deprecating `.agents/docs/plans/` explicitly in this spec (that was handled by a previous change).
