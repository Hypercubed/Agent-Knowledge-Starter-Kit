---
name: aksk-bootstrap
description: Attach the AKSK curation contract to an initialized OpenWiki wiki and verify peer-tool binaries (openspec, openwiki) before use. Use during kit setup, after initializing a repo wiki with `openwiki --init`, or whenever a skill needs to confirm its peer tools are present. Fails fast with exact remediation; never installs anything.
---

# Wiki Contract

## Goal

Own the peer-dependency preconditions between AKSK and the upstream tools:

1. Attach the AKSK curation contract to an existing `openwiki/INSTRUCTIONS.md` without ever replacing OpenWiki-owned content.
2. Verify that `openspec` and `openwiki` binaries resolve on PATH before any skill invokes them.

This skill is a precondition provider: other skills (`learning-distill`, `docs-lint`, `task-closeout`) call into it rather than reimplementing these checks. It is scoped today to preconditions only; tool installation and integration spreading are future additions (tracked by the `aksk-bootstrap-system` change), which this skill will absorb.

## Contract attachment

```bash
node .agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs [repo-root]
```

Behavior contract:

- Appends the curation section from `references/wiki-contract-template.md` between
  `<!-- AKSK:WIKI-CONTRACT:BEGIN/END -->` markers to an **existing** `openwiki/INSTRUCTIONS.md`.
- Never creates the file, replaces content, or removes OpenWiki-owned sections.
- Idempotent and self-updating: re-running is a no-op when the attached section
  matches the template; if the template changed, only the marked section is
  refreshed in place and nothing outside the markers is touched.
- Fail-fast: if `openwiki/INSTRUCTIONS.md` is missing, exits 2 naming the missing
  precondition and printing the verbatim prerequisite `openwiki --init`, with no writes.
- Stub-aware: attaching below OpenWiki's default stub (`A code wiki for this repository.`)
  is reported as such; downstream skills treat a file without the AKSK markers as no-contract.

## Managed-section attachment

```bash
node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs [repo-root] [target-file-name] [template-name]
```

One mechanism for N marker-delimited AKSK sections in root agent instruction files. Each template under `references/` carries its own `<!-- AKSK:<NAME>:BEGIN/END -->` markers; markers are read from the template, not hard-coded.

| Template | Markers | Content |
| --- | --- | --- |
| `routing-note-template.md` (default) | `AKSK:ROUTING` | Thin discovery pointers into `.agents/` and `openwiki/` |
| `lifecycle-template.md` | `AKSK:LIFECYCLE` | The self-improvement loop mandate (closeout -> distill -> prune) |

Behavior contract (all templates):

- Existing content is never replaced or removed; sections attach below it.
- Idempotent and self-updating: re-running is a no-op when the attached section matches the template; if the template changed, only the marked section is refreshed in place.
- A missing target file is created containing only the attached section - root router files have no upstream initializer, so this script is their owner of record.
- Unknown template name exits 2.

## Peer-tool verification

Standalone:

```bash
node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki
```

From Python (sibling skills may import; import from this scripts directory):

```python
import { requireBinaries } from "./check_peer_tools.mjs";
requireBinaries(["openspec", "openwiki"]); // exits 2 with install commands if absent
```

Only known peer tools are accepted (`openspec`, `openwiki`); any other name
exits 2 with an error naming the unknown tool rather than attempting a PATH
lookup.

Behavior contract:

- Checks PATH resolution only; never attempts installation.
- On missing tools, prints one error per tool plus the exact install commands
  (`npm i -g @fission-ai/openspec@latest`, `npm i -g openwiki@latest`) and exits 2.

## Related

- Curation semantics consumed at distill time are specified by the `distill-routing`
  capability; contract attachment semantics by the `wiki-contract` capability.
