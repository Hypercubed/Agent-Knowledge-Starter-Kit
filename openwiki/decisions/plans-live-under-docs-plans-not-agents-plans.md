---
type: Decision
title: Maintainer plans live under `.agents/docs/plans/`, not `.agents/plans/`
description: 'Canonical location for initiative and roadmap markdown is `.agents/docs/plans/`
  so plans are indexed by docs-search alongside decisions and troubleshooting.

  '
tags:
- plans
- docs-search
- agents
- layout
timestamp: '2026-04-22T00:00:00Z'
aksk_status: superseded
aksk_depends_on:
- decisions/single-tree-architecture-agents
- decisions/docs-search-remains-canonical-over-host-native-search
aksk_superseded_note: Maintainer plan files were removed; OpenSpec changes superseded
  them. Retained as historical reference.
---

# Maintainer plans live under `.agents/docs/plans/`, not `.agents/plans/`

### Status

Superseded (The `write-plan` skill and `docs/plans/` directory infrastructure have been deprecated and removed. Maintainers are advised to manage plans manually.)

### Decision

Maintainer **plans** (multi-step initiatives and roadmaps) are stored as markdown under **`.agents/docs/plans/`** (with optional **`plans/archive/`** for retired files), not under a sibling `.agents/plans/` directory.

### Context

The `docs-search` indexer walks **`.agents/docs/**/*.md`** (plus playbooks and `AGENTS.md`). Plans kept outside `docs/` were invisible to search unless the indexer was extended. Co-locating plans under `docs/plans/` gives one query surface for decisions, troubleshooting, and plans.

### Rationale

- **Search:** `search-docs.py` picks up every markdown file under `.agents/docs/`; no special-case crawl is required.
- **Mental model:** Plans are durable, repo-local documentation with structured frontmatter, similar to decisions and troubleshooting, not ephemeral session evidence.
- **Portability:** Consumers who want plans opt into the same relative path after merging the kit.

### Consequences

- Plans were historically authored under `.agents/docs/plans/` with a plan frontmatter contract formerly defined in `MAINTENANCE.md` (that section was retired with the knowledge-base consolidation).
- References to `.agents/plans/` in operational docs should point at `.agents/docs/plans/` instead.

### Related initiative

- Plans as first-class artifacts (plan archived)
