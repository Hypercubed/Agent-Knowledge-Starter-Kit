## Why

Consumers need a safe, clear process to upgrade their Agent Knowledge Starter Kit installations without losing repository-specific agent rules, custom skills, or documentation. This change reduces friction and fear when adopting new starter kit releases by clarifying what to overwrite and what to merge manually.

## What Changes

- Create formal guidance for v1 → vNext style upgrades, calling out safe paths (e.g., using `npx skills add` vs manual merging).
- Provide documentation for first-time adoption in repositories that already have an `.agents/` directory (preserving existing `rules/`, `playbooks/`, and `skills/`).
- Clarify where and how to integrate existing repo-specific knowledge (e.g. updating `.agents/docs/index.md`, logging adoption in `log.md`).
- Incorporate guidance into a dedicated upgrade doc or the existing README/INSTALL.md flow as appropriate.

## Capabilities

### New Capabilities
- `consumer-upgrade-process`: A formal process and set of documentation for consumers to adopt kit updates without destroying local knowledge.
- `installation-guide`: The installation instructions will be formalized to handle existing `.agents/` directories and point to upgrade paths.

### Modified Capabilities


## Impact

- README.md and/or INSTALL.md
- Potentially new documentation under `example/.agents/docs/`
- User experience for existing kit adopters
