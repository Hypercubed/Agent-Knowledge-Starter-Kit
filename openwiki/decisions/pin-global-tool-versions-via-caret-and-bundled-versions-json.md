---
type: Decision
title: Pin global tool versions via caret in package.json and bundled versions.json
description: Global installs use caret ranges from package.json copied to bundled references/versions.json for consumer delivery; non-npm GitHub sources pin by commit SHA with vendored fallback.
tags:
- openwiki
- openspec
- bootstrap
- versions
- caret
timestamp: '2026-08-29T16:03:06.103571Z'
aksk_status: accepted
---

# Pin global tool versions via caret in package.json and bundled versions.json

### Status

Accepted

### Context

`aksk-bootstrap-system` moved the global lane to user scope `npm i -g` (per-user, not repo-local). Early design used `@latest` for `openwiki`/`@fission-ai/openspec` and live-fetch for the FerroxLabs `agents-md` baseline. That breaks the idempotency-by-detection invariant (D2): every `init_agents_md.mjs` or `generate-example` on the same kit version should produce the same file. Live fetch also hides drift until a diff appears. The kit already vendors the baseline with a provenance header and `refresh_agents_baseline.mjs` for explicit updates, and `npx skills add` copies only `references/` — not the repo root `package.json`.

### Decision

- **Caret in `package.json` for npm packages:** `devDependencies` pins `@fission-ai/openspec: ^1.11.0` and `openwiki: ^0.4.3` (caret, not `latest`). `^` allows patches/minors without breaking bootstrap.
- **Bundled `references/versions.json` for delivery:** `bootstrap-global.mjs` reads `references/versions.json` (copied via `npx skills add`) first, then the consumer repo's `package.json` for local override, via `versionsFromPackageJson()`. The `BOTH_INSTALL`/`INSTALL_COMMANDS` are built as `npm i -g @fission-ai/openspec@^1.11.0 openwiki@^0.4.3` (user scope). Fallback is `@latest` only when both sources miss.
- **Non-npm GitHub sources pin by SHA, not devDep:** `FerroxLabs/agents-md` has no `package.json`, so `npm install github:FerroxLabs/agents-md#<sha>` fails `ENOENT package.json`. Keep it out of `package.json` devDeps; pin the commit SHA `90c7198cfa97ff1868f0600952098fee7fc86ef9` in `references/versions.json` (`@ferroxlabs/agents-md: 90c7198...`) plus the vendored `agents-md-baseline-template.md` (Captured 2026-08-29). Update both together via `refresh_agents_baseline.mjs` and regenerate `example/`. Single `npm install` path handles `openspec`/`openwiki`; `agents-md` refresh is file+SHA only.

### Consequences

- `npx skills add` consumers get pinned versions even with no `package.json` — bootstrap is deterministic and reproducible across machines at the same kit version.
- Bumps are explicit PRs: `npm install --save-dev` for npm packages + `refresh_agents_baseline.mjs` for agents-md + `versions.json` sync; `docs-lint` flags staleness >6 months for the baseline.
- `example/` generation seeds `AGENTS.md` baseline→ROUTING→LIFECYCLE after the global caret lane, so the example stays idempotent.
