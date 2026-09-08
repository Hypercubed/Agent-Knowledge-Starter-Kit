---
name: docs-lint
description: Cross-tool lint pass guarding the wiring between AKSK and its adopted tools - routing-block integrity in root instruction files, archived-change/wiki coverage pairing, stale curated knowledge pages, plus duplication, contradiction, broken-link, and path-hygiene checks across `.agents/` and `openwiki/`. Use as a periodic maintenance pass.
---

# Docs Lint

## Goal

Keep the AKSK/OpenWiki knowledge wiring coherent: routing blocks intact, archived changes covered, curated pages truthful.

Machine-oriented scope: [`CONTRACT.md`](CONTRACT.md).

## Inputs

- Root instruction files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md` when present) - marker blocks
- `.agents/AGENTS.md`, `.agents/playbooks/`
- `openwiki/INSTRUCTIONS.md`, curated trees under `openwiki/`
- `openspec/changes/archive/` (for coverage pairing)

## Skill initialization

Ensure the shared scaffold via **learning-distill** initialization when that skill is present; this skill owns no bootstrap templates. No `.agents/docs/` scaffold exists anymore - durable knowledge lives in the wiki.

## Checks

### Wiring checks (fail the pass)

- **Routing-block integrity** — In every root instruction file present, verify each managed block is intact and its targets exist:
  - `AKSK:AGENTS-BASELINE` (FerroxLabs baseline): exactly one block when `AGENTS.md` was seeded; contains provenance header (source URL, capture date, MIT notice, refresh pointer). Flag missing or damaged block; refresh via `node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs --replace` or `refresh_agents_baseline.mjs` for staleness (agent compares `Captured: YYYY-MM-DD` >6 months old; no dedicated lint script — use `refresh_agents_baseline.mjs --check` to validate).
  - each `AKSK:*` block (`ROUTING`, `LIFECYCLE`): exactly one of each; targets named inside must exist. Refresh stale blocks with `node aksk-bootstrap/scripts/attach_section.mjs <root> <target> <template>`.
  - `<!-- OPENWIKI:START/END -->`: never hand-edit; verify presence only; zoned order must be baseline → OpenWiki → AKSK.
- **Wiki contract present** — `openwiki/INSTRUCTIONS.md` carries the `AKSK:WIKI-CONTRACT` markers; refresh with `attach_wiki_contract.mjs` if its template changed.
- **Archived-change/wiki coverage pairing** — For each change under `openspec/changes/archive/`, descriptive outcomes must appear in `openwiki/` or be covered by a recorded deferral. Report uncovered archived changes. A deferral recorded on the change's summary page exempts it.
- **Stale curated knowledge** — Pages under `openwiki/{decisions,troubleshooting}/` whose claims conflict with repository reality: references to retired skills, `aksk_status: accepted` on pages whose successor exists (`aksk_superseded_by` set), or dead `aksk_depends_on` targets. Flag with the superseding source.

### Content checks (report, suggest)

- duplication and contradictions between `.agents/AGENTS.md`, playbooks, and knowledge pages
- inlined adopt-the-kit prose in `docs/integrations/`: flag any product page whose Setup step 1 inlines the canonical sentence instead of linking `[Adopting the kit](./patterns.md#adopting-the-kit)` — grep `Install starter skills in the target repo with` must return hits only in `docs/integrations/patterns.md`, never in a product page
- oversized AGENTS sections
- broken relative links within `.agents/` and `openwiki/`
- frontmatter contract of knowledge pages: filename stem unique per tree; decision pages carry `aksk_status`; validate against `learning-distill/references/*.schema.json`
- troubleshooting entries that should be playbooks; decision pages that should compress into AGENTS guidance
- **Path hygiene:** search for doubled `.agents/.agents` segments under `.agents/`, `README.md`, `INSTALL.md`, `docs/`

## Output

A lint report plus optional minimal edits. Do not modify OpenWiki-owned files; propose rerunning `sync_wiki_indexes.mjs` for index drift instead of failing.

## Constraints

- Prefer reclassification and compression over adding text.
- Do not modify source code; do not delete knowledge without explicit justification.
