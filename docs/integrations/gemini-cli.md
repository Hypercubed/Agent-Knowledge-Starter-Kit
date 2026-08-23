# Gemini CLI Integration Quick Reference

Use this page for Gemini CLI-specific wiring. For the shared integration model, read [Integration Patterns](./patterns.md).

Verified against Gemini CLI behavior in this repository on April 12, 2026.

## Setup

1. Install starter skills in the target repo with `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit`, then run each installed skill's initialization from its `SKILL.md` (see [`INSTALL.md`](../../INSTALL.md)).
2. Add or update root `GEMINI.md`.
3. Keep `GEMINI.md` as a thin router into `.agents/`.
4. Treat Gemini `save_memory(scope="project")` as user-local memory, not shared repo docs.
5. Instruct Gemini to read `.agents/skills/<name>/SKILL.md` directly when a repo workflow matters.

Attach the marker-delimited `AKSK:ROUTING` section rather than hand-writing this file:

```bash
node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs . GEMINI.md
```

The attachment appends the section below any existing content, refreshes it in place when the kit's template changes, and is idempotent on re-run. Add tool-specific notes outside the markers - never edit between them.

## Discovery and Config

| Mechanism      | Location                          | Use                                          |
| -------------- | --------------------------------- | -------------------------------------------- |
| Root mandates  | `GEMINI.md`                       | Primary Gemini CLI instruction file          |
| Project config | `.gemini/`                        | Project-specific config and state            |
| Project memory | `~/.gemini/memory/`               | User-local persistent facts                  |
| Native skills  | Built-in or custom skill registry | Gemini-native capabilities                   |
| Sub-agents     | Built-in                          | Research, strategy, and execution delegation |

## Gemini-Specific Caveats

- `GEMINI.md` should be strong routing into `.agents/`, but not the canonical policy store.
- If Gemini file tools respect `.gitignore`, direct reads under `.agents/sessions/` may fail. Use an allowed shell read or explicit override when available.
- Capture a Gemini session ID in closeout metadata only when it is clearly available, such as from `gemini --list-sessions`; otherwise omit it.
- `save_memory(scope="project")` is private and not version-controlled. Shared lessons belong in the curated wiki trees.

## Workflow

1. Use Gemini CLI's research, strategy, and execution lifecycle normally.
2. During research, read `.agents/AGENTS.md` and relevant docs or playbooks.
3. During closeout, follow `.agents/skills/task-closeout/SKILL.md`.
4. Periodically run a learning pass to promote durable lessons from `.agents/sessions/` into `.agents/`.

## References

- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [Integration Patterns](./patterns.md)
