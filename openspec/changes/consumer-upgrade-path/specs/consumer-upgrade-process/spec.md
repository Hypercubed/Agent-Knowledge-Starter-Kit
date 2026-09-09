## ADDED Requirements

### Requirement: Document safe upgrade paths
The kit documentation SHALL provide clear steps for safely upgrading an existing `.agents/` installation.

#### Scenario: User upgrades the kit
- **WHEN** a consumer wants to upgrade their existing agent knowledge starter kit
- **THEN** they can follow a checklist that explains how to merge directories without losing their local `rules/`, `playbooks/`, and `skills/`

### Requirement: Document first-time adoption for existing structures
The documentation SHALL explain how to integrate the kit into a repository that already contains an `.agents/` folder.

#### Scenario: Existing `.agents/` directory
- **WHEN** a repository already has an `.agents/` directory with custom rules
- **THEN** the consumer can follow steps to add the starter kit's `docs/`, `sessions/`, and core skills without overwriting their existing files

### Requirement: Clarify Gitignore behavior
The documentation SHALL explain that `.agents/.gitignore` is the primary method for ignoring session bundles.

#### Scenario: Ignoring session bundles
- **WHEN** a consumer generates a session bundle
- **THEN** it is ignored by Git using the local `.agents/.gitignore` file, and repo-root `.gitignore` modifications are only needed as a fallback

### Requirement: Define root vs nested AGENTS.md relationship
The documentation SHALL define the relationship between a repository's root `AGENTS.md` and `.agents/AGENTS.md`.

#### Scenario: Both AGENTS.md files exist
- **WHEN** a repository has both a root `AGENTS.md` and an `.agents/AGENTS.md`
- **THEN** the documentation explicitly states their intended usage and relationship
