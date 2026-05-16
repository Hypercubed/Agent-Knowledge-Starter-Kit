## MODIFIED Requirements

### Requirement: Generate Durable Index Header Retention
The index generation script SHALL preserve any human-authored introductory content residing above the raw `## Index` execution tag boundaries.

#### Scenario: Pre-pinned curation contents
- **WHEN** the generator parses existing index markdown containing manual summaries
- **THEN** it must dynamically reconstruct the document by reassembling `parsed["blurb"]`, while additionally augmenting the Quick Reference target zone with auto-escalated data streams.
