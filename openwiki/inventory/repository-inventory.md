---
type: inventory-page
title: "Repository Inventory"
description: "Top-to-bottom map of tracked trees and files in agent-knowledge-starter: what each area contains, who consumes it, and where its wiki page lives."
tags: [inventory, layout, map, navigation]
timestamp: 2026-08-23T23:30:00Z
openwiki:
  roles: [repository]
  source_paths: [package.json]
---

# Repository Inventory

Counts below come from `git ls-files` (322 tracked files; session bundles are gitignored by design).

| Path | Tracked | Contents | Consumed by | Wiki page |
| --- | --- | --- | --- | --- |
| `openspec/` | 137 | change management: 13 active changes + dated archive (+ six relocated maintainer plans) + graduated specs (`openspec/specs/`) + `config.yaml` schema | OpenSpec CLI, maintainers | [OpenSpec workflow](../governance/openspec-workflow.md) |
| `openwiki/` | 75 | this wiki: generated pages plus AKSK-curated trees (`decisions/` 23 pages, `troubleshooting/` 26 pages, `overview.md`, `maintenance-format.md`) and the contract-carrying `INSTRUCTIONS.md` | coding agents, OpenWiki tooling, distillation | [Knowledge layer](../architecture/knowledge-layer.md), [overview](../overview.md) |
| `.agents/` | 40 | the portable layer: AGENTS.md, playbooks/, workflows/, skills/ (4 shipped + internal generate-example); **no `docs/` tree** — knowledge moved to the wiki | coding agents, skills CLI, consumers | [Knowledge layer](../architecture/knowledge-layer.md), [Skills system](../skills/index.md) |
| `docs/` | 17 | root-facing docs: architecture.md + integrations/ (16 pages) | humans adopting the kit | [Tool integrations](../distribution/tool-integrations.md) |
| `example/` | 40 (README + skills-lock only; `.agents/` gitignored) | generated consumer-install illustration — currently stale vs shipped skills | humans evaluating the kit | [generate-example & scripts](../skills/generate-example-and-scripts.md) |
| `scripts/` | 2 | `check-agents-structure.sh`, `check-publish.sh` | maintainers, consumers | [generate-example & scripts](../skills/generate-example-and-scripts.md) |
| root files | — | README.md, INSTALL.md, AGENTS.md, CLAUDE.md, LICENSE, package.json, package-lock.json, openspec.yaml, .remarkrc.json, .gitignore, .claude-plugin/plugin.json | agents + tooling | [Agent entrypoints](../governance/agent-entrypoints.md) |

## Untracked / generated areas

- **`.agents/sessions/<bundle>/`** — 47 task-closeout bundles; deliberately gitignored except README.
- **`.github/workflows/openwiki-update.yml`** — present on disk, excluded by bare `.github` ignore rule ([entrypoints](../governance/agent-entrypoints.md)).
- **`openwiki/.last-update.json`** — OpenWiki run metadata recording the last documented commit for update runs.
- **`skills-lock.json`, `example/skills-lock.json`** — local install receipts, gitignored.
- **`.kilo/`, `.vscode/`, `node_modules/`** — local tooling, ignored.

## Durable content census (dogfood state)

The curated wiki trees double as a live demonstration of the conventions they ship:

- `openwiki/decisions/`: 23 curated OKF pages — every one carries `aksk_status` with qualified `aksk_depends_on` edges where applicable (e.g., `node-single-runtime-for-kit-scripts` depends on superseded `python-preference-for-consumer-scripts`).
- `openwiki/troubleshooting/`: 26 curated pages covering agent-behavior loops, per-tool quirks (Codex, Gemini, Hermes, Copilot, Zo), path/platform issues, sessions/gitignore discovery, maintenance-script stalls, and OpenWiki CLI run behavior (the newest entry: update runs aborting in agent shells).
- `.agents/playbooks/`: five durable procedures (pre-publish, major-version-release, generate-example, writing-integration-guides, README).
- No `log.md` exists anymore: distillation accountability lives in bundle `summary.json` flags plus git history.
