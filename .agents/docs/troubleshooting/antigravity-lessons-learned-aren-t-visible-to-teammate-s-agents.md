---
id: antigravity-lessons-learned-aren-t-visible-to-teammate-s-agents
title: "Antigravity: Lessons learned aren't visible to teammate's agents"
last_updated: 2026-04-19
---

# Antigravity: Lessons learned aren't visible to teammate's agents

#### Symptom

Antigravity thoroughly researched and optimized a pattern on a local machine, but teammates' agents or CI runners do not seem to be aware of the pattern.

#### Likely causes

- Antigravity saved the context internally inside its Persistent Context layer (Knowledge Items or Context Logs). Neither is visible to a CI agent or a teammate's IDE.

#### Fix

- Direct Antigravity to write the finalized documentation or conventions into `.agents/docs/` or explicitly run `task-closeout` exporting the lesson. The `.agents/` tree is the shared communication boundary for all tools, so local Knowledge Items must be periodically distilled.

#### Validation

- The lesson is visible under `.agents/` and trackable via `git log`.
