# Integration Guides

This directory contains user-facing guides for connecting specific tools to the Agent Knowledge Starter Kit.

Start with [Integration Patterns](./patterns.md) to choose the right wiring model. The product pages are quick references for exact filenames, setup snippets, caveats, and verification notes.

Preferred path: run the two lanes in order (EXECUTE lane) — `node .agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs [repo-root]` for globals, then `node .agents/skills/aksk-init/scripts/bootstrap-repo.mjs [repo-root]` for per-repo setup (routing-block attachment, curation-contract attachment, and per-agent spread: `openwiki integrations install <codex|claude|opencode>` vs headless `openwiki --init -p` / `--update -p`) with receipt-partitioned installs. The per-tool guides below are the INSTRUCT-lane/manual fallback for when local execution is not possible (they remain verified against real tool behavior but are no longer the primary wiring path). Do not hardcode agent skill paths such as `~/.agents/skills/` or `~/.codex/skills/` — derive targets from `openwiki integrations install` and `openwiki integrations list` (see `aksk-bootstrap` design D3/D4).

Before wiring a tool manually, install shared kit skills in the target repo with `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit` and follow [`INSTALL.md`](../../INSTALL.md).

## Choose Your Pattern

- [Root `AGENTS.md` native or compatible](./patterns.md#root-agentsmd-native-or-compatible): Codex, OpenCode, Kilo Code, Warp, OpenClaw
- [Tool-specific bootstrap file](./patterns.md#tool-specific-bootstrap-file): Claude Code, Gemini CLI
- [Rules-based IDE wiring](./patterns.md#rules-based-ide-wiring): Cursor, GitHub Copilot
- [Persistent memory and runtime boundary](./patterns.md#persistent-memory-and-runtime-boundary): Hermes, Antigravity, OpenClaw, Agentic Sandbox

## Available guides

- [Integration Patterns](./patterns.md) - shared model and comparison matrix
- [Agentic Sandbox](./agentic-sandbox.md) - Full filesystem/shell access, tool-based skill execution, and script dependencies
- [Antigravity](./antigravity.md) - Persistent Context, planning artifacts, and explicit session export
- [Claude Code](./claude-code.md) - `CLAUDE.md`, auto-memory, command wrappers, and kit routing
- [Codex](./codex.md) - `AGENTS.md`, repo-local `.agents/skills/`, sandbox caveats, and kit routing
- [Copilot](./copilot.md) - `.github/copilot-instructions.md`, VS Code workspace context, and kit routing
- [Cursor](./cursor.md) - `.cursor/rules/`, `AGENTS.md`, and rules-based wiring
- [Gemini CLI](./gemini-cli.md) - `GEMINI.md`, `save_memory`, and repo skill routing
- [Hermes](./hermes.md) - Hermes memory, session recall, skill namespace caveats, and repo skill files
- [Kilo Code](./kilo-code.md) - `AGENTS.md`, `kilo.json`, `.kilo/` wrappers, and kit routing
- [OpenClaw](./openclaw.md) - startup files, memory, sessions, automation, and kit boundaries
- [OpenSpec](./openspec.md) - OpenSpec integration for AKSK knowledge persistence.
- [OpenCode](./opencode.md) - `AGENTS.md`, `opencode.json`, `.opencode/` wrappers, and native skill discovery
- [Warp](./warp.md) - project/global rules, skills, Oz workflows, and kit routing
- [Zo Computer](./zo-computer.md) - Zo-specific skill discovery, knowledge search, and closeout workflow

## Planned guides

The following integrations should be added only after they are verified against real tool behavior:

- VS Code extensions

## Notes

- Integration guides belong in `docs/integrations/`, not under `.agents/`.
- Treat each guide as tool-specific setup and workflow guidance for humans.
- Keep repo-consumable durable knowledge in `.agents/`.
