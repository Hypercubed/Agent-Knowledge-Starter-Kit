---
type: skill-reference
title: "task-closeout Skill"
description: "Capture-only skill that freezes a five-file session bundle under .agents/sessions/ for later distillation."
tags: [skills, task-closeout, sessions, capture]
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-df185c9f1c40982e16f27741
    resource: repo://.agents/skills/task-closeout/bootstrap/sessions/README.md
  - id: openwiki-source-bc5af49c81a8aed294e3b8b0
    resource: repo://.agents/skills/task-closeout/CONTRACT.md
  - id: openwiki-source-764361c18355af2544814f55
    resource: repo://.agents/skills/task-closeout/SKILL.md
  - id: openwiki-source-30179ef0180d39bd7ef5bef7
    resource: repo://openspec/changes/add-task-start/design.md
  - id: openwiki-source-c13ebc2b6ebca535d0e7e2e3
    resource: repo://openspec/changes/add-task-start/proposal.md
  - id: openwiki-source-86a9b374cb99ed0befc3bb8d
    resource: repo://openspec/specs/closeout-change-linking/spec.md
  - id: openwiki-source-2361cff43709905e22758cbb
    resource: repo://scripts/check-agents-structure.sh
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# task-closeout Skill

**Folder:** `.agents/skills/task-closeout/` (`SKILL.md`, `CONTRACT.md`, `bootstrap/sessions/README.md`, `example/task-bundle/`) · **Spec:** `openspec/specs/closeout-change-linking/spec.md`

Capture-only skill: creates a **temporary handoff packet** at any meaningful stopping point (completed, blocked, or abandoned) with no curation and no durable writes. It freezes raw evidence so a later `learning-distill` pass can route stable lessons to `.agents/` (prescriptive) or `openwiki/` (descriptive). Bundle shape and lifecycle live in [Task Lifecycle](../architecture/task-lifecycle.md).

## Bundle

One folder `.agents/sessions/YYYYMMDD-HHMMSS-short-topic/` with exactly five files: `summary.json` (status, timestamps, required `task_id`, optional `repo_id`/`agent`/`openspec_change`/`prior_session`, git metadata, distillation flags), `active-task.md` (observable facts), `learning-candidate.md` (candidate lessons plus confidence), `changed-files.txt`, `validation.txt`. When the session worked on an OpenSpec change its name goes in `openspec_change`; closeout never edits `openspec/` — spec updates defer to archive time.

## Initialization (idempotent, once per repo)

Ensure `.agents/sessions/` exists; copy `sessions/README.md` from the skill's `bootstrap/` when missing; ensure `.agents/.gitignore` carries `sessions/*` plus `!sessions/README.md` (or the equivalent root-`.gitignore` patterns). Deliberately not created here: `.agents/AGENTS.md`, playbooks, or any `openwiki/` content — those belong to `learning-distill` initialization.

## Scope limits

Closeout writes only under `.agents/sessions/` — never `.agents/AGENTS.md`, `openwiki/`, playbooks, `openspec/`, or skill sources. Proposed durable changes are captured as bundle prose for distillation. After closeout the bundle is immutable except status and distillation flags in `summary.json`. **Proposal-only:** `task-start` would own bundle creation while closeout owns finalization; until archived, closeout creates bundles from scratch.

## Related

- [Task Lifecycle](../architecture/task-lifecycle.md) — bundle shape, identity, and state machine.
- [learning-distill](learning-distill.md) — the distillation procedure consuming bundles.
- [Session Identity and Storage](../concepts/session-identity-and-storage.md) — identity and ignore contracts.
