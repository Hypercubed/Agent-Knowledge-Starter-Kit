---
type: Decision
title: '`docs-search` stays canonical for `.agents/` knowledge; host-native search
  is not the default fallback policy'
description: 'Kit skills should not instruct agents to prefer each host product’s
  native workspace index or search first, with the `docs-search` Python tools only
  as fallback. Native search may complement general exploration but does not replace
  the explicit, scoped index contract for durable `.agents/` markdown.

  '
tags:
- docs
- skills
- agents
- architecture
timestamp: '2026-04-22T00:00:00Z'
aksk_status: superseded
aksk_depends_on:
- decisions/docs-tooling-scripts-resolve-target-from-override-then-nearest-agents
---

# `docs-search` stays canonical for `.agents/` knowledge; host-native search is not the default fallback policy

### Status

Superseded — see [knowledge consolidation into OpenWiki](knowledge-consolidation-into-openwiki.md): `docs-search` is retired; knowledge search is plain grep over curated wiki pages

### Context

Many agent hosts and IDEs expose their own codebase search, semantic retrieval, or background indexing. The portable kit ships `docs-search` (`search-docs.py`) and optional `docs-compile` to manage durable repo knowledge.

### Decision

Do **not** adopt default skill wording that tells agents to use the host’s native index or search when available and only fall back to the Python scripts if needed.

### Rationale

- **Scope:** Host search typically spans the whole repository (with product-specific ignore rules). Durable kit knowledge is intentionally concentrated under `.agents/` with a stable layout; broad search often dilutes signal with unrelated paths.
- **Contract:** The documented workflow is "native-first" search against a known corpus. Freshness is implicit, letting the system skip the indexing step.
- **Portability:** Cloud and headless agents do not share one retrieval API. Conditional “if your host has X” instructions multiply branches and go stale as products change.
- **Dual tooling is fine:** Agents may still use host tools for general code navigation; that is orthogonal to the **canonical** path for validating and searching the kit’s durable markdown layer.

### Consequences

- `docs-search` / `docs-compile` skills remain the normative reference for refreshing and querying the local `.agents/` search index.
- Future edits to skills should avoid implying that host-native search replaces or outranks the scripts for kit-knowledge tasks unless a maintainer explicitly revisits this decision.
