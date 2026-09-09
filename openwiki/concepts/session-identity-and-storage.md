---
type: concept
title: Session Identity and Storage
description: How task-closeout identifies sessions via task_id in summary.json, stores temporary bundles under .agents/sessions with gitignore and openwikiignore rules, and supports optional prior_session chaining.
tags: [sessions, task-closeout, gitignore, task-id, storage]
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-62bd4cb693e4e881b3f88f6b
    resource: repo://.agents/.gitignore
  - id: openwiki-source-487bc271e3b8801f2a7a4226
    resource: repo://.agents/sessions/README.md
  - id: openwiki-source-7fe0106a3a83528f5b3d3755
    resource: repo://.agents/skills/learning-distill/SKILL.md
  - id: openwiki-source-bc5af49c81a8aed294e3b8b0
    resource: repo://.agents/skills/task-closeout/CONTRACT.md
  - id: openwiki-source-ab214531734b77501b26a485
    resource: repo://.agents/skills/task-closeout/example/task-bundle/active-task.md
  - id: openwiki-source-2ec3bae65cecf83d96542186
    resource: repo://.agents/skills/task-closeout/example/task-bundle/summary.json
  - id: openwiki-source-764361c18355af2544814f55
    resource: repo://.agents/skills/task-closeout/SKILL.md
  - id: openwiki-source-e119253b3c3737247dc63f2a
    resource: repo://.openwikiignore
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
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# Session Identity and Storage

Session bundles are **temporary working memory**: raw evidence for one task, stored repo-local under `.agents/sessions/` until `learning-distill` promotes only stable lessons to durable homes. Bundles never become durable themselves, never land in commits, and are excluded from OpenWiki evidence. Bundle shape, state machine, and the closeout→distill ordering live in [Task Lifecycle](../architecture/task-lifecycle.md); this page covers identity, storage, and the ignore contracts.

## Canonical identity vs storage label

| Signal | Location | Role |
| --- | --- | --- |
| `task_id` | `summary.json` field `task_id` | **Canonical** identifier. Required. All joins read it from here. |
| Folder name | `.agents/sessions/YYYYMMDD-HHMMSS-short-topic/` | **Sortable storage label** only, never authoritative. One bundle per folder. |
| `repo_id` | `summary.json` field | Stable repository context. Optional but recommended. |

When passing work between agents, provide **both** the bundle path and the `task_id`. Optional provenance fields (`agent`, `agent_session_id`) are recorded when the tool supplies them — never invent IDs. An optional `prior_session` path pointer links related closeouts without merging folders (decision `optional-prior-session-in-session-summary-json`).

## Storage location

All temporary outputs go under `.agents/sessions/YYYYMMDD-HHMMSS-short-topic/`, one five-file closeout packet per folder (`summary.json`, `active-task.md`, `learning-candidate.md`, `changed-files.txt`, `validation.txt` — roles in [Task Lifecycle](../architecture/task-lifecycle.md)). After closeout the bundle is immutable except status and distillation flags in `summary.json`. In cloud or ephemeral environments, mirror the same path shape to durable storage so `task_id`-based joins still work — but keep per-task artifacts out of commits.

## Gitignore contract and OpenWiki ignore

Two layers keep bundles local and out of evidence:

- **Git layer** (`.agents/.gitignore`): `sessions/*` plus `!sessions/README.md` — every per-task subfolder ignored, only the README tracked. Repos without a tracked `.agents/.gitignore` carry the equivalent `.agents/sessions/*` patterns in the root `.gitignore`.
- **OpenWiki layer** (`.openwikiignore`): `.agents/sessions/` plus `!.agents/sessions/README.md` — bundles excluded from fingerprinting and Claim evidence; citing a bundle path as `repo://` evidence fails validation. The `README.md` stays citable as the folder's tracked anchor.

Never cite bundle files as source truth. Skill initialization ensures the directory, README, and ignore lines exist idempotently.

## Finding bundles under gitignore

Ignore-aware searches may report no bundles when they exist. Use at least one **ignore-blind** method — filesystem listing or `rg --no-ignore-vcs` — then read each `summary.json` and filter on `task_id`, `distilled`, and `status`. Never select a bundle from its folder name.

## Invariants

- `task_id` in `summary.json` is canonical; the folder name is a label only.
- Closeout writes only under `.agents/sessions/<folder>/`; nothing else mutates the bundle except distillation flags.
- The gitignore and openwikiignore pairings stay in sync, or bundles leak into commits or become citable evidence.
- Bundles are temporary; only distilled lessons become durable.

## Related

- Lifecycle: [Task Lifecycle and Session Bundles](../architecture/task-lifecycle.md), [Task Lifecycle and Distillation](../workflows/task-lifecycle-and-distill.md)
- Procedures: [task-closeout](../skills/task-closeout.md), [learning-distill](../skills/learning-distill.md)
- Decisions: [Optional prior_session](../decisions/optional-prior-session-in-session-summary-json.md), [Sessions directory: tracked README](../decisions/sessions-directory-tracked-readme-with-ignored-bundles.md), [Root-anchored .openwikiignore](../decisions/root-anchored-openwikiignore-for-generated-trees.md)
