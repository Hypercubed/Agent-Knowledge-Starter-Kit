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
- [`.agents/playbooks/writing-integration-guides.md`](../playbooks/writing-integration-guides.md) — write user-facing tool integration guides without overstating unverified behavior.

Maintainer-only (this repo): [`.agents/skills/sync-scaffold-agents-skills/SKILL.md`](../skills/sync-scaffold-agents-skills/SKILL.md) — merge `scaffold/agents/` and `scaffold/skills/` into `.agents/agents/` and `.agents/skills/`.

## `.agents/docs/MAINTENANCE.md`
Maintenance schema and rules for this knowledge layer.

## `.agents/docs/log.md`
Append-only record of distillation and maintenance activity.

## Root install docs
[`INSTALL.md`](../../INSTALL.md) — agent-facing installation and merge checklist for adopting this starter kit into a target repository.

## Root integration guides (this repository)
[`docs/integrations/README.md`](../../docs/integrations/README.md) — per-tool wiring for Hermes, Cursor, and other planned guides (user-facing; not part of the copied `scaffold/` tree).
