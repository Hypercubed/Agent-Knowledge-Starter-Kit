---
type: "Reference"
title: "Repository Inventory"
description: "Repository map by authority zone: manifests, owned trees, and entrypoints."
tags: [inventory, repository-map, ownership, entrypoints]
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-62bd4cb693e4e881b3f88f6b
    resource: repo://.agents/.gitignore
  - id: openwiki-source-221b8d1823c4691ef36ad664
    resource: repo://.agents/AGENTS.md
  - id: openwiki-source-df46a321fce7026f92166a02
    resource: repo://.agents/playbooks/pre-publish.md
  - id: openwiki-source-c056a1ca61c0634d11844713
    resource: repo://.agents/skills/aksk-bootstrap/references/versions.json
  - id: openwiki-source-7381bbb8d2e7fd02da7469ce
    resource: repo://.agents/skills/aksk-bootstrap/references/wiki-contract-template.md
  - id: openwiki-source-5398a69cb2cf8d556809da57
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_section.mjs
  - id: openwiki-source-d56b5afb22742020f2ab6b59
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-78293e08bbba4e65fb2685ae
    resource: repo://.agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs
  - id: openwiki-source-d1960e41bf9a48af26e81829
    resource: repo://.agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs
  - id: openwiki-source-dce50581779fda5dd507dc34
    resource: repo://.agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
  - id: openwiki-source-dc8872a5e7d386c22ea2f135
    resource: repo://.agents/skills/aksk-bootstrap/SKILL.md
  - id: openwiki-source-d786624ba23d2df437591102
    resource: repo://.agents/skills/aksk-init/references/wiki-contract-template.md
  - id: openwiki-source-ff2d87cb54c01d07d6371400
    resource: repo://.agents/skills/aksk-init/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-9930f2885b3cb73d38a9300a
    resource: repo://.agents/skills/aksk-init/scripts/bootstrap-repo.mjs
  - id: openwiki-source-5a97b1d59b72f21589de6133
    resource: repo://.agents/skills/aksk-init/scripts/init_agents_md.mjs
  - id: openwiki-source-4ab0b6cc58dd78f7a5c0603e
    resource: repo://.agents/skills/aksk-init/SKILL.md
  - id: openwiki-source-7fe0106a3a83528f5b3d3755
    resource: repo://.agents/skills/learning-distill/SKILL.md
  - id: openwiki-source-764361c18355af2544814f55
    resource: repo://.agents/skills/task-closeout/SKILL.md
  - id: openwiki-source-db0f845febf0273d6fc22568
    resource: repo://.agents/skills/verify-install/SKILL.md
  - id: openwiki-source-d8d723e96d55a86c0b91977c
    resource: repo://.claude-plugin/plugin.json
  - id: openwiki-source-e119253b3c3737247dc63f2a
    resource: repo://.openwikiignore
  - id: openwiki-source-bc0a2f3905ac90dd0987d55b
    resource: repo://.remarkrc.json
  - id: openwiki-source-8037e2358a2c4f9b2c722a11
    resource: repo://AGENTS.md
  - id: openwiki-source-75cf85a44e08ef6c1c96b347
    resource: repo://openspec.yaml
  - id: openwiki-source-38af7bdd34d817fbd3c29077
    resource: repo://openspec/config.yaml
  - id: openwiki-source-c23cb9e8edf20ed2740abea1
    resource: repo://openspec/specs/aksk-bootstrap/spec.md
  - id: openwiki-source-d682bd16449a28825541bbed
    resource: repo://openspec/specs/aksk-init/spec.md
  - id: openwiki-source-5b54a58d1b51cd490b0e7162
    resource: repo://package.json
  - id: openwiki-source-2361cff43709905e22758cbb
    resource: repo://scripts/check-agents-structure.sh
  - id: openwiki-source-5d609834bdc11b93524d04a9
    resource: repo://scripts/check-publish.sh
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# Repository Inventory

`agent-knowledge-starter` is a distributable knowledge kit, not a runtime app. Inventory is organized by authority zone — ownership and entrypoints only, no per-file summaries. Run `git ls-files | sort` for exact tracked contents; session bundles and `node_modules/` are gitignored by design and never canonical.

## Root manifests and entrypoints

| Path | Role |
| --- | --- |
| `package.json` | Kit manifest (`name`/`version`/`description`, `scripts` test/format/check, `devDependencies` incl. pinned peer tools); `dependencies` empty — no runtime service |
| `openspec.yaml` | Minimal rule declaration: read-and-reference over `.agents/**` and `docs/**` |
| `AGENTS.md` | Root router entrypoint agents load; marker-delimited managed blocks (see [AGENTS.md Zoning](../concepts/agents-md-zoning.md)) |
| `openwiki/INSTRUCTIONS.md` | Wiki curation contract carrier (`AKSK:WIKI-CONTRACT` markers, append-only attach, never hand-edited inside markers) |
| `.openwikiignore` | Root ignore for generated evidence: `.agents/sessions/` (with `README.md` exception), anchored `/example/` |
| `.claude-plugin/plugin.json` | Marketplace manifest listing the portable user skills |
| `INSTALL.md`, `README.md`, `docs/` | Human-facing adoption docs and per-tool wiring guides |

Peer binaries (never installed by the kit): Node >= 22 plus per-user global `@fission-ai/openspec` and `openwiki`, caret ranges from `references/versions.json` (`@latest` only when unpinned). Verification via `check_peer_tools.mjs` fails fast with exit 2; only the global lane installs.

## Portable prescriptive zone: `.agents/`

The distributable artifact, validated by `scripts/check-agents-structure.sh`: `.agents/AGENTS.md` (compact routing directives, must stay small), `.agents/.gitignore` (`sessions/*` + `!sessions/README.md` — only the README tracked), `.agents/playbooks/` (durable procedures), `.agents/skills/` (`aksk-bootstrap` global preconditions and orchestrator, `aksk-init` per-repo initializer, `task-closeout` capture-only, `learning-distill` classification and promotion, `docs-lint` coherence pass, `verify-install` internal). The global lane (`bootstrap-global.mjs`) runs first, then the per-repo lane (`bootstrap-repo.mjs`); re-runs complete only missing steps and never half-install.

## Curated descriptive zone: `openwiki/`

`index.md` (generated catalog, never hand-edited), `overview.md` and `maintenance-format.md` (AKSK-curated, preserved across updates), `decisions/` and `troubleshooting/` (durable OKF pages authored by `learning-distill`, preserved via preserve-and-link), generated reference trees (`architecture/`, `concepts/`, `distribution/`, `governance/`, `integrations/`, `inventory/`, `operations/`, `skills/`, `workflows/`), and run metadata (`.last-update.json`, `.run.json` concurrency guard — check phase before editing mid-run).

## Process and intent zone: `openspec/`

`openspec/config.yaml` (`schema: spec-driven` plus per-artifact rules binding every change to closeout → distill → lint), `openspec/specs/` (graduated SHALL requirements — the shipped contract), `openspec/changes/` (active proposals, **Proposal-only** until archived) plus `archive/` of graduated changes. Source-of-truth ordering: graduated specs > in-flight delta > archived history.

## Tooling zone

`scripts/check-agents-structure.sh` (portable `.agents` validator) and `scripts/check-publish.sh` (publish wrapper: structure plus Markdown, link, leakage, and hygiene checks; `npm run check`), plus the Node ESM helpers under each skill's `scripts/`. Optional tools degrade to warnings, never silent passes.

## Scoping a change safely

Structure check → publish check → peer preconditions → idempotent bootstrap → knowledge placement (rules → `AGENTS.md`, procedures → `playbooks/`, rationale → `decisions/`, failures → `troubleshooting/`, evidence → `sessions/`).
