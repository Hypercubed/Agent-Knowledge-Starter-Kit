# wiki-contract Specification

## Purpose
Attaches the AKSK curation contract to an already-initialized OpenWiki installation and enforces peer-dependency preconditions: AKSK appends its own instructions to existing ones, never replaces them, and fails fast with exact remediation when the environment is not ready.

## Requirements
### Requirement: Contract attaches to existing instructions only
The AKSK contract attachment SHALL append the AKSK curation section (curated page trees, preserve-and-link semantics, meaningful frontmatter extensions) to an existing `openwiki/INSTRUCTIONS.md`. It MUST NOT create the file, replace its existing content, or remove OpenWiki-owned sections. Re-running the attachment SHALL be idempotent - the section appears exactly once.

#### Scenario: Attaching to a fresh wiki
- **WHEN** attachment runs against an initialized repo whose `INSTRUCTIONS.md` holds only OpenWiki's default content
- **THEN** the AKSK curation section is appended below the existing content and nothing is removed

#### Scenario: Re-running attachment
- **WHEN** the AKSK curation section is already present and attachment runs again
- **THEN** the file is unchanged

### Requirement: Fail fast when the repo is uninitialized
If `openwiki/INSTRUCTIONS.md` does not exist, the attachment SHALL fail immediately without creating directories or files, and SHALL print the initialization prerequisite (`openwiki --init` or equivalent) verbatim.

#### Scenario: No wiki initialized
- **WHEN** attachment runs in a repo with no `openwiki/` directory
- **THEN** it exits with a failure naming the missing precondition and performs no writes

### Requirement: Peer tools verified before use
Every AKSK skill or script that invokes `openspec` or `openwiki` SHALL first verify the binary resolves on PATH and fail with a message containing the exact install command when it does not. Verification MUST NOT attempt installation.

#### Scenario: Missing openspec binary
- **WHEN** a skill needs `openspec` and the binary is not on PATH
- **THEN** the skill stops with the exact `npm i -g @fission-ai/openspec@latest` instruction instead of attempting the operation
