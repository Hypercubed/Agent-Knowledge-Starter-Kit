# OpenCode Integration Quick Reference

Use this page for OpenCode-specific wiring. For the shared integration model, read [Integration Patterns](./patterns.md).

Based on current OpenCode documentation reviewed on April 12, 2026. Re-check OpenCode docs after updates, especially around rule precedence, skill discovery, and project-local config loading.

## Setup

1. Install or merge the starter kit into the target repo as `.agents/`.
2. Keep a short root `AGENTS.md` that routes OpenCode into `.agents/`.
3. Keep durable repo policy in `.agents/`, not duplicated across `AGENTS.md`, `opencode.json`, and commands.
4. Let OpenCode discover `.agents/skills/` natively when available.
5. Add `.opencode/commands/` or `.opencode/agents/` only for OpenCode-specific convenience.

```markdown
# AGENTS.md

This repo uses the Agent Knowledge Starter Kit.

- Read `.agents/AGENTS.md` for durable repo guidance.
- Use `.agents/docs/index.md` to find decisions, troubleshooting, and playbooks.
- Treat `.agents/skills/*/SKILL.md` as canonical repo-local workflows.
- Keep temporary task evidence in `.agents/sessions/`; promote only durable lessons back into `.agents/`.
```

Optional `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [".agents/AGENTS.md", ".agents/docs/index.md"]
}
```

## Discovery and Config

| Mechanism | Location | Use |
| --- | --- | --- |
| Project rules | root `AGENTS.md` | Primary repo instructions |
| Compatibility rules | root `CLAUDE.md` | Fallback instruction file if no OpenCode `AGENTS.md` is present |
| Config | `opencode.json` / `opencode.jsonc` | Runtime config and optional extra instructions |
| Commands | `.opencode/commands/` | Thin slash-style wrappers |
| Agents | `.opencode/agents/` | OpenCode-specific runtime agents |
| Skills | `.opencode/skills/`, `.agents/skills/`, `.claude/skills/` | Reusable workflows |

## OpenCode-Specific Caveats

- Use `opencode.json` `instructions` as routing, not as a second durable policy store.
- `.opencode/commands/` are prompt shortcuts. Keep them as pointers to `.agents/skills/` or `.agents/playbooks/`.
- `.opencode/agents/` should define OpenCode runtime behavior; portable role guidance belongs under `.agents/agents/`.

## Workflow

1. Start OpenCode from the repo root.
2. Let root `AGENTS.md` route into `.agents/`.
3. Use `.agents/skills/` for closeout, distillation, and maintenance workflows.
4. Keep `.opencode/` files short and OpenCode-specific.

## References

- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [Integration Patterns](./patterns.md)
