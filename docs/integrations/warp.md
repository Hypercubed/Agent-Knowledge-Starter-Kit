# Warp Integration Quick Reference

Use this page for Warp-specific wiring. For the shared integration model, read [Integration Patterns](./patterns.md).

Based on current Warp documentation reviewed on April 13, 2026. Re-check Warp and Oz docs after major updates.

## Setup

1. Install the kit per [Adopting the kit](./patterns.md#adopting-the-kit).
2. Add or keep a short root `AGENTS.md`.
3. Keep durable repo policy in `.agents/`, not duplicated across Warp global rules or root bootstrap files.
4. Keep repo-local reusable workflows in `.agents/skills/` so Warp can discover them as project skills where supported.
5. Use Warp global rules only for cross-repo preferences.

Attach the marker-delimited `AKSK:ROUTING` section rather than hand-writing this file:

```bash
node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs . AGENTS.md
```

The attachment appends the section below any existing content, refreshes it in place when the kit's template changes, and is idempotent on re-run. Add tool-specific notes outside the markers - never edit between them.

## Discovery and Config

| Mechanism      | Location                                                                  | Use                             |
| -------------- | ------------------------------------------------------------------------- | ------------------------------- |
| Project Rules  | root `AGENTS.md` or `WARP.md`                                             | Repo-scoped rules               |
| Global Rules   | Warp Drive                                                                | Cross-repo user/team guidance   |
| Skills         | Supported project/global skill directories, including `.agents/skills/`   | Reusable workflows              |
| Slash commands | `/init`, `/plan`, `/skills`, `/open-project-rules`, `/create-environment` | Runtime workflow helpers        |
| Oz             | Warp local/cloud agent runtime                                            | Local and cloud agent workflows |

## Warp-Specific Caveats

- Project rules filename must be uppercase.
- If both `WARP.md` and `AGENTS.md` exist in the same directory, Warp documentation says `WARP.md` takes priority.
- Warp applies root and current-directory project rules, with subdirectory rules taking precedence over root and then global rules.
- `/init` can generate or link instruction files. Keep the result as routing into `.agents/`.

## Workflow

1. Start local work in Warp Agent Mode from the repo root.
2. Confirm root rules route into `.agents/`.
3. Use repo-local skills from `.agents/skills/` for closeout, distillation, and maintenance.
4. For larger background jobs, use cloud agents or Oz while keeping `.agents/` as the source of truth.

## References

- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [Integration Patterns](./patterns.md)
