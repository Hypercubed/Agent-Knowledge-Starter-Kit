---
id: agent-role-guidance
title: Agent role guidance
last_updated: 2026-04-22
description: 'Document when and how to use coding, learning, and lint agent roles with the kit.

  '
tags:
- agents
- documentation
- workflow
status: draft
kind: initiative
consumer_portable: false
author_kind: ai
prompter: Hypercubed
---

# Agent role guidance

## Goal

Make the three kit agent roles discoverable and actionable without turning the kit into an orchestration framework.

Readers should be able to answer:

- when to use the coding agent
- when to use the learning agent
- when to use the lint agent
- which skills belong to each role
- how the roles hand work to each other through session bundles and durable `.agents/` updates

## Current gap

The kit is **skills-first**: it no longer ships a separate `.agents/agents/` persona tree. Role boundaries (coding vs learning vs lint) are described at a high level in root [`docs/architecture.md`](../../../docs/architecture.md) and in `.agents/AGENTS.md`, but adopters still need a compact map from **role intent** to **which `SKILL.md` to run** and when.

The kit docs and skills explain the knowledge model, bundle format, and maintenance rules, but they do not always spell out when to invoke closeout vs distillation vs lint as distinct passes.

## Proposed documentation updates

### `example/.agents/docs/index.md` (or consumer `.agents/docs/index.md`)

Ensure the portable skills section clearly ties each maintenance skill to the workflow phase it supports (closeout, distill, lint), without implying a separate on-disk `agents/` directory.

### `example/.agents/docs/MAINTENANCE.md`

Add an "Agent roles" section near the knowledge model or file roles section.

Cover:

- coding agent owns active implementation work and produces session bundles
- learning agent consumes one completed bundle and updates durable knowledge
- lint agent periodically audits durable knowledge for duplication, contradiction, staleness, and misplaced content
- source code changes belong to the coding agent, while learning and lint work should stay inside `.agents/`
- the handoff boundary is the session bundle under `.agents/sessions/`

### `example/.agents/AGENTS.md`

Add a compact pointer under maintenance rules or before submitting changes:

- use `task-closeout` when implementation work produces meaningful reusable context
- use `learning-distill` after a closeout bundle is ready
- use `docs-lint` periodically or after several distillations

This should stay short so `.agents/AGENTS.md` remains high-signal.

### Skill descriptions

Update the three maintenance skills so their "Use when" descriptions mention the agent role they support:

- `task-closeout` supports the coding agent's closeout handoff
- `learning-distill` is the learning agent's primary workflow
- `docs-lint` is the lint agent's primary workflow

Avoid duplicating the full role definitions inside every skill.

### Optional playbook

Consider adding a compact playbook such as `example/.agents/playbooks/agent-role-lifecycle.md` only if the maintenance doc becomes too dense.

The playbook should show one normal flow:

1. coding agent performs work
2. coding agent writes a closeout bundle
3. learning agent distills durable lessons
4. lint agent later checks the knowledge layer

Prefer this playbook only if it replaces repeated lifecycle prose elsewhere.

## Scope

- Update `example/.agents/` (via `generate-example` / maintainer workflow) when the change belongs in the published kit snapshot.
- Update root `.agents/` when the change belongs in every adopter’s portable contract (this repo no longer maintains a separate `scaffold/` sync tree).
- Keep role guidance concise and procedural.
- Preserve the existing distinction between temporary session evidence and durable `.agents/` knowledge.

## Out of scope

- Adding new agent roles.
- Adding automation for spawning or selecting agents.
- Changing the session bundle schema.
- Reintroducing a portable `.agents/agents/` markdown tree (superseded by skills + `AGENTS.md` + architecture).
- Adding product-specific examples unrelated to the kit lifecycle.

## Open questions

- Should role guidance live entirely in `MAINTENANCE.md`, or should a separate playbook carry the end-to-end lifecycle example?
- Is README + INSTALL + `docs/index.md` enough for discovery, or should each maintenance skill’s `SKILL.md` open with a one-line “role” sentence?

## Success criteria

- A new adopter can identify the right role for implementation, distillation, and knowledge cleanup work.
- Each role points to the relevant skill without duplicating full skill procedures.
- The docs describe the handoff from coding to learning through a session bundle.
- The docs make clear that learning and lint agents do not modify source code.
- The added guidance stays compact enough that `.agents/AGENTS.md` remains a quick operational reference.
