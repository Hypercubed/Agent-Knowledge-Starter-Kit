## 1. Skill Setup

- [ ] 1.1 Create the `.agents/skills/docs-capture/` directory.
- [ ] 1.2 Draft `.agents/skills/docs-capture/SKILL.md` detailing the frontmatter routing rules, domain placement, compiler invocation, and explicitly distinguishing its use-case from `task-closeout`.

## 2. Testing and Linkages

- [ ] 2.1 Verify the skill format manually via `skills-cli`.
- [ ] 2.2 Run a dry-edit on an ad-hoc `/decisions/` markdown document to ensure the compiler generates indices properly.
- [ ] 2.3 Check that `.agents/docs/MAINTENANCE.md` mentions this skill as a valid bypass for manual direct-writes.

## 3. Example Mock Synchronization

- [ ] 3.1 Run `.agents/skills/generate-example/run.sh` to mirror the new skill inside `example/`.

## 4. Final Review and Validation

- [ ] 4.1 Execute `scripts/check-publish.sh` to validate markdown, schemas, and lint boundaries across the repo.
- [ ] 4.2 Run `task-closeout` for the session.
