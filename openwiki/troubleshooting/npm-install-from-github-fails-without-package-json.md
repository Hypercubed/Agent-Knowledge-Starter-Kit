---
type: Troubleshooting
title: npm install from GitHub fails when repo has no package.json
description: Installing a non-npm GitHub repo (e.g., FerroxLabs/agents-md) as a devDep via `github:FerroxLabs/agents-md#sha` fails ENOENT package.json — keep it vendored with SHA in versions.json instead.
tags:
- npm
- github
- versions
- troubleshooting
timestamp: '2026-08-29T16:03:06.104532Z'
aksk_depends_on:
- decisions/pin-global-tool-versions-via-caret-and-bundled-versions-json
---

# npm install from GitHub fails when repo has no package.json

## Symptoms

Adding `github:FerroxLabs/agents-md#90c7198` to `package.json` `devDependencies` then `npm install` fails:

`npm error ENOENT Could not read package.json: .../git-clone.../package.json`

Similar error for any GitHub repo that is a single file (e.g., `AGENTS.md`) without a `package.json` at its root.

## Likely cause

`npm install <github>` expects the cloned repo to be an npm package (`package.json` present). `FerroxLabs/agents-md` is a markdown file repo, not an npm package, so npm's tarball step fails even with `github:` shorthand. This is not a network or SHA issue — the spec selection resolves but the install step requires a package manifest.

## Known fix

- Remove the GitHub entry from `package.json` `devDependencies` — keep `openwiki`/`@fission-ai/openspec` as caret there, not the agents-md repo.
- Pin the commit SHA in `.agents/skills/aksk-bootstrap/references/versions.json` (`@ferroxlabs/agents-md: 90c7198cfa97...`) and keep the vendored `agents-md-baseline-template.md` (with `AKSK:AGENTS-BASELINE` markers, provenance header) as the primary source. `bootstrap.mjs` reads `references/versions.json` (bundled via `npx skills add`), so consumers get the pin without needing `node_modules`.
- Refresh together: `node .agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs` + bump `versions.json` SHA + regenerate `example/` (`bash .agents/skills/generate-example/run.sh` seeds baseline→AKSK).

## Prevention

- For non-npm GitHub sources, never add `github:` devDeps; use vendored file + SHA in `versions.json`.
- For npm packages, use caret `^` in `package.json` and copy to `references/versions.json` for consumer delivery (bootstrap reads bundled first, then consumer `package.json` for override).

## Validation

- `npm install` succeeds without agents-md devDep; `node --check bootstrap.mjs` passes.
- `reference/versions.json` contains `openwiki`/`openspec` caret and `agents-md` SHA; `example/.agents/skills/aksk-bootstrap/references/versions.json` matches after `generate-example`.
- `node refresh_agents_baseline.mjs --check` validates upstream anchors; `npm view` for npm packages shows caret range allows patches.

## Related

- [Pin global tool versions via caret and bundled versions.json](../decisions/pin-global-tool-versions-via-caret-and-bundled-versions-json.md)
- `openspec/specs/agents-md-bootstrap/spec.md` (vendored baseline, provenance, refresh)
