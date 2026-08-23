---
type: Decision
title: Use docs-capture for ad-hoc durable docs
description: Direct ad-hoc documentation edits into the .agents/ layer should use
  the docs-capture skill to bypass full distillation.
tags:
- knowledge
- docs-capture
- openspec
timestamp: '2026-05-16T00:00:00Z'
aksk_status: accepted
---

## Context

The standard `task-closeout` and `learning-distill` pipeline is designed to bundle, review, and distill session artifacts into stable repo knowledge (`.agents/docs/decisions/` or `.agents/docs/troubleshooting/`). However, when maintaining the repository documentation interactively or when specific, ad-hoc guidance must be captured immediately (e.g. "Capture this workaround to troubleshooting"), invoking a full session extraction and distillation cycle is cumbersome and slow. A formalized `docs-capture` skill was proposed to write these direct edits to markdown correctly and automatically update the corresponding `index.md` files while skipping the bundle extraction phase.

## Decision

- Direct ad-hoc documentation edits into the `.agents/` layer MUST use the `docs-capture` skill (once implemented) rather than generating session bundles via `task-closeout`.
- The `docs-capture` command automatically handles index regeneration by executing the equivalent of `generate-durable-indexes.py`, ensuring alphabetical indices remain accurate across repository files.
- Ad-hoc edits should still adhere to the frontmatter requirements (`id`, `title`, `last_updated`, `status`, `description`, `tags`) per `.agents/docs/MAINTENANCE.md`.

## Consequences

- Faster, lower-friction workflow for direct human knowledge dictation.
- The `task-closeout` and `learning-distill` skills remain constrained strictly for task extraction where evidence requires structured review, reducing their burden on interactive conversational workflows.
