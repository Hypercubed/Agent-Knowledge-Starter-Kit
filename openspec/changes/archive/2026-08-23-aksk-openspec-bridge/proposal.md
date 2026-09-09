## Why

Currently, AKSK and OpenSpec operate as siloed systems. Linking them allows agents to govern workflows via OpenSpec using AKSK's knowledge-capture mechanisms as a library of reusable execution capabilities.

## What Changes

- Introduce a set of OpenSpec schemas that bind to AKSK `.agents/skills/` procedures.
- Register these schemas within the OpenSpec CLI so they are discoverable for any project, not just Hermes-centric environments.
- Provide standardized adapter fragments for `CLAUDE.md` and repository CI/CD flows.

## Capabilities

### New Capabilities
- `aksk-bridge-schema`: Standardized OpenSpec schema for discovery and registration of AKSK skills.
- `aksk-workflow-router`: Schema logic to route task implementation phases (Planning/Apply) to appropriate AKSK skills (e.g., `task-start`, `task-closeout`).

### Modified Capabilities
- (None)

## Impact

This change improves cross-system interop without hard-coding Hermes dependencies. It requires packaging AKSK capability definitions into an OpenSpec-compatible schema layout.
