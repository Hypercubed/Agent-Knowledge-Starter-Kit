# Knowledge Index

This file belongs in `.agents/docs/`.

Durable knowledge uses separate markdown files per topic: architectural decisions under [`decisions/`](decisions/index.md); recurring issues under [`troubleshooting/`](troubleshooting/index.md). Decision and troubleshooting entry files include minimal YAML frontmatter (`id`, `title`, `last_updated`).

## How to Navigate This Knowledge Layer

1. **Start here:** Read this index to understand the overall structure
2. **Check section indexes:** Each folder has an `index.md` with descriptions and tags for all entries
3. **Use docs-search:** For keyword/error searches: `python .agents/skills/docs-search/scripts/search-docs.py "query"`
4. **Read specific files:** Once you identify relevant entries from indexes or search results

**Example workflow:**
- Debugging? → Read [`troubleshooting/index.md`](troubleshooting/index.md) → Check Quick Reference → Find relevant pattern → Read full entry
- Architectural question? → Read [`decisions/index.md`](decisions/index.md) → Check Quick Reference → Read decision file
- General exploration? → Start with section indexes to see what's available

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

- [`.agents/playbooks/major-version-release.md`](../playbooks/major-version-release.md) — checklist for releasing a new major version of the kit.
- [`.agents/playbooks/generate-example.md`](../playbooks/generate-example.md) — generate a complete bootstrapped example folder for the kit.
- [`.agents/playbooks/pre-publish.md`](../playbooks/pre-publish.md) — run pre-publish checks and review warnings before publishing the starter kit.
- [`.agents/playbooks/writing-integration-guides.md`](../playbooks/writing-integration-guides.md) — write user-facing tool integration guides without overstating unverified behavior.

## Portable kit skills (`.agents/skills/`)

Workflow definitions shipped with the kit (each folder contains `SKILL.md`, often a `bootstrap/` tree for initialization-only copies into the repo, and sometimes an `assets/` folder for templates used at runtime):

- [`task-closeout`](../skills/task-closeout/SKILL.md) — structured session bundles under `.agents/sessions/`.
- [`learning-distill`](../skills/learning-distill/SKILL.md) — distill bundles into durable `.agents/` knowledge.
- [`docs-lint`](../skills/docs-lint/SKILL.md) — periodic pass for duplication, drift, and index gaps.
- [`docs-search`](../skills/docs-search/SKILL.md) — search durable `.agents/` knowledge via local index generation from markdown sources.
- [`docs-compile`](../skills/docs-compile/SKILL.md) — optional regeneration of durable section `index.md` files under `.agents/docs/` and the docs-search cache.

Maintainer-only (this repository):

- [`.agents/skills/generate-example/SKILL.md`](../skills/generate-example/SKILL.md) — generate a disposable consumer-path example structure (`metadata.internal: true`).

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
