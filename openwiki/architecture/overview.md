---
type: Reference
title: AKSK Architecture Overview
description: Top-level system map of the Agent Knowledge Starter Kit as glue over peer tools, with global versus per-repo lanes and owned trees.
tags: [architecture, overview, bootstrap, knowledge-layer]
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-62bd4cb693e4e881b3f88f6b
    resource: repo://.agents/.gitignore
  - id: openwiki-source-221b8d1823c4691ef36ad664
    resource: repo://.agents/AGENTS.md
  - id: openwiki-source-d14430fd7f922c01d2d4c9b4
    resource: repo://.agents/playbooks/README.md
  - id: openwiki-source-c056a1ca61c0634d11844713
    resource: repo://.agents/skills/aksk-bootstrap/references/versions.json
  - id: openwiki-source-5398a69cb2cf8d556809da57
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_section.mjs
  - id: openwiki-source-d56b5afb22742020f2ab6b59
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-78293e08bbba4e65fb2685ae
    resource: repo://.agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs
  - id: openwiki-source-d1960e41bf9a48af26e81829
    resource: repo://.agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs
  - id: openwiki-source-181fd64540d760eef80f754f
    resource: repo://.agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs
  - id: openwiki-source-67d81b3c5bf101f8b3eb3d2a
    resource: repo://.agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs
  - id: openwiki-source-dce50581779fda5dd507dc34
    resource: repo://.agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
  - id: openwiki-source-dc8872a5e7d386c22ea2f135
    resource: repo://.agents/skills/aksk-bootstrap/SKILL.md
  - id: openwiki-source-944a38bc18074fe81ed45b1f
    resource: repo://.agents/skills/aksk-init/scripts/attach_section.mjs
  - id: openwiki-source-ff2d87cb54c01d07d6371400
    resource: repo://.agents/skills/aksk-init/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-9930f2885b3cb73d38a9300a
    resource: repo://.agents/skills/aksk-init/scripts/bootstrap-repo.mjs
  - id: openwiki-source-5a97b1d59b72f21589de6133
    resource: repo://.agents/skills/aksk-init/scripts/init_agents_md.mjs
  - id: openwiki-source-a32706bb92393653e69338b7
    resource: repo://.agents/skills/docs-lint/CONTRACT.md
  - id: openwiki-source-5af7f373fcb21f142106673c
    resource: repo://.agents/skills/docs-lint/SKILL.md
  - id: openwiki-source-7fe0106a3a83528f5b3d3755
    resource: repo://.agents/skills/learning-distill/SKILL.md
  - id: openwiki-source-bc5af49c81a8aed294e3b8b0
    resource: repo://.agents/skills/task-closeout/CONTRACT.md
  - id: openwiki-source-764361c18355af2544814f55
    resource: repo://.agents/skills/task-closeout/SKILL.md
  - id: openwiki-source-8037e2358a2c4f9b2c722a11
    resource: repo://AGENTS.md
  - id: openwiki-source-115b2dad781e2a2c5b5a980d
    resource: repo://docs/architecture.md
  - id: openwiki-source-096a781fb160ef979fa31121
    resource: repo://INSTALL.md
  - id: openwiki-source-c13ebc2b6ebca535d0e7e2e3
    resource: repo://openspec/changes/add-task-start/proposal.md
  - id: openwiki-source-38af7bdd34d817fbd3c29077
    resource: repo://openspec/config.yaml
  - id: openwiki-source-f7767c74e12e946558d335f1
    resource: repo://openspec/specs/agents-md-bootstrap/spec.md
  - id: openwiki-source-c23cb9e8edf20ed2740abea1
    resource: repo://openspec/specs/aksk-bootstrap/spec.md
  - id: openwiki-source-d682bd16449a28825541bbed
    resource: repo://openspec/specs/aksk-init/spec.md
  - id: openwiki-source-e057169748acea114e857ee9
    resource: repo://openspec/specs/canonical-user-skills-scope/spec.md
  - id: openwiki-source-eeb2cc49563df1de1086bb7e
    resource: repo://openspec/specs/distill-routing/spec.md
  - id: openwiki-source-c16c0a8de8d2a3a0385db0af
    resource: repo://openspec/specs/install-lanes/spec.md
  - id: openwiki-source-53df649d4fbc85ef0839d164
    resource: repo://openspec/specs/wiki-contract/spec.md
  - id: openwiki-source-5b54a58d1b51cd490b0e7162
    resource: repo://package.json
  - id: openwiki-source-2361cff43709905e22758cbb
    resource: repo://scripts/check-agents-structure.sh
  - id: openwiki-source-5d609834bdc11b93524d04a9
    resource: repo://scripts/check-publish.sh
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# AKSK Architecture Overview

The Agent Knowledge Starter Kit (AKSK) is a shareable, tool-agnostic starter kit for maintaining a compiled repository knowledge layer for coding agents. It ships markdown conventions and agent skills — not an application. There is no runtime service or database; `dependencies` is empty and `npm test` intentionally prints `Error: no test specified`.

## Peer dependencies

AKSK is glue over two globally installed tools it never installs implicitly:

- **OpenSpec** (`@fission-ai/openspec`) — owns the intent and process layer under `openspec/`.
- **OpenWiki** (`openwiki`, plus one-time `openwiki --init` per repo) — owns the descriptive knowledge layer under `openwiki/`.

Skills verify these prerequisites before acting and fail fast with exact `npm i -g` install commands when they are missing. Only the deterministic global lane performs per-user installs; all other skills and the per-repo lane only verify. Node >= 22 is the single kit runtime for all `.mjs` scripts. Lane behavior is specified in `openspec/specs/aksk-bootstrap/spec.md` and `openspec/specs/aksk-init/spec.md`; install entry points are in [Quickstart](../quickstart.md) and [Distribution and Tool Wiring](../integrations/distribution-and-tool-wiring.md).

## Zone stack

Organize the repo by authority, not by tree listing. Each zone has one owner, one write path, and one validation path.

- **Zone 1 — Root router.** `AGENTS.md` at the repo root is the entrypoint agents load. AKSK appends marker-delimited managed sections (behavioral baseline, OpenWiki block, AKSK routing, AKSK lifecycle) without replacing existing content. Zoning guarantees are specified in `openspec/specs/agents-md-bootstrap/spec.md` and mapped in [AGENTS.md Zoning](../concepts/agents-md-zoning.md).
- **Zone 2 — Portable prescriptive layer (`.agents/`).** Behavior rules that travel with the repo: `.agents/AGENTS.md` routing directives and learnings (kept small), `.agents/playbooks/` durable procedures, `.agents/sessions/` gitignored temporary evidence (only `sessions/README.md` tracked), `.agents/skills/` portable plus maintainer-internal skills. Tool switching does not invalidate accumulated knowledge because the on-disk layout is stable.
- **Zone 3 — Curated descriptive layer (`openwiki/`).** Durable facts and rationale as curated OKF pages (`decisions/`, `troubleshooting/`, `overview.md`, `maintenance-format.md`), owned by the distilling agent under the preserve-and-link contract in `openwiki/INSTRUCTIONS.md`. Generated artifacts (`index.md`, `.last-update.json`, `.run.json`) live alongside but are never hand-edited. Layer rules are in [Knowledge Layer](./knowledge-layer.md).
- **Zone 4 — Process and intent layer (`openspec/`).** `openspec/changes/` holds active proposals; `openspec/specs/` holds graduated SHALL requirements. Division of labor: OpenSpec owns requirements, OpenWiki owns descriptive facts, AKSK owns experiential capture and curation. Distillation never duplicates a codified SHALL requirement as a wiki page. See [OpenSpec Workflow Governance](../governance/openspec-workflow.md).

## Skills and scripts

Each skill's `SKILL.md` plus its `CONTRACT.md` is the authority for entrypoints, flags, and file shapes; the specs are the authority for lane behavior:

- `aksk-bootstrap` — per-user global lane: Node check, peer-tool installs from `references/versions.json`, PATH verification, global skill spread. Never touches per-repo files except receipts verification. See [aksk-bootstrap](../skills/aksk-bootstrap.md).
- `aksk-init` — per-repo lane: `.agents/` scaffold and baseline seeding first, then `openspec init`, `openwiki --init`, routing and contract attachment. Never attempts global installs. See [aksk-init](../skills/aksk-init.md).
- `task-closeout` — capture-only; writes only under `.agents/sessions/`.
- `learning-distill` — classification and promotion into `.agents/` and curated wiki trees.
- `docs-lint` — read-mostly coherence pass; minimal fixes to AKSK-owned files only.
- `verify-install` — internal validation of installed skill layout.

> **Proposal-only (not shipped):** `openspec/changes/add-task-start` proposes a `task-start` skill seeding the session folder before work begins. Shipped behavior remains `task-closeout` creating the bundle from scratch.

## Maintenance loop

Three agent roles plus deterministic sync form the loop, one writer per zone: `task-closeout` captures per-task bundles under `.agents/sessions/`; `learning-distill` classifies lessons into durable homes (AGENTS rule, playbook, decision, troubleshooting, or topic page) and refreshes indexes deterministically without invoking `openwiki --update`; periodic `docs-lint` guards coherence. Full flow in [Task Lifecycle and Distillation](../workflows/task-lifecycle-and-distill.md).

## Entry points and identifiers

- **Agent startup** — read `openwiki/index.md` and `.agents/AGENTS.md` first. When debugging, grep `openwiki/` and `.agents/` for the symptom before blind debugging. Before architectural changes, search `openwiki/decisions/`.
- **Task identity** — canonical `task_id` lives in `summary.json`; the session folder name is only a sortable label. Bundle discovery must be ignore-blind (`ls`/`find` or `rg --no-ignore-vcs`) since bundles are gitignored.
- **Starter versus consumer** — this repository is the starter kit with its own `.agents/` as source of truth for generic templates; after adoption, the consumer's `.agents/` is the contract.

## Invariants

- Durable descriptive knowledge lives only as curated OKF pages under `openwiki/`; `.agents/` holds only prescriptive guidance.
- OpenSpec and OpenWiki are peer dependencies: verified before use, installed only by the global lane in user scope.
- Raw evidence is not durable knowledge; `.agents/AGENTS.md` stays small; distillation is a separate role from implementation.
- Marker ownership is strict: `AKSK:*` sections by attachment scripts, `OPENWIKI:START/END` never hand-edited.
- Global vs repo lane separation: `aksk-bootstrap` never modifies per-repo files; `aksk-init` never installs global tools.

## Extension and configuration

- Prescriptive, broadly useful behavior rules go in `.agents/AGENTS.md`; ordered procedures in `.agents/playbooks/`; rationale and fixes in curated wiki pages via `learning-distill` classification.
- Product-specific wiring guides belong in `docs/integrations/`, not `.agents/`; shared cross-vendor patterns in `docs/integrations/patterns.md`.
- Portable skills need `SKILL.md` frontmatter (`name`, `description`) plus `CONTRACT.md`; maintainer-only automation sets `metadata.internal: true`.
- Verification: `bash scripts/check-agents-structure.sh` for structure, `bash scripts/check-publish.sh` (or `npm run check`) for publish hygiene.

## Related pages

- [Knowledge layer](../architecture/knowledge-layer.md) — durable knowledge locations and curation rules.
- [Task lifecycle](../architecture/task-lifecycle.md) — bundle shape and state transitions.
- [Distribution and tool wiring](../integrations/distribution-and-tool-wiring.md) — install lanes and peer-tool wiring.
- [Validation and release](../operations/validation-and-release.md) — structural checks and publish hygiene.
