## 1. Skill Development
- [ ] 1.1 Create `.agents/skills/task-start/SKILL.md` (metadata, logic, manifest structure).
- [ ] 1.2 Implement the initialization script for `task-start`.

## 2. Integration
- [ ] 2.1 Refactor `.agents/skills/task-closeout/SKILL.md` to accept existing session manifest context.
- [ ] 2.2 Update `AGENTS.md` to include `task-start` as a mandatory implementation step.
- [ ] 2.3 Update `openspec/config.yaml` to include `task-start` in triggers.

## 3. Verification & Cleanup
- [ ] 3.1 Verify `task-start` -> `task-closeout` lifecycle with a test task.
- [ ] 3.2 Create `.agents/skills/session-cleanup/SKILL.md` for manifest-based housekeeping.
- [ ] 3.3 docs-lint the repository to ensure documentation consistency.
