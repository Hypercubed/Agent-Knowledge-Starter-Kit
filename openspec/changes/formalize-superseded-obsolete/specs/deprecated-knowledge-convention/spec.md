# Deprecated Knowledge Convention Spec

## Purpose

This spec formalizes the procedure for deprecating durable knowledge inside the Agent Knowledge Starter Kit (AKSK) so that both humans and AI agents can accurately identify inactive guidance without losing historical context, under OpenWiki's generated indexes.

## ADDED Requirements

### Requirement: Vocabulary rules
Deprecation vocabulary SHALL distinguish replaced decisions from dead troubleshooting patterns, and frontmatter keys SHALL match the `learning-distill` schemas.

#### Scenario: Deprecating a decision
- **WHEN** a decision under `openwiki/decisions/` is replaced by a newer decision
- **THEN** the term `Superseded` (marker `[SUPERSEDED]`) is used and the page frontmatter carries `aksk_status: superseded` with `aksk_superseded_by` pointing at the successor page

#### Scenario: Deprecating a troubleshooting pattern
- **WHEN** a troubleshooting pattern under `openwiki/troubleshooting/` no longer applies
- **THEN** the term `Obsolete` (marker `[OBSOLETE]`) is used and the page frontmatter carries `aksk_status: superseded` with `aksk_superseded_by` set where a successor exists

### Requirement: Machine-readable source of truth
The deprecation state SHALL live in page frontmatter, never only in index prose, so regeneration cannot lose it.

#### Scenario: Index regeneration
- **WHEN** `sync_wiki_indexes.mjs` regenerates the wiki indexes after a page is deprecated
- **THEN** the deprecated state remains fully recoverable from the page frontmatter (`aksk_status`, `aksk_superseded_by`)

### Requirement: Generated-index-safe representation
Deprecated entries SHALL surface their state through generator-preserved fields (the `description`, which the index generator renders) rather than hand-edited index sections, which regeneration wipes.

#### Scenario: Deprecated entry in a generated index
- **WHEN** a deprecated page appears in a generated `index.md`
- **THEN** its entry text begins with the bolded textual marker (`**[SUPERSEDED]**` or `**[OBSOLETE]**`) via its frontmatter `description` prefix, with no hand-written sections or strikethrough required in the index file

#### Scenario: Hand-authored prose links
- **WHEN** a hand-authored (non-generated) page links to a deprecated entry
- **THEN** the link SHOULD carry the textual marker and MAY use strikethrough (`~~[Title](file.md)~~`) as a visual cue

### Requirement: Page-body banner
Each deprecated page SHALL carry a human-readable status banner in its body stating the deprecation and linking the successor where one exists.

#### Scenario: Agent opens a deprecated page directly
- **WHEN** a reader opens the deprecated page file itself (bypassing the index)
- **THEN** the body banner unambiguously states the page is superseded or obsolete and points at the successor

### Requirement: File retention
Deprecated pages MUST remain in their respective curated directories (`openwiki/decisions/` or `openwiki/troubleshooting/`) and MUST NOT be deleted.

#### Scenario: Historical reference
- **WHEN** an old change, bundle, or page links to a deprecated entry
- **THEN** the link still resolves and the page explains its own deprecated state

## Dependencies & Out of Scope
- Out of scope: lifecycle rendering inside OpenWiki's index generator (upstream feature; this convention works without it).
- Out of scope: Automated migration scripts to proactively sweep for obsolete troubleshooting entries.
