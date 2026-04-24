---
id: implement-operating-contract-and-triggers
title: "Plan: Operating Contract + Trigger System + Playbooks"
last_updated: 2026-04-23
description: "Introduce a lightweight, repo-native workflow layer with an operating contract, trigger system, and playbooks."
tags: [workflow, automation, playbooks, contract]
status: active
kind: initiative
type: plan
phase: plan
inputs: ["AKSK repository", "existing docs structure"]
outputs: ["operating contract", "trigger system", "playbooks"]
files:
  - .agents/OPERATING_CONTRACT.md
  - .agents/triggers.yaml
  - docs/playbooks/*.md
  - docs/rules/*.md
verification:
  - operating contract is consistently applied
  - triggers resolve to valid playbooks
  - at least one trigger executes during task-closeout
  - playbooks are discoverable via ripgrep
---

# Plan: Operating Contract + Trigger System + Playbooks

## Goal
Introduce a lightweight, repo-native workflow layer that:
- Ensures agents consistently consult repository knowledge
- Enables automatic execution of reusable workflows (playbooks)
- Remains tool-agnostic and user-focused

---

## Task 1: Create Operating Contract

**File:** `.agents/OPERATING_CONTRACT.md`

### Steps
1. Define mandatory phases:
   - Discover (search repo)
   - Align (respect decisions)
   - Execute (use playbooks)
   - Closeout (run triggers, update docs)
2. Keep instructions concise and non-configurable
3. Ensure language is directive (not suggestive)

### Acceptance Criteria
- Contract is under 50 lines
- Clearly defines pre-task and post-task behavior
- Does not reference AKSK internals

---

## Task 2: Define Trigger Schema

**File:** `.agents/triggers.yaml`

### Steps
1. Introduce fixed event set:
   - task-start
   - pre-execution
   - post-execution
   - task-closeout
   - error
2. Define trigger structure:
   - `event`
   - `run` (list of playbook IDs)
3. Add initial trigger:

```yaml
triggers:
  - event: task-closeout
    run: [update-docs]
```

### Acceptance Criteria

* YAML is valid and minimal
* Events are consistent (no free-form expansion)
* At least one trigger is defined

---

## Task 3: Introduce Playbooks as First-Class Artifacts

**Directory:** `docs/playbooks/`

### Steps

1. Create initial playbooks:

   * `update-docs.md`
   * `create-plan.md`
2. Add frontmatter to each:

   * type: playbook
   * id
   * when_to_use
   * outputs
3. Structure content:

   * Goal
   * Steps (ordered)
   * Verification checklist

### Acceptance Criteria

* Each playbook is human-readable and actionable
* Each has a unique `id`
* Each includes a verification section

---

## Task 4: Define Rules (Optional but Recommended)

**Directory:** `docs/rules/`

### Steps

1. Add 1–3 foundational rules:

   * Plans must be updated before task completion
   * Decisions must be respected
2. Keep rules declarative (no steps)

### Acceptance Criteria

* Rules are concise and unambiguous
* No overlap with playbooks

---

## Task 5: Enable Discovery via ripgrep

### Steps

1. Ensure all playbooks include:

   * `id:` in frontmatter
2. Validate that playbooks can be found via:

   * `rg "id: update-docs"`
3. Ensure triggers reference valid IDs

### Acceptance Criteria

* All trigger references resolve to exactly one playbook
* No duplicate playbook IDs
* Search returns relevant results quickly

---

## Task 6: Integrate with Workflow

### Steps

1. Update agent instructions to:

   * Always read `OPERATING_CONTRACT.md`
   * Execute triggers on matching events
2. Ensure “task-closeout” includes:

   * Running all associated playbooks
3. Validate behavior with a sample task

### Acceptance Criteria

* At least one full cycle executed:

  * task → closeout → trigger → playbook
* Docs updated as part of closeout

---

## Verification

* [ ] Operating contract is followed before execution
* [ ] Trigger fires on task-closeout
* [ ] `update-docs` playbook is executed
* [ ] Plans/logs updated as expected
* [ ] No manual prompting required to use playbooks

---

## Notes

* Keep system declarative and file-based
* Avoid introducing runtime dependencies
* Favor clarity over completeness in early iteration
