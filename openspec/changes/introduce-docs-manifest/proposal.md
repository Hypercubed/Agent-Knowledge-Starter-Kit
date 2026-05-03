# Proposal: Introduce Manifest-Based Docs Structure

## Problem
Documentation paths are currently hardcoded within individual skills. This creates tight coupling between skills and repository structure, making it difficult to reorganize content without modifying code. There is also a need to support additional user-defined folders and generate a consistent system overview.

## Proposed Change
Introduce a manifest file (`.agents/docs/manifest.yaml`) that defines documentation structure, enabling skills to resolve paths dynamically, supporting user-defined folders, and generating maintenance.md as a derived system overview.

## Impact
- **Decoupling**: Skills no longer hardcode paths, allowing flexible reorganization.
- **User Flexibility**: Users can add custom folders via manifest without code changes.
- **Consistency**: Single source of truth for documentation layout.
- **Maintenance**: Automatic generation of system overview.

## Success Criteria
- Manifest file defines roots, types, and extra_paths.
- Skills resolve paths via manifest (no hardcoded directories).
- Search includes all manifest-defined paths.
- Users can add new folders via extra_paths without code changes.
- maintenance.md is generated and accurate.
- System remains simple and grep-based.