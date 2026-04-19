---
id: kit-contract-policy-changes-must-update-agents-too
title: "Kit-contract policy changes must update `.agents/` too"
last_updated: 2026-04-19
---

# Kit-contract policy changes must update `.agents/` too

### Status

Accepted

### Context

This repository intentionally allows maintainer dogfood under root `.agents/` to diverge from `.agents/`, but some changes are not maintainer-local. When a change alters the portable kit contract, updating only root `.agents/` leaves adopters without the intended behavior.

### Rationale

Safety hardening and other policy-bearing changes that belong to the published starter kit must land in `.agents/` as well as any local dogfood copy. The repo may keep dual trees, but portable policy cannot live only in the maintainer tree.

### Consequences

- For changes to docs, playbooks, or other policy-bearing files that exist in both trees, decide explicitly whether the scope is maintainer-only or kit-wide.
- If the change is kit-wide, update both root `.agents/` and `.agents/` in the same task.
- Do not assume exact text parity between the two trees when patching; verify each target file against its real current contents.
