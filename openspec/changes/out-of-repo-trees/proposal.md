## Why

Teams and individuals often need to apply personal preferences or organizational policies to their agent interactions that should not be committed to a specific repository. Currently, there is no formal guidance on how to use secondary "out-of-repo" knowledge trees (like `~/.agents/`) without conflicting with or breaking the mental model of the repository's own `.agents/` layer.

## What Changes

- New documentation section for out-of-repo knowledge trees.
- Defined precedence rules for repo vs user vs org knowledge.
- Clear guidelines on what must remain in-repo for CI and shared consistency.
- Security hygiene practices for overlay trees.

## Capabilities

### New Capabilities
- `out-of-repo-trees`: Documentation and guidance for managing external knowledge overlays that complement the in-repo `.agents/` layer.

### Modified Capabilities
<!-- None -->

## Impact

- Documentation: Updates to `README.md`, `INSTALL.md`, or `.agents/docs/` to provide authoritative guidance.
- Tooling behavior: Establishes the mental model for how future tools or agents should resolve conflicting instructions across multiple trees.

## Success Criteria

- Comprehensive documentation exists in `.agents/docs/` explaining overlay tree usage.
- Precedence rules are clearly defined and validated.
- Security practices are documented and implementable.
- Guidelines distinguish between in-repo and out-of-repo knowledge appropriately.
- At least one example overlay configuration is provided and tested.
