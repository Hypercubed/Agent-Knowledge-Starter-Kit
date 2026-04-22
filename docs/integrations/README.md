# Integration Guides

This directory contains user-facing guides for connecting specific tools to the Agent Knowledge Starter Kit.

Start with [Integration Patterns](./patterns.md) to choose the right wiring model. The product pages are quick references for exact filenames, setup snippets, caveats, and verification notes.

Before wiring a tool, install shared kit skills in the target repo with `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit` and follow [`INSTALL.md`](../../INSTALL.md).

## Choose Your Pattern

- [Root `AGENTS.md` native or compatible](./patterns.md#root-agentsmd-native-or-compatible): Codex, OpenCode, Kilo Code, Warp, OpenClaw
- [Tool-specific bootstrap file](./patterns.md#tool-specific-bootstrap-file): Claude Code, Gemini CLI
- [Rules-based IDE wiring](./patterns.md#rules-based-ide-wiring): Cursor, GitHub Copilot
- [Persistent memory and runtime boundary](./patterns.md#persistent-memory-and-runtime-boundary): Hermes, Antigravity, OpenClaw

## Available guides

- [Integration Patterns](./patterns.md) - shared model and comparison matrix
- [Antigravity](./antigravity.md) - Persistent Context, planning artifacts, and explicit session export
- [Claude Code](./claude-code.md) - `CLAUDE.md`, auto-memory, command wrappers, and kit routing
- [Codex](./codex.md) - `AGENTS.md`, repo-local `.agents/skills/`, sandbox caveats, and kit routing
- [Copilot](./copilot.md) - `.github/copilot-instructions.md`, VS Code workspace context, and kit routing
- [Cursor](./cursor.md) - `.cursor/rules/`, `AGENTS.md`, and rules-based wiring
- [Gemini CLI](./gemini-cli.md) - `GEMINI.md`, `save_memory`, and repo skill routing
- [Hermes](./hermes.md) - Hermes memory, session recall, skill namespace caveats, and repo skill files
- [Kilo Code](./kilo-code.md) - `AGENTS.md`, `kilo.json`, `.kilo/` wrappers, and kit routing
- [OpenClaw](./openclaw.md) - startup files, memory, sessions, automation, and kit boundaries
- [OpenCode](./opencode.md) - `AGENTS.md`, `opencode.json`, `.opencode/` wrappers, and native skill discovery
- [Warp](./warp.md) - project/global rules, skills, Oz workflows, and kit routing
- [Zo Computer](./zo-computer.md) - Zo-specific skill discovery, docs-search, and closeout workflow

## Planned guides

These are tracked in `.agents/plans/add-integrations.md` and should be added only after they are verified against real tool behavior:

- VS Code extensions

## Notes

- Integration guides belong in `docs/integrations/`, not under `.agents/`.
- Treat each guide as tool-specific setup and workflow guidance for humans.
- Keep repo-consumable durable knowledge in `.agents/`.
