---
type: Decision
title: Knowledge consolidation into OpenWiki
description: The .agents/docs knowledge base (decisions, troubleshooting) consolidates
  into curated OpenWiki trees; hand-built indexes and log upkeep move to OpenWiki
  tooling; AKSK requires openspec and openwiki as hard peers.
tags:
- architecture
- openwiki
- docs
- supersession
timestamp: '2026-08-23T00:00:00Z'
aksk_status: accepted
aksk_depends_on:
- decisions/openspec-openwiki-aksk-division-of-labor
---

# Knowledge consolidation into OpenWiki

### Status

Accepted — supersedes the location aspect of [Single-tree architecture](single-tree-architecture-agents.md)

### Context

AKSK originally promised full portability: the kit's knowledge layer had to work in repositories without OpenWiki, so durable entries lived under `.agents/docs/` with hand-built section indexes and an append-only log. Two developments removed the reasons for that split: the maintainer dropped the portability requirement (AKSK hard-requires openspec and openwiki), and OpenWiki update runs already generated pages *describing* the knowledge layer, creating a second drifting representation of the same content.

### Decision

1. Decision records and troubleshooting entries become OKF pages under curated wiki trees (`openwiki/{decisions,troubleshooting}/`), protected by the AKSK curation contract's preserve-and-link semantics.
2. Decision lifecycle state rides in `aksk_status` frontmatter extension fields; entry identity stays the filename stem.
3. Hand-built section indexes (`decisions/index.md`, `troubleshooting/index.md`, `docs/index.md`) are deleted; deterministic OpenWiki index sync owns indexing. A single curated overview page replaces the grouped Quick Reference.
4. `.agents/docs/log.md` is deleted, not migrated. OpenWiki reserves its own run metadata; distillation accountability lives in session bundle `summary.json` flags plus git history.
5. Playbooks, sessions, skills, and root `AGENTS.md` guidance remain in `.agents/` - only the descriptive KB moves.

### Rationale

Maintaining knowledge outside the OpenWiki flow guarantees drift now that both tools are mandatory peers. Consolidation leaves AKSK with judgment work only: classification, routing, and lint.

### Related

- [OpenSpec / OpenWiki / AKSK division of labor](openspec-openwiki-aksk-division-of-labor.md)
- [Single-tree architecture](single-tree-architecture-agents.md)
