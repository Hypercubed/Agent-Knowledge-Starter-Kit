---
type: Reference
title: Knowledge Curation Contract
description: AKSK attachment, preserve-and-link, frontmatter lifecycle, distill bypass, documentation budget, and ignore guard that keep curated OpenWiki trees authoritative.
tags: [aksk, curation, openwiki, distill-routing, documentation-budget]
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-d56b5afb22742020f2ab6b59
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-d1960e41bf9a48af26e81829
    resource: repo://.agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs
  - id: openwiki-source-dce50581779fda5dd507dc34
    resource: repo://.agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
  - id: openwiki-source-d786624ba23d2df437591102
    resource: repo://.agents/skills/aksk-init/references/wiki-contract-template.md
  - id: openwiki-source-ff2d87cb54c01d07d6371400
    resource: repo://.agents/skills/aksk-init/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-4ab0b6cc58dd78f7a5c0603e
    resource: repo://.agents/skills/aksk-init/SKILL.md
  - id: openwiki-source-5af7f373fcb21f142106673c
    resource: repo://.agents/skills/docs-lint/SKILL.md
  - id: openwiki-source-513536a60f0bc38be6c6d845
    resource: repo://.agents/skills/learning-distill/references/CONTRACT.md
  - id: openwiki-source-6780607585e38503f5da5e5e
    resource: repo://.agents/skills/learning-distill/references/decision-frontmatter.schema.json
  - id: openwiki-source-7fe0106a3a83528f5b3d3755
    resource: repo://.agents/skills/learning-distill/SKILL.md
  - id: openwiki-source-e119253b3c3737247dc63f2a
    resource: repo://.openwikiignore
  - id: openwiki-source-eeb2cc49563df1de1086bb7e
    resource: repo://openspec/specs/distill-routing/spec.md
  - id: openwiki-source-53df649d4fbc85ef0839d164
    resource: repo://openspec/specs/wiki-contract/spec.md
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# Knowledge Curation Contract

The knowledge curation contract is the boundary agreement between AKSK and OpenWiki: which wiki trees AKSK authors directly, how those pages survive scheduled reconciliation, what lifecycle metadata they carry, and what OpenWiki may generate. It is enforced at three moments: attachment time, distill time, and lint time. Tree shape and frontmatter tables shared with [Knowledge Layer](../architecture/knowledge-layer.md) are not duplicated here beyond the contract essentials.

## Curated trees

Four curated locations inside `openwiki/`, all authored by the distilling agent or a maintainer in OKF format, never by the `openwiki --update` generator: `decisions/` (durable decision records, `aksk_status` required), `troubleshooting/` (recurring failure patterns and fixes), `overview.md` (curated entry point), and `maintenance-format.md` (schema and graph-edge reference). Each entry file's **filename stem is its identity** — lowercase `[a-z0-9_-]`, unique **within its tree** — with qualified references (`decisions/<slug>`, `troubleshooting/<slug>`) for graph edges.

## Attachment

The contract lives in `openwiki/INSTRUCTIONS.md` between `AKSK:WIKI-CONTRACT` markers, owned by `attach_wiki_contract.mjs` (byte-identical copies under `aksk-init` and `aksk-bootstrap`): it appends the templated section below existing content, never creates the file, never removes OpenWiki-owned sections, and is idempotent and self-updating on re-runs. If the file is missing it exits 2 naming the `openwiki --init` prerequisite with no writes. Do not edit between the markers by hand — rerun the script after kit upgrades; OpenWiki-owned content outside the markers takes precedence on conflict.

## Preserve-and-link semantics

1. **Preserve-and-link** — when a scheduled update would regenerate a page under a curated tree, the AKSK-authored page is **kept** and generated material **links to it** instead of replacing it.
2. **Frontmatter extensions survive round-trips** — every `aksk_*` field (`aksk_status`, `aksk_superseded_by`, `aksk_depends_on`, forward-compatible additions) is preserved by the reconciler.
3. **Distill-authored pages bypass the CLI** — lessons are written by the host agent with deterministic index refresh; `openwiki --update` is the scheduled reconciliation path but never the distill write path.

A missing contract must never be treated as "nothing curated" — distillation fails closed before any wiki write when the markers are absent, since the next update could otherwise silently regenerate curated pages away.

## Documentation budget

OpenWiki is an agent navigation aid, not a comprehensive reference — prefer a small number of high-signal pages. **Keep:** repository map and ownership, top-level architecture and major flows, cross-cutting conventions and extension points, non-obvious invariants evidenced in source/tests, links to source and canonical specs. **Do not generate:** spec restatements, per-file summaries, standalone API references, release notes or change-history narratives, generated/vendor documentation, or pages that only paraphrase source. **Update threshold:** a page changes only when a public integration boundary, module ownership boundary, major flow, durable convention, or non-obvious invariant changes — feature behavior links to the canonical spec instead.

## Discovery guard (`.openwikiignore`)

The root ignore file keeps generated, vendor, and machine-local paths out of discovery and Claim evidence, using anchored `/example/` (root only) and preserving the `.agents/sessions/` exclusion with a `README.md` exception. It never excludes `openspec/specs/**` or `openspec/changes/archive/**`. The file is merge-not-clobber; user content outside the AKSK markers is never removed.

## Distill routing (summary)

`learning-distill` routes by kind: ephemeral stays in the bundle; prescriptive behavior rules go to `.agents/AGENTS.md` or `playbooks/`; descriptive rationale and fixes become curated wiki pages. No duplication with codified `openspec/specs/` SHALL requirements — cite the spec instead. Descriptive lessons never land in `.agents/`; prescriptive rules never land in `openwiki/`. Write path: fail-closed prerequisite checks, author directly with runtime-loaded guidance, validate frontmatter, refresh indexes deterministically via `sync_wiki_indexes.mjs`, mark the bundle distilled. Full procedure in [learning-distill](../skills/learning-distill.md) and [Task Lifecycle](../architecture/task-lifecycle.md).

## Operations

- Verify the contract: `node .agents/skills/aksk-init/scripts/attach_wiki_contract.mjs` (safe to re-run; re-run after kit upgrades).
- Verify peer tools: `node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki`.
- Refresh indexes after curated edits: `node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs`.
- Validate frontmatter against the JSON Schemas under `.agents/skills/learning-distill/references/`; structural invariants via `bash scripts/check-agents-structure.sh`.

## Related pages

- [The Knowledge Layer](../architecture/knowledge-layer.md) — tree shape, frontmatter table, sessions model, and supersession convention.
- [Task Lifecycle and Session Bundles](../architecture/task-lifecycle.md) — bundle shape, `task_id` identity, and the state machine ending in index sync.
- [learning-distill Skill](../skills/learning-distill.md) — the routing procedure consuming the contract at distill time.
- [aksk-init Skill](../skills/aksk-init.md) — contract attachment and per-repo initialization.
- [docs-lint Skill](../skills/docs-lint.md) — wiring versus content checks keeping the contract coherent.
