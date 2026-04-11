---
description: >
  Extend the distributable kit under scaffold/ with a documented place for
  tool-agnostic or tool-adjacent agent rules, plus guidance on when distilled
  learning should land in rules versus AGENTS.md, docs, or playbooks.
created: 2026-04-11
status: draft
writer: AI
prompter: Hypercubed
---

# Rules in the scaffold

## Goal

Give adopters a clear, portable pattern for **normative agent instructions** that are not always best expressed only in `.agents/AGENTS.md` (for example file-scoped rules or product-native rule trees), without bloating the compiled knowledge layer.

## Scope

- Define where rules live in `scaffold/` (layout, naming, optional index).
- Document the decision boundary: rules vs `AGENTS.md` vs `repo-decisions.md` vs playbooks.
- Update maintainer sync or docs only as needed after scaffold changes (follow existing dual-tree conventions).

## Out of scope (for this plan)

- Changing vendor-specific formats beyond what the README already describes.
- Implementing scaffold changes in this iteration (per current constraint).

## Success criteria

- A consumer copying `scaffold/` knows where to add rules and how they relate to distillation.
- `learning-distill` (or successor) can classify lessons into the rules location without ambiguity.

## Notes

- Align with prior discussion: tool-native rules for glob/enforcement; `AGENTS.md` for portable repo-wide ops; rationale stays in `repo-decisions.md`.
