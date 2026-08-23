# Kilo Code Integration Quick Reference

Use this page for Kilo-specific wiring. For the shared integration model, read [Integration Patterns](./patterns.md).

Based on Kilo's documented configuration and discovery model plus repo-local config locations used by this starter repository. Re-check Kilo docs after upgrades.

## Setup

1. Install starter skills in the target repo with `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit`, then run each installed skill's initialization from its `SKILL.md` (see [`INSTALL.md`](../../INSTALL.md)).
2. Attach the AKSK routing note to root `AGENTS.md` (`attach_section.mjs . AGENTS.md`) so Kilo reads `.agents/AGENTS.md` and `openwiki/index.md`.
3. Keep durable repo policy in `.agents/`, not in `.kilo/instructions.md` or agent prompts.
4. Add `.kilo/` files only when Kilo-native commands, agents, or config add real convenience.
5. Keep personal defaults in global Kilo config; commit only repo-specific wiring.

Attach the marker-delimited `AKSK:ROUTING` section rather than hand-writing this file:

```bash
node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs . AGENTS.md
```

The attachment appends the section below any existing content, refreshes it in place when the kit's template changes, and is idempotent on re-run. Add tool-specific notes outside the markers - never edit between them.

Example thin command:

```markdown
---
description: Close a task using the repo knowledge workflow
---

Read `.agents/skills/task-closeout/SKILL.md` and follow it exactly. Keep temporary evidence under `.agents/sessions/`.
```

## Discovery and Config

| Mechanism      | Location                                                              | Use                                   |
| -------------- | --------------------------------------------------------------------- | ------------------------------------- |
| Project config | `kilo.json`, `.kilo/kilo.json`                                        | Repo-scoped Kilo settings             |
| Commands       | `.kilo/command/*.md`                                                  | Slash commands and thin task routing  |
| Agents         | `.kilo/agent/*.md`                                                    | Kilo-native personas and permissions  |
| Skills         | `.kilo/skill/*/SKILL.md`, `.kilo/skills/*/SKILL.md`, configured paths | Kilo-native skill registry            |
| Instructions   | root `AGENTS.md`, `.kilo/instructions.md`, configured globs           | Always-on or scoped instruction files |

## Kilo-Specific Caveats

- Do not assume `.agents/AGENTS.md` is automatically repo-wide in Kilo. Route from root `AGENTS.md`.
- Kilo-native commands, agents, skills, and instructions can easily duplicate `.agents/` policy. Keep `.kilo/` as wiring.
- Project and global Kilo config may merge. Commit only shared repo behavior, not personal defaults.

## Workflow

1. Start from the repo root.
2. Read root `AGENTS.md`, then `.agents/AGENTS.md` and `openwiki/index.md`.
3. Use `.kilo/command/*.md` and `.kilo/agent/*.md` as convenience wrappers only.
4. Keep raw evidence in `.agents/sessions/`, then distill stable lessons into `.agents/`.

## References

- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [Integration Patterns](./patterns.md)
