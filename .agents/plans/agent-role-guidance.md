---
description: >
  Add concise guidance explaining when and how to use the scaffold's coding,
  learning, and lint agent role definitions from docs and skills.
created: 2026-04-12
status: planned
writer: AI
prompter: Hypercubed
---

# Agent role guidance

## Goal

Make the three scaffold agent roles discoverable and actionable without
turning the scaffold into an orchestration framework.

Readers should be able to answer:

- when to use the coding agent
- when to use the learning agent
- when to use the lint agent
- which skills belong to each role
- how the roles hand work to each other through session bundles and durable
  `.agents/` updates

## Current gap

`scaffold/agents/` defines three roles:

- `coding-agent.md` handles implementation, validation, and task closeout
- `learning-agent.md` distills completed session bundles into durable knowledge
- `lint-agent.md` maintains coherence of the durable knowledge layer

The scaffold docs and skills explain the knowledge model, bundle format, and
maintenance rules, but they do not explicitly teach adopters when these roles
should be invoked or how role responsibilities map to the skills.

## Proposed documentation updates

### `scaffold/docs/index.md`

Add `scaffold/agents/` to the knowledge index with a short description of each
role and links to the role files.

Keep this as a discovery aid, not a full lifecycle explanation.

### `scaffold/docs/MAINTENANCE.md`

Add an "Agent roles" section near the knowledge model or file roles section.

Cover:

- coding agent owns active implementation work and produces session bundles
- learning agent consumes one completed bundle and updates durable knowledge
- lint agent periodically audits durable knowledge for duplication,
  contradiction, staleness, and misplaced content
- source code changes belong to the coding agent, while learning and lint work
  should stay inside `.agents/`
- the handoff boundary is the session bundle under `.agents/sessions/`

### `scaffold/AGENTS.md`

Add a compact pointer under maintenance rules or before submitting changes:

- use `task-closeout` when implementation work produces meaningful reusable
  context
- use `learning-distill` after a closeout bundle is ready
- use `knowledge-lint` periodically or after several distillations

This should stay short so `.agents/AGENTS.md` remains high-signal.

### Skill descriptions

Update the three scaffold skills so their "Use when" descriptions mention the
agent role they support:

- `task-closeout` supports the coding agent's closeout handoff
- `learning-distill` is the learning agent's primary workflow
- `knowledge-lint` is the lint agent's primary workflow

Avoid duplicating the full role definitions inside every skill.

### Optional playbook

Consider adding a compact playbook such as
`scaffold/playbooks/agent-role-lifecycle.md` only if the maintenance doc becomes
too dense.

The playbook should show one normal flow:

1. coding agent performs work
2. coding agent writes a closeout bundle
3. learning agent distills durable lessons
4. lint agent later checks the knowledge layer

Prefer this playbook only if it replaces repeated lifecycle prose elsewhere.

## Scope

- Update scaffold files first because they are the published template.
- Mirror updates into `.agents/` only through the existing scaffold sync process
  if that remains the repo convention.
- Keep role guidance concise and procedural.
- Preserve the existing distinction between temporary session evidence and
  durable `.agents/` knowledge.

## Out of scope

- Adding new agent roles.
- Adding automation for spawning or selecting agents.
- Changing the session bundle schema.
- Rewriting the existing role files except for small clarifying links if needed.
- Adding product-specific examples unrelated to the scaffold lifecycle.

## Open questions

- Should `scaffold/agents/` be indexed as durable knowledge assets, or should
  the index remain focused only on `.agents/` runtime files?
- Should role guidance live entirely in `MAINTENANCE.md`, or should a separate
  playbook carry the end-to-end lifecycle example?
- Should the sync skill be updated so future scaffold-to-`.agents` updates
  explicitly mention agent role docs, or is the existing sync behavior enough?

## Success criteria

- A new adopter can identify the right role for implementation, distillation,
  and knowledge cleanup work.
- Each role points to the relevant skill without duplicating full skill
  procedures.
- The docs describe the handoff from coding to learning through a session bundle.
- The docs make clear that learning and lint agents do not modify source code.
- The added guidance stays compact enough that `.agents/AGENTS.md` remains a
  quick operational reference.
