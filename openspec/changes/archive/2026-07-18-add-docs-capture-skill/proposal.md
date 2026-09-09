## Why

Currently, adding durable repo knowledge requires running a full `task-closeout` followed by `learning-distill`, which is designed for abstracting patterns from complex sessions. Users frequently want a fast, direct path to write directly into `.agents/docs/` when they already know what durable knowledge they want to capture, bypassing the lengthy session review and distillation loop.

## What Changes

- Create a new skill named `docs-capture` (or `knowledge-write`).
- The skill will prompt the agent to explicitly draft new documentation into the correct classification domain (`decisions`, `troubleshooting`, `playbooks`, etc.) within `.agents/docs/`.
- The skill will automatically execute kit maintenance scripts (specifically `generate-durable-indexes.py`) to link the new document.
- The skill will sync updates to the `example/` mock tree if applicable.
- The workflow establishes a formalized, predictable pattern for "skipping the line" when the user gives a direct instruction to record an architectural rule or fix.

## Capabilities

### New Capabilities

- `docs-capture`: Direct writing and indexing of durable knowledge into `.agents/docs/` without full session analysis.

### Modified Capabilities

- None

## Impact

- **Tooling:** A new reusable skill in `.agents/skills/docs-capture`.
- **Documentation:** Kit-level maintenance docs will need to reflect this newly formalized pathway.
- **Workflow:** Agents and developers will save time and context-window length on obvious explicit documentation updates.
