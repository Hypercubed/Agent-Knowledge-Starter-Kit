---
type: Troubleshooting
title: Maintainer plan markdown landed under `learning-distill/bootstrap/`
description: 'Initiative or roadmap files (or stubs for `docs/plans/`) appear under
  `learning-distill/bootstrap/docs/` or another skill bootstrap tree; portable bootstrap
  must stay consumer-generic.

  '
tags:
- plans
- skills
- docs
- maintenance
timestamp: '2026-04-22T00:00:00Z'
aksk_depends_on:
- decisions/plans-live-under-docs-plans-not-agents-plans
---

# Maintainer plan markdown landed under `learning-distill/bootstrap/`

#### Symptom

Markdown under `.agents/skills/learning-distill/bootstrap/docs/plans/` (or similar) contains maintainer roadmap or plan narrative that belongs in this kit’s **`.agents/docs/plans/`** only.

#### Likely causes

Treating the portable **bootstrap** subtree as a place to version maintainer planning artifacts, or mirroring the dogfood `docs/plans/` tree while syncing skills.

#### Fix

- **Move or delete** maintainer plan material from the skill `bootstrap/` tree; author plans only at `.agents/docs/plans/` (see [Maintainer plans live under `.agents/docs/plans/`, not `.agents/plans/`](../decisions/plans-live-under-docs-plans-not-agents-plans.md)).
- If `generate-example` or sync scripts were taught to copy those paths, remove that wiring so bootstrap stays template-only.
- Regenerate `example/` when the portable layout should match ([Regenerate `example/` when the portable kit or bootstrap changes](../decisions/regenerate-example-when-portable-kit-changes.md)).

#### Validation

- No `plans/` directory (or plan bodies) remains under `learning-distill/bootstrap/docs/` unless the kit explicitly documents a **consumer** sample there; maintainer indexes and narratives stay under `.agents/docs/plans/` in this repository.
