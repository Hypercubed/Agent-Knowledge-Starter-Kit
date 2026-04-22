---
description: >
  Extend the distributable kit (published `.agents/` layout, e.g. example/.agents/) with a documented place for tool-agnostic or tool-adjacent agent rules, plus guidance on when distilled learning should land in rules versus AGENTS.md, docs, or playbooks.


created: 2026-04-11
status: draft
writer: AI
prompter: Hypercubed
---

# Rules in the published kit

## Goal

Give adopters a clear, portable pattern for **normative agent instructions** that are not always best expressed only in `.agents/AGENTS.md` (for example file-scoped rules or product-native rule trees), without bloating the compiled knowledge layer.

## Scope

- Define where rules live in the consumer `.agents/` tree (layout, naming, optional index); use `example/.agents/` as the concrete reference once generated.
- Document the decision boundary: rules vs `AGENTS.md` vs `decisions/` vs playbooks.
- Update maintainer docs or `generate-example` only as needed after kit layout changes (follow single-tree conventions in `.agents/docs/decisions/`).

## Out of scope (for this plan)

- Changing vendor-specific formats beyond what the README already describes.
- Implementing layout changes in this iteration (per current constraint).

## Success criteria

- A consumer installing or copying the kit knows where to add rules and how they relate to distillation.
- `learning-distill` (or successor) can classify lessons into the rules location without ambiguity.

## Notes

- Align with prior discussion: tool-native rules for glob/enforcement; `AGENTS.md` for portable repo-wide ops; rationale stays in `.agents/docs/decisions/`.
