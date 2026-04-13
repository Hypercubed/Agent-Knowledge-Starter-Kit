# Cursor Integration Quick Reference

Use this page for Cursor-specific wiring. For the shared integration model, read [Integration Patterns](./patterns.md).

Written to match Cursor's documented rule behavior at verification against Cursor Rules documentation. Re-check that page after Cursor upgrades.

## Setup

1. Install or merge the starter kit into the target repo as `.agents/`.
2. Keep root `AGENTS.md` short, or add an always-on Cursor project rule.
3. Keep durable repo knowledge in `.agents/`.
4. Use `.cursor/rules/` for routing, globs, and IDE-specific constraints.
5. Reference `.agents/` paths in rule bodies instead of copying long guidance.

Example `.cursor/rules/agent-knowledge-kit.mdc`:

```markdown
---
description: Route Agent to the repo knowledge layer under .agents/
alwaysApply: true
---

# Agent Knowledge Kit

- Treat `.agents/AGENTS.md` as the primary durable instructions file.
- Use `.agents/docs/index.md` to find decisions, troubleshooting, and playbooks.
- Follow `.agents/skills/task-closeout/SKILL.md` when closing meaningful work.
- Keep raw evidence in `.agents/sessions/`.

Do not duplicate long policy here; open the referenced paths when needed.
```

## Discovery and Config

| Mechanism | Location | Use |
| --- | --- | --- |
| Project Rules | `.cursor/rules/` | Repo-scoped instructions with modes, descriptions, and globs |
| Root/nested instructions | `AGENTS.md` | Plain markdown agent instructions |
| User Rules | Cursor Settings -> Rules | User-wide preferences |
| Team Rules | Cursor dashboard | Org-wide policy with higher precedence |

## Cursor-Specific Caveats

- `.agents/AGENTS.md` is nested, so it is not guaranteed to be in context for ordinary work outside `.agents/`. Use root `AGENTS.md` or an always-on rule.
- Cursor rules apply to Agent/Chat as documented; do not assume they drive every AI surface.
- Cursor does not treat `.agents/skills/*/SKILL.md` as a separate named skill namespace. Tell it to open the file from disk.
- Team, Project, and User rules can conflict. Keep repo-specific conventions in project files and organization-wide policy in Team Rules.

## Workflow

1. Start Cursor Agent with the root bootstrap or always-on project rule in scope.
2. Open `.agents/AGENTS.md` and `.agents/docs/index.md` when repo policy matters.
3. Use glob-scoped rules only for extra local constraints.
4. Edit `.agents/` first when durable guidance changes, then update Cursor rules only if routing changed.

## References

- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [Integration Patterns](./patterns.md)
