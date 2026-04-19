---
id: scaffold-content-stays-consumer-generic
title: "Scaffold content stays consumer-generic"
last_updated: 2026-04-19
---

# Scaffold content stays consumer-generic

### Status

Accepted (supersedes prior “dual tree sync” policy)

### Context

The published template must be copy-pasteable as `.agents/` without carrying starter-repository concepts.

### Rationale

Consumers should not inherit maintainer-only workflows, paths like `.agents/`, or “keep trees aligned” rules. Those belong in this repo’s `.agents/` (or root `README.md`), not in the kit files under `.agents/`.

### Consequences

- `.agents/` is edited only for improvements that belong in **any** adopter’s `.agents/` layout.
- This repository’s optional `.agents/` may accumulate dogfood-specific notes and **does not** need to match `.agents/` byte-for-byte.
