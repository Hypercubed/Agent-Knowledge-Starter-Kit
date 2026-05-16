## Context

AKSK currently relies on a post-facto `task-closeout` to encapsulate session history. This misses early-stage context and makes the implementation sensitive to interruptions.

## Goals / Non-Goals

**Goals:**
- Architect a proactive state machine for agent tasks: `start` → `work` → `closeout`.
- Formalize a session manifest (`manifest.json`) that travels with the agent throughout the task lifecycle.

**Non-Goals:**
- Modifying the existing non-AKSK agent platforms; this change focuses exclusively on repository-local session and knowledge-capture plumbing.

## Decisions

- **Session manifest initialization**: `task-start` creates `.agents/sessions/<id>/` and `manifest.json`. This makes the target directory discoverable via the repository's file system index immediately upon task creation.
- **Manifest-first closeout**: `task-closeout` updates the manifest already created at the start of work. This eliminates current races or ID re-generations.

## Risks / Trade-offs

- **Risk:** Increased file system overhead (managing empty session folders).
- **Mitigation:** Maintenance script in `.agents/skills/session-cleanup/` to prune folders without an active `manifest.json` after N days.
- **Risk:** Agents failing to trigger `task-start`.
- **Mitigation:** Update `openspec/config.yaml` to enforce `task-start` as a pre-condition hook for implementation tasks.
## Migration Plan

1. Define `task-start` skill in `.agents/skills/`.
2. Update existing `.agents/skills/task-closeout` to search for current manifest first.
3. Update `AGENTS.md` and `openspec/config.yaml`.
## Open Questions
- Should `task-start` accept an optional `task_id` for manual task tracking?
- How to ensure compatibility with already running long-lived sessions during migration?
