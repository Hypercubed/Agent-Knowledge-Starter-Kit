## Why

The Agent Knowledge Starter Kit (AKSK) currently uses a `playbooks` folder for managed procedures (human/agent checklists) and a `workflows` folder for automated agent slash commands. This taxonomy is redundant and inconsistent with OpenSpec terminology, where "workflows" covers all procedural knowledge regardless of the level of automation. Adopting a unified `workflows` folder simplifies the top-level repository structure and provides a more consistent mental model for agents and maintainers.

## What Changes

- **Taxonomy Consolidation**: The `.agents/playbooks/` directory will be merged into `.agents/workflows/`.
- **Structural Update**: All managed procedures (checklists, release processes, etc.) will now reside in `.agents/workflows/`.
- **Global Reference Update**: All documentation, skill definitions, and scripts will be updated to refer to `.agents/workflows/` instead of `.agents/playbooks/`.
- **Registry Update**: The `MAINTENANCE.md` registry will reflect that both `learning-distill` and `docs-lint` interact with the `workflows/` directory.

## Capabilities

### New Capabilities
- `unified-workflows`: A single directory for both automated agent slash commands and manual/semi-automated managed procedures.

### Modified Capabilities
- `knowledge-layer-structure`: Updating the canonical structure of the `.agents/` tree to remove `playbooks/` in favor of `workflows/`.
- `distillation-loop`: Updating the classification rules to promote procedural lessons to `workflows/` instead of `playbooks/`.

## Impact

- **Documentation**: `README.md`, `INSTALL.md`, `AGENTS.md` (root and .agents), `docs/architecture.md`, `docs/index.md`, and 14 tool integration guides (`docs/integrations/*.md`).
- **Skills**: `learning-distill`, `docs-lint`, `docs-search`, and `generate-example` (internal).
- **Scripts**: `docs-search/scripts/search-docs.py` and `generate-example/run.sh`.
- **Bootstrap**: The template folders used for kit initialization in new repositories.
