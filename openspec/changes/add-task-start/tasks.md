## 1. Skill Development
- [ ] 1.1 Create `.agents/skills/task-start/SKILL.md` (metadata, procedure) aligned with `task-closeout/CONTRACT.md` — seeds `summary.json` with `task_id`, `created_at`, `status: in_progress`.
- [ ] 1.2 Implement initialization logic (folder `YYYYMMDD-HHMMSS-short-topic`, idempotent `README.md`/`.gitignore`, optional `openspec_change` passthrough).

## 2. Integration
- [ ] 2.1 Refactor `.agents/skills/task-closeout/SKILL.md` to detect existing seeded `summary.json` and finalize it; retain fallback generation when no seed exists.
- [ ] 2.2 Update `.agents/AGENTS.md` to include `task-start` as the mandatory start-of-task step (routing/lifecycle section).
- [ ] 2.3 Update `openspec/config.yaml` context (replace stale `.agents/docs/` references with `openwiki/` + `.agents/sessions/` (gitignored) + `.agents/AGENTS.md`/`.agents/playbooks/`) and add `task-start` to change lifecycle rules/triggers.

## 3. Verification & Cleanup
- [ ] 3.1 Verify `task-start` → `task-closeout` → `learning-distill` lifecycle with a test task (including `openspec_change` passthrough).
- [ ] 3.2 Run `docs-lint` (or equivalent validation) to ensure documentation consistency.
- [ ] 3.3 Retire or defer `session-cleanup` scope — document pruning guidance instead of shipping a separate skill unless needed.
