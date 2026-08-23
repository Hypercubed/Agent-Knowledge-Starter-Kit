## ADDED Requirements

### Requirement: OKF Search Skill
The system SHALL provide an `okf-search` skill customized to query OKF markdown bundles.

#### Scenario: Querying OKF frontmatter
- **WHEN** the agent needs to find a concept in the wiki
- **THEN** the agent uses `okf-search` to query `title`, `description`, `type`, and `tags` fields across the `openwiki/` directory
