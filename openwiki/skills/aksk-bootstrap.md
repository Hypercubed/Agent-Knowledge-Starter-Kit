---
type: skill-reference
title: "aksk-bootstrap Skill"
description: "Owns the peer-dependency preconditions between AKSK and its adopted tools: attaches the AKSK curation contract to openwiki/INSTRUCTIONS.md, attaches marker-delimited AKSK sections to root agent files, verifies openspec/openwiki binaries on PATH, and refreshes wiki indexes deterministically."
tags: [skills, aksk-bootstrap, bootstrap, preconditions, wiki-contract]
timestamp: 2026-08-23T23:30:00Z
openwiki:
  roles: [integration, workflow, testing]
  change_kinds: [public-api]
  source_paths:
    - .agents/skills/aksk-bootstrap/SKILL.md
    - .agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
    - .agents/skills/aksk-bootstrap/scripts/attach_section.mjs
    - .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs
    - .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
  symbols: ["requireBinaries", "INSTALL_COMMANDS", "synchronizeWikiIndexes"]
  test_paths: [openspec/changes/aksk-bootstrap-system/tasks.md, openspec/changes/add-agents-md-bootstrap/tasks.md]
  invariants: ["Never installs anything; every failure prints the exact remediation command and exits without writing.", "Attachment is append-only and idempotent: content outside AKSK markers is never replaced or removed.", "Only known peer tools (openspec, openwiki) are accepted; unknown names exit 2."]
---

# aksk-bootstrap

**Folder:** `.agents/skills/aksk-bootstrap/` · **Files:** `SKILL.md`, `scripts/*.mjs`, `references/*-template.md`

## Goal

Own the peer-dependency preconditions between AKSK and the upstream tools so no other skill reimplements them:

1. Attach the AKSK curation contract to an existing `openwiki/INSTRUCTIONS.md` without ever replacing OpenWiki-owned content.
2. Verify that `openspec` and `openwiki` binaries resolve on PATH before any skill invokes them.

It is a **precondition provider**: [learning-distill](learning-distill.md), [docs-lint](docs-lint.md), and other skills call into these scripts rather than duplicating the checks. Scope today is preconditions only; tool installation and per-agent integration spreading are future additions tracked by change `aksk-bootstrap-system`, which this skill will absorb.

## Contract attachment — `attach_wiki_contract.mjs`

```bash
node .agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs [repo-root]
```

- Appends the curation section from `references/wiki-contract-template.md` between `<!-- AKSK:WIKI-CONTRACT:BEGIN/END -->` markers to an **existing** `openwiki/INSTRUCTIONS.md`.
- Never creates the file, never replaces content outside the markers.
- Idempotent and self-updating: re-running is a no-op when the attached section matches the template; if the template changed, only the marked section is refreshed in place.
- Fail-fast: missing file exits 2 naming the prerequisite (`openwiki --init`) with no writes.
- Stub-aware: attaching below OpenWiki's default stub (`A code wiki for this repository.`) is reported as such; downstream skills treat a file without the markers as no-contract.

This repo's [`openwiki/INSTRUCTIONS.md`](../INSTRUCTIONS.md) carries the attached contract — the curated trees it names (`decisions/`, `troubleshooting/`, plus root pages `overview.md` and `maintenance-format.md`) are exactly what [knowledge layer](../architecture/knowledge-layer.md) documents.

## Managed-section attachment — `attach_section.mjs`

```bash
node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs [repo-root] [target-file-name] [template-name]
```

One mechanism for N marker-delimited AKSK sections in root agent instruction files (`AGENTS.md` by default). Markers are read from the chosen template, never hard-coded:

| Template | Markers | Content |
| --- | --- | --- |
| `routing-note-template.md` (default) | `AKSK:ROUTING` | Thin discovery pointers into `.agents/` and `openwiki/` |
| `lifecycle-template.md` | `AKSK:LIFECYCLE` | The self-improvement loop mandate (closeout → distill → prune) |

Behavior contract:

- Existing content is never replaced or removed; sections attach below it.
- Idempotent and self-updating on re-run (template changes refresh the marked section in place).
- A missing target file **is created** containing only the attached section — root router files have no upstream initializer today, so this script is their owner of record. That statement is scoped by the pending [`add-agents-md-bootstrap`](../governance/openspec-workflow.md#proposal-add-agents-md-bootstrap--seed-consumer-agentsmd-new-unstarted) proposal, which would add a behavioral seeding script that runs *before* this one; the append-only invariant here would stay intact.
- Unknown template name exits 2.

Root [`AGENTS.md`](../../AGENTS.md) currently carries both attached blocks below its OpenWiki-managed block; see [agent entrypoints](../governance/agent-entrypoints.md).

## Peer-tool verification — `check_peer_tools.mjs`

```bash
node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki
```

Also importable: `import { requireBinaries } from "./check_peer_tools.mjs"` (exits 2 with install commands if absent). Behavior:

- PATH resolution only; never attempts installation.
- Missing tools print one error each plus the exact commands (`npm i -g @fission-ai/openspec@latest`, `npm i -g openwiki@latest`) and exit 2.
- Only known peer tools are accepted (`openspec`, `openwiki`); any other name exits 2 naming the unknown tool instead of attempting a lookup.

## Index sync — `sync_wiki_indexes.mjs`

```bash
node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs [repo-root]
```

Refreshes all OpenWiki directory indexes with **no LLM and no CLI run**: it imports the installed package's exported helpers (`dist/okf/index-sync.js` → `synchronizeWikiIndexes`, driven by `OpenWikiLocalShellBackend` in docs-only virtual mode) located via `npm root -g`. Exits 2 with remediation when `openwiki/` is missing or the package is not installed globally. This is the only sanctioned way distillation refreshes indexes ([learning-distill](learning-distill.md) step 7); [docs-lint](docs-lint.md) reports index drift as informational advice to rerun it rather than failing.

## Change recipe: adding a new managed section

1. Add a template under `.agents/skills/aksk-bootstrap/references/` whose body carries unique `<!-- AKSK:<NAME>:BEGIN -->` / `<!-- AKSK:<NAME>:END -->` markers.
2. Attach it where needed via `attach_section.mjs <root> <target-file> <template-name>`.
3. Extend the wiring checks in `.agents/skills/docs-lint/SKILL.md` so the new block is integrity-checked like `ROUTING`/`LIFECYCLE`.
4. Validate narrowly: run the attachment twice (second run must be a no-op), damage the block and confirm lint reports it, then `bash scripts/check-agents-structure.sh .agents`.

Non-goals: installing peer tools, writing OpenWiki-owned files, or scaffolding consumer repos (all belong to `aksk-bootstrap-system`).
