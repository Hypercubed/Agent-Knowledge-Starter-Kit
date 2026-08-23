# OpenCode Integration Quick Reference

Use this page for OpenCode-specific wiring. For the shared integration model, read [Integration Patterns](./patterns.md).

Based on current OpenCode documentation reviewed on April 12, 2026. Re-check OpenCode docs after updates, especially around rule precedence, skill discovery, and project-local config loading.

## Setup

1. Install starter skills in the target repo with `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit`, then run each installed skill's initialization from its `SKILL.md` (see [`INSTALL.md`](../../INSTALL.md)).
2. Keep a short root `AGENTS.md` that routes OpenCode into `.agents/`.
3. Keep durable repo policy in `.agents/`, not duplicated across `AGENTS.md`, `opencode.json`, and commands.
4. Let OpenCode discover `.agents/skills/` natively when available.
5. Add `.opencode/commands/` or `.opencode/agents/` only for OpenCode-specific convenience.

Attach the marker-delimited `AKSK:ROUTING` section rather than hand-writing this file:

```bash
node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs . AGENTS.md
```

The attachment appends the section below any existing content, refreshes it in place when the kit's template changes, and is idempotent on re-run. Add tool-specific notes outside the markers - never edit between them.

Optional `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [".agents/AGENTS.md", "openwiki/index.md"]
}
```

## Discovery and Config

| Mechanism           | Location                                                  | Use                                                             |
| ------------------- | --------------------------------------------------------- | --------------------------------------------------------------- |
| Project rules       | root `AGENTS.md`                                          | Primary repo instructions                                       |
| Compatibility rules | root `CLAUDE.md`                                          | Fallback instruction file if no OpenCode `AGENTS.md` is present |
| Config              | `opencode.json` / `opencode.jsonc`                        | Runtime config and optional extra instructions                  |
| Commands            | `.opencode/commands/`                                     | Thin slash-style wrappers                                       |
| Agents              | `.opencode/agents/`                                       | OpenCode-specific runtime agents                                |
| Skills              | `.opencode/skills/`, `.agents/skills/`, `.claude/skills/` | Reusable workflows                                              |

## OpenCode-Specific Caveats

- Use `opencode.json` `instructions` as routing, not as a second durable policy store.
- `.opencode/commands/` are prompt shortcuts. Keep them as pointers to `.agents/skills/` or `.agents/playbooks/`.
- `.opencode/agents/` should define OpenCode runtime behavior; portable role guidance and workflow boundaries live in `.agents/AGENTS.md`, kit skills under `.agents/skills/`, and the shared [Architecture](../../docs/architecture.md) document for this starter.

## Workflow

1. Start OpenCode from the repo root.
2. Let root `AGENTS.md` route into `.agents/`.
3. Use `.agents/skills/` for closeout, distillation, and maintenance workflows.
4. Keep `.opencode/` files short and OpenCode-specific.

## References

- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [Integration Patterns](./patterns.md)
