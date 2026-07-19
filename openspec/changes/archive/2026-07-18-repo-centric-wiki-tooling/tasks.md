# Tasks: Repo-Centric Wiki Tooling

## Phase 1: Metadata and Document Contract

### Objective
Make durable docs machine-addressable for compile and query workflows.

### Tasks
1. Extend frontmatter contract for `.agents/docs/decisions/` and `.agents/docs/troubleshooting/`
2. Add recommended keys: `description`, `tags`, `depends_on`, `status`
3. Define link expression conventions for generated maps
4. Update `.agents/docs/MAINTENANCE.md` with new contract and examples
5. Update validation scripts to enforce metadata rules
6. Migrate representative docs to stronger schema

### Exit Criteria
- Durable entries parseable without reading body prose
- Linter identifies missing description, duplicate IDs, malformed tags

## Phase 2: Compile the Knowledge Layer

### Objective
Turn `.agents/` markdown into lightweight compiled index.

### Tasks
1. Create `scripts/knowledge-compile.*` script
2. Implement crawler for durable sources (AGENTS.md, decisions/, troubleshooting/, playbooks/)
3. Generate `.agents/docs/index.json` with standardized fields
4. Generate `.agents/docs/index.md` for human navigation
5. Ensure deterministic output for stable diffs
6. Decide on local script vs library adapter packaging

### Exit Criteria
- New docs don't require manual index editing
- Agents inspect one artifact instead of multiple directories

## Phase 3: Query-First Retrieval

### Objective
Teach agents to search compiled knowledge before opening files.

### Tasks
1. Create `scripts/knowledge-query.*` script
2. Implement query modes: keyword, tag filter, section filter
3. Return structured results: title, path, kind, description, matches
4. Update agent docs with query-first rule
5. Update relevant SKILL.md files
6. Decide on script-only vs new `knowledge-search` skill

### Exit Criteria
- Agents answer most questions via compact query results
- Avoid brute-force reading entire docs tree

## Phase 4: Visualization and Graph Hygiene

### Objective
Expose knowledge graph structure and gaps.

### Tasks
1. Extend compile to produce `.agents/docs/knowledge-map.md`
2. Generate Mermaid from links, depends_on, section membership
3. Identify orphans, missing metadata, overloaded docs, duplicates
4. Add graph checks to `docs-lint`
5. Keep visualization markdown-native for GitHub/rendering

### Exit Criteria
- Maintainers inspect map to identify missing links/weak integration

## Phase 5: Distillation and Maintenance Loop Integration

### Objective
Integrate compile/query into existing skill workflow.

### Tasks
1. Update `learning-distill` to run `docs-compile` when available
2. Update `docs-lint` for metadata, index, graph validation
3. Update `task-closeout` guidance if needed
4. Update root docs explaining source vs generated artifacts
5. Decide which artifacts belong in git vs rebuild-only

### Exit Criteria
- Compile/query part of documented maintenance loop
- Adopters copy pattern without extra infrastructure

## Phase 6: Dogfooding and Release Packaging

### Objective
Validate pattern in this repository before promoting.

### Tasks
1. Dogfood scripts against this repo's `.agents/` tree
2. Test realistic prompts (release guidance, troubleshooting, decisions)
3. Measure reduction in file reads/manual maintenance
4. Add artifacts/scripts to example/kit when stable
5. Update `generate-example` if needed
6. Run publish checks and compile validation

### Exit Criteria
- Pattern works without substantial maintenance burden
- Published kit surface stays small and justified

## Research Backlog

1. Prototype `knowledge-compile` with `mddb` and compare index shape
2. Test `mdvdb` as optional local accelerator
3. Review `llm-wiki-compiler` for transferable command semantics
4. Review SwarmVault for markdown-first graph features
5. Record adoption decisions in repo decision files

## Implementation Order

1. Phase 1
2. Phase 2
3. Phase 3
4. Phase 5
5. Phase 4
6. Phase 6