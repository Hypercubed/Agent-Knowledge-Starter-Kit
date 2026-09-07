---
type: guide
title: AKSK Quickstart
description: Intent-routed entry point for the glue-over-peer-tools kit — bootstrap vs init vs lifecycle vs validation routes.
tags: [quickstart, navigation, routing, aksk]
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
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
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# AKSK Quickstart

The **Agent Knowledge Starter Kit (AKSK) v2.0.0** (`agent-knowledge-starter`) is not an application to run — it is glue over two globally installed peer tools plus a portable knowledge layer. `openwiki/` is optional just-in-time context, not required startup reading; source code and skill contracts are authoritative. `dependencies` is empty and `npm test` intentionally exits 1 — there is no unit suite; validation is script-driven plus agent-executed skill procedures.

- **Peer tools (per-user, never installed by validators):** Node >= 22, `openwiki` (descriptive knowledge, one `openwiki --init` per repo), `@fission-ai/openspec` (intent/process). `openspec/specs/**` is the shipped contract; `openspec/changes/**` are **Proposal-only** and `openspec/changes/archive/**` is historical until graduated. `check_peer_tools.mjs` verifies and fails fast with exact `npm i -g` commands (exit 2, never installs); `bootstrap-global.mjs` is the global lane that installs with caret versions from `references/versions.json` (single source; `aksk-init` reuses it) and falls back to printed INSTRUCT commands when it cannot run.

## Two lanes: global vs per-repo

The skill is the interactive orchestrator (prompts `[Y/n/skip]`); the script is the non-interactive deterministic executor. `bootstrap.mjs` is a shim running the global lane then the repo lane sequentially.

| Lane | Skill → Script | Scope | What it does |
| --- | --- | --- | --- |
| Global | `aksk-bootstrap` → `bootstrap-global.mjs` | Per-user once | Preflight Node >= 22, `npm i -g` for missing tools (skip when present), PATH verify, idempotent INSTRUCT fallback, never half-installs. No per-repo writes. Host integrations are manual opt-in. |
| Per-repo | `aksk-init` → `bootstrap-repo.mjs` | Per repo | Verifies globals first (fail-fast to `aksk-bootstrap`, no global installs), scaffolds `.agents/` + baseline first, `openspec init`, `openwiki --init` (harness needs no key, CLI needs `OPENAI_API_KEY`), routing/lifecycle and wiki-contract attachment. |

Adoption is skill-first: `npx skills add -g -a <self-reported> <source>` places skills under `~/.agents/skills` plus the host dir (repo-local only via override), then run each skill's initialization once. Existing repo rules, playbooks, and skills are preserved — never replace `.agents/` wholesale.

## What the kit ships

1. **Portable `.agents/` layer** — compact `AGENTS.md`, `playbooks/`, `skills/`, gitignored `sessions/`. Prescriptive rules only.
2. **Curated wiki** — `decisions/` and `troubleshooting/` plus `overview.md` / `maintenance-format.md`, authored by distillation and preserved via preserve-and-link. Browse [Knowledge overview](overview.md), not duplicated here.
3. **Skills and scripts** — global + per-repo lanes, attachment helpers, deterministic index sync, and the two bash validators (`check-agents-structure.sh` portable, `check-publish.sh` release wrapper).
4. **Change governance** — OpenSpec proposals/specs/tasks; `openspec.yaml` declares `schema: spec-driven`.

## Maintenance loop

`task-closeout` captures bundles (canonical `task_id` in `summary.json`; folder name is only a label) → `learning-distill` classifies by kind (descriptive → `openwiki/`, prescriptive → `.agents/`, never invoking `openwiki --update`) → `sync_wiki_indexes.mjs` rebuilds indexes deterministically → `docs-lint` guards wiring. Full flow: [Task Lifecycle and Distill](workflows/task-lifecycle-and-distill.md).

## Where to go next — task routing

| If you want to… | Read | Validate with |
| --- | --- | --- |
| Understand zone authority | [System Overview](architecture/overview.md) · [AGENTS.md Zoning](concepts/agents-md-zoning.md) | `bash scripts/check-agents-structure.sh .agents` |
| Bootstrap globals (per-user) | [aksk-bootstrap](skills/aksk-bootstrap.md) · [Packaging and Install](distribution/packaging-and-install.md) | `check_peer_tools.mjs openspec openwiki`, then `bootstrap-global.mjs` |
| Initialize a repo | [aksk-init](skills/aksk-init.md) · [Bootstrap and Attachment](workflows/bootstrap-and-attachment.md) | `bootstrap-repo.mjs --yes` |
| Curate durable knowledge | [Knowledge Curation Contract](concepts/knowledge-curation-contract.md) | `attach_wiki_contract.mjs` (idempotent; exits 2 with `openwiki --init` if missing) |
| Capture finished work | [Task Lifecycle and Distill](workflows/task-lifecycle-and-distill.md) | bundle holds `summary.json` + 4 companions under `.agents/sessions/<timestamp-slug>/` |
| Promote bundles to durable docs | [Task Lifecycle and Distill](workflows/task-lifecycle-and-distill.md) | validate frontmatter, then `sync_wiki_indexes.mjs` |
| Keep wiring coherent | [Validation and Lint](operations/validation-and-lint.md) | `bash scripts/check-publish.sh` / `npm run check` |
| Ship / distribute the kit | [Packaging and Install](distribution/packaging-and-install.md) | `bash scripts/check-agents-structure.sh .agents` |
| Govern changes with OpenSpec | [OpenSpec Governance](workflows/openspec-governance.md) | `npx openspec status` |
| Browse decisions / fixes | [Knowledge overview](overview.md) | `rg -ri "<symptom>" openwiki/ .agents/` |

## Focused validation commands

```bash
bash scripts/check-agents-structure.sh .agents         # portable shape (jq optional)
bash scripts/check-publish.sh                          # full release hygiene
node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki
node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
rg -ri "<symptom>" .agents/ openwiki/                  # durable-knowledge lookup
```
