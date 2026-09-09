---
type: Troubleshooting
title: OpenWiki evidence path excluded by .openwikiignore
description: Fixes Evidence path is excluded by .openwikiignore after adding generated paths to ignore — retarget claims/frontmatter sources to canonical files and re-verify with a walk.
tags:
- openwiki
- troubleshooting
- claims
- ignore
timestamp: '2026-08-29T05:33:16.792919Z'
aksk_depends_on:
- decisions/root-anchored-openwikiignore-for-generated-trees
---

# OpenWiki evidence path excluded by .openwikiignore

## Symptoms

`openwiki --update` (or `openwiki --update -p`) fails validation with:

`Error Evidence path is excluded by .openwikiignore: example/.agents/.gitignore` (from `dist/evidence/repository/resolver.js:55`).

Similar message appears for any `repo://` evidence resource whose file path now matches a new `.openwikiignore` pattern.

## Likely cause

A new ignore was added for a generated tree (for example `/example/` for the root demo or `.agents/sessions/` for ephemeral bundles) but existing Claims still cite the generated file:

- `openwiki/.claims/**/distribution-and-tool-wiring.json` had `repo://example/.agents/.gitignore` with `sha256:9d3e8002bee34dc78f45dbda50b0668070123c114e1bf70f2f902a61fa049353`
- `openwiki/integrations/distribution-and-tool-wiring.md` frontmatter sources listed `repo://example/.agents/.gitignore`

Covering `example/` now makes that evidence invalid. Prose mentions in body are allowed; only frontmatter `repo://` resources inside Claims or page frontmatter are blocked by `OpenWikiIgnore`.

## Known fix

1. Identify all citing pages: `grep -rn "example/.agents/.gitignore" openwiki/.claims openwiki` then full walk with `OpenWikiIgnore.load` over `openwiki/.claims/**/*.json` claims[].evidence[].resource and `openwiki/**/*.md` frontmatter `resource: repo://`.
2. Retarget to canonical source of identical content: replace `repo://example/.agents/.gitignore` with `repo://.agents/.gitignore` (same hash `sha256:9d3e8002bee34dc78f45dbda50b0668070123c114e1bf70f2f902a61fa049353`, content `sessions/*` + `!sessions/README.md`) in the JSON claim, or with the generator `repo://.agents/skills/generate-example/run.sh` which creates the file. In `openwiki/integrations/distribution-and-tool-wiring.md` remove the `openwiki-source-434ca18be88e75ce3a48ffb7` frontmatter source line; the generator entry `openwiki-source-3f1012c7ef48495aaed5c3e44c7a064b2fd9061e6848c390d5a3faa2512c9b3a` already covers the pattern.
3. Re-verify: run `node` with `OpenWikiIgnore.load(process.cwd())` then walk claims and frontmatter; expect `0 ignored evidence`. Quick anchored checks: `example/README.md => true`, `examples/foo.md => false`, `foo/example/bar.md => false`, `.agents/sessions/x/summary.json => true`, `.agents/sessions/README.md => false`.
4. Never cite generated files under root `example/` or `.agents/sessions/` as evidence after ignore; use the generating script or canonical dotfile.

## Prevention

- When adding any path to `.openwikiignore`, immediately run the claims+frontmatter walk before committing.
- Use anchored `/example/` (root only), not bare `example/` which matches at any depth — document anchoring in the ignore file comment and in `openwiki/INSTRUCTIONS.md: Generated demo output`.
- Keep `.agents/sessions/` ignored via both `.gitignore` and `.openwikiignore` with `!README.md` re-include so temporary bundles cannot become durable evidence.

## Validation

- Walk reports `No ignored evidence in claims` and `0 ignored frontmatter sources`.
- `openwiki --update` passes evidence validation; next run with clean worktree and `status: complete` is `noop` (only `updatedAt` refreshes) per `dist/agent/utils.js:getUpdateNoopStatus`.

## Related

- [Root-anchored .openwikiignore for generated trees](../decisions/root-anchored-openwikiignore-for-generated-trees.md)
- `openwiki/INSTRUCTIONS.md: Generated demo output` + `Temporary session evidence`
- `governance/openspec-workflow.md:112` (opsx workflow retirement, task 4.2)
