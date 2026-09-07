---
type: architecture
title: 'The Knowledge Layer: .agents/ and Curated Wiki Trees'
description: How AKSK splits durable knowledge between prescriptive .agents files and descriptive curated OpenWiki trees, plus ephemeral session bundles, preserve-and-link semantics, and lifecycle.
tags: [knowledge-layer, agents, openwiki, curation, distillation]
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-62bd4cb693e4e881b3f88f6b
    resource: repo://.agents/.gitignore
  - id: openwiki-source-221b8d1823c4691ef36ad664
    resource: repo://.agents/AGENTS.md
  - id: openwiki-source-7a71f2c05c7f7289570ac205
    resource: repo://.agents/playbooks/major-version-release.md
  - id: openwiki-source-df46a321fce7026f92166a02
    resource: repo://.agents/playbooks/pre-publish.md
  - id: openwiki-source-a05132b6a7d8998425d82b03
    resource: repo://.agents/playbooks/writing-integration-guides.md
  - id: openwiki-source-7381bbb8d2e7fd02da7469ce
    resource: repo://.agents/skills/aksk-bootstrap/references/wiki-contract-template.md
  - id: openwiki-source-5398a69cb2cf8d556809da57
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_section.mjs
  - id: openwiki-source-d56b5afb22742020f2ab6b59
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-d1960e41bf9a48af26e81829
    resource: repo://.agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs
  - id: openwiki-source-181fd64540d760eef80f754f
    resource: repo://.agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs
  - id: openwiki-source-67d81b3c5bf101f8b3eb3d2a
    resource: repo://.agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs
  - id: openwiki-source-dce50581779fda5dd507dc34
    resource: repo://.agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
  - id: openwiki-source-d786624ba23d2df437591102
    resource: repo://.agents/skills/aksk-init/references/wiki-contract-template.md
  - id: openwiki-source-ff2d87cb54c01d07d6371400
    resource: repo://.agents/skills/aksk-init/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-5af7f373fcb21f142106673c
    resource: repo://.agents/skills/docs-lint/SKILL.md
  - id: openwiki-source-513536a60f0bc38be6c6d845
    resource: repo://.agents/skills/learning-distill/references/CONTRACT.md
  - id: openwiki-source-6780607585e38503f5da5e5e
    resource: repo://.agents/skills/learning-distill/references/decision-frontmatter.schema.json
  - id: openwiki-source-20b14eec3201468748607f5c
    resource: repo://.agents/skills/learning-distill/references/troubleshooting-frontmatter.schema.json
  - id: openwiki-source-7fe0106a3a83528f5b3d3755
    resource: repo://.agents/skills/learning-distill/SKILL.md
  - id: openwiki-source-bc5af49c81a8aed294e3b8b0
    resource: repo://.agents/skills/task-closeout/CONTRACT.md
  - id: openwiki-source-764361c18355af2544814f55
    resource: repo://.agents/skills/task-closeout/SKILL.md
  - id: openwiki-source-e119253b3c3737247dc63f2a
    resource: repo://.openwikiignore
  - id: openwiki-source-8037e2358a2c4f9b2c722a11
    resource: repo://AGENTS.md
  - id: openwiki-source-115b2dad781e2a2c5b5a980d
    resource: repo://docs/architecture.md
  - id: openwiki-source-eeb2cc49563df1de1086bb7e
    resource: repo://openspec/specs/distill-routing/spec.md
  - id: openwiki-source-53df649d4fbc85ef0839d164
    resource: repo://openspec/specs/wiki-contract/spec.md
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# The Knowledge Layer: `.agents/` and Curated Wiki Trees

Durable knowledge lives in two complementary layers. **Prescriptive** guidance — how agents should behave — lives under `.agents/` as plain markdown. **Descriptive** knowledge — facts, rationale, decisions, troubleshooting patterns — lives as curated OKF pages under `openwiki/{decisions,troubleshooting}/` plus two curated root pages. Ephemeral evidence lives under `.agents/sessions/` and never becomes durable until distillation routes it. The consolidation that created this split is recorded in decision `knowledge-consolidation-into-openwiki`. The lifecycle that writes into these layers is covered by [Task Lifecycle and Distillation](../workflows/task-lifecycle-and-distill.md).

## Tree shape

```text
.agents/                          # prescriptive layer + capture machinery
├── AGENTS.md                     # portable routing directives + project learnings + self-improvement loop
├── .gitignore                    # sessions/* + !sessions/README.md
├── playbooks/                    # durable multi-step procedures
├── sessions/                     # ephemeral bundles (gitignored except README.md)
└── skills/                       # aksk-bootstrap, aksk-init, task-closeout,
                                  #   learning-distill, docs-lint, openspec-*, verify-install

openwiki/                         # descriptive layer
├── INSTRUCTIONS.md               # OpenWiki-owned scope brief + AKSK curation contract
├── index.md                      # OpenWiki-owned catalog (never hand-edited)
├── overview.md                   # curated entry point indexing both trees
├── maintenance-format.md         # curated schema and policy reference
├── decisions/<slug>.md           # one page per decision, aksk_status lifecycle
└── troubleshooting/<slug>.md     # one page per recurring failure pattern
```

## `.agents/AGENTS.md` — prescriptive layer

The portable file holds routing directives, project learnings, and the self-improvement loop summary and must stay small. Routing directives are behavioral triggers: on startup read `openwiki/index.md` and `.agents/AGENTS.md` before any file modification; on a failing test or build, first search durable knowledge; before architectural changes, search `openwiki/decisions/`. Placement discipline: rationale goes to `openwiki/decisions/`, recurring failures to `openwiki/troubleshooting/`, multi-step procedures to `playbooks/`, temporary artifacts stay in `sessions/`. Distillation adds to this file only when a lesson is high-confidence, broadly useful, likely to recur, concise, and actionable. Root `AGENTS.md` zoning (stacked marker-delimited zones with one writer per zone) is detailed in [AGENTS.md Zoning](../concepts/agents-md-zoning.md).

## Curated wiki trees — descriptive layer

| Tree | Content | Lifecycle field | Owner |
| --- | --- | --- | --- |
| `openwiki/decisions/` | Durable decision records with rationale and consequences | `aksk_status` required | Distilling agent / maintainer |
| `openwiki/troubleshooting/` | Recurring failure patterns and fixes | none | Distilling agent / maintainer |
| `openwiki/overview.md` | Curated entry point indexing both trees | none | AKSK-authored, preserved |
| `openwiki/maintenance-format.md` | Schema and graph-edge reference | none | AKSK-authored, preserved |

All pages under the curated locations are authored directly by the distilling agent or maintainer in OKF format, never by `openwiki --update`. Each decision and troubleshooting entry occupies one file whose **filename stem is the entry identity** — lowercase `[a-z0-9_-]`, unique **within its tree**. Frontmatter follows the OKF base (`type`, `title`, `description`, `tags`, `timestamp`) extended with `aksk_status` (required on decisions), `aksk_superseded_by`, and `aksk_depends_on` qualified references (`decisions/<slug>` or `troubleshooting/<slug>`). The full schema reference lives on [`maintenance-format.md`](../maintenance-format.md); [`overview.md`](../overview.md) indexes both trees.

## No duplication with OpenSpec requirements

If a candidate lesson restates something already codified as a SHALL requirement in `openspec/specs/`, distillation must not create or extend a wiki page for it — cite the spec capability instead ([OpenSpec workflow](../governance/openspec-workflow.md), decision `openspec-openwiki-aksk-division-of-labor`).

## Preserve-and-link semantics

The curation contract attached to [`openwiki/INSTRUCTIONS.md`](../INSTRUCTIONS.md) between the `AKSK:WIKI-CONTRACT` markers declares three invariants enforced at update time (see [Knowledge Curation Contract](../concepts/knowledge-curation-contract.md)):

1. **Preserve-and-link** — when `openwiki --update` would regenerate a page under a curated tree, the AKSK-authored page is kept and generated material links to it instead of replacing its content.
2. **Frontmatter extensions survive round-trips** — every `aksk_*` field is preserved by the update reconciler.
3. **Distill-authored pages bypass the CLI** — descriptive lessons are written by the host agent with deterministic index refresh; `openwiki --update` is the scheduled reconciliation path but never the distill write path.

The same marked section carries the **documentation budget**: keep the repository map, top-level architecture and major flows, cross-cutting conventions and extension points, non-obvious invariants, and links to source and canonical specs; do not restate spec requirements, summarize per-file contents, or paraphrase source. Distillation fails closed before any wiki write when the contract markers are absent.

## Discovery guard (`.openwikiignore`)

The temporary-vs-durable split is enforced for OpenWiki discovery by the root `.openwikiignore`: it excludes `.agents/sessions/` (except `sessions/README.md`), the root-anchored `/example/` illustration tree, dependencies and build products, generated/vendor artifacts, and machine-local secrets — while never excluding `openspec/specs/**` or `openspec/changes/archive/**`. The file is merge-not-clobber; user content outside the AKSK markers is never removed.

## Sessions model — ephemeral layer

Per-task closeout bundles live under `.agents/sessions/<timestamp>-<short-topic>/`, each containing `summary.json` (status, required `task_id` identity, git metadata, distillation flags), `active-task.md` (observable facts), `learning-candidate.md` (candidate lessons), `changed-files.txt`, and `validation.txt`. Bundles are immutable after closeout except for distillation flags in `summary.json`; canonical identity is always `task_id`, folder names are sortable labels only. Bundle discovery must be ignore-blind (`ls`/`find` or `rg --no-ignore-vcs`) since gitignored paths are invisible to ignore-aware searches. Distillation routes each lesson to at most one durable home (AGENTS rule, playbook, decision, troubleshooting, or topic page), then marks the bundle distilled — full control flow in [Task Lifecycle and Distillation](../workflows/task-lifecycle-and-distill.md).

## Invariants and failure semantics

- **Curated pages are durable** — once accepted, `aksk_status` rides in frontmatter; supersession is the only lifecycle mutation besides `aksk_depends_on` additions.
- **Marker ownership is strict** — content between any `AKSK:*` markers is owned by its writer; `OPENWIKI:START/END` blocks are OpenWiki-owned and never hand-edited.
- **Missing prerequisites fail with remediation, not silent fallback** — missing peer binaries or contract markers are blocking errors naming the exact command to run.
- **Single writer per zone** — closeout writes only under `.agents/sessions/`; distillation alone writes curated wiki trees, `.agents/AGENTS.md`, and playbooks; lint never writes OpenWiki-owned files.

## Validation

- `.agents/` tree structure: `bash scripts/check-agents-structure.sh .agents`
- Peer tools present: `node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki`
- Contract attached and indexes fresh: `grep -c "AKSK:WIKI-CONTRACT" openwiki/INSTRUCTIONS.md`, then `node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs` after curated-page writes
- Entry frontmatter conformance: JSON Schemas under `.agents/skills/learning-distill/references/` plus [`docs-lint`](../skills/docs-lint.md) inspection passes
- Release hygiene: `bash scripts/check-publish.sh`

## Related

- [AGENTS.md Zoning](../concepts/agents-md-zoning.md) — marker-delimited zones in root `AGENTS.md`.
- [Knowledge Curation Contract](../concepts/knowledge-curation-contract.md) — contract attachment, preserve-and-link, and `aksk_*` extensions.
- [Task Lifecycle and Distillation](../workflows/task-lifecycle-and-distill.md) — bundle shape, `task_id` identity, and closeout→distill→sync→lint loop.
- [learning-distill](../skills/learning-distill.md) — routing procedure that consumes the contract at distill time.
- [Validation and Cross-Tool Lint](../operations/validation-and-lint.md) — deterministic validators and pre-publish sequence.
