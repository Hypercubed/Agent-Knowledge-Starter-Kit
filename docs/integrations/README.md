# Integration Guides

This directory contains user-facing guides for connecting specific tools to the Agent Knowledge Starter Kit.

## Available guides

- [Hermes](./hermes.md) — verified guidance for using Hermes with a repo that stores durable knowledge under `.agents/`
- [Cursor](./cursor.md) — project rules, `AGENTS.md`, and how to point Agent at `.agents/` without duplicating it

## Planned guides

These are tracked in `.agents/plans/add-integrations.md` and should be added only after they are verified against real tool behavior:

- OpenClaw
- Claude Code
- Copilot
- VS Code extensions

## Notes

- Integration guides belong in `docs/integrations/`, not under `.agents/`.
- Treat each guide as tool-specific setup and workflow guidance for humans.
- Keep repo-consumable durable knowledge in `.agents/`.
