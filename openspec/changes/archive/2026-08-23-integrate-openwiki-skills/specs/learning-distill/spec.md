## ADDED Requirements

### Requirement: Learning Distill Output
The system SHALL modify the existing `learning-distill` process to trigger the `openwiki-sync` skill upon completion, ensuring new insights are baked into the OKF documentation format.

#### Scenario: Distillation triggers sync
- **WHEN** the `learning-distill` skill extracts durable knowledge from a session
- **THEN** it hands off the execution flow to the `openwiki-sync` skill to write the knowledge to `openwiki/`
