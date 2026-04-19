# Knowledge Index

This file belongs in `.agents/docs/`.

## `.agents/AGENTS.md`

Compact instructions for future agents. Consult first for repo-wide operational guidance.

## `.agents/docs/repo-decisions.md`

Durable rationale, tradeoffs, and architectural choices. Consult when a rule needs explanation.

## `.agents/docs/troubleshooting.md`

Recurring issue patterns, causes, fixes, and validation steps. Consult when debugging known classes of problems.

## `.agents/playbooks/`

Durable procedures for recurring workflows. In this layout, playbooks live under `.agents/playbooks/` (sibling of `.agents/docs/`, not inside it).

Examples (this repo):

- [`.agents/playbooks/maintainer-adoption-closeout-distill.md`](../playbooks/maintainer-adoption-closeout-distill.md) — adopt kit, run closeouts, distill.
- [`.agents/playbooks/maintainer-install-smoke-test.md`](../playbooks/maintainer-install-smoke-test.md) — validate consumer install flow in `_test-target-repo` without `--all`.
- [`.agents/playbooks/pre-publish.md`](../playbooks/pre-publish.md) — run pre-publish checks and review warnings before publishing the starter kit.
- [`.agents/playbooks/writing-integration-guides.md`](../playbooks/writing-integration-guides.md) — write user-facing tool integration guides without overstating unverified behavior.

Maintainer-only (this repo):

- [`.agents/skills/sync-scaffold-agents-skills/SKILL.md`](../skills/sync-scaffold-agents-skills/SKILL.md) — run `npx skills add . -y` to sync shared skills from `scaffold/skills/` into `.agents/skills/`.
- [`.agents/skills/maintainer-install-smoke-test/SKILL.md`](../skills/maintainer-install-smoke-test/SKILL.md) — run a disposable consumer-path install smoke test in `_test-target-repo` without `--all`.

## `.agents/docs/MAINTENANCE.md`

Maintenance schema and rules for this knowledge layer.

## `.agents/docs/log.md`

Append-only record of distillation and maintenance activity.

## `.agents/plans/`

Upcoming work, architectural research, and active task plans. Unlisted from `MAINTENANCE.md` originally but heavily used for agent workflow planning (e.g. `add-knowledge-search.md`).

## Root install docs

[`INSTALL.md`](../../INSTALL.md) — agent-facing installation and merge checklist for adopting this starter kit into a target repository.

## Root integration guides (this repository)

[`docs/integrations/README.md`](../../docs/integrations/README.md) — per-tool wiring for Antigravity, Claude Code, Codex, Cursor, Gemini CLI, Hermes, Kilo Code, OpenClaw, OpenCode, and Warp (user-facing; not part of the copied `scaffold/` tree).
