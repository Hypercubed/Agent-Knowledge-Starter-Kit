---
id: plan-archive-index
title: "Plan Archive index"
last_updated: 2026-05-16
---

# Plan Archive

Each topic is a sibling markdown file (except this index). New entries: follow [Entry shape](../MAINTENANCE.md#entry-shape) in `MAINTENANCE.md`, then add a row below.

## Index

- **[Add knowledge search skill](add-knowledge-search.md)** — Roadmap for a knowledge-search skill that trains agents to search .agents/ markdown before loading large context windows.
  - Tags: `skills`, `docs-search`, `context`
- **[Harden routing architecture](harden-routing-architecture.md)** — A comprehensive, three-phase plan to harden the routing architecture, ensure consumers of the kit inherit these best practices, and definitively prove that the system works.
  - Tags: `routing`, `architecture`, `hardening`
- **[Integrate docs-search into learning-distill and docs-lint](integrate-docs-search-learning-distill-knowledge-lint.md)** — Make docs-search a first-class lookup step in distillation and lint workflows rather than only a post-write cache refresh.
  - Tags: `docs-search`, `learning-distill`, `docs-lint`, `skills`
- **[Plans as first-class artifacts](plans-as-first-class-artifacts.md)** — Promote plans into a first-class, searchable, portable artifact type living under .agents/docs/plans/, with a canonical frontmatter schema, verified docs-search integration, lifecycle tooling, and a write-plan skill — superseding plan-rules-in-scaffold.
  - Tags: `plans`, `docs-search`, `skills`, `workflow`, `schema`, `kit`
- **[Portable skill CONTRACT.md rollout](portable-skill-contracts.md)** — Add skill-local CONTRACT.md beside each user-facing kit skill, link from SKILL.md, and document the pattern and precedence in MAINTENANCE.md (repo and learning-distill bootstrap).
  - Tags: `skills`, `docs`, `maintenance`
- **[replace indexing with ripgrep](replace-indexing-with-ripgrep.md)**
