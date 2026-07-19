# Tasks: Living Architecture & Intent Capture Implementation

## Phase 1: Manifest & Store
- [ ] Create `.agents/manifest.json` with paths and governance settings
- [ ] Create `docs/decisions/` directory
- [ ] Move existing decision contents to `docs/decisions/` with standardized naming
- [ ] Implement naming convention: NNNN-slug-title.md

## Phase 2: The Template
- [ ] Create `.agents/templates/` directory
- [ ] Standardize ADR format in `.agents/templates/adr-template.md`
- [ ] Define combined ADR and Operational Decision structure

## Phase 3: Closeout Integration
- [ ] Update task-closeout playbook to include intent capture workflow
- [ ] Implement detection: git diff on task completion
- [ ] Implement inference: categorize changes as Architectural/Operational
- [ ] Implement proposal loop: draft presentation and user confirmation
- [ ] Implement persistence: write to manifest-defined path

## Phase 4: Linting
- [ ] Update knowledge-lint to check for decision records on modified core files
- [ ] Add check for decisions path reachability and indexing
- [ ] Enforce "Intent-First" standard in linting

## Skill Implementation
- [ ] Create `document-intent.md` skill for diff analysis and drafting
- [ ] Update `knowledge-lint.md` with new checks
- [ ] Update `distill-learning.md` to ingest docs/decisions and synthesize patterns

## Validation and Closeout
- [ ] Test end-to-end workflow with sample changes
- [ ] Perform `task-closeout` to capture implementation changes
- [ ] Run `learning-distill` if new patterns emerged