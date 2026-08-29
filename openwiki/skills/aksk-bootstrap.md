---
type: skill-reference
title: aksk-bootstrap Skill
description: Orchestrates AKSK preconditions — verifies openspec and openwiki binaries on PATH, attaches the curation contract to openwiki/INSTRUCTIONS.md, attaches marker-delimited managed blocks to root agent files, and deterministically refreshes wiki indexes without LLM or CLI runs.
tags: [skills, aksk-bootstrap, bootstrap, preconditions, wiki-contract, peer-tools]
verified:
  - by: openwiki/0.4.3
    at: 2026-08-29T04:36:52.163Z
sources:
  - id: openwiki-source-da03faceacac4fd818b473f3
    resource: repo://.agents/skills/aksk-bootstrap/references/lifecycle-template.md
  - id: openwiki-source-0294ec7c02cfa2beeca87331
    resource: repo://.agents/skills/aksk-bootstrap/references/routing-note-template.md
  - id: openwiki-source-7381bbb8d2e7fd02da7469ce
    resource: repo://.agents/skills/aksk-bootstrap/references/wiki-contract-template.md
  - id: openwiki-source-5398a69cb2cf8d556809da57
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_section.mjs
  - id: openwiki-source-d56b5afb22742020f2ab6b59
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-d1960e41bf9a48af26e81829
    resource: repo://.agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs
  - id: openwiki-source-dce50581779fda5dd507dc34
    resource: repo://.agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
  - id: openwiki-source-dc8872a5e7d386c22ea2f135
    resource: repo://.agents/skills/aksk-bootstrap/SKILL.md
  - id: openwiki-source-5af7f373fcb21f142106673c
    resource: repo://.agents/skills/docs-lint/SKILL.md
  - id: openwiki-source-7fe0106a3a83528f5b3d3755
    resource: repo://.agents/skills/learning-distill/SKILL.md
generated: { by: "openwiki/0.4.3", at: "2026-08-29T04:36:52.163Z" }
---

# aksk-bootstrap

**Folder:** `.agents/skills/aksk-bootstrap/` · **Scripts:** `scripts/*.mjs` (Node ESM) · **Templates:** `references/*-template.md` · **Skill:** `SKILL.md`

Precondition provider for the kit. Every other skill that touches `openspec` or `openwiki` calls into these helpers instead of reimplementing PATH checks or marker merges. Scope today is preconditions only — verification and append-only attachment, never installation — with tool installation and per-agent integration spreading deferred to proposal `aksk-bootstrap-system`.

## Goal and ownership

Own the boundary between AKSK and its peer tools:

1. **Attach** the AKSK curation contract to an already-initialized `openwiki/INSTRUCTIONS.md` without replacing OpenWiki-owned content.
2. **Attach** N marker-delimited AKSK sections to root router files (`AGENTS.md` by default) through one generic mechanism.
3. **Verify** that `openspec` and `openwiki` resolve on `PATH` before any skill invokes them.
4. **Sync** wiki directory indexes deterministically after distill-authored writes, without running `openwiki --update`.

```
.agent/skills/aksk-bootstrap/
  SKILL.md
  scripts/
    attach_wiki_contract.mjs
    attach_section.mjs
    check_peer_tools.mjs
    sync_wiki_indexes.mjs
  references/
    wiki-contract-template.md      # AKSK:WIKI-CONTRACT
    routing-note-template.md       # AKSK:ROUTING (default for attach_section)
    lifecycle-template.md          # AKSK:LIFECYCLE
```

> **Proposal-only (not yet in `openspec/specs/**`):** `openspec/changes/add-agents-md-bootstrap/**` would add a vendored FerroxLabs baseline template (`agents-md-baseline-template.md` with `AKSK:AGENTS-BASELINE` markers and provenance header) plus `init_agents_md.mjs` (seed/replace/combine) and `refresh_agents_baseline.mjs` (opt-in updater). Those files and flows are not shipped today — `references/` contains only the three templates above — and the proposal material is labeled explicitly below. See [AGENTS.md Zoning](../concepts/agents-md-zoning.md) and [Bootstrap and Block Attachment](../workflows/bootstrap-and-attachment.md).

## Entrypoints

| Script | Invocation | Purpose |
| --- | --- | --- |
| `attach_wiki_contract.mjs` | `node .agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs [repo-root]` | Append/refresh `AKSK:WIKI-CONTRACT` block in existing `openwiki/INSTRUCTIONS.md` |
| `attach_section.mjs` | `node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs [repo-root] [target-file] [template-name]` | Append/refresh one `AKSK:*` block in a root router file |
| `check_peer_tools.mjs` | `node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki` · `import { requireBinaries } from "./check_peer_tools.mjs"` | Verify peer binaries on `PATH`; never installs |
| `sync_wiki_indexes.mjs` | `node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs [repo-root]` | Rebuild wiki directory indexes via installed package helpers |

All scripts resolve `repo-root` as `path.resolve(process.argv[2] ?? process.cwd())`. All failures that block progress exit `2` with the exact remediation command and perform no partial writes.

## Contract attachment — `attach_wiki_contract.mjs`

Appends the section from `references/wiki-contract-template.md` — markers are part of the template, not hard-coded separately — between `<!-- AKSK:WIKI-CONTRACT:BEGIN -->` / `<!-- AKSK:WIKI-CONTRACT:END -->`.

Mechanism:

- Reads `openwiki/INSTRUCTIONS.md` with `readFileSync`. If the file does not exist, prints `error: <path> not found; this repository has no initialized OpenWiki wiki. Initialize it first with \`openwiki --init\`.` and exits `2` with no writes. AKSK never creates the wiki.
- If the file lacks `MARKER_BEGIN`, appends `\n<templated section>` below existing content with a normalized newline boundary (`text.endsWith("\n") ? text : text + "\n"`). When the existing file is exactly the default stub `A code wiki for this repository.` the log is stub-aware; otherwise it reports attaching below existing content. Downstream skills treat a file without the markers as no-contract.
- If markers are present, runs `refresh(text, section)` — a dot-all regex `BEGIN.*?END` (escaped) extracts the current block; `match[0].trim() === section.trim()` is a no-op (logs `already up to date`); otherwise splices only the marked block in place via `writeFileSync` and logs `Refreshed`.
- Never replaces or removes content outside the marker pair; a template upgrade refreshes only the marked section.

<!-- openwiki: mermaid parse failed and this diagram was converted to a text fence so it does not break rendering. Fix the diagram source and restore the mermaid fence. Parser error: Heuristic: an unescaped angle bracket inside a label breaks rendering; rephrase the label. -->
```text
flowchart TB
  Check{"openwiki/INSTRUCTIONS.md exists?"}
  Missing["Exit 2 — not found<br>print openwiki --init<br>no writes"]
  HasMarkers{"Contains AKSK:WIKI-CONTRACT?"}
  Append["Append template below existing content<br>stub-aware log"]
  Compare{"trimmed block == template?"}
  NoOp["No-op — already up to date"]
  Refresh["Refresh only between markers"]

  Check -->|no| Missing
  Check -->|yes| HasMarkers
  HasMarkers -->|no| Append
  HasMarkers -->|yes| Compare
  Compare -->|equal| NoOp
  Compare -->|changed| Refresh
```

This repo's `openwiki/INSTRUCTIONS.md` carries the attached contract; the curated trees it names (`decisions/`, `troubleshooting/`, `overview.md`, `maintenance-format.md`) are what the [Knowledge Curation Contract](../concepts/knowledge-curation-contract.md) and [knowledge layer](../architecture/knowledge-layer.md) document.

## Managed-section attachment — `attach_section.mjs`

One mechanism for N sections. The template owns its markers; the script reads them at runtime.

```bash
node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs [repo-root] [target-file-name] [template-name]
# defaults: target-file-name = AGENTS.md, template-name = routing-note-template.md
```

| Template | Markers | Content |
| --- | --- | --- |
| `routing-note-template.md` (default) | `AKSK:ROUTING` | Thin discovery pointers into `.agents/` and `openwiki/` |
| `lifecycle-template.md` | `AKSK:LIFECYCLE` | Self-improvement loop mandate (closeout → distill → prune) |

Control flow:

- `templateName` resolves to `REFERENCE_DIR/<name>`; missing template exits `2` with `error: unknown template '<name>'`.
- `markersOf(section)` extracts `BEGIN`/`END` with `/<!--\s*(AKSK:[A-Z-]+):BEGIN\s*-->/` and the matching `END`, normalizes `BEGIN` whitespace, and returns `[begin, end, name]`. A template without a pair exits `2`.
- Target is `statSync`-checked: a directory at the target path exits `2`; a missing file (or non-file stat) is **created** containing only the templated section — root router files have no upstream initializer, so this script is their owner of record for empty files.
- If the file exists and contains `markBegin`, `refresh()` with escaped dot-all `BEGIN.*?END` compares `match[0].trim() === section.trim()` for idempotency; mismatch refreshes only the marked block in place.
- Otherwise appends `\n<section>` below existing content with normalized newline.

Root `AGENTS.md` currently carries both blocks below its `OPENWIKI:START/END` block; see [AGENTS.md Zoning](../concepts/agents-md-zoning.md).

> **Proposal-only scope for baseline seeding:** the pending `add-agents-md-bootstrap` change would prefix this flow with `init_agents_md.mjs` (missing file → create baseline, existing file without flag → exit 2 prompting `Replace … or combine …?` with `--replace` / `--combine` flags, idempotent re-run via normalized whitespace compare, `--combine` stages `.agents/sessions/agents-md-combine/<timestamp>/`) and add an opt-in `refresh_agents_baseline.mjs` that fetches upstream to a temp file, validates anchors, and swaps only the `AKSK:AGENTS-BASELINE` zone. Until that proposal lands, `attach_section.mjs` remains the sole writer for empty router files and its append-only invariant — existing content outside markers is never replaced — stays intact.

## Peer-tool verification — `check_peer_tools.mjs`

Standalone or imported by sibling skills:

```bash
node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki
```

```js
import { requireBinaries } from "./check_peer_tools.mjs";
requireBinaries(["openspec", "openwiki"]); // exits 2 with install commands if absent
```

Behavior contract:

- **Allowlist only.** `INSTALL_COMMANDS` maps exactly two names: `openspec → npm i -g @fission-ai/openspec@latest` and `openwiki → npm i -g openwiki@latest`. `missing(tools)` rejects any other name with `unknown peer tool(s): …` and exits `2` rather than attempting a `PATH` lookup.
- **PATH resolution only, never installs.** `onPath(cmd)` splits `process.env.PATH` by `path.delimiter`, checks each directory (with `PATHEXT` extensions on `win32`), and tests `existsSync(path.join(d, cmd + e))`.
- **Fail-fast with exact remediation.** `requireBinaries(tools)` collects missing tools, prints one `error: required peer tool '…' is not installed or not on PATH.` per tool, then `Install the missing tools with:` plus each `INSTALL_COMMANDS[tool]` line, and exits `2`. Zero missing is a silent return; the CLI entry prints `all peer tools present: …` on success.
- **No args** also exits `2` with `usage: node check_peer_tools.mjs <tool> [<tool> ...]`.

`learning-distill` runs this as a fail-closed prerequisite before any wiki write; `docs-lint` reuses the same helpers for its wiring checks.

## Index sync — `sync_wiki_indexes.mjs`

Deterministic, offline index rebuild with no LLM and no `openwiki --update` run:

```bash
node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs [repo-root]
```

Mechanism:

- Asserts `openwiki/` exists; otherwise exits `2` with `initialize the wiki first with \`openwiki --init\``.
- Locates the global package via `spawnSync("npm", ["root", "-g"])`; failure exits `2` with `node and npm are required but were not found`. Asserts `<npm-root>/openwiki/dist` exists; missing exits `2` with `npm i -g openwiki@latest`.
- Dynamically imports `agent/docs-only-backend.js` (`OpenWikiLocalShellBackend`) and `okf/index-sync.js` (`synchronizeWikiIndexes`) from the global `dist` via `pathToFileURL`.
- Constructs `new OpenWikiLocalShellBackend({ rootDir, docsOnly: true, virtualMode: true, maxOutputBytes: 100_000, timeout: 120 })` and calls `synchronizeWikiIndexes(backend, "repository")`, keeping curated page bodies byte-identical while rebuilding `openwiki/index.md` and directory indexes.

This is the only sanctioned index-refresh path for distillation (step 7) and the remediation `docs-lint` prints for index drift instead of failing.

## Relationships and state

- **Precondition provider:** [learning-distill](../skills/learning-distill.md) and [docs-lint](../skills/docs-lint.md) delegate `PATH` and contract checks to these scripts rather than duplicating them. Lint treats each marker family as an independent integrity unit and prints the owning script's refresh command for a damaged block.
- **Single writer per zone:** closeout writes only under `.agents/sessions/`; distillation alone writes curated wiki trees, `.agents/AGENTS.md`, and playbooks via these helpers; OpenWiki tooling owns `OPENWIKI:START/END` and `openwiki/index.md`.
- **State is the markers.** The presence and trimmed equality of a marked block is the idempotency signal. Re-running any attachment when the block already matches the template is a no-op and does not rewrite the file, so formatter-only diffs (trailing whitespace, newline-at-EOF) do not churn.

## Invariants and failure semantics

- **Never installs.** Every failure prints the verbatim command to run (`npm i -g …` or `openwiki --init`) and exits without side effects on the failing step. No script spawns an installer or mutates `PATH`.
- **Append-only and idempotent.** Content outside `AKSK:*` / `AKSK:WIKI-CONTRACT` markers is never replaced or removed. `refresh()` swaps only between the marker pair; second run after no template change is a no-op.
- **Only known peer tools accepted.** Unknown names exit `2` naming the tool; no lookup is attempted.
- **Zone isolation.** Refreshing one template (e.g., `lifecycle-template.md`) leaves every other zone byte-identical. Damaging one zone's markers is reported for that family only.
- **Missing-target asymmetry:** `attach_wiki_contract.mjs` never creates `openwiki/INSTRUCTIONS.md` (fail-fast); `attach_section.mjs` does create a missing root router file (owner of record). Both normalize the trailing newline before appending.

## Change recipe — adding a new managed section

1. Add a template under `.agents/skills/aksk-bootstrap/references/` whose body carries a unique `<!-- AKSK:<NAME>:BEGIN -->` / `<!-- AKSK:<NAME>:END -->` pair.
2. Attach it with `node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs <root> <target-file> <template-name>` — `markersOf()` picks it up with no code change.
3. Extend the wiring checks in `.agents/skills/docs-lint/SKILL.md` so the new block (`AKSK:<NAME>`) is integrity-checked like `ROUTING`/`LIFECYCLE`.
4. Validate narrowly: run the attachment twice (second run must log no-op), damage the block and confirm lint reports that family, then `bash scripts/check-agents-structure.sh .agents`.

## Operations and focused validation

| Probe | Command | Proves |
| --- | --- | --- |
| Peer tools present | `node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki` | Missing tools fail with exact `npm i -g` lines; unknown tool names fail naming the tool |
| Contract idempotency | `node .agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs` twice | Second run `already up to date`; template change refreshes only marked block |
| Managed-section idempotency | `node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs . AGENTS.md routing-note-template.md` twice | Second run no-op; each template refreshes only its own block |
| Missing target creation | `rm AGENTS.md && node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs . AGENTS.md routing-note-template.md` | File created containing only the requested section |
| Unknown template | `node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs . AGENTS.md no-such-template.md` | Exits 2 with unknown-template remediation |
| Index drift | `node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs` | Indexes rebuilt; missing `openwiki/` or global package exits 2 with install/init hint |

Non-goals: installing peer tools, writing OpenWiki-owned files outside marker contracts, or scaffolding consumer repos — all belong to `aksk-bootstrap-system` when it lands.
