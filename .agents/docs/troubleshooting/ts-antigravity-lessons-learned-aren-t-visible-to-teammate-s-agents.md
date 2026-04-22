---
id: ts-antigravity-lessons-learned-aren-t-visible-to-teammate-s-agents
title: "Antigravity: Lessons learned aren't visible to teammate's agents"
last_updated: 2026-04-19
description: >
  Local-only research in Antigravity does not automatically become durable repo
  knowledge teammates can load; distill lessons into tracked `.agents/` files.
tags: [agents, workflow, docs]
---

# Antigravity: Lessons learned aren't visible to teammate's agents

#### Symptom

Antigravity thoroughly researched and optimized a pattern on a local machine, but teammates' agents or CI runners do not seem to be aware of the pattern.

#### Likely causes

- Antigravity saved the context internally inside its Persistent Context layer (Knowledge Items or Context Logs). Neither is visible to a CI agent or a teammate's IDE.

#### Fix

- Direct Antigravity to land finalized documentation in durable kit paths under `.agents/` (for example `.agents/docs/decisions/`, `.agents/docs/troubleshooting/`, `.agents/playbooks/`, following [`.agents/docs/index.md`](../index.md)), or run **`task-closeout`** so evidence becomes a session bundle for **`learning-distill`**. Local Knowledge Items are not shared; `.agents/` (via `git`) is the cross-tool boundary.

#### Validation

- The lesson is visible under `.agents/` and trackable via `git log`.
