## Why

Adopters need a clear, portable pattern for normative agent instructions that are not always best expressed only in `.agents/AGENTS.md`. For example, file-scoped rules or product-native rule trees (like Cursor's `.cursorrules`) should have a standard location in the AKSK structure without bloating the compiled knowledge layer.

## What Changes

- Define a new standard location for rules within the consumer `.agents/` tree.
- Document the decision boundary between `AGENTS.md`, `rules/`, `decisions/`, and playbooks.
- Update maintainer documentation and `generate-example` to include the new rules pattern.
- Ensure `learning-distill` can route lessons to this new location.

## Capabilities

### New Capabilities
- `rules-in-scaffold`: Defines the layout, naming, and routing rules for portable agent instructions within the `.agents/` directory.

### Modified Capabilities
- None

## Impact

- Repository layout for AKSK consumers.
- Maintainer docs and example generation scripts.
- `learning-distill` logic for knowledge routing.
