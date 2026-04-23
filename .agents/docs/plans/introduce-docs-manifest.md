---
id: introduce-docs-manifest
title: "Introduce Manifest-Based Docs Structure"
last_updated: 2026-04-22
description: >
Add a manifest file to define documentation structure, enabling skills to
resolve paths dynamically, supporting user-defined folders, and generating
maintenance.md as a derived system overview.
tags: [docs, structure, manifest, workflow]
status: proposed
---

# Introduce Manifest-Based Docs Structure

## Status

Proposed

## Context

Documentation paths are currently hardcoded within individual skills. This creates tight coupling between skills and repository structure, making it difficult to reorganize content without modifying code.

At the same time, the system is moving toward:

- grep-based search (no indexing)
- flat, markdown-native organization
- user flexibility in structuring knowledge

There is also a need to:

- support additional user-defined folders (e.g., "wiki/")
- generate a consistent system overview ("maintenance.md")

A manifest-based approach allows structure to be declared once and consumed by all tools.

## Objectives

- Decouple document structure from skill implementations
- Provide a single source of truth for documentation layout
- Allow users to define additional searchable folders
- Enable automatic generation of "maintenance.md"
- Maintain compatibility with grep-based search

## Approach

Introduce a manifest file that defines:

- root documentation directories
- typed content folders (used by skills)
- additional search-only folders (user-defined)

### Manifest Location

`.agents/docs/manifest.yaml`

### Manifest Schema

```yaml
roots:
  - .agents/docs

types:
  plan:
    path: plans
  decision:
    path: decisions
  troubleshooting:
    path: troubleshooting

extra_paths:
  - wiki
  - notes
```

### Semantics

- "roots" define top-level search locations
- "types" define structured content used by skills
- "extra_paths" define unstructured, search-only folders

### Path Resolution

For typed content:

`<root>/<types[type].path>/<slug>.md`

Example:

`.agents/docs/plans/add-plan-writing.md`

### Search Integration

Search tools (ripgrep + fallback) will:

- include all "roots"
- include all "types[*].path"
- include all "extra_paths"

No indexing is required.

### maintenance.md Generation

Introduce a generated file:

`.agents/docs/maintenance.md`

Generated from the manifest and includes:

- list of typed folders
- list of extra paths
- search scope description
- usage notes

This file is derived and should not be manually edited.

## Work Breakdown

- Phase 1: Define manifest

  - Add "manifest.yaml" with initial schema
  - Populate with current folder structure

- Phase 2: Implement resolver

  - Create utility to resolve paths from "(type, slug)"
  - Replace hardcoded paths in "write-plan" skill

- Phase 3: Update search integration

  - Modify search script to read manifest
  - Build search paths from "roots", "types", and "extra_paths"

- Phase 4: Add extra_paths support

  - Ensure search includes these folders
  - Do not allow skills to write to them

- Phase 5: Generate maintenance.md

  - Implement generator script
  - Output structured overview of manifest
  - Add npm script for regeneration

- Phase 6: Validate

  - Test path resolution across types
  - Test search across all configured paths
  - Add a sample "wiki/" folder and verify behavior

## Risks

- Manifest drift from actual folder structure
- Misconfiguration leading to missing search coverage
- Overextension of manifest scope (becoming too complex)
- Users misunderstanding difference between types and extra_paths

## Exit Criteria

- All skills resolve paths via manifest (no hardcoded directories)
- Search includes all manifest-defined paths
- Users can add new folders via "extra_paths" without code changes
- "maintenance.md" is generated and accurate
- System remains simple and understandable
