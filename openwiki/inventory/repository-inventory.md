---
type: inventory-page
title: "Repository Inventory"
description: "Top-to-bottom map of tracked trees and files in agent-knowledge-starter: what each area contains, who consumes it, and where its wiki page lives."
tags: [inventory, layout, map, navigation]
timestamp: 2026-08-23T18:30:00Z
---

# Repository Inventory

Counts below come from `git ls-files` (275 tracked files; session bundles are gitignored by design).

| Path | Tracked | Contents | Consumed by | Wiki page |
| --- | --- | --- | --- | --- |
| `openspec/` | 104 | change management: 14 active changes + dated archive + merged specs + `config.yaml` schema | OpenSpec CLI, maintainers | [OpenSpec workflow](../governance/openspec-workflow.md) |
| `.agents/` | ~97 (excl. ignored sessions; four forked openspec-* skill folders deleted on disk, unstaged) | the portable knowledge layer: AGENTS.md, docs/, playbooks/, workflows/, skills/ (6 shipped + 4 being removed) | coding agents, skills CLI, consumers | [Knowledge layer](../architecture/knowledge-layer.md), [Skills system](../skills/index.md) |
| `docs/` | 17 | root-facing docs: architecture.md + integrations/ (16 pages) | humans adopting the kit | [Tool integrations](../distribution/tool-integrations.md) |
| `example/` | 40 (README + skills-lock only; `.agents/` gitignored) | generated consumer-install illustration | humans evaluating the kit | [generate-example & scripts](../skills/generate-example-and-scripts.md) |
| `scripts/` | 2 | `check-agents-structure.sh`, `check-publish.sh` | maintainers, consumers | [generate-example & scripts](../skills/generate-example-and-scripts.md) |
| root files | — | README.md, INSTALL.md, AGENTS.md, CLAUDE.md, LICENSE, package.json, package-lock.json, openspec.yaml, .remarkrc.json, .gitignore | agents + tooling | [Agent entrypoints](../governance/agent-entrypoints.md) |

## Untracked / generated areas

- **`.agents/sessions/<bundle>/`** — 46 task-closeout bundles; deliberately gitignored except README.
- **`.github/workflows/openwiki-update.yml`** — present on disk, excluded by bare `.github` ignore rule ([entrypoints](../governance/agent-entrypoints.md)).
- **`openwiki/`** — this wiki; `INSTRUCTIONS.md` is its scope brief, still the default stub (no AKSK curation contract attached yet).
- **`skills-lock.json`, `example/skills-lock.json`, `.claude-plugin/plugin.json`** — local install receipts / plugin manifest with known drift ([packaging](../distribution/packaging-and-install.md)).
- **`openspec/changes/{adopt-openspec-openwiki,aksk-bootstrap-system}/`** — untracked work-in-progress defining AKSK 2.0.
- **`.kilo/`, `.vscode/`, `node_modules/`** — local tooling, ignored.

## Durable content census (dogfood state)

The maintainer tree doubles as a live demonstration of the conventions it ships:

- `decisions/`: 17 entries — every one carries the full frontmatter contract; statuses span accepted/superseded/provisional with qualified `depends_on` edges (e.g., `openspec-documentation-enforcement`, added during the OpenSpec-integration dogfood pass).
- `troubleshooting/`: 24 entries covering agent-behavior loops, per-tool quirks (Codex, Gemini, Hermes, Copilot, Zo), path/platform issues, sessions/gitignore discovery, and maintenance-script stalls.
- `plan-archive/`: 6 historical plans retained after the OpenSpec migration (generic-index kind for docs-compile).
- `log.md`: append-only distillation history back to April 2026 with accepted/rejected accounting.
