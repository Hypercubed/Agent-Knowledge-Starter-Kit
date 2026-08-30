---
type: skill-reference
title: aksk-init Skill
description: Per-repo lane for AKSK — scaffolds .agents/ and AGENTS.md baseline first, then openspec init, openwiki init, and routing/lifecycle plus wiki-contract attachment with idempotent marker ownership.
tags:
- skills
- aksk-init
- per-repo-init
- agents-md
- wiki-contract
- routing
- lifecycle
- openspec
- openwiki
verified:
  - by: openwiki/0.4.3
    at: 2026-08-30T01:40:39.325Z
sources:
  - id: openwiki-source-c056a1ca61c0634d11844713
    resource: repo://.agents/skills/aksk-bootstrap/references/versions.json
  - id: openwiki-source-b7d2caf3a5a306ccd41f0115
    resource: repo://.agents/skills/aksk-init/references/agents-md-baseline-template.md
  - id: openwiki-source-860daeb113838f15883fdf83
    resource: repo://.agents/skills/aksk-init/references/lifecycle-template.md
  - id: openwiki-source-93c78d1dd46b76df62cef2f6
    resource: repo://.agents/skills/aksk-init/references/routing-note-template.md
  - id: openwiki-source-d786624ba23d2df437591102
    resource: repo://.agents/skills/aksk-init/references/wiki-contract-template.md
  - id: openwiki-source-944a38bc18074fe81ed45b1f
    resource: repo://.agents/skills/aksk-init/scripts/attach_section.mjs
  - id: openwiki-source-ff2d87cb54c01d07d6371400
    resource: repo://.agents/skills/aksk-init/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-9930f2885b3cb73d38a9300a
    resource: repo://.agents/skills/aksk-init/scripts/bootstrap-repo.mjs
  - id: openwiki-source-5a97b1d59b72f21589de6133
    resource: repo://.agents/skills/aksk-init/scripts/init_agents_md.mjs
  - id: openwiki-source-4ab0b6cc58dd78f7a5c0603e
    resource: repo://.agents/skills/aksk-init/SKILL.md
  - id: openwiki-source-d682bd16449a28825541bbed
    resource: repo://openspec/specs/aksk-init/spec.md
generated: { by: "openwiki/0.4.3", at: "2026-08-30T01:40:39.325Z" }
---

# aksk-init

**Folder:** `.agents/skills/aksk-init/` · **Scripts:** `scripts/*.mjs` (Node ESM) · **Templates:** `references/*-template.md` · **Skill:** `SKILL.md` · **Spec:** `openspec/specs/aksk-init/spec.md`

Per-repo initialization lane. Verifies the global lane (`aksk-bootstrap`) is satisfied, then deterministically scaffolds the repository: `.agents/` tree and `AGENTS.md` FerroxLabs baseline first, `openspec`/`openwiki` trees, routing plus lifecycle markers in the root router file, and the AKSK curation contract in `openwiki/INSTRUCTIONS.md`. The skill (`SKILL.md`) is the interactive orchestrator; `bootstrap-repo.mjs` is the non-interactive executor that sibling skills and CI can invoke directly.

> **Lane split:** `aksk-bootstrap` is strictly per-user global (Node check, `npm i -g` from `references/versions.json`, PATH verification). `aksk-init` never installs global tools — it fails fast directing to `aksk-bootstrap` when they are missing. The shim `aksk-bootstrap/scripts/bootstrap.mjs` preserves the old entrypoint by running `bootstrap-global.mjs` then `bootstrap-repo.mjs` when present.

```
.agents/skills/aksk-init/
  SKILL.md
  scripts/
    bootstrap-repo.mjs          # per-repo orchestrator — preflight + scaffold + init + attachments
    init_agents_md.mjs          # seed AGENTS.md FerroxLabs baseline (zoned, vendored)
    attach_section.mjs          # generic AKSK:* → AGENTS.md (routing, lifecycle)
    attach_wiki_contract.mjs    # AKSK:WIKI-CONTRACT → openwiki/INSTRUCTIONS.md
  references/
    agents-md-baseline-template.md  # AKSK:AGENTS-BASELINE (vendored, provenance header)
    routing-note-template.md        # AKSK:ROUTING
    lifecycle-template.md           # AKSK:LIFECYCLE
    wiki-contract-template.md       # AKSK:WIKI-CONTRACT
```

## Position in the lane ladder

Global lane must complete before any per-repo work. `bootstrap-repo.mjs` encodes that ordering explicitly: it checks `Node >=22` and that `openspec`/`openwiki` resolve on `PATH` before touching the filesystem, mirroring `aksk-bootstrap/scripts/check_peer_tools.mjs` semantics but without installing. See [aksk-bootstrap](../skills/aksk-bootstrap.md) and [AGENTS.md Zoning](../concepts/agents-md-zoning.md).

<!-- openwiki: mermaid parse failed and this diagram was converted to a text fence so it does not break rendering. Fix the diagram source and restore the mermaid fence. Parser error: Heuristic: an unescaped angle bracket inside a label breaks rendering; rephrase the label. -->
```text
flowchart TD
    G[aksk-bootstrap global lane\nbootstrap-global.mjs] --> P{Node >=22\nopenspec/openwiki on PATH?}
    P -- missing --> F[fail fast exit 2\nINSTRUCT: npm i -g ...\nrun aksk-bootstrap first]
    P -- ok --> S1[scaffold .agents/ + init_agents_md baseline FIRST]
    S1 --> S2[openspec init --tools none\nif openspec/ missing]
    S2 --> S3[openwiki --init\nif openwiki/ missing\nharness vs CLI]
    S3 --> S4[attach_section routing + lifecycle\n→ AGENTS.md]
    S4 --> S5[attach_wiki_contract\n→ openwiki/INSTRUCTIONS.md]
    S5 --> DONE[Repo init complete\nre-run is no-op]
```

## Entrypoints

| Script | Invocation | Purpose |
| --- | --- | --- |
| `bootstrap-repo.mjs` | `node .agents/skills/aksk-init/scripts/bootstrap-repo.mjs [repo-root] [--yes] [--local-skills]` | **Primary orchestrator.** Non-interactive; skill prompts `[Y/n/skip]` before calling it. `--yes`/`--non-interactive`/`AKSK_YES=1` uses defaults; no TTY falls back to INSTRUCT. |
| `init_agents_md.mjs` | `node .../init_agents_md.mjs [repo-root]` · `--replace` · `--combine` | Seed or reconcile the `AGENTS.md` baseline zone. |
| `attach_section.mjs` | `node .../attach_section.mjs [repo-root] [target-file] [template-name]` | Generic marker-delimited attachment for `AKSK:ROUTING` / `AKSK:LIFECYCLE` (and future `AKSK:*`). |
| `attach_wiki_contract.mjs` | `node .../attach_wiki_contract.mjs [repo-root]` | Append/refresh `AKSK:WIKI-CONTRACT` in existing `openwiki/INSTRUCTIONS.md`. |

All scripts are Node ESM and share a single runtime requirement (`Node >=22`). They never block on `stdin`; the skill layer owns interactivity.

## Orchestrator — `bootstrap-repo.mjs`

The orchestrator is intentionally sequential and idempotent by detection, not by flag.

1. **Preflight.** Parse `repo-root` as the first non-flag positional; resolve to absolute. Reject `Node <22` with `exit 2`. Probe `PATH` for `openspec` and `openwiki` (platform-aware via `PATHEXT` on Windows). On miss, read caret ranges from `aksk-bootstrap/references/versions.json` as the single version source, print `INSTRUCT: npm i -g @fission-ai/openspec@<range> openwiki@<range>` and `exit 2` with `Missing tools — run aksk-bootstrap first`. No global install is attempted.

2. **Scaffold `.agents/` + baseline first.** `detectState` checks filesystem trees (`.agents`, `openspec`, `openwiki`). If `.agents` is absent, create `.agents/skills` and `.agents/sessions` recursively. Then spawn `init_agents_md.mjs` unconditionally — seeding the baseline is always the first repo write so downstream attachments have a stable zoning anchor.

3. **`openspec` init.** If `openspec/` is absent, run `openspec init --tools none` in `repoRoot`. Log `openspec init ok` or the error; presence on re-run logs `openspec/ present`.

4. **`openwiki` init.** If `openwiki/` is absent, run `openwiki --init` and surface the last lines of output. The log notes the two paths explicitly: harness (agent + OpenWiki MCP/skill, no extra key) vs CLI (requires `OPENAI_API_KEY`). On non-zero status print `CLI failed: set OPENAI_API_KEY or use harness path`. Presence on re-run logs `openwiki/ present`.

5. **Routing and lifecycle.** Sequentially spawn `attach_section.mjs` for `routing-note-template.md` then `lifecycle-template.md`, both targeting `AGENTS.md`. Each prints its trailing status line.

6. **Wiki contract.** Spawn `attach_wiki_contract.mjs`. Print its trailing status line.

`detectState` is re-evaluated after the baseline step so late steps see the freshly scaffolded tree. Re-running on a fully initialized repo logs `present`/`already up to date` for every step and changes nothing.

### Optional repo-local skills

Default is inheriting global skills (`~/.agents/skills`). When invoked with `--local-skills`, the lane installs skills repo-locally via `npx skills add` without `-g` and records per-project receipts. The partitioned INSTRUCT fallback then prints only repo-scoped remaining commands and omits global-lane install commands.

### Version source

`aksk-init` does not maintain its own `references/versions.json`. Diagnostic `INSTRUCT` lines read `@fission-ai/openspec` and `openwiki` caret ranges from `aksk-bootstrap/references/versions.json`; unsynced fallback is `@latest`. This invariant is enforced by `docs-lint` drift guards.

## AGENTS.md baseline — `init_agents_md.mjs`

Deterministic seeding of the root `AGENTS.md` from the vendored FerroxLabs baseline. The template at `references/agents-md-baseline-template.md` is the offline source of truth — wrapped in `<!-- AKSK:AGENTS-BASELINE:BEGIN -->` / `<!-- AKSK:AGENTS-BASELINE:END -->` with a provenance header (source URL `https://raw.githubusercontent.com/FerroxLabs/agents-md/main/AGENTS.md`, capture date `YYYY-MM-DD`, MIT notice, refresh pointer to `refresh_agents_baseline.mjs`). Markers are read from the template at runtime via `markersOf()`, never hard-coded.

Behavior contract:

- **Missing file.** With no flag, write the template verbatim to `AGENTS.md` including markers and header, `exit 0`. `--replace`/`--combine` require an existing file and `exit 2` when it is absent.
- **Existing file with matching block.** When `AGENTS.md` already contains the `AKSK:AGENTS-BASELINE` pair and the block equals the template after trailing-whitespace-per-line and newline-at-EOF normalization, no-op `exit 0`.
- **Existing non-matching file, no flag.** Fail-closed `exit 2`, no writes, printing `Replace AGENTS.md with the FerroxLabs baseline, or combine both using the LLM?` plus the two remediation flags. This mirrors the `attach_wiki_contract` fail-fast-with-remediation convention.
- **`--replace`.** Overwrite `AGENTS.md` with the marked baseline. Caller must then re-run OpenWiki attachment and `attach_section.mjs` to restore the other zones.
- **`--combine`.** Never mutates the original. Creates a timestamped staging directory `.agents/sessions/agents-md-combine/<ISO-timestamp>/` containing `existing.md` (current file), `baseline.md` (vendored block), and `COMBINE.md` (merge brief with rules: preserve project-specific learnings and sections 10/11, prefer baseline structure for 0–9, keep all `AKSK:*` and `OPENWIKI:*` markers verbatim, final order baseline → OpenWiki → AKSK, show diff before writing).
- **Directory collision.** If `AGENTS.md` resolves to a directory, `exit 2` with `expected a file`.

Zoned layout after a full bootstrap (each zone has a single writer, ordered upstream-first — see [AGENTS.md Zoning](../concepts/agents-md-zoning.md)):

| Zone | Markers | Owner |
| --- | --- | --- |
| FerroxLabs behavioral baseline | `AKSK:AGENTS-BASELINE:BEGIN/END` | `init_agents_md.mjs` / `refresh_agents_baseline.mjs` |
| OpenWiki block | `OPENWIKI:START/END` | OpenWiki tooling |
| AKSK routing | `AKSK:ROUTING:BEGIN/END` | `attach_section.mjs` + `routing-note-template.md` |
| AKSK lifecycle | `AKSK:LIFECYCLE:BEGIN/END` | `attach_section.mjs` + `lifecycle-template.md` |

The vendored template contains only the baseline block; other zones are byte-identical by construction.

### Baseline refresh

`refresh_agents_baseline.mjs` (canonical under `aksk-bootstrap`, mirrored for `aksk-init`) fetches upstream via `curl -fsSL` to temp, validates non-empty and that anchors `Non-negotiables`, `Before writing code`, `Surgical changes`, `Goal-driven execution` are present, then swaps only content between `AKSK:AGENTS-BASELINE` markers in the vendored template and bumps the capture date. On offline or validation failure it exits non-zero with remediation and leaves the previous template byte-identical. Repo `AGENTS.md` files are never touched — re-run `init_agents_md.mjs` to propagate.

## Wiki contract — `attach_wiki_contract.mjs`

Owns the `AKSK:WIKI-CONTRACT` section in `openwiki/INSTRUCTIONS.md` and nothing else — the original precondition provider now factored out of `aksk-bootstrap`.

- Appends the section from `references/wiki-contract-template.md` between `<!-- AKSK:WIKI-CONTRACT:BEGIN -->` / `<!-- AKSK:WIKI-CONTRACT:END -->` to an **existing** `openwiki/INSTRUCTIONS.md`. Existing content outside the markers is never replaced or removed; the new section is appended below it (`\n`-terminated base plus `\n` separator).
- Idempotent and self-updating: re-running when `match[0].trim() === section.trim()` is a no-op; when the template changed, only the marked slice is refreshed in place via regex swap (`s` flag, content between markers inclusive).
- Fail-fast: if `openwiki/INSTRUCTIONS.md` is missing, `exit 2` naming the missing precondition and printing the verbatim prerequisite `openwiki --init` with no writes.
- Stub-aware: when the file is exactly OpenWiki's default stub (`A code wiki for this repository.`) the attachment is reported as `below OpenWiki's default stub`; downstream skills treat a file without `AKSK:WIKI-CONTRACT` markers as no-contract.
- Markers are constants in the script, not derived from the template (unlike `attach_section`).

## Managed-section attachment — `attach_section.mjs`

One mechanism for N marker-delimited sections in root router files (today `AGENTS.md`, `CLAUDE.md` etc. when targeted explicitly).

| Template | Markers | Content |
| --- | --- | --- |
| `routing-note-template.md` (default) | `AKSK:ROUTING` | Thin discovery pointers into `.agents/` and `openwiki/` |
| `lifecycle-template.md` | `AKSK:LIFECYCLE` | Self-improvement loop mandate (closeout → distill → prune) |

Behavior contract (all templates):

- Markers are read from the template at runtime via `markersOf()` — not hard-coded — so adding a template automatically defines its marker pair. Mismatched `BEGIN`/`END` names or missing markers `exit 2`.
- Existing content outside the markers is never replaced or removed; sections attach below it with normalized trailing newline handling.
- Idempotent and self-updating: same `trim()` compare then regex refresh as the wiki contract; updated block replaces exactly the matched slice.
- Missing target file is created containing only the attached section — root router files have no upstream initializer, so this script is their owner of record.
- Unknown template name (no file under `references/`) `exit 2`.
- Directory target `exit 2`.

New managed sections extend by adding a template under `references/` carrying a unique `<!-- AKSK:<NAME>:BEGIN -->` / `<!-- AKSK:<NAME>:END -->` pair and invoking `attach_section.mjs <root> <target> <template>`; `docs-lint` wiring checks are extended alongside.

## State, lifecycle, and invariants

- **First-write ordering.** `.agents/` + baseline always precedes `openspec`/`openwiki` initialization, which always precedes marker attachments. This prevents attachments from racing with `openwiki --init` stub generation and guarantees the baseline zone exists for downstream `docs-lint` structure checks.
- **Re-entrancy.** All four scripts are safe to re-run in any order: matching content is a no-op, drifted content is refreshed in place, absent content is appended. The orchestrator's `detectState` makes the whole lane convergent after partial failure.
- **Zone ownership.** One writer per marker family. No script touches markers it does not own. Cross-family ordering is enforced by orchestrator call order and documented in [AGENTS.md Zoning](../concepts/agents-md-zoning.md).
- **Single version source.** Caret pins live only in `aksk-bootstrap/references/versions.json`. `aksk-init` reads that file for diagnostics; drift is a lint error.
- **No half-state on peer-tool failure.** When a step fails, only its own writes (if any) remain; prior completed steps stay committed, later steps are still attempted unless preflight already exited. The INSTRUCT lane reports the exact remaining shell commands.

## Failure semantics

| Condition | Exit | Behavior |
| --- | --- | --- |
| `Node <22` | 2 | `Node <major> < 22`, no writes. |
| `openspec` or `openwiki` not on PATH | 2 | `Missing tools — run aksk-bootstrap first.` + `INSTRUCT: npm i -g ...` with caret ranges; no global install attempt, no repo writes beyond what already happened. |
| `AGENTS.md` is a directory | 2 | `is a directory, expected a file`, no writes. |
| `AGENTS.md` exists, non-matching, no flag | 2 | Prompt naming `--replace` and `--combine` with full re-run commands; no writes. |
| `--replace` + `--combine` together | 2 | `mutually exclusive`, no writes. |
| `openwiki/INSTRUCTIONS.md` missing (contract) | 2 | Names missing file, prints `` `openwiki --init` ``, no writes. |
| Unknown `attach_section` template | 2 | `unknown template '<name>' (no <path>)`, no writes. |
| Template missing its marker pair / mismatch | 2 | `template has no AKSK:* marker pair` or `marker mismatch`, no writes. |
| `openwiki --init` non-zero | — | Logged as `CLI failed: set OPENAI_API_KEY or use harness path`; orchestrator continues to marker attachments so contract attachment can still report its own precondition. |

## Configuration and operations

There is no runtime config file for `aksk-init`. Inputs are positional `repo-root` and optional flags:

- `repo-root` — positional, defaults to `process.cwd()`, resolved to absolute. All filesystem joins use it.
- `--yes` / `--non-interactive` / `AKSK_YES=1` — consumed by the skill layer to suppress `[Y/n/skip]` prompts; the script itself stays non-interactive and never reads `stdin`.
- `--local-skills` — opt-in repo-local skill install (no `-g`). Default inherits global store.

Operational checks:

```bash
node .agents/skills/aksk-init/scripts/init_agents_md.mjs          # seed / no-op
node .agents/skills/aksk-init/scripts/init_agents_md.mjs --replace # overwrite baseline
node .agents/skills/aksk-init/scripts/init_agents_md.mjs --combine # stage LLM merge bundle
node .agents/skills/aksk-init/scripts/attach_section.mjs . AGENTS.md routing-note-template.md
node .agents/skills/aksk-init/scripts/attach_section.mjs . AGENTS.md lifecycle-template.md
node .agents/skills/aksk-init/scripts/attach_wiki_contract.mjs .
node .agents/skills/aksk-init/scripts/bootstrap-repo.mjs . --yes
```

`docs-lint` validates that each `AGENTS.md` carries exactly one block per family in the prescribed order and that `openwiki/INSTRUCTIONS.md` carries `AKSK:WIKI-CONTRACT` when the wiki tree exists.

## Relationships

- **Upstream — `aksk-bootstrap`:** owns `check_peer_tools.mjs`, `refresh_agents_baseline.mjs` (canonical), `sync_wiki_indexes.mjs`, and `references/versions.json`. `aksk-init` delegates peer verification semantics to it and reads its version pins. See [aksk-bootstrap Skill](../skills/aksk-bootstrap.md).
- **Downstream — `openspec` / `openwiki`:** per-repo trees `openspec/` and `openwiki/` initialized by their respective CLIs. `aksk-init` only invokes `openspec init --tools none` and `openwiki --init` when those directories are absent.
- **Peers — `learning-distill`, `docs-lint`, `task-closeout`:** reuse the `AKSK:WIKI-CONTRACT` and `AKSK:ROUTING/LIFECYCLE` invariants installed by `aksk-init` — distill checks contract markers before writing curated pages, lint checks marker presence and ordering.
- **Knowledge layer:** the wiki contract section declares the curated page trees (`decisions/`, `troubleshooting/`, `overview.md`, `maintenance-format.md`) and rules (preserve-and-link, `aksk_` frontmatter survival, distill bypass) described in [Knowledge Curation Contract](../concepts/knowledge-curation-contract.md).
- **Spec authority:** `openspec/specs/aksk-init/spec.md` (graduated from `split-bootstrap-init`) is the requirement set; the shim at `aksk-bootstrap/scripts/bootstrap.mjs` sequencing `bootstrap-global.mjs` then `bootstrap-repo.mjs` is the compatibility surface documented in [Architecture Overview](../architecture/overview.md) and [Distribution and Agent Spread](../integrations/distribution-and-agent-spread.md).
