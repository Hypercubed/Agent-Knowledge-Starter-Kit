## Purpose

Repurposes the periodic lint pass to guard the wiring between AKSK and its adopted tools: routing blocks stay intact, archived changes have wiki coverage, and stale decisions get flagged, while index-coverage checking moves out of scope.

## ADDED Requirements

### Requirement: Routing block integrity check
The lint pass SHALL verify that routing blocks in root-level instruction files (including the AKSK block merged into `AGENTS.md` and the OpenWiki-managed block) are present, unmodified, and point at targets that exist, and SHALL report any missing, duplicated, or broken block.

#### Scenario: Routing block damaged by manual edit
- **WHEN** a routing block was partially deleted or its link targets were moved
- **THEN** lint reports the affected file, the damaged block, and the repair action

### Requirement: Archived-change wiki coverage check
The lint pass SHALL pair archived OpenSpec changes with wiki coverage: for each archived change, it checks that descriptive outcomes are represented in `openwiki/` (directly or via recorded deferral) and reports archived changes lacking coverage.

#### Scenario: Archived change without wiki coverage
- **WHEN** an archived change produced descriptive knowledge that appears in no wiki page
- **THEN** lint lists that change as uncovered

#### Scenario: Coverage explicitly deferred
- **WHEN** an archived change records that wiki coverage was intentionally deferred
- **THEN** lint does not flag it

### Requirement: Stale decision detection
The lint pass SHALL flag decision entries whose claims conflict with current repository reality (for example, referencing retired skills or superseded proposals still marked accepted) and suggest supersession updates.

#### Scenario: Decision references a retired skill
- **WHEN** a decision entry still directs agents to use a skill that this kit retired
- **THEN** lint flags the entry as stale and names the superseding source

### Requirement: Index coverage out of scope
The lint pass MUST NOT fail repositories for missing or stale hand-maintained section indexes under `.agents/docs/`; index generation and log upkeep belong to the adopted wiki tooling.

#### Scenario: Missing section index
- **WHEN** a section under `.agents/docs/` lacks an up-to-date `index.md`
- **THEN** lint passes that check silently and does not report an error

