---
id: out-of-repo-trees
title: Guidance for out-of-repo knowledge trees
last_updated: 2026-04-22
description: 'Document overlays such as ~/.agents for personal or org policy and precedence versus in-repo .agents/.

  '
tags:
- installation
- architecture
- agents
status: draft
kind: initiative
consumer_portable: false
author_kind: ai
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
- Changing the generated `example/` kit layout in this iteration (unless a tiny doc-only pointer is needed).

## Success criteria

- README, `INSTALL.md`, or `docs/` gives a single authoritative section adopters can copy (the repository no longer ships a parallel `scaffold/` tree; use root docs and `example/.agents/docs/` only if the guidance belongs in the copied kit).
- Skills or agents that should “read repo first, overlay second” can cite one short paragraph.

## Notes

- Align with portable kit philosophy: in-repo `.agents/` remains canonical for the project; overlays are optional and product-specific registration stays the adopter’s responsibility.

## Global skill installs vs overlay trees

This plan is about optional **knowledge overlays** (extra markdown trees such as a personal `~/.agents/`), not about where the Skills CLI stores skill **definitions**. The Skills CLI (for example `npx skills add`) may install skills under a user or global path depending on the product and flags; that is separate from the compiled repo layer under the project.

For this kit, durable output and session bundles should remain under the **repository’s** `.agents/` when work runs in that repo. `task-closeout`, `learning-distill`, and `knowledge-lint` are written to use `./.agents/` relative to the project. No extra instructions are required for global skill installs as long as the agent uses the repo as the working directory and those paths are honored. Add troubleshooting only if a specific product is observed writing kit output outside the repo.
