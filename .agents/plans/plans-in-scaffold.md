---
description: >
  Promote the plans pattern from maintainer dogfood under .agents/plans/ into the published kit (example/.agents/plans/ or equivalent) with conventions for lifecycle, frontmatter, and how plans relate to sessions, playbooks, and distillation.


created: 2026-04-11
status: draft
writer: AI
prompter: Hypercubed
---

# Plans in the published kit

## Repository context (2026-04)

The repository removed the parallel `scaffold/` tree in favor of a **single-tree** layout: canonical portable content is maintained under root `.agents/`, and an optional **generated** full kit lives under `example/.agents/` (see `.agents/docs/decisions/`). This plan’s original title referred to “scaffold”; mentally substitute “published kit copy” wherever that made sense historically.

## Goal

Ship **durable intent and multi-step initiatives** as a first-class kit path (mirroring this repo’s `.agents/plans/`), with explicit rules so plans do not rot or duplicate playbooks.

## Scope

- Add `example/.agents/plans/` (or agreed name under the published `.agents/` tree) with a short README or index describing purpose vs `.agents/playbooks/` and `.agents/sessions/`.
- Standardize optional YAML frontmatter (description, created, status, writer, prompter when writer is AI).
- Document transitions: when a plan becomes a playbook, a repo decision, log-only, or is archived/deleted.

## Out of scope (for this plan)

- Implementing published-kit plan files until the layout and `generate-example` contract are agreed.
- Automating plan lint in CI until the schema stabilizes.

## Success criteria

- Adopters can file approved work as plans without overloading `AGENTS.md` or session bundles.
- Maintainers have a single place in the kit describing plan lifecycle and linking from `docs/index.md` / `MAINTENANCE.md` (paths may be `example/.agents/docs/` in this repo).

## Notes

- This plan is meta: it describes promoting “plans” into the **generated** kit while the pattern is validated here under `.agents/plans/` only.
