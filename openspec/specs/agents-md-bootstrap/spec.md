# agents-md-bootstrap Specification

## Purpose

Lets the AKSK bootstrap flow (as extended by `aksk-bootstrap-system` — global tools in user scope via `npm i -g`, per-repo scaffold and routing merge) give consumer repos a senior-engineer behavioral baseline in their root `AGENTS.md`: seed it from the vendored FerroxLabs/agents-md file when absent, and force an explicit, user-driven decision when one already exists — never overwriting silently.

## Requirements

### Requirement: Seed missing root AGENTS.md from the vendored baseline

The bootstrap initializer SHALL create a missing root `AGENTS.md` containing the vendored FerroxLabs baseline wrapped in its `AKSK:AGENTS-BASELINE` marker block (with provenance header inside) so that AKSK-managed sections attach below real behavioral content instead of an empty router file.

#### Scenario: Fresh repo with no AGENTS.md

- **WHEN** the initializer runs in a repo with no root `AGENTS.md`
- **THEN** the file is created from the vendored baseline wrapped in its marker block including the provenance header, with no network access required

#### Scenario: Re-run after seeding is idempotent

- **WHEN** the initializer runs again and the marked baseline section already matches the vendored template
- **THEN** the run reports success as a no-op and does not rewrite the file

### Requirement: Managed-zone layout with distinct markers

A fully bootstrapped root `AGENTS.md` SHALL separate each content family behind its own marker block — upstream baseline (`AKSK:AGENTS-BASELINE`), OpenWiki (`OPENWIKI:START/END`), and AKSK sections (`AKSK:ROUTING`, `AKSK:LIFECYCLE`) — attached in that order, so any consumer can tell which content came from where, and updates to one family never rewrite another.

#### Scenario: All zones distinguishable after full bootstrap

- **WHEN** seeding, OpenWiki attachment, and AKSK section attachment have all run on a fresh repo
- **THEN** the file contains exactly one block per family, each within its own markers, ordered baseline → OpenWiki → AKSK

#### Scenario: Refresh touches only the baseline zone

- **WHEN** the vendored baseline is refreshed and re-attached in a file that also carries OpenWiki and AKSK blocks
- **THEN** only the content between the `AKSK:AGENTS-BASELINE` markers changes and all other zones remain byte-identical

### Requirement: Existing AGENTS.md blocks seeding until explicitly resolved

When a root `AGENTS.md` already exists, the initializer SHALL NOT write anything: it MUST exit non-zero with a message instructing the agent to ask the user whether to replace the file with the baseline or combine both using the LLM, and each choice SHALL correspond to an explicit command-line flag on a subsequent run.

#### Scenario: Existing file exits without writing

- **WHEN** the initializer runs in a repo that already has a root `AGENTS.md` and no resolution flag is given
- **THEN** the script exits non-zero, names the conflict, presents the replace-vs-combine options, and leaves the existing file byte-identical

#### Scenario: Explicit replace flag overwrites

- **WHEN** the initializer runs with the replace flag in a repo with an existing `AGENTS.md`
- **THEN** the file is replaced with the vendored baseline wrapped in its marker block including the provenance header

#### Scenario: Explicit combine flag stages for LLM merge

- **WHEN** the initializer runs with the combine flag in a repo with an existing `AGENTS.md`
- **THEN** the script stages the existing content and the baseline side-by-side in a session-scoped working area, prints exact instructions for the agent to produce the merged file, and the original remains untouched by the script itself

### Requirement: Vendored baseline carries provenance and opt-in refresh

The vendored baseline under `.agents/skills/aksk-bootstrap/references/` SHALL carry a provenance header naming its upstream source URL and capture date, and a dedicated refresh command SHALL update it from upstream only on explicit invocation.

#### Scenario: Provenance header survives seeding

- **WHEN** a repo is seeded from the vendored baseline
- **THEN** the marked baseline section contains the provenance header with the upstream source URL and capture date

#### Scenario: Offline refresh fails fast without corruption

- **WHEN** the refresh command cannot reach upstream
- **THEN** it exits non-zero with remediation and the previously vendored baseline remains intact and usable
