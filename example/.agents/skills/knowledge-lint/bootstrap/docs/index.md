# Knowledge Index

This file belongs in `.agents/docs/`.

Durable knowledge uses separate markdown files per topic: architectural decisions under [`repo-decisions/`](repo-decisions/index.md); recurring issues under [`troubleshooting/`](troubleshooting/index.md). Each entry file includes minimal YAML frontmatter (`id`, `title`, `last_updated`).

## `.agents/AGENTS.md`

Compact instructions for future agents. Consult first for repo-wide operational guidance.

## `.agents/docs/repo-decisions/`

Durable rationale, tradeoffs, and architectural choices (one markdown file per decision). Consult [index.md](repo-decisions/index.md) when a rule needs explanation.

## `.agents/docs/troubleshooting/`

Recurring issue patterns, causes, fixes, and validation steps (one markdown file per pattern). Consult [index.md](troubleshooting/index.md) when debugging known classes of problems.

## `.agents/playbooks/`

Durable procedures for recurring workflows. In this layout, playbooks live under `.agents/playbooks/` (sibling of `.agents/docs/`, not inside it).

- [`.agents/playbooks/README.md`](../playbooks/README.md) — how playbooks differ from repo decisions, troubleshooting entries, and skills.

## Portable kit skills (`.agents/skills/`)

Workflow definitions shipped with the kit (each folder contains `SKILL.md` and often a `bootstrap/` tree for initialization):

- [`task-closeout`](../skills/task-closeout/SKILL.md) — structured session bundles under `.agents/sessions/`.
- [`learning-distill`](../skills/learning-distill/SKILL.md) — distill bundles into durable `.agents/` knowledge.
- [`knowledge-lint`](../skills/knowledge-lint/SKILL.md) — periodic pass for duplication, drift, and index gaps.

## `.agents/agents/`

Persona-style markdown for multi-agent workflows (optional for single-agent setups):

- [`.agents/agents/coding-agent.md`](../agents/coding-agent.md)
- [`.agents/agents/learning-agent.md`](../agents/learning-agent.md)
- [`.agents/agents/lint-agent.md`](../agents/lint-agent.md)

## `.agents/docs/MAINTENANCE.md`

Maintenance schema and rules for this knowledge layer.

## `.agents/docs/log.md`

Append-only record of distillation and maintenance activity.

## Repository architecture and install (project root)

When this kit lives at the **repository root** of your project, optional pointers:

- [`docs/architecture.md`](../../docs/architecture.md) — design principles and lifecycle (create these paths in your repo if you use them).
- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)

## Root integration guides (optional)

[`docs/integrations/README.md`](../../docs/integrations/README.md) — per-tool wiring guides (user-facing; not part of the copied `.agents/` tree unless you add them).
