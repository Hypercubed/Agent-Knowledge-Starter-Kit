# OpenClaw Integration Quick Reference

Use this page for OpenClaw-specific wiring. For the shared integration model, read [Integration Patterns](./patterns.md).

Grounded in current OpenClaw CLI/docs and a live local OpenClaw install verified on April 12, 2026. Re-check OpenClaw docs after upgrades, especially around startup files, session tools, and automation behavior.

OpenClaw belongs to two patterns: it can use root `AGENTS.md` as a repo entrypoint, and it also has persistent memory, session tools, and automation that need a clear boundary from repo-shared `.agents/` knowledge.

## Setup

1. Install starter skills in the target repo with `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit`, then run each installed skill's initialization from its `SKILL.md` (see [`INSTALL.md`](../../INSTALL.md)).
2. Keep or add a short root `AGENTS.md` that routes OpenClaw into `.agents/`.
3. Keep durable repo policy in `.agents/`, not in OpenClaw memory files.
4. Keep repo-closeout and distillation workflows under `.agents/skills/` and `.agents/playbooks/`.
5. Use OpenClaw memory, sessions, sub-agents, and automation as helpers around the repo knowledge layer.

```markdown
# AGENTS.md

This repo uses the Agent Knowledge Starter Kit.

- Read `.agents/AGENTS.md` for durable repo guidance.
- Use `openwiki/index.md` for decisions, troubleshooting, and architecture; `.agents/playbooks/` for procedures.
- Treat `.agents/skills/*/SKILL.md` as canonical repo-local maintenance workflows.
- Keep temporary task evidence in `.agents/sessions/`; promote only durable lessons back into `.agents/`.
```

## Discovery and Config

| Mechanism        | Location                                                      | Use                                                   |
| ---------------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| Startup files    | root `AGENTS.md`, `SOUL.md`, `USER.md`, sometimes `MEMORY.md` | Session bootstrap and standing instructions           |
| Workspace memory | `MEMORY.md`, `memory/*.md`                                    | Assistant/user continuity and local operating context |
| Skills           | Installed workspace skills, built-ins, repo skill files       | Native and repo-local workflows                       |
| Session tools    | `sessions_list`, `sessions_history`, `sessions_spawn`, etc.   | Recall and orchestration                              |
| Automation       | Heartbeat, cron, hooks, Task Flow, background tasks           | Periodic or event-driven work                         |
| CLI/Gateway      | `openclaw status`, `openclaw agent`, `openclaw sessions`      | Inspection and operations                             |

## OpenClaw-Specific Caveats

- Root `AGENTS.md` is the checkout entrypoint; `.agents/AGENTS.md` is the portable durable repo file.
- OpenClaw memory is useful for assistant continuity, but repo architecture and maintenance policy belong in `.agents/`.
- Native skills and `.agents/skills/` can overlap. Keep cross-tool workflows canonical under `.agents/skills/`.
- Automation should point to `.agents/` files, not encode the only copy of repo policy in cron, heartbeat, or task-flow text.

## Workflow

1. Start from the repo root so root `AGENTS.md` can route into `.agents/`.
2. Read `.agents/AGENTS.md` and `openwiki/index.md`.
3. Use OpenClaw session tools, sub-agents, and automation for orchestration.
4. At meaningful task boundaries, follow `.agents/skills/task-closeout/SKILL.md`.
5. Run a later learning pass to promote only stable lessons into durable `.agents/` files.

## References

- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [Integration Patterns](./patterns.md)
