---
type: task-lifecycle
title: "Task Lifecycle and Session Bundles"
description: "How task identity works (task_id in summary.json vs folder labels), the five-file closeout bundle with its optional openspec_change link, the closeout-to-distilled state machine, and how distillation now ends in deterministic wiki index sync instead of a log append."
tags: [sessions, task-closeout, lifecycle, workflow]
timestamp: 2026-08-23T23:30:00Z
openwiki:
  roles: [workflow, architecture]
  source_paths: [".agents/skills/task-closeout/CONTRACT.md", "openspec/specs/closeout-change-linking/spec.md"]
  invariants: ["task_id in summary.json is the canonical task identifier; folder names are sortable labels only.", "Closeout never edits openspec/; spec updates happen at /opsx:archive time."]
---

# Task Lifecycle and Session Bundles

Every meaningful unit of agent work moves through a defined lifecycle: capture at a stopping point, distill into durable knowledge, then mark processed. This page documents identity, bundle shape, and state transitions. The skill instructions that implement each phase are [task-closeout](../skills/task-closeout.md) and [learning-distill](../skills/learning-distill.md).

## Task and session identity

From `/docs/architecture.md`:

- The **canonical** task/session identifier is the `task_id` field inside `.agents/sessions/<session-folder>/summary.json`.
- The session **folder name is only a sortable storage label** (`YYYYMMDD-HHMMSS-short-topic`, lowercase slug tied to the task goal). Never infer canonical identity from it.
- `repo_id` carries the stable repository/project context.
- When passing work between agents, provide both the bundle path and the `task_id`.

Example from the architecture doc:

```text
Bundle path: .agents/sessions/20260411-122921-auth-timeout-fix/
Task ID: t-20260411-122921-auth-timeout-fix
Repo ID: agent-knowledge-starter
```

Real bundles show both styles: `20260503-130450-migrate-remaining-plans-to-openspec/summary.json` uses `task_id: "20260503-130450-migrate-remaining-plans-to-openspec"`; the reference example bundle uses `t-20260407-143210-monaco`. Optional chaining: decision entry `optional-prior-session-in-session-summary-json` allows a `prior_session` pointer in `summary.json` to link related closeouts without merging folders.

## Bundle shape

Each bundle directory must contain exactly these five files:

| File | Role |
| --- | --- |
| `summary.json` | status, timestamps, optional `repo_id`, **required `task_id`**, optional `agent`/`agent_session_id`, optional **`openspec_change`**, git metadata, distillation flags |
| `active-task.md` | observable facts only; sections: Task ID, Agent (optional), Agent Session ID (optional), Goal, Outcome, Files Changed, Commands Run, Validation, Remaining Work, Notes |
| `learning-candidate.md` | candidate lessons only: Task, What failed, What worked, Reusable pattern, Candidate AGENTS update, Candidate troubleshooting note, Candidate repo decision, Candidate playbook, Confidence |
| `changed-files.txt` | paths touched during the session |
| `validation.txt` | checks run and outcomes |

A filled-in reference lives at `.agents/skills/task-closeout/example/task-bundle/` (its example `summary.json` carries `"openspec_change": "add-task-start"`). Note that "the whole maintainer conversation" is in scope for the two markdown files — mistakes, reversals, and corrections — not just the final diff.

### The `openspec_change` link

When the session worked on an OpenSpec change, record its name in `summary.json.openspec_change`. Closeout never edits `openspec/` itself — spec updates are deferred to `/opsx:archive` time so bundles can reference an in-flight change without modifying it (capability `closeout-change-linking`). This field also gives [docs-lint](../skills/docs-lint.md)'s archived-change/wiki coverage pairing a natural join key.

## State machine

```mermaid
stateDiagram-v2
    [*] --> Captured: task-closeout writes 5 files
    Captured --> ReadyForDistill: status complete/blocked/abandoned
    ReadyForDistill --> Distilling: learning-distill reads bundle
    Distilling --> Distilled: lessons promoted or rejected<br/>indexes synced via sync_wiki_indexes.mjs
    Distilling --> ProposedOnly: candidates recorded but no net edits
    Distilled --> [*]
    ProposedOnly --> [*]
    note right of Captured
        summary.json distilled=false
        bundle immutable except
        status/distillation fields
    end note
```

*Caption: bundle states as enforced by the task-closeout contract ("immutable after closeout except status / distillation-related fields") and learning-distill's final step ("Mark the session bundle as distilled").*

## Lifecycle ordering and invariants

1. A coding task begins; the coding agent creates or adopts stable `repo_id` and task-specific `task_id`.
2. At completion, blockage, or abandonment, the coding agent runs `task-closeout` → bundle written to `.agents/sessions/<folder>/`.
3. The learning agent runs `learning-distill` on the bundle, reading `task_id` from `summary.json`; fail-closed prerequisites ([peer tools present](../skills/aksk-bootstrap.md), curation contract attached) pass before any wiki write.
4. Durable lessons land in their routed homes: curated wiki trees (`openwiki/{decisions,troubleshooting}/`) for descriptive lessons; `.agents/AGENTS.md` or playbooks for prescriptive ones.
5. The learning agent runs `sync_wiki_indexes.mjs` for deterministic index refresh, then marks the bundle distilled. **There is no activity log to append** — accountability lives in the bundle flags plus git history (the former `.agents/docs/log.md` was deleted in the consolidation).
6. Periodically the lint agent runs `docs-lint`.

Invariants that hold across the loop:

- **Write-scope separation**: closeout writes only under `.agents/sessions/<folder>/` (never `openwiki/**` or durable files); distillation owns all durable updates ([task-closeout contract](../../.agents/skills/task-closeout/CONTRACT.md)).
- **Gitignore boundary**: everything under `sessions/` except `README.md` stays untracked. Because ignore-aware tools hide these paths, discovery during distillation has a dedicated invariant — see [learning-distill](../skills/learning-distill.md#finding-bundles-under-gitignore).
- **No secrets upward**: neither bundles nor wiki pages may carry credentials, personal data, or long raw dumps.

## Worked end-to-end example

The kit's example bundle doubles as a teaching artifact: `active-task.md` records a Monaco JSON worker fix (goal, outcome, files changed, commands run), while `learning-candidate.md` proposes one AGENTS update, one troubleshooting note, and one repo decision from the same evidence with `Confidence: high`. The reconciled OpenSpec change (`worked-lifecycle-example`) proposes expanding this into a compact narrative that now includes the wiki leg: descriptive lessons become curated OKF pages under `openwiki/{decisions,troubleshooting}/` (validated with OpenWiki's frontmatter checker, indexes refreshed via `sync_wiki_indexes.mjs`), prescriptive lessons update `.agents/AGENTS.md` or playbooks, and there is no separate log file — the bundle flags plus git history are the audit trail (see [OpenSpec workflow](../governance/openspec-workflow.md)).

## Related

- Skill-level procedures: [task-closeout](../skills/task-closeout.md), [learning-distill](../skills/learning-distill.md)
- Where promoted knowledge lands: [knowledge layer](knowledge-layer.md)
- Proactive initialization of task state (proposed, not yet shipped): OpenSpec change `add-task-start` defines a `manifest.json`-based `task-start` capability that `task-closeout` would update rather than regenerate. Its reconciliation with the slimmed closeout is now written down: `task-start` initializes the manifest and must preserve/pass through the fields the 2.0 closeout added (`openspec_change`, distillation flags); sequencing is task-start owns creation → task-closeout owns finalization → learning-distill consumes only after closeout marks it ready, with no overlapping writers ([OpenSpec workflow](../governance/openspec-workflow.md)).
