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
- `task-closeout`: Modified to consume existing manifests rather than generating new metadata, ensuring continuity of task identity.

## Impact

This affects the lifecycle of all implementation tasks within AKSK-compliant repositories. It requires updating `AGENTS.md` and `openspec/config.yaml` to include `task-start` as a mandatory trigger for implementation workflows.
