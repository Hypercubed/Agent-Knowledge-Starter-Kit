## 1. Directory Deletion

- [x] 1.1 Remove the `.agents/skills/write-plan/` directory and all its contents.

## 2. Clean Up References

- [x] 2.1 Remove references to `write-plan` from `.agents/docs/index.md`.
- [x] 2.2 Remove references to `write-plan` and the `write-plan` schemas from `.agents/docs/MAINTENANCE.md`.
- [x] 2.3 Remove references to `write-plan` and the `write-plan` schemas from `.agents/skills/learning-distill/bootstrap/docs/MAINTENANCE.md`.
- [x] 2.4 Update `.agents/skills/docs-lint/SKILL.md` to remove the `write-plan` dependency for scaffolding the `plans/` index.
- [x] 2.5 Clean up the `write-plan` reference in `.agents/skills/learning-distill/SKILL.md` and its portable contract.
- [x] 2.6 Remove the block responsible for syncing `write-plan` bootstrap plans from `.agents/skills/generate-example/run.sh`.
