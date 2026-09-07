---
type: operations
title: Validation and Cross-Tool Lint
description: Deterministic validators (check-agents-structure.sh vs check-publish.sh) and the docs-lint cross-tool wiring pass.
tags:
- validation
- lint
- docs-lint
- check-publish
- cross-tool
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-df46a321fce7026f92166a02
    resource: repo://.agents/playbooks/pre-publish.md
  - id: openwiki-source-da03faceacac4fd818b473f3
    resource: repo://.agents/skills/aksk-bootstrap/references/lifecycle-template.md
  - id: openwiki-source-0294ec7c02cfa2beeca87331
    resource: repo://.agents/skills/aksk-bootstrap/references/routing-note-template.md
  - id: openwiki-source-7381bbb8d2e7fd02da7469ce
    resource: repo://.agents/skills/aksk-bootstrap/references/wiki-contract-template.md
  - id: openwiki-source-5398a69cb2cf8d556809da57
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_section.mjs
  - id: openwiki-source-d56b5afb22742020f2ab6b59
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-d1960e41bf9a48af26e81829
    resource: repo://.agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs
  - id: openwiki-source-67d81b3c5bf101f8b3eb3d2a
    resource: repo://.agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs
  - id: openwiki-source-dce50581779fda5dd507dc34
    resource: repo://.agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
  - id: openwiki-source-dc8872a5e7d386c22ea2f135
    resource: repo://.agents/skills/aksk-bootstrap/SKILL.md
  - id: openwiki-source-a32706bb92393653e69338b7
    resource: repo://.agents/skills/docs-lint/CONTRACT.md
  - id: openwiki-source-5af7f373fcb21f142106673c
    resource: repo://.agents/skills/docs-lint/SKILL.md
  - id: openwiki-source-bc0a2f3905ac90dd0987d55b
    resource: repo://.remarkrc.json
  - id: openwiki-source-8037e2358a2c4f9b2c722a11
    resource: repo://AGENTS.md
  - id: openwiki-source-dc51f338f00dcd0763b107a6
    resource: repo://openspec/specs/cross-tool-lint/spec.md
  - id: openwiki-source-5b54a58d1b51cd490b0e7162
    resource: repo://package.json
  - id: openwiki-source-2361cff43709905e22758cbb
    resource: repo://scripts/check-agents-structure.sh
  - id: openwiki-source-5d609834bdc11b93524d04a9
    resource: repo://scripts/check-publish.sh
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# Validation and Cross-Tool Lint

Two complementary layers guard this repository's knowledge wiring: **deterministic bash validators** that enforce file shape without network access, and the **`docs-lint` procedure-and-checklist skill** that verifies cross-artifact coherence. The validators own structure; the lint pass owns wiring. Neither owns index regeneration — index drift is fixed by rerunning `sync_wiki_indexes.mjs`. Checklist detail lives in the [docs-lint](../skills/docs-lint.md) contract, not here.

## Validators

**`check-agents-structure.sh [target]`** (default `.agents`) — portable shape check: target exists; required files present (`AGENTS.md`, `.gitignore`, `playbooks/README.md`, `sessions/README.md`, portable `SKILL.md` files, task-closeout example bundle); session tracking (only `sessions/README.md` tracked, bundles ignored); `SKILL.md` frontmatter markers; JSON validity via `jq` when present. Exit 0 iff no failures.

**`check-publish.sh`** (`npm run check`) — release wrapper that `cd`s to the git root, delegates structure to the portable validator on root `.agents` only, then adds Markdown formatting (`remark --frail`), per-file link checks, leakage scans (warning-only backstop), doubled `.agents/.agents` path hygiene (hard fail), and a published-files listing. Missing optional tools degrade to warning-skips; any failure blocks publishing.

## docs-lint wiring checks (fail the pass)

1. **Routing-block integrity** — each root instruction file present carries exactly one byte-intact block per family in baseline → OpenWiki → AKSK order, with link targets existing on disk. Repair by rerunning the owning script (`init_agents_md.mjs`, `attach_section.mjs`).
2. **Wiki contract present** — `openwiki/INSTRUCTIONS.md` carries `AKSK:WIKI-CONTRACT` markers; drift repaired by rerunning `attach_wiki_contract.mjs`.
3. **Archived-change ↔ wiki coverage pairing** — each `openspec/changes/archive/` entry has descriptive outcomes in `openwiki/` or a recorded deferral.
4. **Stale curated knowledge** — retired-skill references, `aksk_status: accepted` with `aksk_superseded_by` set, dead `aksk_depends_on` targets. Each flag names the superseding source.

Content checks (duplication, contradictions, broken links, frontmatter contract, mis-placed entries, path hygiene) report and suggest without failing the pass. Lint writes reports plus minimal edits to AKSK-owned files only — never OpenWiki-owned files, never marker interiors except via owning scripts.

## Baseline staleness (informational)

The FerroxLabs baseline is vendored offline with a provenance header; seeding never touches the network. `refresh_agents_baseline.mjs --check` validates upstream without writing; a capture date older than six months surfaces as informational advice, not a blocking failure, and failed refreshes leave the vendored copy byte-identical.

## Invariants

- No installation: every script verifies prerequisites and exits 2 with remediation instead of installing.
- Bounded probes with graceful degradation: missing `jq`, `npx`, or `rg` degrades to warning-skips.
- Fail-fast with remediation on unknown templates, directory targets, missing wiki init, or baseline conflicts.
- Full docs-lint pass after several agent-assisted edits and before publishing (pre-publish playbook step 9); deterministic validators are cheap enough for CI on every push.
