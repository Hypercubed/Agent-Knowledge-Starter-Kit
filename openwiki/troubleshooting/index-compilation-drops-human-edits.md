---
type: Troubleshooting
title: Index compilation drops human edits
description: Scripted auto-generation of indexes should preserve human-curated sections
  like Quick Reference rather than blindly overwriting the entire file.
tags:
- knowledge
- docs-compile
- indexes
timestamp: '2026-05-16T00:00:00Z'
aksk_status: superseded
aksk_superseded_note: The docs-compile indexer is retired; OpenWiki's deterministic
  index sync preserves descriptions and never drops human-curated content outside
  reserved files.
---

# Index compilation drops human edits

## Symptom

Running compilation scripts like `.agents/skills/docs-compile/scripts/generate-durable-indexes.py` causes manually curated sections (such as `## Quick Reference`) at the top of an `index.md` file to be irrevocably lost, replaced by a default boilerplate blurb.

## Cause

The script was previously reading the `index.md`, identifying the `## Index` marker, but failing to retain the parsed contents above that marker when regenerating the new template. It fell back to hardcoded default constants instead of preserving the human-edited markdown.

## Fix

Scripts that perform partial-file regeneration (like auto-generating a list at the bottom of a file) MUST prioritize parsing and re-inserting the existing content located above their injection point.

- For script authors: Ensure that `parsed["blurb"]` (or the equivalent variable holding the content above the split marker) is prioritized over default script constants.
- The `## Quick Reference` section is an intentional, manually curated highlight list. Auto-generation scripts are responsible for maintaining the integrity of this section during updates.
