---
type: distribution-page
title: "Packaging and Install"
description: "How the kit is packaged and adopted: manual peer-dependency prerequisites, skills CLI install, skill-first initialization, merge checklist for existing .agents/ trees, plugin.json registration, and known drift."
tags: [packaging, installation, npm, adoption]
timestamp: 2026-08-23T19:30:00Z
openwiki:
  roles: [operations, integration]
  source_paths:
    - INSTALL.md
    - package.json
    - .claude-plugin/plugin.json
    - README.md
---

# Packaging and Install

## What the package is

Root `package.json` declares `agent-knowledge-starter` v2.0.0 — "A shareable, tool-agnostic starter kit for maintaining a compiled repo knowledge layer for coding agents." It ships **content** (markdown layout and conventions) rather than a runtime library:

- `devDependencies`: `skills` (the Skills CLI used for installs), `remark-cli` + plugins, `markdown-link-check`;
- `scripts`: `test` (intentionally errors — no test suite), `format` (remark over `.agents/**/*.md`), `check` (runs `scripts/check-publish.sh`);
- no runtime dependencies — the peer tools (`@fission-ai/openspec`, `openwiki`) are global installs the kit verifies but never declares or installs.

The distributable surface is root `.agents/` — four portable skills plus shared templates and playbooks. Maintainer-only material (the internal generate-example skill, session history) must never be copied into published artifacts (pre-publish playbook review guidance). The curated wiki trees under `openwiki/` are this repository's knowledge base, not a distributable template; consumers initialize their own wiki with `openwiki --init`.

## Peer-dependency prerequisites (manual, fail-fast)

Per `/INSTALL.md` and `/docs/architecture.md`, the kit is glue over two peer tools it never installs itself:

- **Node >= 22**
- `npm i -g @fission-ai/openspec@latest` (OpenSpec CLI)
- `npm i -g openwiki@latest` (OpenWiki CLI), plus one-time repo initialization: `openwiki --init`

Skills and scripts verify these prerequisites before acting ([check_peer_tools.mjs](../skills/aksk-bootstrap.md)) and **fail fast** with exactly these commands when something is missing. They never attempt installation.

## Registration surfaces

| Surface | File / command | Content |
| --- | --- | --- |
| Skills CLI | `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit` | installs `.agents/skills/*` into consumer repos; skips `metadata.internal: true` folders |
| Claude Code plugin | `.claude-plugin/plugin.json` v2.0.0 | registers four paths: task-closeout, learning-distill, docs-lint, aksk-bootstrap |
| Local receipts (gitignored) | `skills-lock.json` (untracked) | per-skill source + SHA hash records from local `skills add` runs |

The plugin manifest's dangling write-plan registration was fixed during the migration: it now lists exactly the four shipped skills.

## Skill-first install flow (`/INSTALL.md`)

The default adoption path treats skills as the unit of installation:

1. Run the skills CLI in the target repo; preserve each skill folder's `bootstrap/` subtree — initialization copies *from* it and idempotent re-runs depend on the original name. Prefer narrow `-s <skill> -a <agent>` flags; upstream `--all` sprays every skill into every known agent directory.
2. Open each installed SKILL.md and run its **Skill initialization** once (copy-missing-only, never overwrite existing content).
3. Suggested orders: closeout-only → task-closeout init; distill/lint → learning-distill init first (it scaffolds sessions/playbooks/AGENTS.md **and** runs the wiki prerequisites: peer-tool check plus contract attachment); lint-without-distill → no separate initialization needed.
4. Attach the AKSK routing note to your root instruction file with `node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs` so agents discover the knowledge layer.
5. Register `SKILL.md` paths in your editor/product as needed.

Skill *definitions* may live in user/global locations, but initialization output and ongoing artifacts belong under the target repo's `.agents/`.

### Before editing / new install checklist

Inspect target `.agents/`, root AGENTS.md, both gitignores, and `git status`; after installing keep `.agents/.gitignore` tracked (`sessions/*`, `!sessions/README.md`) or replicate at repo root; edit `.agents/AGENTS.md` with real build/test conventions; record durable rationale as [curated decision pages](../architecture/knowledge-layer.md), then run `sync_wiki_indexes.mjs` so they are discoverable.

### Existing `.agents/` merge checklist

Never replace wholesale unless confirmed disposable. Preserve repo-specific rules/playbooks/skills first; add missing kit skills + run initializations; hand-merge `.agents/AGENTS.md`; prefer kit-default ignore patterns; update `openwiki/index.md` discovery via index sync so preserved assets stay discoverable.

### Validation before finishing

Run structure check (`bash scripts/check-agents-structure.sh .agents`), confirm only `sessions/README.md` tracked under sessions, confirm preservation, run the wiki index sync, summarize changed files plus manual registration steps.

## Root vs portable AGENTS relationship

When both exist: root = agent entrypoint for that checkout; `.agents/AGENTS.md` = portable knowledge-layer file. One source of truth per instruction; root points into `.agents/`.

## Known drift and aspirational surfaces

- **Untracked CI workflow:** the OpenWiki refresh workflow exists on disk but is excluded by the bare `.github` gitignore line — see [agent entrypoints](../governance/agent-entrypoints.md).
- **Aspirational `docs-capture`:** decision entry `use-docs-capture-for-ad-hoc-durable-docs` mandates a docs-capture skill "(once implemented)" whose proposal was archived unimplemented — treat it as recorded intent, not shipped capability.
- **opsx-* workflow copies pending deletion:** `.agents/workflows/` still holds four forked OpenSpec command definitions slated for removal by step 1 of the pipeline ([OpenSpec workflow](../governance/openspec-workflow.md)).
- **Example tree lags the shipped skills:** tracked `example/.agents/skills/` still contains the retired `docs-search`/`docs-compile` folders and a pre-consolidation `docs/` scaffold; regeneration is pending (task 3.3 of `aksk-bootstrap-system`).
- **Bootstrap-first future:** under active change `aksk-bootstrap-system`, README/INSTALL will restate install as bootstrap-first with these manual peer-dependency steps as fallback. Until that change lands, this page's skill-first flow remains the shipped path.

## Example tree and upgrade path

`example/.agents/` shows the post-initialization state a consumer should see; regenerate it whenever portable content changes (decision `regenerate-example-when-portable-kit-changes`) using [generate-example](../skills/generate-example-and-scripts.md). Upgrade guidance for consumers (v1→vNext style merges without destroying local knowledge) is specced in active change `consumer-upgrade-path`.
