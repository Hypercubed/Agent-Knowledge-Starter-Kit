---
type: skill-reference
title: "task-closeout Skill"
description: "Captures a finished, blocked, or abandoned task into a five-file temporary session bundle under .agents/sessions/ with canonical task_id identity and an optional openspec_change link in summary.json; never touches durable files or openspec/."
tags: [skills, task-closeout, sessions, capture]
timestamp: 2026-08-23T19:30:00Z
openwiki:
  roles: [workflow]
  source_paths:
    - .agents/skills/task-closeout/SKILL.md
    - .agents/skills/task-closeout/CONTRACT.md
    - .agents/skills/task-closeout/example/task-bundle/
  invariants: ["Write scope is only .agents/sessions/<session-folder>/; closeout never edits openwiki/**, durable docs, or openspec/.", "After closeout the bundle is immutable except status/distillation-related fields in summary.json."]
---

# task-closeout

**Folder:** `.agents/skills/task-closeout/` · **Files:** `SKILL.md`, `CONTRACT.md`, `bootstrap/sessions/README.md`, `example/task-bundle/`

## Goal and trigger

Create a temporary handoff packet for later learning extraction. Use it at any meaningful stopping point — completed, blocked, or abandoned tasks — when there were meaningful changes, debugging, validation, or reusable lessons. It is the first half of the knowledge loop described in [Task lifecycle](../architecture/task-lifecycle.md).

## Skill initialization (idempotent, once per repo)

1. Resolve the repo root (directory containing `.git/` in normal layouts).
2. Ensure `.agents/sessions/` exists.
3. If `.agents/sessions/README.md` is missing, copy it from this skill's `bootstrap/sessions/`.
4. Ensure `.agents/.gitignore` exists; if missing create exactly:
   ```gitignore
   sessions/*
   !sessions/README.md
   ```
   If it exists, merge those two lines without removing unrelated rules.
5. If the repo doesn't track `.agents/.gitignore`, ensure equivalent root patterns instead: `.agents/sessions/*` and `!.agents/sessions/README.md`.

Deliberately **not** created here: durable `AGENTS.md`, playbooks, wiki pages — those belong to learning-distill initialization or a full kit merge.

## Procedure

1. Determine or create `repo_id`.
2. Determine or create `task_id`.
3. Create a session folder named `YYYYMMDD-HHMMSS-short-topic` (sortable label — not canonical identity).
4. One bundle per session folder.
5. Collect changed files and commands run / validation results.
6. Re-read the whole session or transcript before drafting prose so notes are not scoped to only the final edit.
7. Write `active-task.md`, then `learning-candidate.md`, then `summary.json` with status, metadata, ids.
8. Mark the bundle ready for distillation.

## Contract highlights (`CONTRACT.md`)

- **Write scope:** all new files under `.agents/sessions/<session-folder>/`. Never create/edit `.agents/AGENTS.md`, `openwiki/**`, `.agents/playbooks/**`, or anything under `.agents/skills/**`; also never edit `openspec/` for in-flight changes — spec updates are deferred to `/opsx:archive` time (capability `closeout-change-linking`). Proposed skill or policy changes go into the bundle as text; learning-distill applies them.
- **Required bundle filenames:** `summary.json`, `active-task.md`, `learning-candidate.md`, `changed-files.txt`, `validation.txt`.
- **Contractual minimum for `summary.json`:** a stable string **`task_id`**. Include **`openspec_change`** (string: the OpenSpec change name) when the session worked on an OpenSpec change — it links the bundle to OpenSpec work and gives lint's coverage pairing its join key. Everything else is optional; the example shows typical keys:

```json
{
  "repo_id": "example-repo",
  "task_id": "t-20260407-143210-monaco",
  "agent": "example-agent",
  "agent_session_id": "example-session-id",
  "status": "completed",
  "distilled": false,
  "created_at": "2026-04-07T14:32:10Z",
  "completed_at": "2026-04-07T15:11:54Z",
  "branch": "fix/monaco-json-worker",
  "head_commit": "abc1234",
  "workspace_root": "/path/to/repo",
  "openspec_change": "add-task-start"
}
```

- **Immutability:** after closeout the bundle is immutable except status/distillation-related fields a later tool may update.

## Rules that shape bundle quality

- Record only observable facts in `active-task.md`; only candidate lessons in `learning-candidate.md`; clearly separate what failed, what worked, and what is hypothesis.
- Treat the whole maintainer conversation as in scope unless the user limits closeout to one subtask — mistakes, reversals, corrections.
- Prefer concise bullets; no long narrative summaries.

## Agent provenance (optional metadata)

Record `agent` and/or `agent_session_id` whenever the active tool supplies them, independently of each other — add the matching section to `active-task.md` too. Never invent session IDs or require manual lookups outside the tool's supported history. The conservative stance is codified in the [integration-guide playbook](../../.agents/playbooks/writing-integration-guides.md): document provenance capture only where the tool exposes it.

## Focused evidence

- Reference bundle: `.agents/skills/task-closeout/example/task-bundle/` — all five files filled in for a fictional Monaco JSON worker fix, including the `openspec_change` field.
- Structure enforcement: `scripts/check-agents-structure.sh` requires the four example-bundle text files plus `summary.json` to exist inside the shipped skill ([validation scripts](generate-example-and-scripts.md)).
- Real-world usage: 46 bundles under `.agents/sessions/` in this dogfood repo follow the same shape.
- Planned extension (unshipped): change `add-task-start` would have closeout update an existing `manifest.json` instead of generating metadata; its coordination with the new `openspec_change` field is open reconciliation work ([OpenSpec workflow](../governance/openspec-workflow.md)).
