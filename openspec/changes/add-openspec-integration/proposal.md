## Why

AKSK manages the durable knowledge of a repository, while OpenSpec manages the active lifecycle of tasks and change tracking. Consumers who use both tools currently lack guidance on how to integrate them. By providing an integration guide, we show consumers how to use OpenSpec's native rules to trigger AKSK's maintenance loops (like `task-closeout` and `learning-distill`) without hardwiring dependencies between the tools in AKSK itself.

## What Changes

- Add a new integration guide in `docs/integrations/openspec.md`.
- Provide specific `openspec/config.yaml` `rules` snippets that consumers can use to instruct their agents to read AKSK constraints before proposing changes, and to trigger AKSK distillation when archiving changes.
- Ensure the integration aligns with the opt-in philosophy of AKSK capabilities.

## Capabilities

### New Capabilities
- `openspec-integration`: Guidance and snippets for using OpenSpec to interact with AKSK processes.

### Modified Capabilities
None

## Impact

- Adds documentation (markdown) in the `docs/integrations/` directory.
- No changes to existing AKSK skills, workflows, or core scripts. This is purely an instructional capability for consumers.
