---
name: task-closeout
description: Capture the current task into a structured temporary task bundle outside the workspace so a learning agent can later distill durable repo knowledge. Use for completed, blocked, or abandoned tasks with meaningful changes, debugging, validation, or reusable lessons.
---

# Task Closeout

## Goal
Create a temporary handoff packet for later learning extraction.

## Output location
Write outside the workspace to the configured task-bundle store.

## Required outputs
- summary.json
- active-task.md
- learning-candidate.md
- changed-files.txt
- validation.txt

## Rules
- Record only observable facts in active-task.md.
- Record only candidate lessons in learning-candidate.md.
- Distinguish clearly between what failed, what worked, and what is only a hypothesis.
- Do not update `.agents/AGENTS.md` or any other durable repo knowledge file.
- Do not write narrative summaries longer than necessary.
- Prefer concise bullet lists.

## Procedure
1. Determine or create `repo_id`.
2. Determine or create `task_id`.
3. Collect changed files.
4. Collect commands run and validation results.
5. Write active-task.md.
6. Write learning-candidate.md.
7. Write summary.json with status and metadata.
8. Mark the task bundle ready for distillation.

## active-task.md sections
- Task ID
- Goal
- Outcome
- Files Changed
- Commands Run
- Validation
- Remaining Work
- Notes

## learning-candidate.md sections
- Task
- What failed
- What worked
- Reusable pattern
- Candidate AGENTS update
- Candidate troubleshooting note
- Candidate repo decision
- Candidate playbook
- Confidence
