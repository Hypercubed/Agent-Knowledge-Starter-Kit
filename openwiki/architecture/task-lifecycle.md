---
type: task-lifecycle
title: "Task Lifecycle and Session Bundles"
description: "How task identity works (task_id in summary.json vs folder labels), the five-file closeout bundle, the closeout-to-distilled state machine, and deterministic index sync."
tags: [sessions, task-closeout, lifecycle, workflow]
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-62bd4cb693e4e881b3f88f6b
    resource: repo://.agents/.gitignore
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
  - id: openwiki-source-115b2dad781e2a2c5b5a980d
    resource: repo://docs/architecture.md
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

# Task Lifecycle and Session Bundles

Every meaningful unit of agent work moves through a defined lifecycle: capture at a stopping point, distill into durable knowledge, sync indexes deterministically, then lint. The skill procedures implementing each phase are [task-closeout](../skills/task-closeout.md) and [learning-distill](../skills/learning-distill.md). A proactive `task-start` phase is **Proposal-only** under `openspec/changes/add-task-start/` and not yet an active capability.

## Task and session identity

- The **canonical** task identifier is the `task_id` field inside `.agents/sessions/<session-folder>/summary.json`. Consumers and distillers must read it from there.
- The session **folder name is only a sortable storage label** (`YYYYMMDD-HHMMSS-short-topic`). Never infer identity from it. One bundle per folder.
- `repo_id` carries stable repository context; an optional `prior_session` pointer links related closeouts without merging folders. Agent provenance (`agent`, `agent_session_id`) is recorded when the tool supplies it — never invent IDs.

## Bundle shape

Each bundle contains exactly five files. `task-closeout` is the sole writer of this tree today; under the proposal `task-start` would own creation and `task-closeout` finalization.

| File | Role |
| --- | --- |
| `summary.json` | status, timestamps, required `task_id`, optional `repo_id`/`agent`/`openspec_change`, git metadata, distillation flags (`distilled`, `distillation_status`) |
| `active-task.md` | observable facts: goal, outcome, files changed, commands run, validation, remaining work |
| `learning-candidate.md` | candidate lessons: what failed/worked, reusable pattern, candidate durable homes, confidence |
| `changed-files.txt` | paths touched during the session |
| `validation.txt` | checks run and outcomes |

When the session worked on an OpenSpec change, its name is recorded in `summary.json.openspec_change`. **Closeout never edits `openspec/`** for in-flight changes — spec updates are deferred to archive time and noted in `learning-candidate.md`.

## State machine

`Captured` (closeout wrote 5 files, `distilled: false`) → `ReadyForDistill` (status complete, blocked, or abandoned) → `Distilling` (learning-distill reads via `task_id`) → `Distilled` (lessons promoted or rejected, indexes synced) or `ProposedOnly` (no net edits). After closeout the bundle is immutable except status and distillation fields in `summary.json`. There is no activity log — accountability lives in bundle flags plus git history.

## Lifecycle ordering

1. Coding task begins; the agent adopts stable `repo_id` and task-specific `task_id`.
2. At a stopping point the agent runs `task-closeout` → bundle under `.agents/sessions/<folder>/`.
3. The learning agent runs `learning-distill`: fail-closed prerequisites (peer binaries on PATH, `AKSK:WIKI-CONTRACT` markers in `openwiki/INSTRUCTIONS.md`) must pass before any wiki write.
4. Durable lessons land in routed homes (table below); duplication of a codified `openspec/specs/` SHALL requirement is rejected — cite the spec instead.
5. Indexes refresh via `sync_wiki_indexes.mjs`, the bundle is marked distilled, and periodic `docs-lint` guards coherence.

## Routing: descriptive → OpenWiki vs prescriptive → `.agents`

| Category | Destination | Bar to clear |
| --- | --- | --- |
| `ephemeral` | stays in bundle | one-off detail |
| `AGENTS guidance` | `.agents/AGENTS.md` | high confidence, broadly useful, likely to recur, concise, actionable |
| `playbook` | `.agents/playbooks/<name>.md` | durable multi-step procedure |
| `decision record` | `openwiki/decisions/<slug>.md` | rationale needing explanation later |
| `troubleshooting record` | `openwiki/troubleshooting/<slug>.md` | recurring failure + fix |
| `descriptive lesson` | topical page under `openwiki/` | stable fact or pattern worth keeping |

Curated frontmatter, authoring validation, and the deterministic `sync_wiki_indexes.mjs` write path are owned by the [learning-distill](../skills/learning-distill.md) contract — see that page instead of duplicating them here.

## Finding bundles under gitignore

Session folders are deliberately gitignored (only `README.md` tracked), so **never conclude no bundles exist from an ignore-aware search**. Locate them via filesystem listing or `rg --no-ignore-vcs`, then read each `summary.json` and filter on `task_id`, `distilled`, and `status`.

## Failure handling

Missing peer binaries, missing wiki initialization, or missing contract markers fail closed with exit 2 and exact remediation before any write — no silent fallback, no partial pages. Closeout leaving `openspec/` untouched on in-flight changes is contractual, not incidental.

## Related

- Skill procedures: [task-closeout](../skills/task-closeout.md), [learning-distill](../skills/learning-distill.md), [docs-lint](../skills/docs-lint.md)
- Where promoted knowledge lands: [knowledge layer](knowledge-layer.md)
- OpenSpec capabilities: `closeout-change-linking`, `distill-routing` — plus **Proposal-only** `task-start` under `openspec/changes/add-task-start/`
