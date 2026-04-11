---
name: task-closeout
description: Capture the current task into a structured temporary session bundle under `.agents/sessions/` so a learning agent can later distill durable repo knowledge. Use for completed, blocked, or abandoned tasks with meaningful changes, debugging, validation, or reusable lessons.
---

# Task Closeout

## Goal
Create a temporary handoff packet for later learning extraction.

## Output location
Write inside the repo to `.agents/sessions/<session-folder>/`.

## Required outputs
- summary.json
- active-task.md
- learning-candidate.md
- changed-files.txt
- validation.txt

## Example bundle
Filled-in reference files live next to this skill under `example/task-bundle/`.

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
3. Create a session folder using the pattern `YYYYMMDD-HHMMSS-short-topic`.
4. Keep one task-closeout bundle per session folder.
5. Collect changed files.
6. Collect commands run and validation results.
7. Write active-task.md.
8. Write learning-candidate.md.
9. Write summary.json with status and metadata.
10. Mark the session bundle ready for distillation.

## Session folder naming
- Use a deterministic, sortable folder name such as `YYYYMMDD-HHMMSS-short-topic`.
- Keep the slug short, lowercase, and tied to the task goal.
- Reuse the same session folder only for the single task-closeout bundle it was created for.

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
