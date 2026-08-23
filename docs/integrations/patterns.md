# Integration Patterns

Use this guide before opening a product-specific page. Most integrations are the same shape: keep the tool's native setup thin, and keep durable repository knowledge under `.agents/`.

The product pages in this directory cover exact filenames, snippets, caveats, and verification notes. This page covers the shared decisions so they are not repeated in every guide.

## The Core Pattern

Keep one source of truth:

- **Tool-native files** are wiring: root bootstrap files, project rules, command wrappers, local config, and runtime preferences.
- **`.agents/` files** are durable repo knowledge: project guidance, decisions, troubleshooting, playbooks, portable skills, and session bundles.

Do not copy long-lived repo policy into every tool's native config. Point the tool at `.agents/AGENTS.md`, `openwiki/index.md`, `.agents/playbooks/`, and `.agents/skills/` instead.

## Adopting the kit

In a target repository, install shared skills with `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit`, then follow each installed skill's **Skill initialization** in its `SKILL.md`. See [`INSTALL.md`](../../INSTALL.md) for the full merge checklist.

## Pattern Groups

### Root `AGENTS.md` Native or Compatible

Tools: [Codex](./codex.md), [OpenCode](./opencode.md), [Kilo Code](./kilo-code.md), [Warp](./warp.md), [OpenClaw](./openclaw.md)

Use a short root `AGENTS.md` as the repo entrypoint:

```markdown
# AGENTS.md

This repo uses the Agent Knowledge Starter Kit.

- Read `.agents/AGENTS.md` for durable repo guidance.
- Use `openwiki/index.md` for decisions, troubleshooting, and architecture; `.agents/playbooks/` for procedures.
- Treat `.agents/skills/*/SKILL.md` as canonical repo-local workflows.
- Keep temporary task evidence in `.agents/sessions/`; promote only durable lessons back into `.agents/`.
```

Product-specific config such as `opencode.json`, `kilo.json`, Warp global rules, or OpenClaw startup/memory files should only add runtime behavior or point back to the canonical repo files.

### Tool-Specific Bootstrap File

Tools: [Claude Code](./claude-code.md), [Gemini CLI](./gemini-cli.md)

Use the tool's root instruction file as a thin router:

- Claude Code: root `CLAUDE.md`
- Gemini CLI: root `GEMINI.md`

The bootstrap should say where the real repo knowledge lives. Native memory such as Claude auto-memory or Gemini `save_memory` is user-local and should not replace the curated wiki knowledge.

### Rules-Based IDE Wiring

Tools: [Cursor](./cursor.md), [GitHub Copilot](./copilot.md)

Cursor project rules and Copilot instruction files are useful wiring. Keep them short: reference `.agents/` paths instead of pasting long policy into rule bodies or instruction files.

This pattern should also fit future rules-based IDE guides such as VS Code extensions.

### Persistent Memory and Runtime Boundary

Tools: [Hermes](./hermes.md), [Antigravity](./antigravity.md), [OpenClaw](./openclaw.md), [Agentic Sandbox](./agentic-sandbox.md)

Persistent assistants may have private memory, session recall, artifacts, automation, or runtime skills. Use those systems for local continuity and orchestration, not as the only copy of repo policy.

At task boundaries, export durable evidence into `.agents/sessions/<folder>/` and run a later learning pass to promote stable lessons into `.agents/AGENTS.md`, the curated wiki trees, or `.agents/playbooks/`.

## Quick Matrix

| Tool        | Bootstrap                                     | Native config / storage                                     | Native memory or artifacts                             | Skill behavior                                                     | Primary caveat                                                  |
| ----------- | --------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| Antigravity | Optional root `AGENTS.md`                     | Agent-private app data                                      | Knowledge Items, conversation logs, planning artifacts | Prompt it to read repo skill files                                 | Export local artifacts into `.agents/sessions/` for other tools |
| Claude Code | Root `CLAUDE.md`, also reads root `AGENTS.md` | `.claude/commands/`, `.claude/settings.json`                | User-local auto-memory                                 | `.claude/commands/` can wrap `.agents/skills/`                     | Do not use auto-memory as repo docs                             |
| Codex       | Root `AGENTS.md`                              | `~/.codex/config.toml`, rules, connectors                   | Session-local plus configured tools                    | Discovers repo `.agents/skills/`                                   | `.agents/AGENTS.md` is not repo-wide unless routed from root    |
| Copilot     | `.github/copilot-instructions.md`             | VS Code workspace settings (`.vscode/settings.json`)        | Conversation-scoped context (not persistent)           | Explicitly prompt to read `.agents/skills/` files                  | Nested `.agents/` files not auto-visible; use bootstrap routing |
| Cursor      | `.cursor/rules/` and/or root `AGENTS.md`      | Project/User/Team Rules                                     | Product context, not repo durable storage              | Treat `.agents/skills/` as files to open                           | Avoid duplicating long policy in `.cursor/rules/`               |
| Gemini CLI  | Root `GEMINI.md`                              | `.gemini/`                                                  | `save_memory(scope="project")` is user-local           | Activate native skills or explicitly read repo skill files         | Keep `GEMINI.md` as routing, not the canonical policy file      |
| Hermes      | Root `AGENTS.md` if present                   | Hermes runtime and skill store                              | Memory and session recall                              | Hermes skills and repo skills are separate namespaces              | Read `.agents/skills/*/SKILL.md` from disk for repo workflows   |
| Kilo Code   | Root `AGENTS.md`                              | `kilo.json`, `.kilo/command/`, `.kilo/agent/`               | Product/runtime dependent                              | Kilo-native skills are separate from repo skills                   | Keep `.kilo/` as wiring only                                    |
| OpenClaw    | Root `AGENTS.md` plus startup files           | `SOUL.md`, `USER.md`, `MEMORY.md`, automation               | Memory, sessions, heartbeat, cron                      | Native and repo-local skill layers can overlap                     | Do not move repo policy into OpenClaw memory or automation text |
| OpenCode    | Root `AGENTS.md`                              | `opencode.json`, `.opencode/agents/`, `.opencode/commands/` | Product/runtime dependent                              | Can load `.agents/skills/` natively                                | Keep commands and agents as convenience wrappers                |
| Warp        | Root `AGENTS.md` or `WARP.md`                 | Warp Drive rules, slash commands, Oz                        | Local/cloud agent context                              | Discovers supported skill directories, including `.agents/skills/` | `WARP.md` can take priority over `AGENTS.md`                    |
| Agentic Sandbox | Root `AGENTS.md`                          | Shell, filesystem, and native tools                         | Volatile sandbox environment                           | Execute `SKILL.md` via tool calls or run scripts directly          | Requires dependencies (PyYAML) for scripted skills              |

## Session Export Rule

Native memory is useful during work, but `.agents/sessions/` is the shared task boundary. A closeout bundle should capture the important commands, changed files, validation, and learning candidates so another tool can distill durable knowledge later.

Keep `.agents/sessions/` temporary and usually gitignored. Commit the promoted durable changes in `.agents/AGENTS.md`, the curated wiki trees, and `.agents/playbooks/`.
