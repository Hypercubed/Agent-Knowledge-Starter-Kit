# Codex Integration Quick Reference

Use this page for Codex-specific wiring. For the shared integration model, read [Integration Patterns](./patterns.md).

Verified against OpenAI Codex documentation on April 12, 2026. Re-check Codex docs after updates, especially around sandbox defaults and skill discovery.

## Setup

1. Install or merge the starter kit into the target repo as `.agents/`.
2. Keep a short root `AGENTS.md` that routes Codex into `.agents/`.
3. Keep durable repo policy in `.agents/`, not in Codex home or local config.
4. Leave portable kit skills under `.agents/skills/<name>/SKILL.md` so Codex can discover them.
5. Use `~/.codex/config.toml` only for local sandbox, approval, profile, and similar user settings.

```markdown
# AGENTS.md

This repo uses the Agent Knowledge Starter Kit.

- Read `.agents/AGENTS.md` for durable repo guidance.
- Use `.agents/docs/index.md` to find decisions, troubleshooting, and playbooks.
- Treat `.agents/skills/*/SKILL.md` as repo-local Codex skills.
- Keep temporary task evidence in `.agents/sessions/`; promote only durable lessons back into `.agents/`.
```

## Discovery and Config

| Mechanism            | Location                                          | Use                                              |
| -------------------- | ------------------------------------------------- | ------------------------------------------------ |
| Project instructions | root and nested `AGENTS.md`, `AGENTS.override.md` | Session-start instructions                       |
| Kit instructions     | `.agents/AGENTS.md`                               | Durable repo guidance after root routing         |
| Repo skills          | `.agents/skills/<name>/SKILL.md`                  | Repo-local Codex skills                          |
| User config          | `~/.codex/config.toml`                            | Sandbox, approvals, profiles, fallback filenames |
| Rules                | `~/.codex/rules/*.rules`                          | Experimental command-approval rules              |

## Codex-Specific Caveats

- Codex discovers `AGENTS.md` files along the path from the project root to the working directory. It does not automatically treat `.agents/AGENTS.md` as repo-wide when launched from the root.
- Skill names can collide across repo, user, admin, and system skill locations. Invoke important workflows explicitly, such as `$task-closeout` or `read .agents/skills/task-closeout/SKILL.md`.
- Some sandbox profiles may protect `.agents/` as read-only. That is fine for normal feature work; use an approval or writable-root configuration for knowledge-maintenance edits.

## Workflow

1. Launch Codex from the repo root or target working directory.
2. Confirm root `AGENTS.md` routes into `.agents/`.
3. Read `.agents/AGENTS.md` and `.agents/docs/index.md` before changing conventions.
4. Use repo-local skills for closeout, distillation, and linting.
5. Verify with `git status --short` and targeted reads before finishing.

## References

- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [Integration Patterns](./patterns.md)
