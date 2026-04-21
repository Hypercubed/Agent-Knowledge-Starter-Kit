---
description: >
  Add lightweight compile, query, and visualize capabilities to the repo-local
  markdown knowledge layer without replacing the existing skill-based
  distillation workflow.
created: 2026-04-19
status: in-progress
writer: AI
prompter: Hypercubed
---

# Plan: Repo-Centric Wiki Tooling

## Goal

Adopt the strongest operational patterns from wiki-centric agent systems such as
Hermes Agent and llm-wiki-compiler while keeping this starter kit:

- repo-local
- markdown-first
- skill-based
- tool-agnostic
- reviewable in git

The intended outcome is not a separate knowledge platform. The outcome is a
small set of local conventions and scripts that make `.agents/` easier for
agents to ingest, query, maintain, and validate.

## Current direction (Option A, April 2026)

The implementation direction now favors a split between query correctness and
optional human-oriented index regeneration:

- `docs-search` is consumer-facing and self-sufficient for building
  `docs-search-index.json` directly from durable markdown sources.
- `docs-compile` is an optional consumer skill that regenerates
  `decisions/index.md` and `troubleshooting/index.md`, then refreshes
  `docs-search-index.json`.
- `learning-distill` and `knowledge-lint` attempt `docs-compile` when present,
  but continue when absent.
- Durable section `index.md` files are optional compile artifacts rather than a
  hard runtime dependency for docs-search.

## Why this plan exists

The current v2 direction already moves in the right direction by splitting
durable knowledge into per-entry markdown files under `.agents/docs/`. The
remaining gap is operational: agents still need to infer structure by reading
folders and indexes directly.

Hermes-style and wiki-compiler-style systems reduce that burden by providing
explicit knowledge operations such as:

- ingest or compile
- query or retrieve
- visualize or inspect graph shape
- lint or reconcile drift

This plan adds those capabilities as repo-local helpers and skills rather than
as a separate service, database, or monolithic memory layer.

## Design constraints

- Keep durable source-of-truth content in markdown under `.agents/`.
- Do not require a vector database, remote service, or proprietary runtime.
- Treat generated indexes and maps as derived artifacts from markdown sources.
- Preserve the current maintenance loop: `task-closeout` -> `learning-distill`
  -> `knowledge-lint`.
- Favor small deterministic scripts over model-only folder traversal.
- Keep generated artifacts cheap to diff and safe to regenerate.

## Proposed deliverables

- A stricter metadata schema for durable knowledge entries.
- A repo-local `knowledge-compile` command that rebuilds derived knowledge
  artifacts.
- A repo-local `knowledge-query` command that returns targeted file matches.
- A generated knowledge map for humans and agents.
- Lint rules that validate metadata, index coverage, and orphaned entries.
- Documentation and skill updates that teach agents to use those commands first.

## External adoption notes

These notes exist so the project can revisit reuse-vs-build decisions at the
right phase boundaries instead of defaulting to custom implementation.

### Note A: Structured index backend

Evaluate whether `markdowndb` (`mddb`) should provide the parsing and indexing
layer for `knowledge-compile`.

- Why revisit it: strong fit for frontmatter extraction, links, computed fields,
  and structured queryable output.
- Questions to answer:
  - Can it generate the fields this repo needs without awkward translation?
  - Can it stay an internal implementation detail while source-of-truth remains
    `.agents/` markdown?
  - Does it add acceptable maintenance and packaging cost for adopters?
- Default direction if unresolved: use a thin local script first, but keep the
  compile contract compatible with a later `mddb` adapter.

### Note B: Advanced retrieval backend

Evaluate whether `markdown-vdb` (`mdvdb`) should be supported as an optional
search backend for `knowledge-query`.

- Why revisit it: section-level results, metadata filters, link graph,
  backlinks, orphans, and hybrid search already exist.
- Questions to answer:
  - Should advanced retrieval be optional rather than part of the baseline kit?
  - Is the Rust/tooling footprint justified for the value it adds?
  - Can the skill surface degrade cleanly to plain JSON or grep-based query when
    `mdvdb` is absent?
- Default direction if unresolved: keep baseline query deterministic and local,
  then document `mdvdb` as a power-user integration later.

### Note C: Command and workflow conventions

Evaluate which command patterns from `llm-wiki-compiler` should be adopted even
if its runtime is not.

- Candidate patterns:
  - `compile`, `query`, `lint`, `watch`, `serve`
  - saved query answers as reviewable artifacts
  - incremental rebuilds
  - MCP-friendly read/query surfaces
- Questions to answer:
  - Which of these conventions improve portability across agent tools?
  - Which ones would pull the kit too far toward a separate wiki product?
- Default direction if unresolved: adopt vocabulary and lifecycle patterns, not
  the full compiler runtime.

### Note D: Graph and provenance escalation

Evaluate whether any lighter-weight subset of SwarmVault ideas should be adopted
for visualization, provenance, or schema-guided structure.

- Candidate patterns:
  - graph health checks
  - typed relationships
  - provenance markers
  - schema-guided compilation rules
- Questions to answer:
  - Which pieces materially improve `.agents/` maintenance without adding a
    second platform?
  - Can provenance be represented in plain markdown/frontmatter rather than a
    separate state system?
- Default direction if unresolved: keep graph generation markdown-native and
  avoid introducing a persistent state layer.

### Note E: Packaging boundary

Decide which external integrations should be:

- core dependencies of the starter kit
- optional adapters
- documented integrations only

Questions to answer:

- What is the smallest baseline that still delivers clear user value?
- Which tools are mature enough to depend on in a portable starter kit?
- Which integrations should remain maintainer-only experiments first?

## Phase 1: Metadata and document contract

### Objective

Make durable docs machine-addressable enough for compile and query workflows.

### Changes

1. Extend the frontmatter contract for files under
   `.agents/docs/decisions/` and `.agents/docs/troubleshooting/`.
2. Keep existing required keys: `id`, `title`, `last_updated`.
3. Add new recommended or required keys:
   - `description`: 1 to 2 sentence summary used by query output
   - `tags`: stable topic labels such as `auth`, `build`, `testing`, `release`
   - `depends_on`: related doc or playbook references when there is an explicit
     relationship
   - `status`: for decisions where lifecycle matters (`accepted`, `superseded`,
     `provisional`)
4. Define how links should be expressed so generated maps can follow them
   reliably.
5. Update `.agents/docs/MAINTENANCE.md` with the new contract and examples.
6. Update `scripts/check-agents-structure.sh` or an adjacent validation script to
   enforce the metadata rules.

### Deliverables

- Updated `.agents/docs/MAINTENANCE.md`
- Validation support for required frontmatter shape
- One or two representative docs migrated to the stronger schema
- Decision checkpoint for Note A (`mddb` as compile/index backend)

### Exit criteria

- Durable entry files can be parsed without reading arbitrary body prose.
- A linter can identify missing `description`, duplicate `id`, or malformed
  `tags` deterministically.

## Phase 2: Compile the knowledge layer

### Objective

Turn `.agents/` markdown into a lightweight compiled index that agents can use
without traversing the full tree.

### Changes

1. Add a repo-local script such as
   `.agents/skills/docs-compile/scripts/docs-compile.sh` (or equivalent).
2. Crawl durable knowledge sources:
   - `.agents/AGENTS.md`
   - `.agents/docs/decisions/`
   - `.agents/docs/troubleshooting/`
   - `.agents/playbooks/`
   - optionally `.agents/plans/` for maintainer planning discovery
3. Generate derived artifacts:
   - `.agents/docs/index.json` for machine-oriented lookup
   - refreshed `.agents/docs/index.md` for human-oriented navigation
   - optional per-section indexes if the root index becomes too dense
   - note: per-section `index.md` artifacts are optional in the Option A
     packaging model and should not be required for docs-search correctness
4. Standardize artifact fields in `index.json`:
   - `id`
   - `title`
   - `description`
   - `tags`
   - `path`
   - `kind` (`decision`, `troubleshooting`, `playbook`, `guide`, `plan`)
   - `last_updated`
5. Keep generated output deterministic so diffs are stable.

### Deliverables

- `scripts/knowledge-compile.*`
- Generated `.agents/docs/index.json`
- Updated `.agents/docs/index.md` generation flow
- Packaging note for whether compile relies on local code only or a library
  adapter

### Exit criteria

- Adding a new durable doc no longer requires hand-editing every index.
- Agents can inspect one compiled artifact first instead of reading multiple
  directories.

## Phase 3: Query-first retrieval

### Objective

Teach agents to search the compiled knowledge layer before opening files.

### Changes

1. Add a repo-local command such as `scripts/knowledge-query.(js|sh)`.
2. Query `index.json` rather than raw file contents for first-pass retrieval.
3. Return concise structured results:
   - title
   - path
   - kind
   - description
   - matching tags or reasons
4. Support simple query modes:
   - keyword search
   - tag filter
   - section filter such as `decision` or `troubleshooting`
5. Update `.agents/agents/coding-agent.md` and related agent docs with a
   query-first rule:
   - search before reading
   - read the smallest relevant file set
   - avoid loading the entire docs tree into context
6. Decide whether this remains a script-only behavior or also becomes a new
   portable skill such as `knowledge-search`.

### Deliverables

- `scripts/knowledge-query.*`
- Agent guidance updated to prefer query-first retrieval
- Optional `knowledge-search` skill aligned with the script behavior
- Decision checkpoint for Note B (`mdvdb` as optional enhanced query backend)
- Decision checkpoint for Note C (borrowed command/workflow conventions)

### Exit criteria

- A coding agent can answer most repo-knowledge questions by first consulting
  one compact query result instead of brute-force reading the wiki.

## Phase 4: Visualization and graph hygiene

### Objective

Expose structure and gaps in the knowledge graph so both humans and agents can
see what is connected, duplicated, or orphaned.

### Changes

1. Extend the compile step to produce a derived map such as
   `.agents/docs/knowledge-map.md`.
2. Generate Mermaid output from explicit relationships:
   - links in markdown
   - `depends_on` frontmatter
   - index membership by section
3. Use the graph to identify:
   - orphaned entries
   - entries with no metadata
   - heavily connected central docs that may be overloaded
   - duplicate docs on the same topic
4. Add graph-aware checks to `knowledge-lint`.
5. Keep the visualization lightweight and markdown-native so it renders in
   GitHub and editor previews.

### Deliverables

- Generated `.agents/docs/knowledge-map.md`
- `knowledge-lint` guidance for orphan and graph drift detection
- Decision checkpoint for Note D (graph/provenance features worth adopting)

### Exit criteria

- Maintainers can inspect the map and quickly identify missing links or weakly
  integrated knowledge.

## Phase 5: Distillation and maintenance loop integration

### Objective

Integrate compile and query behavior into the existing skill workflow instead of
leaving it as optional maintainer knowledge.

### Changes

1. Update `learning-distill` so the routine flow becomes:
   - write or update durable docs
   - run `docs-compile` when available
   - review generated changes
2. Update `knowledge-lint` to validate:
   - metadata contract
   - index coverage (conditional when optional compile artifacts are absent)
   - graph coverage
   - broken links between docs and playbooks
3. Update `task-closeout` guidance if new candidate fields help downstream
   classification, but avoid bloating the session bundle.
4. Update root docs and integration guides to explain the difference between:
   - source markdown
   - generated indexes or maps
   - skills that use those artifacts
5. Decide which generated artifacts belong in git and which are rebuild-only.

### Deliverables

- Updated skill docs for `learning-distill` and `knowledge-lint`
- Updated architecture and README documentation
- Clear published guidance on when to rebuild compiled artifacts
- Decision checkpoint for Note E (core dependency vs optional adapter vs
  integration-only)

### Exit criteria

- The compile and query steps are part of the documented maintenance loop.
- Repo adopters can copy the pattern without needing extra infrastructure.

## Phase 6: Dogfooding and release packaging

### Objective

Validate the pattern in this repository before promoting it as standard kit
guidance.

### Changes

1. Dogfood the scripts against this repository's `.agents/` tree.
2. Test realistic prompts such as:
   - find the release or publish guidance
   - locate recurring troubleshooting entries
   - identify decisions related to example generation or installs
3. Measure whether query-first retrieval reduces file reads and manual index
   maintenance.
4. Add generated artifacts and scripts to the example or published kit only when
   the flow feels stable.
5. Update `generate-example` if the compiled pattern should appear in consumer
   examples.
6. Run `bash scripts/check-publish.sh` and any new compile-specific validation
   before merging.

### Deliverables

- Dogfood validation notes in the relevant plan or commit history
- Packaging decision on whether compile and query scripts ship in the base kit,
  maintainer-only surface, or both

### Exit criteria

- The pattern works in this repo without adding substantial maintenance burden.
- The published kit surface stays small and justified.

## Recommended implementation order

1. Phase 1: metadata contract
2. Phase 2: compile step
3. Phase 3: query step
4. Phase 5: skill integration
5. Phase 4: visualization and graph hygiene
6. Phase 6: dogfooding and packaging

This order keeps the first milestone practical: structured docs plus a compiled
index already deliver most of the benefit. Visualization can follow after the
underlying metadata and compile path are stable.

## Research backlog

These are explicit follow-up investigations tied to the adoption notes above.

1. Prototype `knowledge-compile` against `mddb` on this repository's
   `.agents/` tree and compare the generated index shape against a hand-rolled
   JSON output.
2. Test whether `mdvdb` can operate as an optional local accelerator for
   `.agents/` docs without changing the baseline kit install story.
3. Review `llm-wiki-compiler` command semantics and MCP surfaces to identify the
   smallest transferable subset for this repo.
4. Review SwarmVault's graph/provenance patterns and isolate any markdown-first
   features that can be represented without introducing a vault state layer.
5. Record each adoption decision in a repo decision file once the implementation
   direction is chosen.

## Risks and mitigations

### Risk: too much generated surface

Mitigation: keep only a few deterministic artifacts and derive all of them from
markdown source files.

### Risk: the system drifts toward a separate platform

Mitigation: keep all commands repo-local, text-based, and optional to run
outside the skill flow.

### Risk: metadata burden makes writing docs harder

Mitigation: keep the schema small and validate only fields that materially help
query, compile, and lint.

### Risk: agents ignore the new helpers

Mitigation: encode query-first behavior in agent docs and in skill procedures,
not only in human-facing README text.

## Definition of done

This initiative is complete when all of the following are true:

- durable docs have a consistent metadata contract
- a compiled index can be rebuilt locally from markdown sources
- agents have a documented query-first retrieval path
- maintainers can inspect a generated knowledge map
- lint can detect missing metadata, missing index coverage, and orphaned docs
- the workflow remains repo-centric, skill-based, and git-reviewable
