## 1. Documentation Updates

- [ ] 1.1 Review and update `README.md` to ensure human and agent quick starts are clearly separated.
- [ ] 1.2 Update `README.md` (or create a dedicated section) to detail the safe upgrade paths (e.g., using `npx skills add` vs manual merging).
- [ ] 1.3 Update `README.md` to document the first-time adoption process for repositories with an existing `.agents/` folder.
- [ ] 1.4 Verify `README.md` explains the relationship between the root `AGENTS.md` and `.agents/AGENTS.md`.
- [ ] 1.5 Verify `README.md` clarifies that `.agents/.gitignore` is the primary location for ignoring session bundles.

## 2. Install Guide Refinement

- [ ] 2.1 Update `INSTALL.md` to include a detailed install and merge checklist specifically intended for AI agents.
- [ ] 2.2 Add recommendations in `INSTALL.md` or `README.md` to record adoption in `.agents/docs/log.md`, track rationale in `.agents/docs/decisions/`, and update `.agents/docs/index.md`.

## 3. Verification and Cleanup

- [ ] 3.1 Run `docs-lint` to ensure the new documentation additions do not conflict with existing durable knowledge.
- [ ] 3.2 Run `task-closeout` to capture session artifacts for this documentation update.
- [ ] 3.3 (Optional) Run `learning-distill` if the process uncovers any reusable documentation patterns or rationale that should be added to `.agents/docs/`.
