---
type: distribution-page
title: "Packaging and Install"
description: "How the kit is packaged and adopted: skills CLI install, skill-first initialization, merge checklist for existing .agents/ trees, plugin.json registration, and known drift."
tags: [packaging, installation, npm, adoption]
timestamp: 2026-08-23T18:30:00Z
---

# Packaging and Install

## What the package is

Root `package.json` declares `agent-knowledge-starter` v2.0.0 — "A shareable, tool-agnostic starter kit for maintaining a compiled repo knowledge layer for coding agents." It ships **content** (markdown layout and conventions) rather than a runtime library:

- `devDependencies`: `skills` (the Skills CLI used for installs), `remark-cli` + plugins, `markdown-link-check`;
- `scripts`: `test` (intentionally errors — no test suite), `search` (wraps the docs-search Python script), `format` (remark over `.agents/**/*.md`), `check` (runs `scripts/check-publish.sh`);
- no runtime dependencies.

The distributable surface is root `.agents/` — portable `skills/`, shared docs templates, playbooks — plus root-level guides (`README.md`, `INSTALL.md`, `docs/`). Maintainer-only material (dogfood decisions/troubleshooting entries, session history, plan-archive) must never be copied into published artifacts (pre-publish playbook review guidance).

## Registration surfaces

| Surface | File | Content |
| --- | --- | --- |
| Skills CLI | `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit` | installs `.agents/skills/*` into consumer repos; skips `metadata.internal: true` folders |
| Claude Code plugin | `.claude-plugin/plugin.json` v2.0.0 | registers six paths: task-closeout, learning-distill, docs-lint, write-plan, docs-compile, docs-search |
| Local receipts (gitignored) | `skills-lock.json`, `example/skills-lock.json` | per-skill source + SHA hash records from local `skills add` runs |

## Skill-first install flow (`/INSTALL.md`)

The default adoption path treats skills as the unit of installation:

1. Run the skills CLI in the target repo; preserve each skill folder's `bootstrap/` subtree — initialization copies *from* it and idempotent re-runs depend on the original name. Prefer narrow `-s <skill> -a <agent>` flags; upstream `--all` sprays every skill into every known agent directory.
2. Open each installed SKILL.md and run its **Skill initialization** once (copy-missing-only, never overwrite existing content).
3. Suggested orders: closeout-only → task-closeout init; distill/lint → learning-distill init first (it scaffolds durable docs + template AGENTS.md); lint-without-distill → docs-lint init.
4. Register `SKILL.md` paths in your editor/product as needed.

Skill *definitions* may live in user/global locations, but initialization output and ongoing artifacts belong under the target repo's `.agents/`.

### Before editing / new install checklist

Inspect target `.agents/`, root AGENTS.md, both gitignores, and `git status`; after installing keep `.agents/.gitignore` tracked (`sessions/*`, `!sessions/README.md`) or replicate at repo root; edit `.agents/AGENTS.md` with real build/test conventions; optionally log adoption only if your team uses log.md as an audit trail (default is not to).

### Existing `.agents/` merge checklist

Never replace wholesale unless confirmed disposable. Preserve repo-specific rules/playbooks/skills first; add missing kit skills + run initializations; hand-merge `.agents/AGENTS.md`; prefer kit-default ignore patterns; record durable rationale as decision entries; update `.agents/docs/index.md` so preserved assets stay discoverable.

### Validation before finishing

Run structure check (`bash scripts/check-agents-structure.sh .agents`), confirm only `sessions/README.md` tracked under sessions, confirm preservation, summarize changed files plus manual registration steps.

## Root vs portable AGENTS relationship

When both exist: root = agent entrypoint for that checkout; `.agents/AGENTS.md` = portable knowledge-layer file. One source of truth per instruction; root points into `.agents/`.

## Known drift and aspirational surfaces

- **Dangling plugin registration:** `.claude-plugin/plugin.json` lists `./.agents/skills/write-plan`, but that skill was removed (archived change `2026-07-19-remove-write-plan`; deletion visible in commit `a64c786`). Consumers registering via plugin metadata hit a missing path until the manifest is updated.
- **Aspirational `docs-capture`:** decision entry `use-docs-capture-for-ad-hoc-durable-docs` mandates a docs-capture skill "(once implemented)" whose proposal was archived unimplemented — treat it as recorded intent, not shipped capability.
- **Untracked CI workflow:** the OpenWiki refresh workflow exists on disk but is excluded by the bare `.github` gitignore line — see [agent entrypoints](../governance/agent-entrypoints.md).
- **Forked skills mid-deletion:** the four forked `openspec-*` skill folders are deleted on disk (deletion unstaged) pending the 2.0 retirement ([OpenSpec workflow](../governance/openspec-workflow.md)).
- **2.0 will restate install as peer dependencies:** under active change `adopt-openspec-openwiki`, README/INSTALL must document manual prerequisites — Node ≥ 22 plus global `npm i -g @fission-ai/openspec@latest openwiki`, then `openspec init` and `openwiki --init` in the target repo; AKSK verifies these binaries before use and fails with the exact command rather than installing ([OpenSpec workflow](../governance/openspec-workflow.md)). Until that change lands, this page's skill-first flow remains the shipped path.

## Example tree and upgrade path

`example/.agents/` shows the post-initialization state a consumer should see; regenerate it whenever portable content changes (decision `regenerate-example-when-portable-kit-changes`) using [generate-example](../skills/generate-example-and-scripts.md). Upgrade guidance for consumers (v1→vNext style merges without destroying local knowledge) is specced in active change `consumer-upgrade-path`.
