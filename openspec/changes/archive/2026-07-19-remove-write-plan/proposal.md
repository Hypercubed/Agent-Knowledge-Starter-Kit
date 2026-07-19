## Why

The user no longer wants `write-plan` to be part of the Agent Knowledge Starter Kit (AKSK) artifacts.

## What Changes

- The `write-plan` skill directory (`.agents/skills/write-plan/`) will be removed entirely.
- All references to the `write-plan` skill will be removed from the documentation (e.g., `.agents/docs/index.md`, `.agents/docs/MAINTENANCE.md`).
- The `.agents/docs/plans` directory will be kept intact.

## Capabilities

### New Capabilities
- `remove-write-plan`: Handles the removal of the write-plan skill and references.

### Modified Capabilities

## Impact

Affected systems:
- `.agents/skills/write-plan/` will be deleted.
- Documentation references in `.agents/docs/` and `.agents/skills/` will be updated.
- `.agents/skills/generate-example/run.sh` will be updated to remove `write-plan` sync logic.
