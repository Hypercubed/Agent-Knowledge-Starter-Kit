# Proposal: Repo-Centric Wiki Tooling

## Summary

Add lightweight compile, query, and visualize capabilities to the repo-local markdown knowledge layer without replacing the existing skill-based distillation workflow.

## Goal

Adopt the strongest operational patterns from wiki-centric agent systems such as Hermes Agent and llm-wiki-compiler while keeping this starter kit repo-local, markdown-first, skill-based, tool-agnostic, and reviewable in git.

The intended outcome is not a separate knowledge platform. The outcome is a small set of local conventions and scripts that make `.agents/` easier for agents to ingest, query, maintain, and validate.

## Current Direction

The implementation direction favors a split between query correctness and optional human-oriented index regeneration:

- `docs-search` is consumer-facing and self-sufficient for building `docs-search-index.json` directly from durable markdown sources.
- `docs-compile` is an optional consumer skill that regenerates `decisions/index.md` and `troubleshooting/index.md`, then refreshes `docs-search-index.json`.
- `learning-distill` and `docs-lint` attempt `docs-compile` when present, but continue when absent.
- Durable section `index.md` files are optional compile artifacts rather than a hard runtime dependency for docs-search.

## Why This Proposal

The current v2 direction already moves in the right direction by splitting durable knowledge into per-entry markdown files under `.agents/docs/`. The remaining gap is operational: agents still need to infer structure by reading folders and indexes directly.

Hermes-style and wiki-compiler-style systems reduce that burden by providing explicit knowledge operations such as ingest or compile, query or retrieve, visualize or inspect graph shape, lint or reconcile drift.

This proposal adds those capabilities as repo-local helpers and skills rather than as a separate service, database, or monolithic memory layer.

## Design Constraints

- Keep durable source-of-truth content in markdown under `.agents/`.
- Do not require a vector database, remote service, or proprietary runtime.
- Treat generated indexes and maps as derived artifacts from markdown sources.
- Preserve the current maintenance loop: `task-closeout` -> `learning-distill` -> `docs-lint`.
- Favor small deterministic scripts over model-only folder traversal.
- Keep generated artifacts cheap to diff and safe to regenerate.

## Proposed Deliverables

- A stricter metadata schema for durable knowledge entries.
- A repo-local `knowledge-compile` command that rebuilds derived knowledge artifacts.
- A repo-local `knowledge-query` command that returns targeted file matches.
- A generated knowledge map for humans and agents.
- Lint rules that validate metadata, index coverage, and orphaned entries.
- Documentation and skill updates that teach agents to use those commands first.

## Phases

1. Metadata and document contract
2. Compile the knowledge layer
3. Query-first retrieval
4. Visualization and graph hygiene
5. Distillation and maintenance loop integration
6. Dogfooding and release packaging