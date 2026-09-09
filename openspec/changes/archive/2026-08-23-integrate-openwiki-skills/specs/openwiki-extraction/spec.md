## ADDED Requirements

### Requirement: OpenWiki Prompt Extraction
The system SHALL provide a script to extract prompt strings from the `openwiki` package and write them as native `SKILL.md` files for `openwiki-init` and `openwiki-sync`.

#### Scenario: Running the extraction script
- **WHEN** the user or initialization workflow runs the extraction script
- **THEN** the `.agents/skills/openwiki-init/SKILL.md` and `.agents/skills/openwiki-sync/SKILL.md` files are created or updated with native prompt instructions
