# cross-tool-lint Specification

## Purpose
Repurposes the periodic lint pass to guard the wiring between AKSK and its adopted tools: routing blocks stay intact, archived changes have wiki coverage, and stale decisions get flagged, while index-coverage checking moves out of scope.

## Requirements
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
The lint pass SHALL flag curated knowledge pages under `openwiki/{decisions,troubleshooting}/` whose claims conflict with current repository reality (for example, referencing retired skills or entries still marked accepted via `aksk_status` after being superseded) and suggest supersession updates.

#### Scenario: Decision references a retired skill
- **WHEN** a curated decision page still directs agents to use a skill that this kit retired
- **THEN** lint flags the page as stale and names the superseding source

### Requirement: Index and log ownership out of scope
The lint pass MUST NOT verify, regenerate, or require hand-maintained section indexes or activity logs; index generation and run metadata belong to OpenWiki tooling, and `.agents/docs/` (including its log) is removed by this change.

#### Scenario: Wiki index out of date
- **WHEN** a wiki directory index does not reflect newly added pages because no sync has run
- **THEN** lint reports it as informational guidance to rerun index sync, not as a failure
