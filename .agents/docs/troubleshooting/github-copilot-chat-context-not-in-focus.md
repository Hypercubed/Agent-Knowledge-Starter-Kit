---
id: github-copilot-chat-context-not-in-focus
title: "GitHub Copilot Chat context not in focus"
last_updated: 2026-04-19
---

# GitHub Copilot Chat context not in focus

#### Symptom

Copilot Chat answers don't reference `.agents/AGENTS.md` even though `.github/copilot-instructions.md` exists.

#### Likely causes

- `.github/copilot-instructions.md` is not being read at session start; verify file exists and VS Code recognizes the discovery.
- Copilot Chat is using a conversation-scoped context model; `.agents/AGENTS.md` is not automatically in context outside the `.agents/` directory.
- Nested `.agents/` files require explicit `@` reference or prompt in chat.

#### Fix

- Use `@.agents/AGENTS.md` or `@.agents/docs/index.md` in chat when context is needed.
- Ask Copilot to read the bootstrap file: "What does `.github/copilot-instructions.md` tell you?"
- For persistent guidance, use root `AGENTS.md` instead of relying only on nested `.agents/AGENTS.md`.

#### Validation

- Open `.github/copilot-instructions.md` and confirm it routes to `.agents/`.
- In Copilot Chat, use `@` to explicitly reference durable files when needed.
