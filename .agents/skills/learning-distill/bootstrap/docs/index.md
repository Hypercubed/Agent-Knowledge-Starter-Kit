# Knowledge Index

This file belongs in `.agents/docs/`.

Durable knowledge uses separate markdown files per topic: architectural decisions under [`decisions/`](decisions/index.md); recurring issues under [`troubleshooting/`](troubleshooting/index.md). See [MAINTENANCE.md](MAINTENANCE.md) for frontmatter and workflow rules.

## `.agents/AGENTS.md`

Compact instructions for future agents. Consult first for repo-wide operational guidance.

## `.agents/docs/decisions/`

Durable rationale, tradeoffs, and architectural choices (one markdown file per decision). Consult [index.md](decisions/index.md) when a rule needs explanation.

## `.agents/docs/troubleshooting/`

Recurring issue patterns, causes, fixes, and validation steps (one markdown file per pattern). Consult [index.md](troubleshooting/index.md) when debugging known classes of problems.

## `.agents/playbooks/`

Durable procedures live under `.agents/playbooks/` (sibling of `.agents/docs/`, not inside it).

- [`.agents/playbooks/README.md`](../playbooks/README.md)

## Portable kit skills (`.agents/skills/`)

Workflow definitions (each folder contains `SKILL.md`):

- [`task-closeout`](../skills/task-closeout/SKILL.md) — structured session bundles under `.agents/sessions/`.
- [`learning-distill`](../skills/learning-distill/SKILL.md) — distill bundles into durable `.agents/` knowledge.
- [`docs-lint`](../skills/docs-lint/SKILL.md) — periodic pass for duplication, drift, and index gaps.
- [`docs-search`](../skills/docs-search/SKILL.md) — search durable knowledge via a local index built from markdown.
- [`docs-compile`](../skills/docs-compile/SKILL.md) — optional regeneration of section `index.md` files under `.agents/docs/` and the docs-search cache.

## `.agents/docs/MAINTENANCE.md` and `log.md`

Maintenance schema: [MAINTENANCE.md](MAINTENANCE.md). Append-only audit: [log.md](log.md).
