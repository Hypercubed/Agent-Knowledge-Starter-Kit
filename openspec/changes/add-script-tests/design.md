# Design: Script Test Architecture

## Overview
Implement pytest-based black-box tests that invoke scripts as CLI commands against temporary fixture repositories. Each test scenario builds a minimal fixture repo, runs the script, and asserts invariants over exit codes, file outputs, and stdout/stderr.

## Test Organization

### Directory Layout
```
tests/
  scripts/
    conftest.py           # Shared pytest fixtures and helpers
    test_index_docs.py    # docs-search indexer tests
    test_search_docs.py   # docs-search search tests
    test_generate_durable_indexes.py  # docs-compile indexer tests
    test_docs_compile.py  # docs-compile orchestrator tests
```

### Fixture Design
Create fixture builders in `conftest.py` for efficient test setup:

1. **TempRepoFixture**: Creates minimal temporary git repository with `.agents/` structure
2. **DocsFixture**: Builder for `.agents/docs/decisions/` and `.agents/docs/troubleshooting/` entries
3. **PlaybooksFixture**: Builder for `.agents/playbooks/` entries
4. **AgentsMarkdownFixture**: Helper to create/modify `.agents/AGENTS.md`

Prefer compact, scenario-specific fixtures over monolithic shared fixtures.

## Test Matrix

### 1) `index-docs.py` Tests
- **Validation Scope**: Builds search index from source markdown without requiring durable index files
- **Test Cases**:
  - ✓ Generates `docs-search-index.json` from decisions, troubleshooting, playbooks, and `.agents/AGENTS.md`
  - ✓ Includes all required per-record fields (`id`, `title`, `description`, `path`, `kind`)
  - ✓ `--dry-run` flag skips writing to disk
  - ✓ Exits with non-zero and clear message when `.git` missing
  - ✓ Exits with non-zero and clear message when `.agents/docs` missing

### 2) `search-docs.py` Tests
- **Validation Scope**: Searches generated index and returns properly formatted results
- **Test Cases**:
  - ✓ Returns search results matching query from generated index
  - ✓ `--limit` flag respects result count
  - ✓ Exits with non-zero and guidance message when index missing
  - ✓ File paths in results are openable from repo root

### 3) `generate-durable-indexes.py` Tests
- **Validation Scope**: Regenerates durable index files and respects cache-like semantics
- **Test Cases**:
  - ✓ Regenerates `decisions/index.md` and `troubleshooting/index.md` from entry frontmatter
  - ✓ Preserves `last_updated` field when body content is unchanged
  - ✓ `--dry-run` flag reports would-change without writing
  - ✓ Handles minor metadata issues with warnings (non-fatal)
  - ✓ Output order is deterministic

### 4) `docs-compile.py` Tests
- **Validation Scope**: Orchestrates generator and indexer correctly
- **Test Cases**:
  - ✓ Runs both generator and indexer when both scripts exist
  - ✓ Succeeds with skip messaging when only one component is available
  - ✓ Exits non-zero when run outside a git repository

## Assertion Strategy
- Assert substrings and structural invariants over complete output snapshots
- Assert membership and presence where possible; enforce ordering only when contractual
- Avoid timestamps and variable paths in assertions; use placeholder or regex matching
- Validate exit codes directly (0 for success, non-zero for expected failures)

## Fixture Constraints
- Minimal repos (no more than 3–5 files per scenario)
- Reusable builder functions to reduce duplication
- No large snapshot files or golden outputs
- Cleanup handled automatically by pytest temp directories
