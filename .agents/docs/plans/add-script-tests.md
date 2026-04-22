---
id: add-script-tests
title: Add script tests for docs-search and docs-compile
last_updated: 2026-04-22
description: 'Add focused automated tests for docs-search and docs-compile scripts so consumer-deliverable behavior stays stable.

  '
tags:
- testing
- docs-search
- docs-compile
status: draft
kind: initiative
consumer_portable: false
author_kind: ai
prompter: Hypercubed
---

# Plan: Add Script Tests (Option A)

## Goal

Add a minimal, reliable automated test layer for the script surfaces made
consumer-facing in Option A:

- `.agents/skills/docs-search/scripts/index-docs.py`
- `.agents/skills/docs-search/scripts/search-docs.py`
- `.agents/skills/docs-compile/scripts/generate-durable-indexes.py`
- `.agents/skills/docs-compile/scripts/docs-compile.sh`

## Scope

### In scope

- Script behavior and output contracts.
- Exit codes and failure modes for missing prerequisites.
- Temporary fixture repos that model minimal `.agents/` structures.

### Out of scope

- Markdown prose/link correctness in docs files.
- End-to-end integration with editor-specific tasks or git hooks.
- Large snapshot/golden-output comparisons.

## Approach

Use `pytest` with subprocess-driven black-box tests:

- Run scripts as users run them (CLI invocation).
- Build fixture repos in temp directories.
- Assert key invariants over output and generated files.

Avoid introducing additional shell-test frameworks unless needed.

## Test matrix

### 1) `index-docs.py`

Validate that docs-search indexing is independent from durable section index
files and compiles from source markdown:

1. Builds `docs-search-index.json` when `decisions/index.md` and
   `troubleshooting/index.md` are absent.
2. Includes expected entry kinds and sources:
   - decisions entries
   - troubleshooting entries
   - playbooks
   - `.agents/AGENTS.md`
3. Emits required per-record fields:
   - `id`, `title`, `description`, `path`, `kind`
4. `--dry-run` does not write `docs-search-index.json`.
5. Missing `.git` or missing `.agents/docs` yields non-zero exit with clear
   error message.

### 2) `search-docs.py`

1. Returns results from a generated index.
2. Honors `--limit`.
3. Reports missing index with non-zero exit and guidance message.
4. Displays file paths that can be opened directly from repo root.

### 3) `generate-durable-indexes.py`

1. Regenerates `decisions/index.md` and `troubleshooting/index.md` from entry
   frontmatter.
2. Preserves `last_updated` when body content is unchanged.
3. `--dry-run` reports would-change without writing files.
4. Handles minor metadata issues with warnings (non-fatal), while preserving
   deterministic output order.

### 4) `docs-compile.sh`

1. Runs generator and indexer when both scripts exist.
2. Succeeds with explicit skip messaging when one component is missing.
3. Fails with non-zero exit when run outside a git repository.

## Fixture design

Create helper builders for temporary repositories:

- minimal `.git` marker and repo root
- `.agents/docs/decisions/*.md`
- `.agents/docs/troubleshooting/*.md`
- optional/missing `index.md` variants
- `.agents/playbooks/*.md`
- `.agents/AGENTS.md`

Prefer compact fixtures per scenario over one large shared fixture.

## Implementation steps

1. Add test directory layout (for example `tests/scripts/`).
2. Add fixture/helper module for temporary repo assembly.
3. Add black-box tests for each script in the matrix above.
4. Add a single local run command (for example `pytest tests/scripts`).
5. Document how to run script tests in contributor-facing docs.

## Acceptance criteria

1. Tests fail if docs-search regresses to requiring durable section `index.md`
   files.
2. Tests fail if docs-compile no longer degrades gracefully when optional
   components are absent.
3. Tests pass deterministically on repeated local runs.
4. Test suite remains small and fast enough for routine maintainer use.

## Risks and mitigations

### Risk: brittle output assertions

Mitigation: assert key substrings and structural fields, not full stdout
snapshots with timestamps.

### Risk: over-coupling to current file ordering

Mitigation: assert membership/invariants where possible; only enforce ordering
where explicitly contractual.

### Risk: fixture sprawl

Mitigation: centralize fixture builders and keep each scenario minimal.
