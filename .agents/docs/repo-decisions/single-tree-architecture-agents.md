---
id: single-tree-architecture-agents
title: "Single-tree architecture (`.agents/`)"
last_updated: 2026-04-19
---

# Single-tree architecture (`.agents/`)

### Status

Accepted (supersedes prior "dual-tree" approach)

### Context

The repository previously maintained a `scaffold/` tree parallel to `.agents/`, confusing AI agents and users about where skills and workflows lived.

### Rationale

Consolidating the repository to use its own `.agents/` tree as the canonical kit removes maintenance overhead and simplifies skill installation. Adopters just use `npx skills add <repository>` rather than manually copying from a separate `scaffold/` directory.

### Consequences

- All generic templates and skills now live in `.agents/`.
- Installation instructions command explicit use of `cp` instead of writing line-by-line to prevent template drift.
