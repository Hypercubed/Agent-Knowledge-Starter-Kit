## Why

AKSK currently captures session history retroactively via `task-closeout`, which leaves work vulnerable to data loss if an agent is interrupted and prevents effective context anchoring at the start of a task. We need to formalize task state initialization proactively.

## What Changes

- Introduce a standardized `task-start` skill/capability.
- Define a manifestation format for persistent session logs (`manifest.json`).
- Update `task-closeout` to transition from initialized state to durable bundle state.

## Capabilities

### New Capabilities
- `task-start`: Proactive initialization of task metadata, ID generation, and session folder structure.

### Modified Capabilities
- `task-closeout`: Modified to consume existing manifests rather than generating new metadata, ensuring continuity of task identity. As slimmed by `adopt-openspec-openwiki`, `summary.json` additionally carries `openspec_change` (the associated OpenSpec change name) and distillation flags; `task-start` manifests MUST preserve and pass through these fields rather than redefining them.

## Impact

This affects the lifecycle of all implementation tasks within AKSK-compliant repositories. It requires updating `AGENTS.md` and `openspec/config.yaml` to include `task-start` as a mandatory trigger for implementation workflows.

**Sequencing:** `task-start` initializes the manifest; `task-closeout` finalizes it into a bundle (adding status, `openspec_change`, agent metadata, and distillation flags); `learning-distill` consumes the finalized bundle only after closeout marks it ready. The changes apply in that order without overlapping writes: task-start owns creation, task-closeout owns finalization, nothing else touches the manifest.
