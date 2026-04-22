# GitHub Copilot Integration Quick Reference

Use this page for GitHub Copilot-specific wiring. For the shared integration model, read [Integration Patterns](./patterns.md).

Written and verified against GitHub Copilot Chat behavior in VS Code with agent capabilities on April 13, 2026. Re-check after VS Code or Copilot Chat updates, especially around instruction file discovery and context injection.

## Setup

1. Install starter skills in the target repo with `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit`, then run each installed skill's initialization from its `SKILL.md` (see [`INSTALL.md`](../../INSTALL.md)).
2. Create a repository-level Copilot instruction file to route to `.agents/`.
3. Keep durable repo policy in `.agents/`, not in instruction files or editor-profile settings.
4. Add `.github/copilot-instructions.md` as a thin bootstrap.
5. Use VS Code workspace settings (`.vscode/settings.json`) only for tool preferences, not policy.
6. Optionally, add `.github/prompts/*.prompt.md` as reusable prompt files for invoking repo skills.

Example `.github/copilot-instructions.md`:

```markdown
# Copilot Instructions

This repo uses the Agent Knowledge Starter Kit.

**Before starting work:**
- Read `.agents/AGENTS.md` for durable repo guidance.
- Use `.agents/docs/index.md` to find decisions, troubleshooting, and playbooks.

**For task closeout:**
- Follow `.agents/skills/task-closeout/SKILL.md` at meaningful task boundaries.

**For session storage:**
- Keep temporary task evidence in `.agents/sessions/`;
- promote only durable lessons back into `.agents/`.
```

A root `.copilot-instructions.md` file is sometimes mentioned as a fallback, but this path is not confirmed in official VS Code Copilot documentation. Prefer `.github/copilot-instructions.md`.

## Discovery and Config

| Mechanism               | Location                                           | Use                                           |
| ----------------------- | -------------------------------------------------- | --------------------------------------------- |
| Repository instructions | `.github/copilot-instructions.md`                  | Repo-level agent instructions                 |
| Reusable prompts        | `.github/prompts/*.prompt.md`                      | Prompt files for invoking skills or workflows |
| Project instructions    | root `AGENTS.md`                                   | Plain markdown agent instructions             |
| Kit knowledge           | `.agents/AGENTS.md`, `.agents/docs/index.md`       | Durable repo guidance and decision log        |
| VS Code preferences     | `.vscode/settings.json`, `.vscode/extensions.json` | Editor settings, not repo policy              |
| Workspace context       | VS Code Chat context panel, `@` file references    | File-scoped guidance during chat sessions     |

## Copilot-Specific Caveats

- `.github/copilot-instructions.md` is the primary discovery location; keep it short and route into canonical `.agents/` files rather than duplicating guidance.
- Copilot Chat context in VS Code is conversation-scoped, not persistent. Use `.agents/sessions/` for task evidence so work survives tool restarts or hand-offs to other agents.
- VS Code workspace-level instructions (in `.vscode/settings.json` under `github.copilot.chat`) can extend repo instructions, but do not put durable policy there; those settings are tool-specific and may not travel to other IDEs or tools.
- Nested files like `.agents/AGENTS.md` are not automatically in context for work outside `.agents/`; use root `AGENTS.md` or a bootstrap file to ensure visibility.
- `@`-style file references in chat require user action. Prompt Copilot explicitly to `@.agents/AGENTS.md` or other key paths when needed.
- Copilot does not discover `.agents/skills/` natively; tell it to read specific skill files explicitly. Use `.github/prompts/*.prompt.md` to create reusable prompt wrappers that invoke repo skills.

## Workflow

1. Start VS Code with the repo open.
2. Review `.github/copilot-instructions.md` at session start (it should route into `.agents/`).
3. Open `.agents/AGENTS.md` and `.agents/docs/index.md` when repo policy matters; use `@` references in chat if context is unclear.
4. Use explicit prompts to follow `.agents/skills/*/SKILL.md` at task boundaries.
5. Use Copilot Chat to read and understand guidance, but edit `.agents/` directly when durable knowledge changes.
6. Keep personal editor preferences (themes, keybindings, extensions) in `.vscode/settings.json` and repo policy in `.agents/`.

## Two-Tool Workflow: Copilot + Claude Code

This workflow shows Copilot Chat and Claude Code working on the same repo with the kit:

1. **Start in Copilot Chat** with a bug report or feature request.
2. **Copilot reads** `.github/copilot-instructions.md` → routes to `.agents/AGENTS.md` and `.agents/docs/troubleshooting/` (see index there).
3. **Copilot suggests** changes and implementation strategy in chat.
4. **Hand off to Claude Code** by switching to the Claude Code editor or pasting context.
5. **Claude Code reads** root `CLAUDE.md` (separate from Copilot instructions) → routes to same `.agents/` files.
6. **Claude Code implements** the changes and runs validation.
7. **At meaningful stopping point**: Claude Code runs `task-closeout` to write `.agents/sessions/<timestamp>/`.
8. **Later, run learning-distill**: On the session bundle to promote durable lessons into `.agents/AGENTS.md` and `.agents/docs/`.

Both agents converge on the same `.agents/` tree, keeping knowledge centralized even though each tool has its own instruction file and context model.

## References

- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [Integration Patterns](./patterns.md)
- [`.agents/docs/troubleshooting/`](../../.agents/docs/troubleshooting/ts-github-copilot-chat-context-not-in-focus.md) — Copilot Chat context visibility
