---
name: aksk-bootstrap
description: Idempotent bootstrap orchestrator for AKSK — preflight detection, per-user global installs (npm i -g, not repo-local), per-repo scaffolding, contract/routing attachment, and OpenWiki agent-integration spread. Falls back to printed INSTRUCT commands when local execution is not possible. Also owns the AKSK curation contract attachment and peer-tool verification preconditions.
---

# AKSK Bootstrap

## Goal

One idempotent entry point (skill plus deterministic JS script) that takes any repo from bare to fully wired. Reuses the finalized kit templates and `adopt-openspec-openwiki` curation-contract semantics; never replaces OpenWiki-owned content.

The skill is the orchestrator; the JS script is the deterministic executor. Other skills (`learning-distill`, `docs-lint`, `task-closeout`) reuse its preconditions.

## Bootstrap (orchestrator)

### EXECUTE lane — run locally

```bash
node .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs [repo-root] [--force]
```

Two verbs (idempotent by detection):

1. **Verify CLIs** — Node >= 22, `openspec`/`openwiki` on PATH (`npm i -g @fission-ai/openspec@^1.11.0 openwiki@^0.4.3` if missing, caret from `references/versions.json` via `versionsFromPackageJson()`); skip any tool already present at a compatible version; verify `openwiki` resolves before MCP registration.
2. **Verify skills** — ensure `~/.agents/skills/<name>/SKILL.md` plus current host's dir; if missing `npx skills add -g -a <self-reported> <source>` (versions from `references/versions.json`, `@latest` only when unpinned; `npx` required, no clone fallback) for the kit and for `langchain-ai/openwiki --full-depth` when that lifecycle skill is needed, otherwise `openwiki integrations install <self-reported>` when that host is in `codex|claude|opencode` (skill+MCP+receipt atomically) else `openwiki mcp --host <self-reported>` or `npx add-mcp` chooser as backup; then per-repo `openspec init`, minimal `.agents/` scaffold, contract/routing attachment. **Never half-install**: failed step prints exact remaining commands and exits clean without partial state from that step.

### INSTRUCT lane — no local execution bridge

When any step cannot run locally (no `npm`, no write, sandboxed worker), the script prints the exact remaining commands and exits clean. The skill then surfaces those commands verbatim as the answer.

```
INSTRUCT lane — run these commands manually (versions from `references/versions.json`, caret-pinned):
  npm i -g @fission-ai/openspec@^1.11.0 openwiki@^0.4.3
  openspec init
  node .agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
  node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs AGENTS.md routing-note-template.md
  openwiki integrations install codex
```

No partial state from the failed step is left behind; completed steps remain.

### Idempotency

Re-running on a fully bootstrapped fixture changes nothing; re-running on a partially bootstrapped fixture completes only missing steps (detection-driven).

## Wiki Contract

### Goal

Own the peer-dependency preconditions between AKSK and the upstream tools:

1. Attach the AKSK curation contract to an existing `openwiki/INSTRUCTIONS.md` without ever replacing OpenWiki-owned content.
2. Verify that `openspec` and `openwiki` binaries resolve on PATH before any skill invokes them.

This section is the original precondition provider now owned by the bootstrap change; bootstrap copies the finalized kit templates rather than defining its own.

### Contract attachment

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

### Managed-section attachment

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
node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs [repo-root]          # seed when missing → exit 0
node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs [repo-root] --replace # overwrite with baseline
node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs [repo-root] --combine # stage for LLM merge
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
node .agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs        # fetch upstream + swap baseline zone
node .agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs --check # validate upstream without writing
```

Fetches `https://raw.githubusercontent.com/FerroxLabs/agents-md/main/AGENTS.md` to temp, validates (non-empty, contains anchors `Non-negotiables`, `Before writing code`, `Surgical changes`, `Goal-driven execution`), then swaps only the content between `AKSK:AGENTS-BASELINE` markers in the vendored template, updating the capture date. Other zones byte-identical (template has only the baseline). Offline/failure → exits non-zero with remediation, previously vendored baseline remains byte-identical.

### Bootstrap composition

In `bootstrap.mjs` the per-repo lane now runs `init_agents_md.mjs` before `attach_section.mjs` (and after the global `npm i -g` lane). The `AGENTS.md` initializer is the owner of the baseline zone; `attach_section.mjs` remains the owner of `AKSK:ROUTING`/`AKSK:LIFECYCLE`.

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
  (`npm i -g @fission-ai/openspec@^1.11.0`, `npm i -g openwiki@^0.4.3` with caret from `references/versions.json`, falling back to `@latest` if unpinned) and exits 2.

## Related

- Curation semantics consumed at distill time are specified by the `distill-routing`
  capability; contract attachment semantics by the `wiki-contract` capability.
- Design and lane ladder for `openwiki integrations install` are tracked in
  `openspec/changes/aksk-bootstrap-system/`.
