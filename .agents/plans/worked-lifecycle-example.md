---
description: >
  Add a compact worked lifecycle example that shows how a task-closeout bundle becomes durable knowledge without duplicating this repository's structural example.


created: 2026-04-12
status: planned
writer: AI
prompter: Hypercubed
---

# Worked lifecycle example

## Goal

Add a small end-to-end example that demonstrates the knowledge loop:

1. a coding task completes
2. `task-closeout` writes a session bundle
3. `learning-distill` classifies candidate lessons
4. durable docs are updated
5. `.agents/docs/log.md` records the maintenance action

## Current decision

Do not implement this example in the current review-follow-up batch. The repository already demonstrates the structural layout through `example/.agents/` (generated full kit) and the maintainer `.agents/` tree, so the example should be designed carefully rather than added as extra narrative.

## Scope

- Decide whether the example belongs in `README.md`, `docs/architecture.md`, or `example/.agents/docs/`.
- Prefer connecting the example to `example/.agents/skills/task-closeout/example/task-bundle/` instead of inventing an unrelated scenario.
- Show the canonical identity model using the `task_id` field inside `summary.json`.
- Show classification destinations for at least:
  - `.agents/AGENTS.md`
  - `.agents/docs/troubleshooting/`
  - `.agents/docs/decisions/`
  - `.agents/playbooks/`
  - `.agents/docs/log.md`
- Keep the example compact enough that it helps adoption without becoming a tutorial.

## Out of scope

- Adding multiple examples.
- Adding automation or schema validation.
- Changing the existing sample bundle unless the example needs a small consistency fix.

## Success criteria

- A reader can understand the full closeout-to-distillation loop without inferring missing steps.
- The example reinforces that session bundles are temporary and durable lessons belong in reviewed `.agents/` files.
- The example does not blur the distinction between the published kit (`example/.agents/` after `generate-example`, or an adopter tree installed via skills) and this repository's maintainer `.agents/` tree.
