---
id: dec-docs-tooling-scripts-resolve-target-from-override-then-nearest-agents
title: "Docs tooling scripts resolve target from override, then nearest `.agents`"
last_updated: 2026-04-20
description: >
  Docs-search and docs-compile scripts should not assume git-root coupling;
  they first honor explicit target overrides, then discover the nearest `.agents`
  from the current working directory.
tags: [docs, skills, tooling, architecture]
status: accepted
depends_on:
  - dec-single-tree-architecture-agents
---
# Docs tooling scripts resolve target from override, then nearest `.agents`

### Status

Accepted

### Context

Docs tooling was used from both repo root and nested paths such as `example/`, and also needs to remain portable for global or copied installs. Git-root-only path resolution caused wrong-target behavior in nested contexts.

### Rationale

Portable scripts need predictable target selection across environments. A hybrid strategy is durable:

1. explicit CLI/env override when provided,
2. nearest project marker discovery from current working directory (`.agents`),
3. clear error when neither resolves.

This keeps maintainer and consumer runs aligned without hard-coding repository layout assumptions.

### Consequences

- `docs-search` remains self-sufficient with explicit target support and nearest-`.agents` fallback.
- `docs-compile` remains optional and should follow the same targeting contract.
- New script changes should validate both repo-root and nested-path execution to prevent regressions.
