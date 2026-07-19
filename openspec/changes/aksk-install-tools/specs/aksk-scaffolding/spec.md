## ADDED Requirements

### Requirement: Scaffold Agent Structure
The system SHALL create the base `.agents/` folder structure, copy the `AGENTS.md` file, and populate the `skills` directory with core kit skills.

#### Scenario: Scaffolding a fresh repo
- **WHEN** the user runs the initialization process
- **THEN** the `.agents` directory is created, `AGENTS.md` is populated, and native skills like `learning-distill` and `task-closeout` are copied into `.agents/skills/`

### Requirement: Trigger OpenWiki Extraction
The initialization process SHALL invoke the `extract-openwiki-skills` script to generate native `openwiki-init` and `openwiki-sync` skills based on the installed `openwiki` package version.

#### Scenario: Running extraction during init
- **WHEN** the scaffolding completes the core directory setup
- **THEN** it executes `npm run extract-skills` (or equivalent script) so that native OpenWiki prompts are available to the agent
