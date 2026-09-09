---
type: operations
title: Validation and Release
description: Release gating for the starter kit — publish wrapper, pre-publish and major-version playbooks, retired example lane.
tags: [validation, release, publish, pre-publish, check-publish]
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-62bd4cb693e4e881b3f88f6b
    resource: repo://.agents/.gitignore
  - id: openwiki-source-7a71f2c05c7f7289570ac205
    resource: repo://.agents/playbooks/major-version-release.md
  - id: openwiki-source-df46a321fce7026f92166a02
    resource: repo://.agents/playbooks/pre-publish.md
  - id: openwiki-source-bc0a2f3905ac90dd0987d55b
    resource: repo://.remarkrc.json
  - id: openwiki-source-5b54a58d1b51cd490b0e7162
    resource: repo://package.json
  - id: openwiki-source-2361cff43709905e22758cbb
    resource: repo://scripts/check-agents-structure.sh
  - id: openwiki-source-5d609834bdc11b93524d04a9
    resource: repo://scripts/check-publish.sh
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# Validation and Release

Deterministic validators and procedural playbooks guard every publish. Validator mechanics (sections, failure semantics, optional-tool degradation) live in [Validation and Cross-Tool Lint](validation-and-lint.md); this page covers the release gate, the playbook sequence, and the retired example lane.

> `check-publish.sh` validates root `.agents` only; `example/` is excluded from validation per the install-lanes spec. Leakage hits are warnings, doubled `.agents/.agents` is a hard failure.

## Release gate

`bash scripts/check-publish.sh` (or `npm run check`) always runs from the git root: portable structure on root `.agents` only, then Markdown formatting (`remark --frail`), per-file link checks, a published-files listing, leakage scans (warning-only backstop, never a secret manager), and doubled-path hygiene (hard fail). All `npx` probes use `--no-install` with timeouts — missing tools degrade to warning-skips rather than installing on the fly. Any failure exits 1 and blocks publishing; warnings require manual review but do not block. `package.json` wires `check` to this script and `format` to `remark` over `.agents/**/*.md`.

## Pre-publish playbook (condensed)

`.agents/playbooks/pre-publish.md` sequences the gate: run `check-publish.sh` and treat non-zero as blocking; fix structure, links, tracked session artifacts, and formatting; review warnings manually; after curated wiki edits run `sync_wiki_indexes.mjs` so indexes cover them; run `docs-lint` after several agent-assisted edits; inspect `git status` and `git diff` before tagging. Portable skills and shared docs must read as if installed in a consumer's `.agents/` — starter-repo helper workflows and session history stay out of published surfaces.

## Major-version playbook (condensed)

`.agents/playbooks/major-version-release.md` adds three sweeps for major releases: grep the repo for deprecated artifact names after a tool removal, review new scripts for cross-platform path portability, then run both validators. Lightweight by design — pre-publish remains the full gate.

## Retired example lane

`example/` and `generate-example` were removed: the two supported install lanes copy missing artifacts **from** each skill's `bootstrap/` without deleting or renaming it, and there is no `cp example/.agents` path or generator to run. Validators never inspect `example/`; after template or skill changes verify with both validators plus `docs-lint` instead of regenerating a fixture.

## Invariants

- Portable vs wrapper scopes are strict: structure script scoped to its target, publish script to root `.agents` only.
- Session tracking is git-truth: only `sessions/README.md` tracked; anything else under `sessions/` is a blocking failure.
- Failures block, warnings advise; probes are bounded and non-installing; no example fixture exists.
- Marker-block integrity must survive publish — verified via `docs-lint` wiring checks before tagging.

## Related

- [Validation and Cross-Tool Lint](validation-and-lint.md) — validator mechanics and lint checks.
- [Packaging and Install Lanes](../distribution/packaging-and-install.md) — the distributable surface the gate protects.
- [AGENTS.md Zoning](../concepts/agents-md-zoning.md) — marker zones verified before publish.
