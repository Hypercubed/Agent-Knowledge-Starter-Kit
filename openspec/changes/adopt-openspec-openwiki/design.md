## Context

This repository is the first adopter: `openwiki/` was initialized out-of-band during dogfooding (the root `AGENTS.md` already carries a hand-merged OpenWiki routing block), while `.agents/` still contains the pre-2.0 skill set including skills slated for retirement. Both upstream tools are installed globally in the maintainer environment.

The defining constraint of this change: **OpenSpec and OpenWiki are peer dependencies.** AKSK assumes they exist, verifies before use, and never installs them. Automated installation, scaffolding, and agent-integration spread belong to the follow-on change `aksk-bootstrap-system`, which depends on this one's finalized skill set.

See proposal.md for motivation and capability list.

## Goals / Non-Goals

**Goals:**

- Rewire the experiential layer (closeout, distill, lint) onto the adopted tools with verifiable behavior.
- Make every tool invocation precondition explicit: binary on PATH, repo initialized, curation contract attached - each failing fast with exact remediation.
- Retire duplicated mechanisms cleanly, with supersession records so stale pointers redirect.

**Non-Goals:**

- Any installation, scaffolding, or provisioning automation (`aksk-bootstrap-system` owns that).
- Deciding whether 2.0 releases with or without the bootstrap change; this change must stand alone as releasable documentation-wise (peer-dependency prerequisites stated in README/INSTALL).

## Decisions

### D1: Peer-dependency contract over embedded setup

Skills invoke `openspec`/`openwiki` like any CLI peer dependency. Each invocation path first checks the binary resolves and fails with the exact `npm i -g` line otherwise. Verification never attempts installation.

*Alternative considered:* skills fall back to manual instructions when tools are missing. Rejected: silent mode-switching produces two divergent behaviors for one skill; fail-fast keeps one code path and honest errors.

### D2: Curation contract attaches by append-only merge

The AKSK curation section is appended to an existing `openwiki/INSTRUCTIONS.md`; OpenWiki-owned content is never replaced. Attachment recognizes OpenWiki's default stub content as "no contract present" (the stub ships from `openwiki --init`) but still never deletes it - the AKSK section lands below it. Idempotent by marker detection: the section appears exactly once after any number of runs.

*Rationale:* the file belongs to OpenWiki's initialization flow; AKSK claiming it wholesale would break upstream upgrades of that file.

### D3: Fail closed at distillation time

If the contract is absent (missing file or stub-only), distillation stops before writing any wiki output and prints remediation. Missing-file and missing-binary failures name their exact fix (`openwiki --init`, `npm i -g ... openwiki`).

*Alternative considered:* treat an absent contract as "nothing curated" and write freely. Rejected: a hand-curated wiki page could be regenerated away silently - unacceptable data-loss mode for a knowledge tool. The user confirmed fail-fast semantics.

### D4: Retirements are deletions plus decision records

`docs-search`, `docs-compile`, forked `openspec-*` skills, and `opsx-*` workflow copies are deleted, not deprecated-in-place; `openspec/config.yaml` stays as legitimate customization. Supersession of `repo-centric-wiki-tooling` and of the archived extraction-based `integrate-openwiki-skills` approach is recorded as decision entries so agents following stale pointers get a redirect target.

### D5: Division of labor recorded once, referenced everywhere

One decision entry states the three-layer split (OpenSpec = process, OpenWiki = descriptive, AKSK = experiential/curation). Other artifacts reference it rather than restating rationale.

### D6: Host-authored lesson pages; CLI reserved for reconciliation

`learning-distill` writes wiki pages itself (host-agent authoring), loading authoring guidance at runtime from the installed package's exported prompts (`createSystemPrompt` in `dist/agent/prompt.js`) and validating output with the shipped deterministic OKF helpers (`okf/frontmatter`, `okf/index-sync`). The headless CLI (`openwiki --update -p`) is not used for distillation output; it remains the scheduled whole-wiki reconciliation path (GitHub Actions workflow).

*Rationale:* distilled lessons exist as session context; OpenWiki's CLI runs its own LLM agent that re-discovers evidence from the repo and cannot see what the session learned. Delegating distillation output to it discards exactly the knowledge being captured, adds a provider-credential dependency at write time, and routes content through a foreign model. Runtime import of upstream guidance avoids the drift problem that motivated rejecting prompt extraction.

*Verified against shipped v0.3.3:* prompts and OKF helpers are exported from `dist/`; the MCP lifecycle server and `integrations install` lanes exist only on unreleased main-branch source and are intentionally outside this change's dependency surface.

### D7: Marked routing-note attachment owned by the bootstrap skill

The kit's routing note for root agent instruction files (AGENTS.md, CLAUDE.md, GEMINI.md) ships as a marker-delimited template (`<!-- AKSK:ROUTING:BEGIN/END -->`) attached by a script in the `aksk-bootstrap` skill, mirroring the wiki-contract mechanism. Existing content is never replaced; re-runs are idempotent no-ops. Unlike `INSTRUCTIONS.md`, a missing root router file is created with only the note, because these files have no upstream initializer - AKSK is their owner of record. The note content matches the canonical block the integration guides instruct users to add manually. The same script generalizes to N managed sections: markers are read from the chosen template, so additional blocks (e.g. `AKSK:LIFECYCLE`, carrying the self-improvement-loop mandate that previously lived hand-merged in root files) attach through one mechanism and stay independently refreshable and lint-checkable.

### D8: Knowledge base consolidates into curated wiki trees; logs and indexes dropped

Decision records and troubleshooting entries move from `.agents/docs/` to curated OKF pages under `openwiki/{decisions,troubleshooting}/`, protected by the curation contract's preserve-and-link semantics. Lifecycle state rides in `aksk_status` frontmatter extensions; entry identity stays the filename stem. Hand-built section indexes are deleted - deterministic OpenWiki index sync owns indexing - and one curated overview page replaces the grouped Quick Reference. `.agents/docs/log.md` is deleted rather than migrated: OpenWiki reserves its own run metadata, and distillation accountability lives in bundle `summary.json` flags plus git history.

*Rationale:* with portability dropped (AKSK hard-requires openspec and openwiki), keeping a parallel knowledge representation outside the OpenWiki flow guarantees drift; OpenWiki update runs already generate pages describing the knowledge layer. Consolidation leaves AKSK only judgment work: classification, routing, lint. Recorded as decision `knowledge-consolidation-into-openwiki`, which supersedes the location aspect of `single-tree-architecture-agents`. Breaking-change burden is accepted as low: usage is personal-scale and hand-migration is acceptable.

## Risks / Trade-offs

- [Consumers adopt this change without the follow-on bootstrap] -> README/INSTALL state peer-dependency prerequisites as manual steps; every failure message prints its exact command, so manual adoption degrades to copy-paste, not guesswork.
- [Stub detection may break if OpenWiki changes its default INSTRUCTIONS.md content] -> Treat known-stub matching as advisory only; absence of the AKSK marker section is the authoritative signal, so an unrecognized stub still fails closed safely.
- [Hand-merged AGENTS.md block in this repo may drift from what bootstrap will generate later] -> Lint's routing-block integrity check catches drift regardless of origin; bootstrap reuses the same markers.
- [Retiring docs-search/docs-compile before wiki indexing proves itself in-repo] -> Mitigated by dogfood ordering: deletion commits land only after distill/lint validate against this repository's live `openwiki/`.
- [OpenWiki main carries unreleased functionality (MCP server, integration lanes) that the published npm release lacks] -> This change pins its dependency surface to shipped 0.3.x exports (D6); follow-on bootstrap work tracks upstream releases and adopts MCP lanes only when they ship.
- [Upstream changes the default INSTRUCTIONS.md stub wording] -> Stub matching is advisory; absence of the AKSK marker section is the authoritative no-contract signal (see Risks in D2's attachment semantics).

## Migration Plan

**Sequencing rule:** template or pointer changes (routing-note bullet, contract trees, skill destinations) land together with the work that makes their targets real, and attached marker blocks in root files are refreshed only after those targets exist. Interim state between tasks here is acceptable only if old and new targets both resolve.

1. Record decision entries (division of labor, distribution context, ownership partition, supersessions).
2. Implement `wiki-contract` attachment + template; rewrite `learning-distill`; repurpose `docs-lint`; slim `task-closeout`.
3. Delete retired skills/workflows; update README/INSTALL/architecture with peer-dependency prerequisites.
4. Dogfood against this repository: attach the contract to the existing stub, then validate distillation and lint end-to-end.
5. Reconcile affected open proposals (see final task group).

Rollback: phases land as reviewable commits; deletions come last and revert cleanly. Consumer repos running prior kit versions are unaffected until they upgrade.

## Open Questions

None. Release sequencing (2.0 with or without `aksk-bootstrap-system`) is an explicit maintainer decision deferred outside this planning scope; both orders work because this change stands alone.
