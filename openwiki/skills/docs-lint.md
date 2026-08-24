---
type: skill-reference
title: "docs-lint Skill (Cross-Tool Lint)"
description: "Periodic lint pass guarding the wiring between AKSK and its adopted tools: routing-block integrity in root instruction files, archived-change/wiki coverage pairing, stale curated knowledge pages, plus duplication, contradiction, broken-link, and path-hygiene checks across .agents/ and openwiki/."
tags: [skills, docs-lint, lint, maintenance, cross-tool]
timestamp: 2026-08-23T23:30:00Z
openwiki:
  roles: [testing, operations]
  source_paths:
    - .agents/skills/docs-lint/SKILL.md
    - .agents/skills/docs-lint/CONTRACT.md
    - openspec/specs/cross-tool-lint/spec.md
  invariants: ["Wiring failures fail the pass; content issues are report-and-suggest only.", "Never writes OpenWiki-owned files; index drift is reported as advice to rerun sync_wiki_indexes.mjs.", "Index/log ownership is out of scope: OpenWiki tooling owns indexes; no activity log exists."]
---

# docs-lint (cross-tool lint)

**Folder:** `.agents/skills/docs-lint/` · **Files:** `SKILL.md`, `CONTRACT.md`, `bootstrap/README.md`

## Goal

Keep the wiring between AKSK and its adopted tools coherent: routing blocks intact, archived OpenSpec changes covered by wiki pages, curated knowledge truthful. This is a **procedure-and-checklist skill only — no bundled executable script**; the maintainer or agent runs the checks by inspection.

## Inputs (read-only scope)

Root instruction files and their marker blocks (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md` when present); `.agents/AGENTS.md` and `.agents/playbooks/`; `openwiki/INSTRUCTIONS.md` and the curated trees under `openwiki/`; `openspec/changes/archive/` (for coverage pairing).

## Initialization — depends on learning-distill templates

This kit keeps exactly **one** copy of scaffold templates under learning-distill's `bootstrap/`; docs-lint's own bootstrap folder contains only a README pointing there. Initialization defers to [learning-distill](learning-distill.md) initialization. No `.agents/docs/` scaffold exists anymore — durable knowledge lives in the wiki.

## The checks

### Wiring checks (fail the pass)

- **Routing-block integrity** — in every root instruction file present, each managed block is intact and its targets exist: each `AKSK:*` block (`ROUTING`, `LIFECYCLE`) exactly once with existing targets; refresh stale blocks with `node aksk-bootstrap/scripts/attach_section.mjs <root> <target> <template>`. The `<!-- OPENWIKI:START/END -->` block is verified for presence only — never hand-edited. If `add-agents-md-bootstrap` lands, a third family (`AKSK:AGENTS-BASELINE`, with provenance header) joins the integrity set.
- **Wiki contract present** — `openwiki/INSTRUCTIONS.md` carries the `AKSK:WIKI-CONTRACT` markers; refresh via `attach_wiki_contract.mjs` if its template changed.
- **Archived-change/wiki coverage pairing** — each change under `openspec/changes/archive/` must have descriptive outcomes represented in `openwiki/` or be exempted by a recorded deferral on the change's summary page.
- **Archived-change/wiki coverage pairing** — each change under `openspec/changes/archive/` must have descriptive outcomes represented in `openwiki/` or be exempted by a recorded deferral on the change's summary page. Worked deferral examples: `openspec/changes/archive/2026-08-23-aksk-openspec-bridge/wiki-coverage.md` (scope recorded on the governance page) and the two 2026-07-18 OBE deferrals.
- **Stale curated knowledge** — pages under `openwiki/{decisions,troubleshooting}/` whose claims conflict with repository reality: references to retired skills, `aksk_status: accepted` on a page whose successor exists (`aksk_superseded_by` set), or dead `aksk_depends_on` targets. Flag with the superseding source. This check is also where the reconciled triple-lock convention from `formalize-superseded-obsolete` gets verified: superseded pages carry `aksk_status: superseded`, and listings that surface them add the bold `[SUPERSEDED]`/`[OBSOLETE]` prefix and strikethrough lock.

### Content checks (report, suggest)

- Duplication and contradictions between `.agents/AGENTS.md`, playbooks, and knowledge pages; oversized AGENTS sections.
- Broken relative links within `.agents/` and `openwiki/`.
- Frontmatter contract of curated pages: filename stem unique per tree; decision pages carry `aksk_status`; validate against the JSON Schemas under `learning-distill/references/*.schema.json`.
- Troubleshooting entries that should be playbooks; decision pages that should compress into AGENTS guidance.
- **Path hygiene:** grep for doubled `.agents/.agents` segments under `.agents/`, `README.md`, `INSTALL.md`, `docs/` (symptom of bad global replace); the same check hard-fails in `scripts/check-publish.sh`.

Index-coverage checking is explicitly out of scope: deterministic index sync owns indexes ([aksk-bootstrap](aksk-bootstrap.md)). When a directory index lags newly added pages, lint reports it as informational guidance to rerun `sync_wiki_indexes.mjs`, not as a failure.

## Outputs and constraints

Produce a **lint report** plus optional minimal edits to AKSK-owned files only (`.agents/AGENTS.md`, playbooks, curated page content). Never write OpenWiki-owned files (indexes, run metadata). Do not append to any log — none exists; prefer reclassification and compression over adding text; do not modify source code; do not delete knowledge without explicit justification.

## Focused validation

Run a pass after several agent-assisted edits and before publishing (step 9 of the [pre-publish playbook](../../.agents/playbooks/pre-publish.md)). Narrow mechanical pieces you can run directly: the doubled-path grep (`rg -n '\.agents/\.agents/' README.md INSTALL.md docs .agents`) and frontmatter schema validation against the JSON Schemas. The cross-tool checks were dogfood-validated against this repo's state (task 5.3 of the archived step-1 change, [OpenSpec workflow](../governance/openspec-workflow.md)); the coverage-pairing check now has three worked deferral examples in `openspec/changes/archive/*/wiki-coverage.md` files.
