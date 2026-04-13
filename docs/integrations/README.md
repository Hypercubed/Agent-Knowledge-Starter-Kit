# Integration Guides

This directory contains user-facing guides for connecting specific tools to the Agent Knowledge Starter Kit.

## Available guides

- [Antigravity](./antigravity.md) — Persistent Context mapping, handling native planning artifacts, and leveraging kit memory as canonical storage
- [Hermes](./hermes.md) — verified guidance for using Hermes with a repo that stores durable knowledge under `.agents/`
- [OpenClaw](./openclaw.md) — native memory, startup files, session tools, automation, and how to keep `.agents/` as canonical repo knowledge
- [Cursor](./cursor.md) — project rules, `AGENTS.md`, and how to point Agent at `.agents/` without duplicating it
- [Codex](./codex.md) — `AGENTS.md`, repo-local `.agents/skills/`, sandbox permissions, and how Codex should use the kit
- [Kilo Code](./kilo-code.md) — `AGENTS.md`, `kilo.json`, thin `.kilo/` wiring, and how to keep `.agents/` as the shared source of truth
- [Claude Code](./claude-code.md) — `CLAUDE.md`, auto-memory vs kit docs, `.claude/commands/` vs `.agents/skills/`, and thin wiring without duplication
- [Gemini CLI](./gemini-cli.md) — `GEMINI.md`, `save_memory` vs kit docs, and orchestrating the Research-Strategy-Execution lifecycle with `.agents/`

## Planned guides

These are tracked in `.agents/plans/add-integrations.md` and should be added only after they are verified against real tool behavior:

- Copilot
- VS Code extensions

## Notes

- Integration guides belong in `docs/integrations/`, not under `.agents/`.
- Treat each guide as tool-specific setup and workflow guidance for humans.
- Keep repo-consumable durable knowledge in `.agents/`.
