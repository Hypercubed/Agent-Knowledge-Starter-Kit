---
type: workflow
title: Task Lifecycle and Distillation
description: The closeout-to-distill loop — capture, classify, route, sync, lint — with handoffs and failure semantics.
tags: [task-lifecycle, task-closeout, learning-distill, curation-contract, sync-wiki-indexes]
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
  - id: openwiki-source-513536a60f0bc38be6c6d845
    resource: repo://.agents/skills/learning-distill/references/CONTRACT.md
  - id: openwiki-source-7fe0106a3a83528f5b3d3755
    resource: repo://.agents/skills/learning-distill/SKILL.md
  - id: openwiki-source-bc5af49c81a8aed294e3b8b0
    resource: repo://.agents/skills/task-closeout/CONTRACT.md
  - id: openwiki-source-2ec3bae65cecf83d96542186
    resource: repo://.agents/skills/task-closeout/example/task-bundle/summary.json
  - id: openwiki-source-764361c18355af2544814f55
    resource: repo://.agents/skills/task-closeout/SKILL.md
  - id: openwiki-source-30179ef0180d39bd7ef5bef7
    resource: repo://openspec/changes/add-task-start/design.md
  - id: openwiki-source-c13ebc2b6ebca535d0e7e2e3
    resource: repo://openspec/changes/add-task-start/proposal.md
  - id: openwiki-source-bfc58f79a96e2ed041bc3436
    resource: repo://openspec/changes/add-task-start/specs/task-start/spec.md
  - id: openwiki-source-86a9b374cb99ed0befc3bb8d
    resource: repo://openspec/specs/closeout-change-linking/spec.md
  - id: openwiki-source-eeb2cc49563df1de1086bb7e
    resource: repo://openspec/specs/distill-routing/spec.md
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# Task Lifecycle and Distillation

Every substantive unit of agent work moves through a fixed loop: **capture** at a stopping point, **distill** into durable knowledge routed by kind, **sync** wiki indexes deterministically, and **lint** the wiring. Bundle shape, identity, and state machine live in [Task Lifecycle](../architecture/task-lifecycle.md); skill procedures in [task-closeout](../skills/task-closeout.md) and [learning-distill](../skills/learning-distill.md). This page traces the handoffs.

> **Proposal-only:** `task-start` lives only under `openspec/changes/add-task-start/` and is not an active capability until archived. Durable writes happen **only during `learning-distill`** — start/closeout write only under `.agents/sessions/` plus idempotent init files.

## The loop

1. **Capture** — at a stopping point (completed, blocked, abandoned) `task-closeout` freezes the five-file bundle. Canonical identity is `summary.json:task_id`; an `openspec_change` name links the bundle to an in-flight change without touching `openspec/`.
2. **Classify** — `learning-distill` reads the bundle via `task_id` and routes each lesson by kind: ephemeral stays, behavior rules go to `.agents/AGENTS.md` or playbooks, rationale and fixes become curated `decisions/` or `troubleshooting/` pages. Spec-duplicating candidates are rejected with a citation instead.
3. **Gate** — fail-closed prerequisites (peer binaries on PATH, `AKSK:WIKI-CONTRACT` markers present) pass before any wiki write; on failure stop with remediation, no writes.
4. **Sync** — `sync_wiki_indexes.mjs` rebuilds catalogs deterministically with curated bodies byte-identical. Never hand-edit OpenWiki-owned files.
5. **Mark and lint** — bundle flagged `distilled`; periodic `docs-lint` guards routing integrity, coverage pairing, and staleness.

## Handoffs

- Coder → closer: stopping point plus bundle path and `task_id`.
- Closer → distiller: bundle state fields (`distilled`, `status`, `distillation_status`) for filtering; `prior_session` chains related bundles without merging.
- Distiller → repo: one durable home per lesson, indexes refreshed, bundle marked.
- Maintainer → loop: lint report; fixes route back through the same homes.

## Failure semantics

Missing binaries, missing wiki init, or missing contract markers exit 2 with exact remediation before any write. Bundles stay immutable except status and distillation flags; no activity log exists — flags plus git history are the audit trail. Ignore-blind discovery (`ls`/`find` or `rg --no-ignore-vcs`) is required since bundles are gitignored.

## Related

- [Task Lifecycle](../architecture/task-lifecycle.md) — bundle shape, identity, state machine.
- [task-closeout](../skills/task-closeout.md) · [learning-distill](../skills/learning-distill.md) — procedures.
- [Knowledge Curation Contract](../concepts/knowledge-curation-contract.md) — contract enforced at distill time.
