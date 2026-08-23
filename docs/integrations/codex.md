# Codex Integration Quick Reference

Use this page for Codex-specific wiring. For the shared integration model, read [Integration Patterns](./patterns.md).

Verified against OpenAI Codex documentation on April 12, 2026. Re-check Codex docs after updates, especially around sandbox defaults and skill discovery.

## Setup

1. Install starter skills in the target repo with `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit`, then run each installed skill's initialization from its `SKILL.md` (see [`INSTALL.md`](../../INSTALL.md)).
2. Keep a short root `AGENTS.md` that routes Codex into `.agents/`.
3. Keep durable repo policy in `.agents/`, not in Codex home or local config.
4. Leave portable kit skills under `.agents/skills/<name>/SKILL.md` so Codex can discover them.
5. Use `~/.codex/config.toml` only for local sandbox, approval, profile, and similar user settings.

Attach the marker-delimited `AKSK:ROUTING` section rather than hand-writing this file:

```bash
node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs . AGENTS.md
```

The attachment appends the section below any existing content, refreshes it in place when the kit's template changes, and is idempotent on re-run. Add tool-specific notes outside the markers - never edit between them.

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
3. Read `.agents/AGENTS.md` and `openwiki/index.md` before changing conventions.
4. Use repo-local skills for closeout, distillation, and linting.
5. Verify with `git status --short` and targeted reads before finishing.

## References

- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [Integration Patterns](./patterns.md)
