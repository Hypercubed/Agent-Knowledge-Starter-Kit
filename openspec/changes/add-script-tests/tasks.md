# Tasks: Script Test Implementation

## Phase 1: Setup
- [ ] Create `tests/scripts/` directory structure
- [ ] Add `conftest.py` with shared fixture builders (TempRepoFixture, DocsFixture, PlaybooksFixture, AgentsMarkdownFixture)
- [ ] Verify pytest is available in dev dependencies (package.json or requirements)

## Phase 2: Implement Core Tests
- [ ] Implement `test_index_docs.py` with 5 test cases covering index generation, dry-run, and error handling
- [ ] Implement `test_search_docs.py` with 4 test cases covering search, limit, missing index, and path format
- [ ] Implement `test_generate_durable_indexes.py` with 5 test cases covering regeneration, cache semantics, dry-run, and determinism
- [ ] Implement `test_docs_compile.py` with 3 test cases covering full orchestration, partial availability, and git-repo validation

## Phase 3: Validation & Documentation
- [ ] Run full test suite locally and verify all tests pass deterministically
- [ ] Add a local run command (e.g., `pytest tests/scripts` or npm script)
- [ ] Document how to run script tests in contributor-facing docs (e.g., CONTRIBUTING.md or `.agents/docs/contributing/`)
- [ ] Verify test suite completes in <5 seconds on typical hardware

## Phase 4: Completion
- [ ] Ensure all tests pass in CI/CD (if applicable)
- [ ] Perform `task-closeout` to capture implementation notes
- [ ] If new patterns emerge, run `learning-distill` to update `.agents/` docs
