---
id: single-tree-architecture-agents
title: "Single-tree architecture (`.agents/`)"
last_updated: 2026-04-19
description: >
  Canonical kit knowledge and portable skills live only under root `.agents/`;
  the `example/` tree is generated illustration, not a second source of truth.
tags: [architecture, agents, installation]
status: accepted
depends_on:
  - maintainer-skills-mark-internal-in-frontmatter
  - regenerate-example-when-portable-kit-changes
---

# Single-tree architecture (`.agents/`)

### Status

Accepted (supersedes prior "dual-tree" approach)

### Context

The repository previously maintained a **`scaffold/`** tree parallel to `.agents/`, which confused agents and users about where skills and workflows lived.

### Rationale

Consolidating on **root `.agents/`** as the only canonical kit tree removes that overhead and simplifies installation: adopters use `npx skills add <repository>` (or copy `.agents/skills/`) without mirroring a second tree. A generated **`example/.agents/`** folder illustrates a bootstrap install; it is not a parallel source of truth.

### Consequences

- Portable templates and skills live under root `.agents/` only.
- Maintainer-only skills in `.agents/skills/` are flagged with **`metadata.internal: true`** (see [Maintainer-only skills use `metadata.internal: true`](maintainer-skills-mark-internal-in-frontmatter.md)).
- The disposable **`example/`** tree is regenerated when the illustrated install should match recent kit changes (see [Regenerate `example/` when the portable kit or bootstrap changes](regenerate-example-when-portable-kit-changes.md)).
