## ADDED Requirements

### Requirement: Validate Frontmatter Featured Flag
The `generate-durable-indexes.py` script SHALL read and parse boolean `featured` metadata attributes gracefully during documentation traversal scans.

#### Scenario: Document is feature flagged
- **WHEN** the script iterates over a `.md` file with `featured: true` in its frontmatter payload
- **THEN** it flags this specific record for insertion into the Quick Reference array data structure

### Requirement: Quick Reference Automated Injector
The script SHALL programmatically compose an automated featured list section and inject it precisely underneath the `## Quick Reference` header location inside the human-rendered `index.md` file blurb strings.

#### Scenario: Blurb contains quick reference declaration
- **WHEN** the markdown blurb contains the case-insensitive phrase `## Quick Reference`
- **THEN** it isolates the contents underneath the header but above the trailing standard definitions, appends the newly computed list of links matching `featured: true`, and injects the output safely.
