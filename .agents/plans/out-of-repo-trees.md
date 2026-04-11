---
description: >
  Document using out-of-repo knowledge trees (for example ~/.agents) for
  personal or org overlays, including precedence versus in-repo .agents/ and
  what must remain in the repository for teammates and CI.
created: 2026-04-11
status: draft
writer: AI
prompter: Hypercubed
---

# Guidance for out-of-repo trees

## Goal

Let teams and individuals use **secondary roots** (such as `~/.agents/` or a managed org directory) for preferences and policy that should not be committed, without breaking the mental model of the compiled repo layer.

## Scope

- Document recommended directory shape for an overlay (mirror or subset of in-repo layout).
- Define **precedence**: repo vs user vs org when instructions conflict.
- List **must stay in-repo** items (build/test truth, shared conventions, anything CI needs).
- Security hygiene: no secrets in either tree; pointers to env/vault only.

## Out of scope (for this plan)

- Implementing tool-specific wiring for every editor (link patterns only).
- Changing scaffold in this iteration.

## Success criteria

- README or `scaffold/docs/` gives a single authoritative section adopters can copy.
- Skills or agents that should “read repo first, overlay second” can cite one short paragraph.

## Notes

- Align with portable kit philosophy: in-repo `.agents/` remains canonical for the project; overlays are optional and product-specific registration stays the adopter’s responsibility.
