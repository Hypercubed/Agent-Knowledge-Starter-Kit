---
type: operations
title: Validation Scripts Reference
description: Entrypoints, sections, and failure signals for the two bash validators.
tags: [validation, check-agents-structure, check-publish, release, bash]
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-62bd4cb693e4e881b3f88f6b
    resource: repo://.agents/.gitignore
  - id: openwiki-source-df46a321fce7026f92166a02
    resource: repo://.agents/playbooks/pre-publish.md
  - id: openwiki-source-bc0a2f3905ac90dd0987d55b
    resource: repo://.remarkrc.json
  - id: openwiki-source-c16c0a8de8d2a3a0385db0af
    resource: repo://openspec/specs/install-lanes/spec.md
  - id: openwiki-source-5b54a58d1b51cd490b0e7162
    resource: repo://package.json
  - id: openwiki-source-2361cff43709905e22758cbb
    resource: repo://scripts/check-agents-structure.sh
  - id: openwiki-source-5d609834bdc11b93524d04a9
    resource: repo://scripts/check-publish.sh
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# Validation Scripts Reference

Two bash scripts provide all deterministic validation. Mechanics shared with sibling pages are not repeated here — see [Validation and Cross-Tool Lint](validation-and-lint.md) for check semantics and [Validation and Release](validation-and-release.md) for the publish gate. Neither script installs tools, requires network, or validates a second tree.

## `check-agents-structure.sh [target]`

Portable shape check for any single knowledge tree (default `.agents`). Five sections in order: target exists; required-files manifest (`AGENTS.md`, `.gitignore`, `playbooks/README.md`, `sessions/README.md`, portable `SKILL.md` files, task-closeout example bundle); git-aware session tracking (only `sessions/README.md` tracked, bundles ignored — `WARN` and skip outside git); `SKILL.md` frontmatter markers (line 1 `---`, `name:`/`description:` in first 12 lines); JSON validity via `jq` when present. Always needs only `bash`/`sed`/`grep`/`find` plus `git` for tracking. Exits 0 iff no failures.

## `check-publish.sh`

Release wrapper answering *is this starter repo releasable*: `cd`s to the git root, runs the portable check on root `.agents` only, then adds Markdown formatting (`remark --frail`, 60s bound), per-file link checks (`markdown-link-check --alive 200,0`, 30s per file), a published-files listing, leakage scans (warning-only backstop over `README.md`/`INSTALL.md`/`docs`/`.agents`, excluding session bundles), and doubled `.agents/.agents` path hygiene (hard fail). Every `npx` probe uses `--no-install` with timeouts — unavailable tools degrade to warning-skips. Failures exit 1 and block publishing; warnings require manual review.

## Package wiring and sequencing

`package.json#scripts.check` runs the wrapper; `#scripts.format` runs `remark` over `.agents/**/*.md`. `devDependencies` supply the probed tools; `jq` and `rg` are system CLIs. Pre-publish sequence: validators → `sync_wiki_indexes.mjs` after wiki edits → `docs-lint` → inspect `git status`/`diff` before tagging.

## Invariants

Scopes are strict (portable script never leaves its target; wrapper validates root `.agents` only). Session bundles are local evidence — tracking beyond `sessions/README.md` fails in every tree. No probe installs; no false passes. New required files go in the structure script's manifest (inherited by delegation); new optional checks follow the gate-on-`command -v`, warn-not-fail pattern.

## Related

- [Validation and Cross-Tool Lint](validation-and-lint.md) — check semantics and lint pass.
- [Validation and Release](validation-and-release.md) — publish gate and playbooks.
- [Packaging and Install Lanes](../distribution/packaging-and-install.md) — the surface the gate protects.
