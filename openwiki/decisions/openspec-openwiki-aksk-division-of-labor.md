---
type: Decision
title: OpenSpec / OpenWiki / AKSK division of labor
description: OpenSpec owns the intent/process layer, OpenWiki owns the descriptive
  knowledge layer, and AKSK owns the experiential and curation layer; AKSK stops reimplementing
  upstream tool responsibilities.
tags:
- architecture
- openspec
- openwiki
- skills
timestamp: '2026-08-23T00:00:00Z'
aksk_status: accepted
---

# OpenSpec / OpenWiki / AKSK division of labor

### Status

Accepted

### Context

AKSK historically duplicated capabilities that actively maintained upstream tools now provide: hand-rolled index generation overlapped OpenWiki's deterministic OKF index handling, and ad-hoc process guidance overlapped OpenSpec's managed change workflow. Continuing to duplicate them guarantees drift and doubles maintenance.

### Decision

Three layers, one owner each:

1. **OpenSpec** (`@fission-ai/openspec`) owns the intent/process layer: change proposals, specs, tasks, validation, archival.
2. **OpenWiki** (`openwiki`) owns the descriptive knowledge layer: generated repository documentation under `openwiki/` in OKF format, including indexes and provenance metadata.
3. **AKSK** owns the experiential and curation layer: `.agents/AGENTS.md` behavioral guidance, session capture (`task-closeout`), distillation judgment and routing (`learning-distill`), and cross-tool lint guardrails (`docs-lint`).

AKSK skills delegate to the upstream tools where a capability overlaps and add value only in judgment, routing, and curation that upstream does not provide.

### Rationale

Upstream tools are actively maintained and tested; AKSK copies of their functionality rot. Judgment about *what* knowledge matters and *where* it lands is the kit's actual product. This split is referenced by the distribution-stack, ownership-partition, and supersession decisions recorded alongside it.

### Related

- [OpenWiki integration distribution stack](openwiki-integration-distribution-stack.md)
- [Agent-tool ownership partition](agent-tool-ownership-partition.md)
- [Adopt upstream tools over reimplementation](adopt-upstream-tools-over-reimplementation.md)
