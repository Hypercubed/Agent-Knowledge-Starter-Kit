## ADDED Requirements

### Requirement: OKF Synchronization Skill
The system SHALL provide an `openwiki-sync` skill that instructs the agent how to natively output OKF v0.1 markdown bundles.

#### Scenario: Running the sync skill
- **WHEN** the agent invokes the `openwiki-sync` skill
- **THEN** the agent inspects source changes and modifies `openwiki/*.md` files with correct Google OKF v0.1 frontmatter and links
