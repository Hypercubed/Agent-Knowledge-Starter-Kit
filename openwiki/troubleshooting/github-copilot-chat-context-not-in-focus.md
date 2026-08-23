---
type: Troubleshooting
title: GitHub Copilot Chat context not in focus
description: 'Copilot Chat may ignore `.agents/` guidance when routing files or editor
  context are not aligned with the repo’s documented bootstrap pattern.

  '
tags:
- github-copilot
- agents
- integrations
timestamp: '2026-04-19T00:00:00Z'
---

# GitHub Copilot Chat context not in focus

#### Symptom

Copilot Chat answers don't reference `.agents/AGENTS.md` even though `.github/copilot-instructions.md` exists.

#### Likely causes

- `.github/copilot-instructions.md` is not being read at session start; verify file exists and VS Code recognizes the discovery.
- Copilot Chat is using a conversation-scoped context model; `.agents/AGENTS.md` is not automatically in context outside the `.agents/` directory.
- Nested `.agents/` files require explicit `@` reference or prompt in chat.

#### Fix

- Use `@.agents/AGENTS.md`, `@.agents/docs/index.md`, or the specific indexes `@.agents/docs/decisions/index.md` / `@.agents/docs/troubleshooting/index.md` when you need to route between decisions, troubleshooting patterns, and playbooks.
- Ask Copilot to read the bootstrap file: "What does `.github/copilot-instructions.md` tell you?"
- For visibility outside `.agents/`-heavy work, prefer a short root `AGENTS.md` that points into `.agents/` rather than assuming nested files are always in context (see [`docs/integrations/copilot.md`](../../docs/integrations/copilot.md)).

#### Validation

- Open `.github/copilot-instructions.md` and confirm it routes to `.agents/`.
- In Copilot Chat, use `@` to explicitly reference durable files when needed.
