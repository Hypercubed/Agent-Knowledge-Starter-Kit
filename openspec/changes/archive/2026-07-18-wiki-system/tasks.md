# Tasks: Wiki System Implementation

## Phase 1 — Wiki Foundation

- [ ] Create `.agents/wiki/` directory structure and `wiki/index.md`
- [ ] Define and document wiki entry format with frontmatter schema
- [ ] Update `task-closeout` skill to capture `wiki_candidates` in session bundles
- [ ] Update `learning-distill` skill to write wiki entries (single-session mode)
- [ ] Update `.agents/docs/index.md` to register wiki in knowledge asset catalog
- [ ] Update `docs/architecture.md` (this repo) with wiki lifecycle diagram and distillation rules

## Phase 2 — Lint Integration

- [ ] Update `docs-lint` skill with semantic lint pass for `code_refs` verification
- [ ] Add wiki plan emission logic to `docs-lint` for significant drift
- [ ] Update `learning-distill` skill documentation and/or `.agents/AGENTS.md` with wiki plan handling for learning-style passes

## Phase 3 — Direct Write and Reconciliation

- [ ] Create `wiki-update` skill for direct wiki writes without session bundles
- [ ] Add multi-session reconciliation mode to `learning-distill` skill
- [ ] Update `docs/architecture.md` with full lifecycle including direct write path and reconciliation
- [ ] Document conflict resolution policy for multi-session reconciliation (e.g., flag for review)

## Validation and Handoff

- [ ] Perform `task-closeout` to capture implementation changes
- [ ] Run `learning-distill` to update durable docs if new patterns emerged
- [ ] Final validation pass with `docs-lint` to ensure no drift introduced