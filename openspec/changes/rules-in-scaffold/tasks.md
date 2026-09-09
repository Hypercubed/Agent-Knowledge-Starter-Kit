## 1. Documentation and Scaffolding

- [ ] 1.1 Create the `.agents/rules/` directory (or ensure it's in the scaffold)
- [ ] 1.2 Update `.agents/docs/index.md` or a new decision file to define the rules vs decisions boundary
- [ ] 1.3 Update `AGENTS.md` to include a reference to the rules directory for domain-specific instructions

## 2. Skill Updates

- [ ] 2.1 Update `generate-example` skill to create `.agents/rules/` and populate it with sample rules
- [ ] 2.2 Update `learning-distill` skill prompt/instructions to support routing distilled lessons to `.agents/rules/`

## 3. Verification and Maintenance

- [ ] 3.1 Run `generate-example` and verify the new rules structure
- [ ] 3.2 Run `docs-lint` to ensure the new documentation aligns with the kit standards
- [ ] 3.3 Execute `task-closeout` to capture the implementation session
- [ ] 3.4 Execute `learning-distill` to promote any new patterns discovered during implementation
