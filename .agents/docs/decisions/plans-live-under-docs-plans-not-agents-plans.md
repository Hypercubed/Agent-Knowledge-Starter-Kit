---
id: plans-live-under-docs-plans-not-agents-plans
title: Maintainer plans live under `.agents/docs/plans/`, not `.agents/plans/`
last_updated: 2026-04-22
description: 'Canonical location for initiative and roadmap markdown is `.agents/docs/plans/` so plans are indexed by docs-search alongside decisions and troubleshooting.

  '
tags:
- plans
- docs-search
- agents
- layout
status: accepted
depends_on:
- decisions/single-tree-architecture-agents
- decisions/docs-search-remains-canonical-over-host-native-search
---

# Maintainer plans live under `.agents/docs/plans/`, not `.agents/plans/`

### Status

Accepted

### Decision

Maintainer **plans** (multi-step initiatives and roadmaps) are stored as markdown under **`.agents/docs/plans/`** (with optional **`plans/archive/`** for retired files), not under a sibling `.agents/plans/` directory.

### Context

The `docs-search` indexer walks **`.agents/docs/**/*.md`** (plus playbooks and `AGENTS.md`). Plans kept outside `docs/` were invisible to search unless the indexer was extended. Co-locating plans under `docs/plans/` gives one query surface for decisions, troubleshooting, and plans.

### Rationale

- **Search:** `search-docs.py` picks up every markdown file under `.agents/docs/`; no special-case crawl is required.
- **Mental model:** Plans are durable, repo-local documentation with structured frontmatter, similar to decisions and troubleshooting, not ephemeral session evidence.
- **Portability:** Consumers who want plans opt into the same relative path after merging the kit.

### Consequences

- New plans are authored at `.agents/docs/plans/<id>.md` with the plan frontmatter contract in [MAINTENANCE.md](../MAINTENANCE.md#frontmatter-contract-plans).
- Retired plans move to `.agents/docs/plans/archive/<id>.md` with a link sweep across the repo.
- References to `.agents/plans/` in operational docs should point at `.agents/docs/plans/` instead.

### Related initiative

- [Plans as first-class artifacts](../plans/archive/plans-as-first-class-artifacts.md)
