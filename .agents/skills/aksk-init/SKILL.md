---
name: aksk-init
description: Per-repo AKSK initialization — scaffolds .agents/ and AGENTS.md baseline first, then openspec/openwiki init, routing/lifecycle and wiki contract. Verifies aksk-bootstrap is ready. Interactive with --yes fallback.
---

# AKSK Init

Per-repo initialization. Verifies global tools (Node >=22, openspec/openwiki via aksk-bootstrap) then interactively scaffolds the repo.

## Steps (non-interactive script; skill prompts)

1. Scaffold `.agents/` + seed `AGENTS.md` baseline (`init_agents_md.mjs`)
2. `openspec init`
3. `openwiki --init` — (a) via harness (agent+openwiki MCP/skill, no extra key) or (b) CLI (requires OPENAI_API_KEY)
4. Attach routing + lifecycle (`attach_section.mjs`)
5. Attach wiki contract (`attach_wiki_contract.mjs`)

Each step prompts `[Y/n/skip]`; `--yes` / `--non-interactive` / `AKSK_YES=1` uses defaults; no TTY falls back to INSTRUCT (print commands, no writes).

```bash
node .agents/skills/aksk-init/scripts/bootstrap-repo.mjs [repo-root] [--yes] [--local-skills]
```

## Wiki Contract

### Goal

Own the peer-dependency preconditions between AKSK and the upstream tools:

1. Attach the AKSK curation contract to an existing `openwiki/INSTRUCTIONS.md` without ever replacing OpenWiki-owned content.
2. Verify that `openspec` and `openwiki` binaries resolve on PATH before any skill invokes them.

This section is the original precondition provider now owned by the bootstrap change; bootstrap copies the finalized kit templates rather than defining its own.

### Contract attachment

```bash
node .agents/skills/aksk-init/scripts/attach_wiki_contract.mjs [repo-root]
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

### Managed-section attachment

```bash
node .agents/skills/aksk-init/scripts/attach_section.mjs [repo-root] [target-file-name] [template-name]
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

## AGENTS.md baseline (FerroxLabs)

Deterministic seeding of the root `AGENTS.md` behavioral baseline. Composes with the bootstrap orchestrator — full idempotent order is:

```
1. Global lane in user scope: npm i -g @fission-ai/openspec@^1.11.0 openwiki@^0.4.3 (caret from `references/versions.json`)
2. init_agents_md (baseline, this section) → AGENTS.md baseline zone
3. OpenWiki block (OPENWIKI:START/END) via openwiki tooling
4. attach_section (AKSK:ROUTING + AKSK:LIFECYCLE) below
```

Zoned layout in a fully bootstrapped `AGENTS.md` (each zone owned by one writer, ordered upstream-first):

| Zone | Markers | Owner |
| --- | --- | --- |
| FerroxLabs behavioral baseline | `AKSK:AGENTS-BASELINE:BEGIN/END` | `init_agents_md.mjs` / `refresh_agents_baseline.mjs` |
| OpenWiki block | `OPENWIKI:START/END` | OpenWiki tooling |
| AKSK routing + lifecycle | `AKSK:ROUTING`, `AKSK:LIFECYCLE` | `attach_section.mjs` |

### Seed initializer

```bash
node .agents/skills/aksk-init/scripts/init_agents_md.mjs [repo-root]          # seed when missing → exit 0
node .agents/skills/aksk-init/scripts/init_agents_md.mjs [repo-root] --replace # overwrite with baseline
node .agents/skills/aksk-init/scripts/init_agents_md.mjs [repo-root] --combine # stage for LLM merge
```

Behavior contract:

- Missing `AGENTS.md` → creates it containing the vendored baseline wrapped in `AKSK:AGENTS-BASELINE` markers including provenance header (source URL, capture date, MIT notice, refresh pointer). No network access.
- Existing file with matching baseline block (trailing-whitespace/newline-at-EOF normalized) → no-op, exit 0.
- Existing non-matching file with no flag → exits 2, no writes, prints `Replace AGENTS.md with the FerroxLabs baseline, or combine both using the LLM?` plus the two flags to encode each answer. Mirrors the fail-fast-with-remediation convention.
- `--replace` → overwrites `AGENTS.md` with the marked baseline section. Follow with OpenWiki attach + `attach_section.mjs` to restore the other zones.
- `--combine` → never modifies the original. Stages `existing.md`, `baseline.md`, and generated `COMBINE.md` brief under `.agents/sessions/agents-md-combine/<timestamp>/` and prints agent instructions to merge and write back.

Template lives at `references/agents-md-baseline-template.md` (markers read from template, not hard-coded). Vendoring keeps bootstrap offline-safe.

### Baseline refresh

```bash
node .agents/skills/aksk-init/scripts/refresh_agents_baseline.mjs        # fetch upstream + swap baseline zone
node .agents/skills/aksk-init/scripts/refresh_agents_baseline.mjs --check # validate upstream without writing
```

Fetches `https://raw.githubusercontent.com/FerroxLabs/agents-md/main/AGENTS.md` to temp, validates (non-empty, contains anchors `Non-negotiables`, `Before writing code`, `Surgical changes`, `Goal-driven execution`), then swaps only the content between `AKSK:AGENTS-BASELINE` markers in the vendored template, updating the capture date. Other zones byte-identical (template has only the baseline). Offline/failure → exits non-zero with remediation, previously vendored baseline remains byte-identical.

### Bootstrap composition

Per-repo sequencing (scaffold+baseline first, then openspec/openwiki init, then routing/lifecycle/contract) now lives in `aksk-init`. Bootstrap only runs the global lane.

