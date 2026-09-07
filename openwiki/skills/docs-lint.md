---
type: skill-reference
title: docs-lint Skill (Cross-Tool Lint)
description: Periodic coherence guard that verifies routing-block integrity, wiki coverage pairing, and stale curated pages across .agents/ and openwiki/.
tags:
- skills
- docs-lint
- lint
- maintenance
- cross-tool
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-df46a321fce7026f92166a02
    resource: repo://.agents/playbooks/pre-publish.md
  - id: openwiki-source-5398a69cb2cf8d556809da57
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_section.mjs
  - id: openwiki-source-d56b5afb22742020f2ab6b59
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-dce50581779fda5dd507dc34
    resource: repo://.agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
  - id: openwiki-source-dc8872a5e7d386c22ea2f135
    resource: repo://.agents/skills/aksk-bootstrap/SKILL.md
  - id: openwiki-source-9c913440d577c441cb56c5fa
    resource: repo://.agents/skills/docs-lint/bootstrap/README.md
  - id: openwiki-source-a32706bb92393653e69338b7
    resource: repo://.agents/skills/docs-lint/CONTRACT.md
  - id: openwiki-source-5af7f373fcb21f142106673c
    resource: repo://.agents/skills/docs-lint/SKILL.md
  - id: openwiki-source-8037e2358a2c4f9b2c722a11
    resource: repo://AGENTS.md
  - id: openwiki-source-54b54b9f7eb380534f682bb3
    resource: repo://openspec/changes/formalize-superseded-obsolete/proposal.md
  - id: openwiki-source-f7767c74e12e946558d335f1
    resource: repo://openspec/specs/agents-md-bootstrap/spec.md
  - id: openwiki-source-dc51f338f00dcd0763b107a6
    resource: repo://openspec/specs/cross-tool-lint/spec.md
  - id: openwiki-source-2361cff43709905e22758cbb
    resource: repo://scripts/check-agents-structure.sh
  - id: openwiki-source-5d609834bdc11b93524d04a9
    resource: repo://scripts/check-publish.sh
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# docs-lint (cross-tool lint)

**Folder:** `.agents/skills/docs-lint/` (`SKILL.md`, `CONTRACT.md`, `bootstrap/README.md`) · **Spec:** `openspec/specs/cross-tool-lint/spec.md`

Procedure-and-checklist skill with no bundled executable — an agent or maintainer runs the checks by inspection, with two narrow mechanical probes (doubled-path grep, frontmatter schema validation). Checklist detail lives in the skill's `CONTRACT.md`, not here.

## Wiring checks (fail the pass)

- **Routing-block integrity** — each root instruction file present carries exactly one byte-intact block per family in baseline → OpenWiki → AKSK order, with link targets existing; repair via the owning script.
- **Wiki contract present** — `openwiki/INSTRUCTIONS.md` carries `AKSK:WIKI-CONTRACT` markers; the attach script is append-only, idempotent and stub-aware, exits 2 with the verbatim `openwiki --init` prerequisite when missing, and refreshes only between markers on template upgrades.
- **Archived-change ↔ wiki coverage pairing** — every `openspec/changes/archive/` entry has descriptive outcomes in `openwiki/` or a recorded deferral.
- **Stale curated knowledge** — retired-skill references, `accepted` status with a successor set, dead `aksk_depends_on` targets; each flag names the superseding source.

## Content checks (report only)

Duplication and contradictions, oversized AGENTS sections, broken relative links, frontmatter contract violations, misplaced decision/troubleshooting content, and doubled-path hygiene. Prefers reclassification and compression over new text.

## Constraints

Reads root instruction files and marker blocks, `.agents/AGENTS.md` and playbooks, `INSTRUCTIONS.md` and curated trees, and the changes archive. Writes reports plus minimal edits to AKSK-owned files only — never OpenWiki-owned files, never marker interiors except via owning scripts, never source code. Run after several agent-assisted edits and before publishing.

## Related

- [Validation and Cross-Tool Lint](../operations/validation-and-lint.md) — validators plus lint check detail.
- [Knowledge Curation Contract](../concepts/knowledge-curation-contract.md) — the contract lint guards.
