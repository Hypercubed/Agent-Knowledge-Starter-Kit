# Design: Repo-Centric Wiki Tooling

## Overview

This design implements lightweight wiki tooling for the `.agents/` knowledge layer, focusing on compile, query, and visualization capabilities while maintaining the repo-local, markdown-first approach.

## Architecture

The design splits functionality between core query correctness and optional human-oriented features:

- **Core Query**: `docs-search` builds `docs-search-index.json` directly from markdown sources
- **Optional Compile**: `docs-compile` skill regenerates human-readable indexes and refreshes the search index
- **Maintenance Loop**: `learning-distill` and `docs-lint` integrate compile when available

## Key Components

### Metadata Schema

Extend frontmatter for `.agents/docs/decisions/` and `.agents/docs/troubleshooting/` files:

- Required: `id`, `title`, `last_updated`
- Recommended: `description`, `tags`, `depends_on`, `status`

### Compile Command

A repo-local script (`scripts/knowledge-compile.*`) that:

- Crawls durable sources: `.agents/AGENTS.md`, `.agents/docs/decisions/`, `.agents/docs/troubleshooting/`, `.agents/playbooks/`
- Generates artifacts: `.agents/docs/index.json`, `.agents/docs/index.md`, `.agents/docs/knowledge-map.md`

### Query Command

A repo-local script (`scripts/knowledge-query.*`) that:

- Queries `index.json` for first-pass retrieval
- Supports keyword search, tag filters, section filters
- Returns structured results with title, path, kind, description

### Visualization

Generated Mermaid diagrams in `knowledge-map.md` showing:

- Document relationships via links and `depends_on`
- Orphaned entries, duplicates, and connectivity

### Lint Integration

`docs-lint` validates:

- Metadata contract compliance
- Index coverage
- Graph health (orphans, broken links)

## Constraints

- Durable content remains in markdown under `.agents/`
- No external dependencies for core functionality
- Generated artifacts are deterministic and git-friendly
- Preserves existing skill workflow
- Small scripts over complex tooling

## External Integrations

Evaluated but not required:

- `markdowndb` (mddb) for structured indexing
- `markdown-vdb` (mdvdb) for advanced retrieval
- `llm-wiki-compiler` command patterns
- SwarmVault graph features

Default to local scripts with compatibility for future adapters.

## Phases

### Phase 1: Metadata Contract
- Extend frontmatter schema
- Update MAINTENANCE.md
- Add validation scripts

### Phase 2: Compile Step
- Implement `knowledge-compile` script
- Generate `index.json` and `index.md`
- Standardize artifact fields

### Phase 3: Query Step
- Implement `knowledge-query` script
- Update agent guidance for query-first retrieval
- Optional `knowledge-search` skill

### Phase 4: Visualization
- Generate `knowledge-map.md` with Mermaid
- Add graph checks to lint

### Phase 5: Integration
- Update `learning-distill` and `docs-lint`
- Integrate into maintenance loop
- Update documentation

### Phase 6: Packaging
- Dogfood in this repository
- Validate against real prompts
- Decide kit inclusion

## Risks and Mitigations

- **Generated Surface**: Keep artifacts minimal and derived
- **Platform Drift**: Keep commands repo-local and optional
- **Metadata Burden**: Small schema, validate only helpful fields
- **Agent Adoption**: Encode in skill procedures, not just docs

## Definition of Done

- Consistent metadata contract
- Rebuildable compiled index
- Query-first agent behavior
- Inspectable knowledge map
- Lint detects issues
- Repo-centric, skill-based workflow