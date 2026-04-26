# Learning distill contract

Machine-oriented rules for **learning-distill** when only this skill folder is present. Distillation policy, logging rules, and durable entry YAML remain normative in [`.agents/docs/MAINTENANCE.md`](../../docs/MAINTENANCE.md). For precedence, see [Portable skill contracts](../../docs/MAINTENANCE.md#portable-skill-contracts).

## Inputs

- One **session bundle** directory under `.agents/sessions/<bundle>/` (see [task-closeout `CONTRACT.md`](../task-closeout/CONTRACT.md) for bundle layout).
- Existing durable tree: `.agents/AGENTS.md`, `.agents/docs/**`, `.agents/playbooks/`.

**Canonical task identity:** read `task_id` from the bundle’s `summary.json`. Do not infer identity from the session folder name.

## Bootstrap source path (this repo)

Initialization templates live only under this skill:

- `bootstrap/docs/` — `MAINTENANCE.md`, `index.md`, `log.md`, `decisions/`, `troubleshooting/`
- `bootstrap/playbooks/README.md`
- `bootstrap/sessions/README.md`
- `bootstrap/AGENTS.md`

Copy rules: **create missing files only**; do not overwrite existing consumer files. Do not create `.agents/docs/plans/` here (owned by **write-plan** when installed).

## Writes (distillation)

Allowed durable targets include:

- `.agents/AGENTS.md` (only for lessons meeting the skill’s AGENTS criteria)
- `.agents/docs/decisions/*.md` and `decisions/index.md`
- `.agents/docs/troubleshooting/*.md` and `troubleshooting/index.md`
- `.agents/docs/index.md`
- `.agents/playbooks/*.md`
- **Append** a row to `.agents/docs/log.md` on each successful distillation (see `MAINTENANCE.md` Logging policy; no secrets or long raw dumps)
- Update the bundle’s `summary.json` / distillation flags to mark the bundle processed (see `SKILL.md`)

**Do not** modify application source code outside the knowledge layer.

## Post-write index refresh

After changing durable markdown, when optional skills exist:

```bash
python .agents/skills/docs-compile/scripts/docs-compile.py
```

Contract details: [docs-compile `CONTRACT.md`](../docs-compile/CONTRACT.md), [docs-search `CONTRACT.md`](../docs-search/CONTRACT.md).
