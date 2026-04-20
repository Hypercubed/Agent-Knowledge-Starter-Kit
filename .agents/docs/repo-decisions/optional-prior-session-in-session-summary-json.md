---
id: optional-prior-session-in-session-summary-json
title: "Optional `prior_session` in session `summary.json`"
last_updated: 2026-04-19
description: >
  Session bundles may record an optional `prior_session` pointer in `summary.json`
  to chain related closeouts without merging bundle folders.
tags: [sessions, workflow, skills]
status: accepted
---

# Optional `prior_session` in session `summary.json`

### Status

Accepted (optional convention)

### Context

Multi-step maintainer work can produce more than one task-closeout folder for a single initiative (for example adoption work plus a later orchestrator meta-closeout).

### Rationale

Adding `prior_session` (path to the earlier bundle directory) records linkage and ordering without reopening or editing earlier packets, which should stay append-only after closeout.

### Consequences

- Distillation across linked bundles relies on `task_id`, timestamps, and `prior_session`; see [`overlapping-session-bundles-for-one-initiative`](../troubleshooting/overlapping-session-bundles-for-one-initiative.md) for overlap symptoms and fixes (avoid rewriting closed session trees).
- Agents reconstructing history may follow `prior_session` when present.
