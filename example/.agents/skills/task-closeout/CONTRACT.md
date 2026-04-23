# Task closeout contract

Machine-oriented rules for **task-closeout** when only this skill folder is present. Session bundle lifecycle at the kit level is summarized in [`.agents/docs/MAINTENANCE.md`](../../docs/MAINTENANCE.md) (Task bundle policy). For precedence, see [Portable skill contracts](../../docs/MAINTENANCE.md#portable-skill-contracts).

## Write scope

All new files go under:

- `.agents/sessions/<session-folder>/`

Do **not** create or edit `.agents/AGENTS.md`, `.agents/docs/**`, `.agents/playbooks/**`, or files under `.agents/skills/**` during closeout. Propose durable or skill changes as prose inside the bundle for **learning-distill**.

## Session folder name

Pattern (sortable label, **not** canonical identity):

- `YYYYMMDD-HHMMSS-short-topic` — lowercase slug, short, tied to the task goal.

One **task-closeout** bundle per folder; reuse a folder only for the bundle it was created for.

## Required bundle files

Each bundle directory **must** contain these filenames:

| File | Role |
| --- | --- |
| `summary.json` | Status, timestamps, optional `repo_id`, **`task_id`** (canonical), optional `agent`, `agent_session_id`, git metadata, `distilled`, etc. |
| `active-task.md` | Observable facts; sections per `SKILL.md` |
| `learning-candidate.md` | Candidate lessons only |
| `changed-files.txt` | Paths or identifiers of touched files |
| `validation.txt` | Checks run and outcomes |

## `summary.json` fields (contractual minimum)

Agents **must** include a stable string **`task_id`** (canonical session identifier). Other fields are optional unless your workflow requires them; the example bundle under `example/task-bundle/summary.json` in this skill shows typical keys (`repo_id`, `status`, `distilled`, `created_at`, `completed_at`, `branch`, `head_commit`, `workspace_root`, `agent`, `agent_session_id`).

After closeout, treat the bundle as **immutable** except for status / distillation-related fields in `summary.json` when a later tool updates them.

## Reference tree

Filled-in examples: `example/task-bundle/` inside this skill (same filenames as above).

## Initialization artifacts (not bundle output)

First-run setup may create `.agents/sessions/README.md` and merge lines into `.agents/.gitignore` per `SKILL.md`; that is separate from per-task bundle contents.
