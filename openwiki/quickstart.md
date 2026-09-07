---
type: guide
title: AKSK Quickstart
description: Intent-routed entry point for the glue-over-peer-tools kit (Node >=22, openspec/openwiki per-user) → bootstrap vs init vs lifecycle vs validation routes.
tags: [quickstart, navigation, routing, aksk]
sources:
  - id: openwiki-source-221b8d1823c4691ef36ad664
    resource: repo://.agents/AGENTS.md
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
  - id: openwiki-source-5ffa21d5a23117c638ca72b7
    resource: repo://.agents/skills/aksk-bootstrap/scripts/bootstrap.mjs
  - id: openwiki-source-d1960e41bf9a48af26e81829
    resource: repo://.agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs
  - id: openwiki-source-181fd64540d760eef80f754f
    resource: repo://.agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs
  - id: openwiki-source-dce50581779fda5dd507dc34
    resource: repo://.agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
  - id: openwiki-source-dc8872a5e7d386c22ea2f135
    resource: repo://.agents/skills/aksk-bootstrap/SKILL.md
  - id: openwiki-source-9930f2885b3cb73d38a9300a
    resource: repo://.agents/skills/aksk-init/scripts/bootstrap-repo.mjs
  - id: openwiki-source-4ab0b6cc58dd78f7a5c0603e
    resource: repo://.agents/skills/aksk-init/SKILL.md
  - id: openwiki-source-5af7f373fcb21f142106673c
    resource: repo://.agents/skills/docs-lint/SKILL.md
  - id: openwiki-source-7fe0106a3a83528f5b3d3755
    resource: repo://.agents/skills/learning-distill/SKILL.md
  - id: openwiki-source-764361c18355af2544814f55
    resource: repo://.agents/skills/task-closeout/SKILL.md
  - id: openwiki-source-8037e2358a2c4f9b2c722a11
    resource: repo://AGENTS.md
  - id: openwiki-source-115b2dad781e2a2c5b5a980d
    resource: repo://docs/architecture.md
  - id: openwiki-source-096a781fb160ef979fa31121
    resource: repo://INSTALL.md
  - id: openwiki-source-c23cb9e8edf20ed2740abea1
    resource: repo://openspec/specs/aksk-bootstrap/spec.md
  - id: openwiki-source-d682bd16449a28825541bbed
    resource: repo://openspec/specs/aksk-init/spec.md
  - id: openwiki-source-e36f190fc8c564a717bd71bb
    resource: repo://openspec/specs/openspec-integration/spec.md
  - id: openwiki-source-53df649d4fbc85ef0839d164
    resource: repo://openspec/specs/wiki-contract/spec.md
  - id: openwiki-source-5b54a58d1b51cd490b0e7162
    resource: repo://package.json
  - id: openwiki-source-23775c3de52f3ab95a13cb8b
    resource: repo://README.md
  - id: openwiki-source-2361cff43709905e22758cbb
    resource: repo://scripts/check-agents-structure.sh
  - id: openwiki-source-5d609834bdc11b93524d04a9
    resource: repo://scripts/check-publish.sh
generated: { by: "openwiki/0.4.3", at: "2026-08-30T01:40:39.325Z" }
---

# AKSK Quickstart

The **Agent Knowledge Starter Kit (AKSK) v2.0.0** (`agent-knowledge-starter`) is not an application to run — it is glue over two globally installed peer tools and a portable knowledge layer. `openwiki/` is optional just-in-time context, not required startup reading; source code and `.agents/skills/**/SKILL.md` contracts are authoritative.

- **Peer tools (installed per-user, never by validators):** Node >= 22, `openwiki` (descriptive knowledge under `openwiki/`, initialized once per repo with `openwiki --init`), `@fission-ai/openspec` (intent/process under `openspec/`). `openspec/specs/**` is the shipped contract; `openspec/changes/**` are Proposal-only (not yet in specs) and `openspec/changes/archive/**` is historical until graduated via `openspec archive`. `check_peer_tools.mjs` verifies and fails fast with exact `npm i -g …` commands (exit 2, never installs); `bootstrap-global.mjs` is the global lane that attempts `npm i -g` with caret versions from `references/versions.json` and falls back to printed `INSTRUCT` commands when it cannot run.
- **Runtime:** agent behavior driven by markdown skills, marker-delimited contracts, Node ESM helpers under `.agents/skills/aksk-bootstrap/scripts/` and `.agents/skills/aksk-init/scripts/` plus two bash validators under `scripts/`. `dependencies` is empty; `npm test` intentionally prints an error and exits 1.

This repo is its own best consumer — the maintainer `.agents/` tree dogfoods every convention the kit ships.

## Two lanes: global vs per-repo

`aksk-bootstrap` and `aksk-init` are split by scope. The skill is the interactive orchestrator (prompts `[Y/n/skip]`); the JS script is the non-interactive deterministic executor (never blocks on stdin, supports `--yes`/`AKSK_YES=1` passthrough).

| Lane | Skill | Script | Scope | What it does |
| --- | --- | --- | --- | --- |
| Global | `aksk-bootstrap` | `.agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs` | Per-user once | Preflight Node >=22, `npm i -g` for `openspec`/`openwiki` from caret ranges in `references/versions.json` via `versionsFromPackageJson()`, PATH verify, idempotent INSTRUCT fallback, never half-installs. Does not write per-repo files. |
| Per-repo | `aksk-init` | `.agents/skills/aksk-init/scripts/bootstrap-repo.mjs` | Per repo | Verifies globals first (fail-fast to `aksk-bootstrap` if missing, no global install), scaffolds `.agents/` + `AGENTS.md` baseline first (`init_agents_md.mjs`), runs `openspec init --tools none`, runs `openwiki --init` (harness needs no extra key, CLI needs `OPENAI_API_KEY`), attaches routing/lifecycle (`attach_section.mjs`) and wiki contract (`attach_wiki_contract.mjs`). Optional `--local-skills` for repo-local `npx skills add` without `-g`. Partitioned INSTRUCT prints only repo commands. |

`bootstrap.mjs` at `.agents/skills/aksk-bootstrap/scripts/bootstrap.mjs` is a shim that runs the global lane then the repo lane sequentially when both skill trees are present.

> Cite `openspec/specs/**` for shipped behavior. Anything under `openspec/changes/**` is Proposal-only — label it as such and do not present ADDED/MODIFIED/REMOVED as shipped.

## What the kit ships

1. **Portable `.agents/` layer** — compact `AGENTS.md`, `playbooks/`, `skills/` and gitignored `sessions/`. Durable prescriptive rules only; no session history or long rationale.
2. **Curated wiki under `openwiki/`** — `decisions/` and `troubleshooting/` trees plus `overview.md` / `maintenance-format.md`, authored as OKF pages by distillation and preserved across `openwiki --update` via preserve-and-link. Browse the index at [Knowledge overview](overview.md), not duplicated here.
3. **`aksk-bootstrap` (global) + `aksk-init` (per-repo) skills and scripts** — `bootstrap-global.mjs` (global `npm i -g` lane), `bootstrap-repo.mjs` (per-repo sequencing), helpers `check_peer_tools.mjs`, `attach_wiki_contract.mjs`, `attach_section.mjs`, `init_agents_md.mjs`/`refresh_agents_baseline.mjs`, and deterministic index sync `sync_wiki_indexes.mjs` (both skills ship copies of the shared attachment helpers; `versions.json` single-sources under `aksk-bootstrap/references/`).
4. **Two validators** — `check-agents-structure.sh` (portable, runs on any `.agents` tree) and `check-publish.sh` (release wrapper, `npm run check`).
5. **Adoption content** — `INSTALL.md` skill-first flow (`npx skills add -g -a <self-reported> Hypercubed/Agent-Knowledge-Starter-Kit`), guides under `docs/integrations/` and the shared patterns.
6. **Change governance** — OpenSpec proposals/specs/tasks under `openspec/`; `openspec.yaml` declares `schema: spec-driven`. Cite `openspec/specs/**` for shipped behavior.

Details live under [System Overview](architecture/overview.md).

## High-level map

```mermaid
flowchart TD
    subgraph Entry["Agent entrypoints"]
        RA["root AGENTS.md — AKSK:AGENTS-BASELINE → OPENWIKI → AKSK:ROUTING+LIFECYCLE"]
        AG[".agents/AGENTS.md + playbooks"]
        DX["openwiki curated decisions + troubleshooting — optional JIT"]
    end
    subgraph SK["Skills under .agents/skills"]
        TC["task-closeout"]
        LD["learning-distill"]
        DL["docs-lint"]
        AB["aksk-bootstrap (global lane)"]
        AI["aksk-init (per-repo lane)"]
    end
    SE[("gitignored session bundles — .agents/sessions")]
    OS["openspec changes + specs"]
    VAL["check-agents-structure + check-publish"]

    RA --> AG
    RA --> DX
    TC -->|"writes bundle"| SE
    SE -->|"distill"| LD
    LD -->|"prescriptive"| AG
    LD -->|"descriptive OKF"| DX
    AB -->|"peer checks, global installs"| VAL
    AI -->|"scaffold, contract attach, index sync"| DX
    DL -->|"lints wiring of both"| Entry
    OS -.->|"governs change"| SK
    VAL -->|"validates"| AG
```

*Solid arrows are dataflow, dashed is governance.*

## Maintenance loop

```mermaid
sequenceDiagram
    participant C as Coding agent
    participant B as .agents/sessions bundle
    participant L as learning-distill
    participant W as openwiki curated pages
    participant X as docs-lint

    C->>B: task-closeout writes summary.json<br/>task_id, openspec_change, candidates
    L->>B: read via ignore-bypassing listing<br/>select by task_id / distilled state
    L->>L: fail-closed prerequisites<br/>peer tools + AKSK:WIKI-CONTRACT
    L->>W: author descriptive OKF pages directly
    L->>C: prescriptive rules → .agents/AGENTS.md or playbooks
    L->>W: sync_wiki_indexes.mjs refresh
    L->>B: mark bundle distilled
    X->>W: periodic pass: routing blocks,<br/>coverage pairing, stale pages
```

1. **Closeout** — `task-closeout` captures raw evidence. Canonical `task_id` lives in `summary.json`; folder name `YYYYMMDD-HHMMSS-slug` is only a sortable label.
2. **Distill** — `learning-distill` classifies by kind (descriptive → `openwiki/`, prescriptive → `.agents/`) and never invokes `openwiki --update`.
3. **Sync** — `sync_wiki_indexes.mjs` rebuilds `openwiki/index.md` and directory indexes deterministically via `OpenWikiLocalShellBackend` (`docsOnly`/`virtualMode`) without invoking `openwiki --update`.
4. **Lint** — `docs-lint` guards wiring. Validators prove file shape in CI.

Full sequencing, bundle shape, and routing rules: [Task Lifecycle and Distill](workflows/task-lifecycle-and-distill.md).

## Where to go next — task routing

Do not duplicate the curated decision/troubleshooting catalogs — follow the links to their indexes.

| If you want to… | Read | Source anchors | Validate with |
| --- | --- | --- | --- |
| Understand zone authority | [System Overview](architecture/overview.md) · [AGENTS.md Zoning](concepts/agents-md-zoning.md) | `docs/architecture.md`, `.agents/AGENTS.md`, `AGENTS.md` markers (`AKSK:AGENTS-BASELINE`, `OPENWIKI:START/END`, `AKSK:ROUTING`/`AKSK:LIFECYCLE`) | `bash scripts/check-agents-structure.sh .agents` |
| Bootstrap globals (per-user) | [aksk-bootstrap — Global Lane](skills/aksk-bootstrap.md) · [Packaging and Install](distribution/packaging-and-install.md) | `.agents/skills/aksk-bootstrap/SKILL.md`, `.agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs`, `references/versions.json` | `node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki` then `node .agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs` |
| Initialize a repo | [aksk-init — Per-Repo Lane](skills/aksk-init.md) · [Bootstrap and Attachment](workflows/bootstrap-and-attachment.md) | `.agents/skills/aksk-init/SKILL.md`, `.agents/skills/aksk-init/scripts/bootstrap-repo.mjs`, `init_agents_md.mjs`, `attach_section.mjs`, `references/*-template.md` | `node .agents/skills/aksk-init/scripts/bootstrap-repo.mjs --yes` |
| Curate durable knowledge | [Knowledge Curation Contract](concepts/knowledge-curation-contract.md) | `openwiki/INSTRUCTIONS.md` (`AKSK:WIKI-CONTRACT`), `openwiki/overview.md`, `openwiki/maintenance-format.md` | `node .agents/skills/aksk-init/scripts/attach_wiki_contract.mjs` (idempotent no-op if attached; exits 2 with `openwiki --init` if missing) |
| Capture finished work | [Task Lifecycle and Distill](workflows/task-lifecycle-and-distill.md) · `.agents/skills/task-closeout/SKILL.md` | `.agents/skills/task-closeout/CONTRACT.md` | bundle contains `summary.json` + 4 companion files under `.agents/sessions/<timestamp-slug>/` |
| Promote bundles to durable docs | [Task Lifecycle and Distill](workflows/task-lifecycle-and-distill.md) · `.agents/skills/learning-distill/SKILL.md` | `learning-distill/references/*.schema.json` | `NPM_ROOT=$(npm root -g) node --input-type=module -e '...validateOkfFrontmatter...'` then `node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs` |
| Refresh wiki indexes | [Bootstrap and Attachment](workflows/bootstrap-and-attachment.md) | `.agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs` | prints `Wiki indexes synchronized under …`; exits 2 if `openwiki/` missing |
| Keep wiring coherent | [Validation and Lint](operations/validation-and-lint.md) | `.agents/skills/docs-lint/SKILL.md`, `scripts/check-publish.sh` | `bash scripts/check-publish.sh` / `npm run check` |
| Ship / distribute the kit | [Packaging and Install](distribution/packaging-and-install.md) · [Distribution and Agent Spread](integrations/distribution-and-agent-spread.md) | `package.json` (`name: agent-knowledge-starter`), `references/versions.json` | `bash scripts/check-agents-structure.sh .agents` |
| Govern changes with OpenSpec | [OpenSpec Governance](workflows/openspec-governance.md) · [Governance Workflow](governance/openspec-workflow.md) | `openspec.yaml`, `openspec/changes/`, `openspec/specs/` | `npx openspec status` |
| Browse decisions / fixes | [Knowledge overview](overview.md) | `openwiki/decisions/` · `openwiki/troubleshooting/` | `rg -ri "<symptom>" openwiki/ .agents/` (openwiki is JIT, grep the sources) |

## Focused validation commands

```bash
bash scripts/check-agents-structure.sh .agents         # portable shape (jq optional)
bash scripts/check-publish.sh                          # full release hygiene (remark, links, leakage scans)
npm run check                                          # same via package.json
npm run format                                         # remark over .agents/**/*.md
node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki
node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
rg -ri "<symptom>" .agents/ openwiki/                  # durable-knowledge lookup
```

There is no unit test suite (`npm test` exits 1 by design); validation is script-driven plus agent-executed skill procedures. Use the routing table above to pick the minimal probe for your intent.
