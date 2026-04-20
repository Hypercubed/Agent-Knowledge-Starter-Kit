# Knowledge Index

This file belongs in `.agents/docs/`.

Durable knowledge uses separate markdown files per topic: architectural decisions under [`decisions/`](decisions/index.md); recurring issues under [`troubleshooting/`](troubleshooting/index.md). Each entry file includes minimal YAML frontmatter (`id`, `title`, `last_updated`).

## `.agents/AGENTS.md`

Compact instructions for future agents. Consult first for repo-wide operational guidance.

## `.agents/docs/decisions/`

Durable rationale, tradeoffs, and architectural choices (one markdown file per decision). Consult [index.md](decisions/index.md) when a rule needs explanation.

## `.agents/docs/troubleshooting/`

Recurring issue patterns, causes, fixes, and validation steps (one markdown file per pattern). Consult [index.md](troubleshooting/index.md) when debugging known classes of problems.

## `.agents/playbooks/`

Durable procedures for recurring workflows. In this layout, playbooks live under `.agents/playbooks/` (sibling of `.agents/docs/`, not inside it).

- [`.agents/playbooks/README.md`](../playbooks/README.md) — how playbooks differ from repo decisions, troubleshooting entries, and skills.

Examples (this repo):

- [`.agents/playbooks/generate-example.md`](../playbooks/generate-example.md) — generate a complete bootstrapped example folder for the kit.
- [`.agents/playbooks/pre-publish.md`](../playbooks/pre-publish.md) — run pre-publish checks and review warnings before publishing the starter kit.
- [`.agents/playbooks/docs-compile.md`](../playbooks/docs-compile.md) — refresh derived docs indexes and the maintainer docs-search cache.
- [`.agents/playbooks/writing-integration-guides.md`](../playbooks/writing-integration-guides.md) — write user-facing tool integration guides without overstating unverified behavior.

## Portable kit skills (`.agents/skills/`)

Workflow definitions shipped with the kit (each folder contains `SKILL.md` and often a `bootstrap/` tree for initialization):

- [`task-closeout`](../skills/task-closeout/SKILL.md) — structured session bundles under `.agents/sessions/`.
- [`learning-distill`](../skills/learning-distill/SKILL.md) — distill bundles into durable `.agents/` knowledge.
- [`knowledge-lint`](../skills/knowledge-lint/SKILL.md) — periodic pass for duplication, drift, and index gaps.

Maintainer-only (this repository):

- [`.agents/skills/generate-example/SKILL.md`](../skills/generate-example/SKILL.md) — generate a disposable consumer-path example structure (`metadata.internal: true`).
- [`.agents/skills/docs-search/SKILL.md`](../skills/docs-search/SKILL.md) — search `.agents/docs/` via a local index (`metadata.internal: true`).
- **Planning / roadmaps** (under `.agents/plans/`, not part of the portable consumer kit): [wiki-system.md](../plans/wiki-system.md), [repo-centric-wiki-tooling.md](../plans/repo-centric-wiki-tooling.md), [add-integrations.md](../plans/add-integrations.md).

## `.agents/agents/`

Persona-style markdown for multi-agent workflows (optional for single-agent setups):

- [`.agents/agents/coding-agent.md`](../agents/coding-agent.md)
- [`.agents/agents/learning-agent.md`](../agents/learning-agent.md)
- [`.agents/agents/lint-agent.md`](../agents/lint-agent.md)

## `.agents/docs/MAINTENANCE.md`

Maintenance schema and rules for this knowledge layer.

## `.agents/docs/log.md`

Append-only record of distillation and maintenance activity.

## Repository architecture (root docs)

[`docs/architecture.md`](../../docs/architecture.md) — design principles, lifecycle, layout, and how closeout, distillation, and lint fit together.

## Root readme and install

[`README.md`](../../README.md) — kit overview and maintenance loop diagram.

[`INSTALL.md`](../../INSTALL.md) — agent-facing installation and merge checklist for adopting this starter kit into a target repository.

## Root integration guides (this repository)

[`docs/integrations/README.md`](../../docs/integrations/README.md) — per-tool wiring for Antigravity, Claude Code, Codex, Cursor, Gemini CLI, Hermes, Kilo Code, OpenClaw, OpenCode, and Warp (user-facing; not part of the copied `.agents/` tree).
