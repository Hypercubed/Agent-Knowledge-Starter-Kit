# Deprecated Knowledge Convention Spec

## Overview
This spec formalizes the procedure for deprecating durable knowledge inside the Agent Knowledge Starter Kit (AKSK). The convention establishes a consistent way to handle superseded architectural decisions and obsolete troubleshooting patterns so that both humans and AI agents can accurately identify inactive guidance without losing historical context.

## Requirements

### R1. Vocabulary Rules
1. For architectural decisions (`openwiki/decisions/`): The term `Superseded` (and `[SUPERSEDED]`) MUST be used when deprecating a decision. The page frontmatter MUST carry the AKSK extension `aksk_status: superseded`.
2. For troubleshooting patterns (`openwiki/troubleshooting/`): The term `Obsolete` (and `[OBSOLETE]`) MUST be used when deprecating a pattern; the page carries `aksk_status: superseded` with an `aksk_superseded_note` explaining why (troubleshooting pages otherwise omit lifecycle fields).

### R2. Listing Representation (Triple-Lock)
Wherever a deprecated entry is listed (the curated overview page or other curated pages linking to it), its representation MUST conform to the following triple-lock format:
1. **Grouping**: Deprecated entries SHOULD be grouped under a dedicated heading (`## Superseded` or `## Obsolete`) at the bottom of the listing, or carry the textual lock inline where no grouping exists.
2. **Textual Prefix**: The list item MUST begin with a bolded textual marker (`**[SUPERSEDED]**` or `**[OBSOLETE]**`).
3. **Markdown Strikethrough**: The markdown link to the file MUST be fully enclosed in strikethrough tags (`~~[Link Title](file.md)~~`).

Example for a decision:
```markdown
## Superseded

- **[SUPERSEDED]** ~~[Maintainer plans live under `.agents/docs/plans/`, not `.agents/plans/`](plans-live-under-docs-plans-not-agents-plans.md)~~
```

### R3. File Retention
Deprecated pages MUST remain in their respective curated directories (`openwiki/decisions/` or `openwiki/troubleshooting/`) and MUST NOT be deleted. This ensures historical context and cross-links continue to function; discovery is plain grep plus the wiki indexes (the retired `docs-search` no longer applies).

## Dependencies & Out of Scope
- Out of scope: Automated migration scripts to proactively sweep for obsolete troubleshooting entries.
- Out of scope: Deprecating `.agents/docs/plans/` explicitly in this spec (that was handled by a previous change).
