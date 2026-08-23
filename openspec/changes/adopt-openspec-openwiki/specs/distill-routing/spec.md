## Purpose

Defines where `learning-distill` sends distilled knowledge: descriptive lessons about the repository become OpenWiki pages in OKF format, while prescriptive lessons about agent behavior stay inside `.agents/`.

## ADDED Requirements

### Requirement: Descriptive lessons route to OpenWiki
The distillation process SHALL write descriptive durable lessons (facts, rationale, architecture, troubleshooting patterns) as OpenWiki pages in OKF format and refresh the wiki index afterwards, rather than creating files under `.agents/docs/`.

#### Scenario: Distilling a descriptive lesson
- **WHEN** a session bundle yields a descriptive lesson such as an architectural rationale
- **THEN** distillation produces an OKF-format wiki page under `openwiki/` and triggers the wiki index update

### Requirement: Prescriptive lessons stay in .agents
The distillation process SHALL route prescriptive lessons (agent behavior rules, procedures) to `.agents/AGENTS.md`, playbooks, or decisions under `.agents/docs/`, and MUST NOT place them in `openwiki/`.

#### Scenario: Distilling a behavior rule
- **WHEN** a session bundle yields a rule governing future agent behavior
- **THEN** it lands in the `.agents/` layer and no wiki page is created for it

### Requirement: Curated pages preserved on update
When updating the wiki, distillation SHALL treat page trees marked AKSK-curated in `openwiki/INSTRUCTIONS.md` as preserve-and-link targets: their AKSK-authored content is kept and linked rather than overwritten by generated content, and AKSK-specific frontmatter extension fields on those pages remain meaningful after the update round-trip.

#### Scenario: Update touches a curated page
- **WHEN** a wiki update would regenerate a page whose tree is marked curated in `INSTRUCTIONS.md`
- **THEN** the AKSK-authored content and frontmatter extensions survive and generated material links to the curated page instead of replacing it

### Requirement: Fail fast on missing prerequisites
Distillation SHALL verify, before writing any wiki output, that the `openwiki` binary is available and that `openwiki/INSTRUCTIONS.md` carries the AKSK curation contract section. If either is missing or the file only contains the default OpenWiki stub, distillation SHALL stop without writing wiki output and print the exact remediation steps.

#### Scenario: Wiki tool absent
- **WHEN** distillation runs on a machine without the `openwiki` binary installed
- **THEN** it stops before writing any pages and prints the exact global install command

#### Scenario: Contract not yet attached
- **WHEN** `openwiki/INSTRUCTIONS.md` exists but lacks the AKSK curation section (including the default stub case)
- **THEN** distillation stops without writing wiki output and points to the contract attachment step

