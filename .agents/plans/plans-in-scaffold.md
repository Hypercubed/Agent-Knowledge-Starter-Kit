---
description: >
  Promote the plans pattern from maintainer dogfood under .agents/plans/ into scaffold/ with conventions for lifecycle, frontmatter, and how plans relate to sessions, playbooks, and distillation.


created: 2026-04-11
status: draft
writer: AI
prompter: Hypercubed
---

# Plans in the scaffold

## Goal

Ship **durable intent and multi-step initiatives** as a first-class kit path (mirroring this repo’s `.agents/plans/`), with explicit rules so plans do not rot or duplicate playbooks.

## Scope

- Add `scaffold/plans/` (or agreed name) with a short README or index describing purpose vs `.agents/playbooks/` and `.agents/sessions/`.
- Standardize optional YAML frontmatter (description, created, status, writer, prompter when writer is AI).
- Document transitions: when a plan becomes a playbook, a repo decision, log-only, or is archived/deleted.

## Out of scope (for this plan)

- Implementing scaffold files now (per current constraint).
- Automating plan lint in CI until the schema stabilizes.

## Success criteria

- Adopters can file approved work as plans without overloading `AGENTS.md` or session bundles.
- Maintainers have a single place in the kit describing plan lifecycle and linking from `docs/index.md` / `MAINTENANCE.md`.

## Notes

- This plan is meta: it describes adding “plans” to the scaffold while the pattern is validated here under `.agents/plans/` only.
