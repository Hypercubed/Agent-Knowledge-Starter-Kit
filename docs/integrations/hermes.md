# Hermes Integration Quick Reference

Use this page for Hermes-specific wiring. For the shared integration model, read [Integration Patterns](./patterns.md).

Based on behavior verified while working in this repo, including failure modes captured in `.agents/docs/` and `.agents/sessions/`.

## Setup

1. Install starter skills in the target repo with `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit`, then run each installed skill's initialization from its `SKILL.md` (see [`INSTALL.md`](../../INSTALL.md)).
2. Read root `AGENTS.md` first when present, then follow it into `.agents/`.
3. Keep repo-specific durable knowledge in `.agents/`.
4. Use Hermes memory for cross-project user and environment facts.
5. Read repo-local skills from disk instead of assuming Hermes system skills match them.

## Discovery and Config

| Mechanism        | Location                              | Use                                    |
| ---------------- | ------------------------------------- | -------------------------------------- |
| Repo entrypoint  | root `AGENTS.md`                      | Bootstrap into `.agents/`              |
| Kit instructions | `.agents/AGENTS.md`                   | Durable repo guidance                  |
| Kit docs         | `.agents/docs/`, `.agents/playbooks/` | Decisions, troubleshooting, procedures |
| Kit skills       | `.agents/skills/<name>/SKILL.md`      | Repo-local workflows                   |
| Hermes memory    | Hermes runtime                        | User/profile continuity                |
| Hermes skills    | Hermes skill store                    | Runtime-integrated procedures          |
| Session recall   | Hermes runtime                        | Prior conversation history             |

## Hermes-Specific Caveats

- Hermes system skills and repo-local `.agents/skills/` are different namespaces. Names can collide.
- If a repo workflow matters, read `.agents/skills/<name>/SKILL.md` directly from the filesystem.
- Earlier write-tool failures in this repo were not strong evidence of a broad Hermes product limitation. Verify important writes with a follow-up check.
- Do not mirror all repo knowledge into Hermes memory; keep shared repo knowledge in Git under `.agents/`.

## Workflow

1. Read root `AGENTS.md` if present.
2. Read `.agents/AGENTS.md` plus relevant docs, playbooks, or skill files.
3. Perform the work normally.
4. Verify important file changes.
5. Use `.agents/sessions/` for task evidence and distill stable lessons later.

## References

- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [Integration Patterns](./patterns.md)
- [`../../.agents/docs/troubleshooting/`](../../.agents/docs/troubleshooting/index.md)
