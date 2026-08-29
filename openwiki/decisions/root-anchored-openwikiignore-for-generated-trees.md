---
type: Decision
title: Root-anchored .openwikiignore for generated trees
description: Use anchored /example/ and explicit .agents/sessions/ withREADME re-include in .openwikiignore to keep generated demo and ephemeral session bundles out of wiki evidence.
tags:
- openwiki
- ignore
- sessions
- example
timestamp: '2026-08-29T05:32:42.769110Z'
aksk_status: accepted
---

# Root-anchored .openwikiignore for generated trees

### Status

Accepted

### Context

`openwiki --update` fingerprints the repo and validates Claims evidence. Two trees are generated, not source truth: the root `example/` illustration (`generate-example`) and the ephemeral session bundles under `.agents/sessions/`. Both are already gitignored (`example/` via Skills CLI, `sessions/*` + `!README.md` via `.agents/.gitignore`), but OpenWiki has its own ignore layer (`.openwikiignore`, `OpenWikiIgnore.load`). A broad `example/` rule matches any depth and can hide legitimate nested examples; a claim citing `example/.agents/.gitignore` after ignore causes `Evidence path is excluded by .openwikiignore` from `dist/evidence/repository/resolver.js:55`. Distinguishing `openspec/specs/**` (contract) from `changes/**` (proposal-only) and `archive/**` (historical) also needed a durable instruction.

### Decision

- **Anchor root ignore only:** `.openwikiignore` contains `/example/` (slash-anchored), not bare `example/`. The comment is "Anchored to repo root; nested example/ folders are not ignored". This passes `OpenWikiIgnore.load` verified true for `example/.agents/.gitignore` and false for `foo/example/bar.md` or `examples/foo.md`.
- **Explicit sessions ignore with re-include:** `.openwikiignore` contains `.agents/sessions/` and `!.agents/sessions/README.md` (last-match-wins negation), mirroring `.agents/.gitignore: sessions/*` + `!sessions/README.md`. Defense in depth beyond git so temporary `summary.json`/`active-task.md` are never citable evidence. Verified true for `.agents/sessions/2026/x/summary.json` and false for `README.md`.
- **Instructions labeling:** `openwiki/INSTRUCTIONS.md` has three companion sections: `## OpenSpec source of truth` (specs = contract, changes = Proposal-only labeled, archive = historical), `## Generated demo output` (root `example/` ignored via `/example/`), and `## Temporary session evidence` (`.agents/sessions/` ignored except README). No bare wiki prose presents `changes/**` delta requirements as shipped.
- **Evidence retarget rule:** When a path is added to `.openwikiignore`, walk `openwiki/.claims/**/*.json` and `openwiki/**/*.md` frontmatter `repo://` sources for that prefix and retarget to the generator (`repo://.agents/skills/generate-example/run.sh`) or canonical file (`repo://.agents/.gitignore`, same `sha256:9d3e8002bee34dc78f45dbda50b0668070123c114e1bf70f2f902a61fa049353`). Prose mentions in body are allowed; only evidence resources are blocked.

### Consequences

- `openwiki --update` no longer aborts on generated `example/.agents/.gitignore` evidence; Claims walk returns 0 ignored resources.
- `openspec/changes/archive/**` stays indexed for history and lint pairing; `INSTRUCTIONS.md` labeling prevents mis-citing as shipped.
- Generated pages that still reference retired `.agents/workflows/opsx-*.md` are expected; next `openwiki --update` rewrites them to match `governance/openspec-workflow.md` supersession (task 4.2 of adopts-upstream-tools-over-reimplementation).
