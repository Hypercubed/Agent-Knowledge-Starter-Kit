---
id: replace-indexing-with-ripgrep
title: "Replace Indexing with ripgrep + Fallback Search"
last_updated: 2026-04-22
description: >
Remove the custom indexing and search scripts and replace them with a
ripgrep-based search approach with a layered fallback strategy, including
npm/npx-based execution for maximum portability.
tags: [search, tooling, docs, workflow]
status: completed
---

# Replace Indexing with ripgrep + Fallback Search

## Status

Completed

## Context

The current docs-search implementation uses Python scripts to build a JSON index and perform basic string matching with heuristic scoring. This introduces:

- an additional build step (indexing)
- risk of stale data
- duplicated source of truth
- maintenance overhead

At the same time, the search logic itself is relatively simple and does not provide capabilities beyond what modern CLI tools like ripgrep already offer.

The repository is structured in a way (consistent frontmatter + predictable headings) that is highly compatible with text-based search tools.

## Objectives

- Eliminate the indexing step and JSON index artifacts
- Replace search with a ripgrep-first approach
- Provide a robust fallback chain for environments without ripgrep
- Maintain or improve current developer UX
- Keep the system simple, transparent, and low-maintenance

## Approach

Adopt a multi-tier search backend strategy:

### Backend Priority

1. ripgrep ("rg") — primary
2. git grep — secondary (if inside a git repo)
3. grep — tertiary
4. npx + Node-based search module — final fallback

A single entrypoint script (Node or Python) will:

- detect available tools at runtime
- dispatch the query to the best available backend
- normalize and format results

### npm Integration

Expose search via npm:

```bash
npm run search -- "query"
```

Optionally:

```bash
npx aksk-search "query"
```

### npx Fallback Strategy

If no native tools are available:

- dynamically invoke a Node-based search fallback via npx
- fallback implementation performs:
  - recursive ".md" scan
  - case-insensitive substring matching
  - minimal formatting

This ensures the system works even in constrained environments without requiring preinstalled tools.

### Output Consistency

Maintain a consistent output format across all backends:

- file path
- title (if extractable)
- snippet (optional)
- grouping by folder (optional)

## Work Breakdown

- Phase 1: Remove indexing system

  - Delete "index-docs.py"
  - Remove JSON index artifacts
  - Remove index build steps from workflows

- Phase 2: Implement search wrapper

  - Create "search-docs.py" (or ".py")
  - Implement backend detection (rg → git grep → grep)

- Phase 3: Add npm integration

  - Add "search" script to "package.json"
  - Standardize CLI usage

- Phase 4: Implement npx fallback

  - Add Node-based fallback search
  - Ensure it runs via npx when no tools available

- Phase 5: Normalize output

  - Match or improve current UX formatting
  - Ensure consistent behavior across backends

- Phase 6: Validate

  - Test across:
    - dev machine (rg present)
    - minimal environment (grep only)
    - no-tool environment (npx fallback)

## Risks

- Slight differences in result formatting between backends
- Loss of precomputed metadata (e.g., description extraction)
- Edge cases in Windows environments (command availability)
- npx fallback may be slower than native tools

## Exit Criteria

- No indexing step required anywhere in the workflow
- Search works via a single command ("npm run search")
- ripgrep is used when available
- Fallback chain works reliably across environments
- Results are accurate and comparable to current system
- No regression in developer usability
