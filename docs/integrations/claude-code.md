# Claude Code Integration Quick Reference

Use this page for Claude Code-specific wiring. For the shared integration model, read [Integration Patterns](./patterns.md).

Written and verified against Claude Code behavior in this repository on April 12, 2026. Re-check Anthropic documentation after Claude Code updates, especially around `CLAUDE.md` discovery and custom command formats.

## Setup

1. Install starter skills in the target repo with `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit`, then run each installed skill's initialization from its `SKILL.md` (see [`INSTALL.md`](../../INSTALL.md)).
2. Add a short root `CLAUDE.md` that routes Claude Code into `.agents/`.
3. Keep durable repo policy in `.agents/`, not in `CLAUDE.md` or auto-memory.
4. Keep personal preferences in `~/.claude/CLAUDE.md`.
5. Add `.claude/commands/` only as thin wrappers around repo-local skills or playbooks.

```markdown
# CLAUDE.md

This repo uses the Agent Knowledge Starter Kit.

- Read `.agents/AGENTS.md` for durable repo guidance.
- Use `.agents/docs/index.md` to find decisions, troubleshooting, and playbooks.
- For task closeout, follow `.agents/skills/task-closeout/SKILL.md`.
- Keep temporary task evidence in `.agents/sessions/`; promote only durable lessons back into `.agents/`.
```

Optional command wrapper:

```markdown
Read and follow `.agents/skills/task-closeout/SKILL.md`. Write the output bundle to `.agents/sessions/<timestamp>-<slug>/`.
```

## Discovery and Config

| Mechanism               | Location                                           | Use                                  |
| ----------------------- | -------------------------------------------------- | ------------------------------------ |
| Primary instructions    | root and parent `CLAUDE.md`, `~/.claude/CLAUDE.md` | Session-start instructions           |
| Additional instructions | root `AGENTS.md`                                   | Additional agent instructions        |
| Commands                | `.claude/commands/*.md`, `~/.claude/commands/*.md` | Custom slash commands                |
| Settings                | `.claude/settings.json`, `~/.claude/settings.json` | Hooks, MCP config, behavior settings |
| Auto-memory             | `~/.claude/projects/<project>/memory/`             | User-local cross-session memory      |

## Claude-Specific Caveats

- Claude Code does not automatically load `.agents/AGENTS.md`; route from root `CLAUDE.md`.
- Auto-memory is private to the user and outside Git. Promote shared lessons into `.agents/docs/`.
- `.claude/commands/` and `.agents/skills/` are separate registries. Command files should point at repo skills, not copy them.
- Do not commit `.claude/settings.local.json` or credential-bearing local config.

## Workflow

1. Start Claude Code in the repo.
2. Let `CLAUDE.md` route into `.agents/`.
3. Use command wrappers or explicit prompts to follow `.agents/skills/*/SKILL.md`.
4. Keep durable updates under `.agents/` and local preferences under `~/.claude/`.

## References

- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [Integration Patterns](./patterns.md)
