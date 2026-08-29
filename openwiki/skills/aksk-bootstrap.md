---
type: skill-reference
title: aksk-bootstrap Skill
description: Idempotent bootstrap orchestrator that verifies CLIs and skills to the canonical ~/.agents/skills plus self-reported host via npx skills add -g -a, chooses openwiki integrations install vs add-mcp, and attaches marker-delimited contract/routing/baseline blocks.
tags:
- skills
- aksk-bootstrap
- bootstrap
- preconditions
- wiki-contract
- peer-tools
- universal-store
verified:
  - by: openwiki/0.4.3
    at: 2026-08-29T20:18:58.499Z
sources:
  - id: openwiki-source-da03faceacac4fd818b473f3
    resource: repo://.agents/skills/aksk-bootstrap/references/lifecycle-template.md
  - id: openwiki-source-0294ec7c02cfa2beeca87331
    resource: repo://.agents/skills/aksk-bootstrap/references/routing-note-template.md
  - id: openwiki-source-c056a1ca61c0634d11844713
    resource: repo://.agents/skills/aksk-bootstrap/references/versions.json
  - id: openwiki-source-7381bbb8d2e7fd02da7469ce
    resource: repo://.agents/skills/aksk-bootstrap/references/wiki-contract-template.md
  - id: openwiki-source-5398a69cb2cf8d556809da57
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_section.mjs
  - id: openwiki-source-d56b5afb22742020f2ab6b59
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-5ffa21d5a23117c638ca72b7
    resource: repo://.agents/skills/aksk-bootstrap/scripts/bootstrap.mjs
  - id: openwiki-source-d1960e41bf9a48af26e81829
    resource: repo://.agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs
  - id: openwiki-source-181fd64540d760eef80f754f
    resource: repo://.agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs
  - id: openwiki-source-67d81b3c5bf101f8b3eb3d2a
    resource: repo://.agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs
  - id: openwiki-source-dce50581779fda5dd507dc34
    resource: repo://.agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
  - id: openwiki-source-dc8872a5e7d386c22ea2f135
    resource: repo://.agents/skills/aksk-bootstrap/SKILL.md
  - id: openwiki-source-5af7f373fcb21f142106673c
    resource: repo://.agents/skills/docs-lint/SKILL.md
  - id: openwiki-source-7fe0106a3a83528f5b3d3755
    resource: repo://.agents/skills/learning-distill/SKILL.md
  - id: openwiki-source-545e83dfac0165c5342cef38
    resource: repo://openspec/changes/canonical-universal-install/proposal.md
  - id: openwiki-source-7c39b0010ecc4bc50c9c670f
    resource: repo://openspec/changes/canonical-universal-install/specs/canonical-user-skills-scope/spec.md
  - id: openwiki-source-c23cb9e8edf20ed2740abea1
    resource: repo://openspec/specs/aksk-bootstrap/spec.md
generated: { by: "openwiki/0.4.3", at: "2026-08-29T20:18:58.499Z" }
---

# aksk-bootstrap

**Folder:** `.agents/skills/aksk-bootstrap/` · **Scripts:** `scripts/*.mjs` (Node ESM) · **Templates:** `references/*-template.md` + `references/versions.json` · **Skill:** `SKILL.md`

One idempotent entry point that takes any repo from bare to fully wired. The **skill is the orchestrator, the JS script is the deterministic executor**. Two verbs handle the whole install surface, then per-repo scaffolding and zone-isolated marker attachments finish the wiring. Other skills (`learning-distill`, `docs-lint`, `task-closeout`) reuse its preconditions instead of reimplementing PATH checks or marker merges.

> **Canonical store:** default is the user-scoped universal store `~/.agents/skills` plus the current self-reported host's directory (e.g. `~/.codex/skills`), via `npx skills add -g -a <self-reported> <source>`. Extra `-a <other>` or `--all` only on explicit user request at install time. `npx` is required — the `git clone --depth 1 && cp -r .agents/skills` fallback is removed. Repo-local `./.agents/skills` is an override, not the default.

```
.agents/skills/aksk-bootstrap/
  SKILL.md
  scripts/
    bootstrap.mjs               # orchestrator — two verbs + per-repo lane + spread
    check_peer_tools.mjs        # peer-tool PATH verification (allowlist, never installs)
    attach_wiki_contract.mjs    # AKSK:WIKI-CONTRACT → openwiki/INSTRUCTIONS.md
    attach_section.mjs          # generic AKSK:* → AGENTS.md (or any root file)
    init_agents_md.mjs          # AGENTS.md baseline seed (FerroxLabs)
    refresh_agents_baseline.mjs # refresh vendored baseline from upstream
    sync_wiki_indexes.mjs       # deterministic index rebuild without LLM/CLI
  references/
    versions.json               # caret pins for npm i -g and npx skills add lanes
    wiki-contract-template.md   # AKSK:WIKI-CONTRACT markers owned by template
    routing-note-template.md    # AKSK:ROUTING (default for attach_section)
    lifecycle-template.md       # AKSK:LIFECYCLE
    agents-md-baseline-template.md # AKSK:AGENTS-BASELINE (vendored FerroxLabs)
```

## Entrypoints

| Script | Invocation | Purpose |
| --- | --- | --- |
| `bootstrap.mjs` | `node .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs [repo-root] [--force] [--json]` | Orchestrate the two verbs (verify CLIs → verify skills) plus per-repo scaffolding and integration spread; EXECUTE or INSTRUCT |
| `check_peer_tools.mjs` | `node .../check_peer_tools.mjs openspec openwiki` · `import { requireBinaries } from "./check_peer_tools.mjs"` | Verify peer binaries on PATH; never installs |
| `attach_wiki_contract.mjs` | `node .../attach_wiki_contract.mjs [repo-root]` | Append/refresh `AKSK:WIKI-CONTRACT` in existing `openwiki/INSTRUCTIONS.md` |
| `attach_section.mjs` | `node .../attach_section.mjs [repo-root] [target-file] [template-name]` | Append/refresh one `AKSK:*` block in a root router file (defaults: `AGENTS.md`, `routing-note-template.md`) |
| `init_agents_md.mjs` | `node .../init_agents_md.mjs [repo-root] [--replace] [--combine]` | Seed `AGENTS.md` baseline zone `AKSK:AGENTS-BASELINE` |
| `refresh_agents_baseline.mjs` | `node .../refresh_agents_baseline.mjs [--check]` | Fetch upstream FerroxLabs `AGENTS.md` and swap only the baseline zone in the vendored template |
| `sync_wiki_indexes.mjs` | `node .../sync_wiki_indexes.mjs [repo-root]` | Rebuild wiki directory indexes via installed `openwiki` package helpers (no LLM, no `openwiki --update`) |

All scripts resolve `repo-root` as `path.resolve(process.argv[2] ?? process.cwd())`. Failures that block progress exit `2` with the exact remediation and without partial state from the failed step.

## Bootstrap orchestrator — two verbs

<!-- openwiki: mermaid parse failed and this diagram was converted to a text fence so it does not break rendering. Fix the diagram source and restore the mermaid fence. Parser error: Heuristic: an unescaped angle bracket inside a label breaks rendering; rephrase the label. -->
```text
flowchart TB
  Preflight{"Preflight: Node >=22?\nopenspec/openwiki on PATH?\n.agents/ openspec/ openwiki/?\nreceipts (.openwiki-install.json)?"}
  Report["Report state before acting"]
  Verb1{"Verb 1: Verify CLIs\nmissing tools?"}
  GlobalInstall["npm i -g @fission-ai/openspec@^caret openwiki@^caret\n(user scope, once per user)\nskip if already present"]
  VerifyOpenWiki{"openwiki resolves?"}
  Verb2{"Verb 2: Verify skills\n~/.agents/skills/<name>/SKILL.md + host mirror?"}
  SkillInstall["npx skills add -g -a <self-reported> <source>\n(caret from versions.json, @latest only if unpinned)\nAKSK kit + langchain-ai/openwiki --full-depth when needed"]
  PerRepo["Per-repo lane:\n openspec init → .agents/ scaffold\n → attach_wiki_contract → init_agents_md\n → attach_section ROUTING/LIFECYCLE"]
  Spread{"Integration spread\nopenwiki integrations install <self-reported>?"}
  IntegrationsInstall["openwiki integrations install <self> (atomic skill+MCP+receipt)\nwhen host in codex|claude|opencode"]
  AddMcpFallback["npx skills add -g -a <self> + npx add-mcp -g -a <self>\n(or openwiki mcp --host <self>)\nwhen host not in registry"]
  Instruct["INSTRUCT lane — print exact remaining commands\nclean exit, no partial state from failed step"]

  Preflight --> Report --> Verb1
  Verb1 -->|none missing| Verb2
  Verb1 -->|missing| GlobalInstall --> VerifyOpenWiki
  VerifyOpenWiki -->|no npm / install failed| Instruct
  VerifyOpenWiki -->|ok| Verb2
  Verb2 --> SkillInstall --> PerRepo
  PerRepo --> Spread
  Spread -->|supported host| IntegrationsInstall
  Spread -->|other host| AddMcpFallback
  Spread -.->|cannot execute locally| Instruct
```

### Preflight detection

Before any mutation `bootstrap.mjs` detects and reports: Node major version, whether `openspec` and `openwiki` resolve on `PATH` (via `PATH` split + `PATHEXT` on win32), whether `.agents/`, `openspec/`, `openwiki/` and `openwiki/INSTRUCTIONS.md` exist, whether `AKSK:WIKI-CONTRACT` / `AKSK:ROUTING` are attached, and receipts via `openwiki integrations list --project` (best-effort, never throws). On `Node < 22` it stops before installing anything and prints the upgrade hint.

### EXECUTE vs INSTRUCT lanes

- **EXECUTE** — runs locally. Steps already satisfied are skipped (detection-driven idempotency).
- **INSTRUCT** — when any step cannot run locally (no `npm`, no write, sandboxed worker, `curl` failure), the script prints the exact remaining commands verbatim and exits clean (`process.exit(0)`) without partial state from the failed step. Completed steps remain. The skill then surfaces those commands as the answer.

```
INSTRUCT lane — run these commands manually (versions from references/versions.json, caret-pinned):
  npm i -g @fission-ai/openspec@^1.11.0 openwiki@^0.4.3
  openspec init --tools none
  node .agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
  node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs . AGENTS.md routing-note-template.md
  openwiki integrations install codex
```

**Never half-installs:** failed step prints remaining commands and exits clean; no file is left half-written by that step.

### Verb 1 — Verify CLIs (global lane, user scope)

- Reads caret ranges from `references/versions.json` via `versionsFromPackageJson(repoRoot)` — consumer repo's `package.json` is checked first for local override, then the bundled `references/versions.json`. Keys `@fission-ai/openspec` and `openwiki` (e.g. `^1.11.0`, `^0.4.3`) drive `npm i -g @fission-ai/openspec@^1.11.0 openwiki@^0.4.3`; `@latest` only when unpinned.
- `npm i -g` is per-user, not repo-local `npx` or `node_modules`. Both missing → one combined install; one missing → single package install; both present → skip and report `openspec --version` / `openwiki --version`.
- If `npm` not on PATH or install fails, INSTRUCT prints `npm i -g ...` and exits `0`. After install it re-detects and verifies `openwiki` resolves before any MCP registration.

### Verb 2 — Verify skills (canonical user store)

Default shape:

```bash
npx skills add -g -a <self-reported> Hypercubed/Agent-Knowledge-Starter-Kit
npx skills add -g -a <self-reported> langchain-ai/openwiki --full-depth  # when lifecycle skill needed
```

- Presence is asserted as `~/.agents/skills/<name>/SKILL.md` plus the self-reported host's mirror (e.g. `~/.codex/skills/<name>/SKILL.md`). Repo-local `./.agents/skills` is not asserted unless the scenario explicitly tests an override.
- Skill installs use the same caret list (`references/versions.json` via `versionsFromPackageJson()`); `@latest` only when unpinned.
- `npx` is required; the old `git clone --depth 1 && cp -r .agents/skills` lane is removed. When `npx` unavailable, bootstrap reports the prerequisite via INSTRUCT and does not silently copy.
- Extra agents (`-a <other>` or `--all` / 56 mirrors) only if the user explicitly asked at install time; self-report is the second target, not an override, and spoofing is the agent's own failure.

### Per-repo lane

In `bootstrap.mjs` order after the global lane:

1. `openspec init --tools none` when `openspec/` missing (skips if present).
2. Minimal `.agents/` scaffold (`mkdir -p .agents/skills`, `.agents/sessions`, empty `.agents/AGENTS.md` when absent).
3. Curation-contract attachment via `attach_wiki_contract.mjs` (skips with `openwiki --init` hint when `openwiki/` missing; never creates `openwiki/INSTRUCTIONS.md` itself).
4. Baseline seed via `init_agents_md.mjs` (before OpenWiki/AKSK zones).
5. `attach_section.mjs` for `routing-note-template.md` then `lifecycle-template.md` into root `AGENTS.md`.

Re-running on a fully bootstrapped fixture changes nothing; on a partially bootstrapped fixture only missing steps run.

### Integration spread — ladder

Spread is receipt-partitioned via `openwiki integrations list` (reads `.openwiki-install.json`):

| Host class | Path when détected |
| --- | --- |
| `codex` `claude` `opencode` (3-host registry) | `openwiki integrations install <self-reported>` — atomic skill + MCP + receipt, ownership via `openwiki integrations list` |
| Any other of the `add-mcp` 18-host registry | `npx skills add -g -a <self-reported> langchain-ai/openwiki --full-depth` + `npx --yes add-mcp -g -a <self-reported> "openwiki"` (or `openwiki mcp --host <self-reported>`) as backup |
| Unsupported/headless | `openwiki --init -p` / `openwiki --update -p` directly |

Idempotency: `installed` → skip; `modified` → skip unless `--force` (backup created); `not-installed` → install when host applicable, otherwise report headless lane. Wide `--all` is never the default.

## Contract attachment — `attach_wiki_contract.mjs`

Appends the section from `references/wiki-contract-template.md` — markers are part of the template — between `<!-- AKSK:WIKI-CONTRACT:BEGIN -->` / `<!-- AKSK:WIKI-CONTRACT:END -->`.

- Reads `openwiki/INSTRUCTIONS.md` with `readFileSync`. If missing, prints `error: <path> not found; this repository has no initialized OpenWiki wiki. Initialize it first with \`openwiki --init\`.` and exits `2` with no writes — AKSK never creates the wiki.
- If no `MARKER_BEGIN`, appends `\n<templated section>` below existing content with normalized newline boundary. When the file is exactly the default stub `A code wiki for this repository.` the log is stub-aware; downstream skills treat a file without markers as no-contract.
- If markers present, `refresh()` with dot-all regex `BEGIN.*?END` compares `match[0].trim() === section.trim()` → no-op (`already up to date`) else splices only the marked block in place. Content outside the pair is never touched; template upgrades refresh only the marked section.

## Managed-section attachment — `attach_section.mjs`

One mechanism for N sections — template owns its markers, script reads them at runtime.

| Template | Markers | Content |
| --- | --- | --- |
| `routing-note-template.md` (default) | `AKSK:ROUTING` | Thin discovery pointers into `.agents/` and `openwiki/` |
| `lifecycle-template.md` | `AKSK:LIFECYCLE` | Self-improvement loop mandate (closeout → distill → prune) |

- `markersOf(section)` extracts `BEGIN`/`END` via `/<!--\s*(AKSK:[A-Z-]+):BEGIN\s*-->/` and normalizes `BEGIN` whitespace; missing pair exits `2`.
- Unknown template name exits `2` with `unknown template '<name>'`.
- Target `statSync`-checked: directory at path → exit `2`; missing file (or non-file stat) → **create** containing only the templated section (root router files have no upstream initializer, so this script is their owner of record for empty files).
- File contains `markBegin` → `refresh()` with escaped dot-all `BEGIN.*?END`, trimmed equality for idempotency, mismatch refreshes only the marked block. Otherwise appends `\n<section>` with normalized newline.

## AGENTS.md baseline — `init_agents_md.mjs` / `refresh_agents_baseline.mjs`

### Zoned layout (ordered upstream-first, one writer per zone)

| Zone | Markers | Owner |
| --- | --- | --- |
| FerroxLabs behavioral baseline | `AKSK:AGENTS-BASELINE:BEGIN/END` | `init_agents_md.mjs` / `refresh_agents_baseline.mjs` |
| OpenWiki block | `OPENWIKI:START/END` | OpenWiki tooling |
| AKSK routing + lifecycle | `AKSK:ROUTING`, `AKSK:LIFECYCLE` | `attach_section.mjs` |

Full idempotent order in `bootstrap.mjs`: global `npm i -g` → `init_agents_md` (baseline) → OpenWiki block → `attach_section` (ROUTE/LIFECYCLE).

### Seed initializer — `init_agents_md.mjs`

```bash
node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs [repo-root]          # seed when missing → exit 0
node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs [repo-root] --replace # overwrite with baseline
node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs [repo-root] --combine # stage for LLM merge
```

- Missing `AGENTS.md` → creates it with vendored baseline wrapped in `AKSK:AGENTS-BASELINE` markers including provenance header (source URL `https://raw.githubusercontent.com/FerroxLabs/agents-md/main/AGENTS.md`, capture date, MIT notice, refresh pointer). No network access. `--replace`/`--combine` with no existing file → exit `2`.
- Existing file with matching baseline block (trailing-whitespace / newline-at-EOF normalized via `normalize()`) → no-op, exit `0`.
- Existing non-matching file with no flag → exits `2`, no writes, prints `Replace AGENTS.md with the FerroxLabs baseline, or combine both using the LLM?` plus the two flags to encode each answer (fail-fast with remediation, mirroring the kit convention). `--replace` and `--combine` are mutually exclusive.
- `--replace` → overwrites `AGENTS.md` with the marked baseline; follow with OpenWiki attach + `attach_section` to restore other zones.
- `--combine` → never modifies the original. Stages `existing.md`, `baseline.md`, and generated `COMBINE.md` brief under `.agents/sessions/agents-md-combine/<timestamp>/` with merge rules (preserve project-specific learnings, prefer baseline structure for sections 0–9, keep every marker block verbatim, final order baseline → OpenWiki → AKSK).

Markers are read from `references/agents-md-baseline-template.md`, never hard-coded; `--help` prints usage.

### Baseline refresh — `refresh_agents_baseline.mjs`

```bash
node .agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs        # fetch upstream + swap baseline zone
node .agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs --check # validate upstream without writing
```

- Fetches upstream to temp via `curl -fsSL https://raw.githubusercontent.com/FerroxLabs/agents-md/main/AGENTS.md`, validates: non-empty, `>5k` bytes, starts with `# AGENTS.md`, contains anchors `Non-negotiables`, `Before writing code`, `Surgical changes`, `Goal-driven execution`. Any failure exits non-zero with remediation and leaves the vendored baseline byte-identical.
- On success swaps only the content between `AKSK:AGENTS-BASELINE` markers in `references/agents-md-baseline-template.md`, updating capture date `YYYY-MM-DD` and provenance header. Other zones byte-identical by design (template contains only the baseline; repo `AGENTS.md` files untouched — re-run `init_agents_md.mjs` to propagate).
- `--check` validates upstream and exits `0` without writing; normalized compare makes re-run idempotent when already up to date.

## Peer-tool verification — `check_peer_tools.mjs`

```bash
node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki
```

```js
import { requireBinaries } from "./check_peer_tools.mjs";
requireBinaries(["openspec", "openwiki"]); // exits 2 with install commands if absent
```

- **Allowlist only.** `INSTALL_COMMANDS` maps exactly two names: `openspec → npm i -g @fission-ai/openspec@latest` and `openwiki → npm i -g openwiki@latest`. `missing()` rejects any other name with `unknown peer tool(s): …` and exits `2`.
- **PATH only, never installs.** `onPath(cmd)` splits `PATH` by `path.delimiter`, checks each directory with `PATHEXT` extensions on win32, via `existsSync(path.join(d, cmd + e))`.
- **Fail-fast with remediation.** `requireBinaries(tools)` collects missing, prints one `error: required peer tool '…' is not installed or not on PATH.` per tool plus `Install the missing tools with:` plus each line, exits `2`. Zero missing → silent return; CLI entry prints `all peer tools present: …`. No args → exit `2` with usage.
- Bootstrap's global lane wraps this with caret versions from `references/versions.json` (`npm i -g @fission-ai/openspec@^1.11.0` etc.), falling back to `@latest` only if unpinned; standalone `check_peer_tools.mjs` keeps the `@latest` fallback as the informative install hint.

## Index sync — `sync_wiki_indexes.mjs`

Deterministic, offline rebuild with no LLM and no `openwiki --update`:

```bash
node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs [repo-root]
```

- Asserts `openwiki/` exists else `error: … not found; initialize the wiki first with \`openwiki --init\`.` exit `2`.
- Locates global package via `spawnSync("npm", ["root", "-g"])`; failure exits `2` with `node and npm are required but were not found`; `<npm-root>/openwiki/dist` missing exits `2` with `npm i -g openwiki@latest`.
- Dynamically imports `agent/docs-only-backend.js` (`OpenWikiLocalShellBackend`) and `okf/index-sync.js` (`synchronizeWikiIndexes`) from global `dist` via `pathToFileURL`, constructs `new OpenWikiLocalShellBackend({ rootDir, docsOnly: true, virtualMode: true, maxOutputBytes: 100_000, timeout: 120 })` and calls `synchronizeWikiIndexes(backend, "repository")`. Curated page bodies stay byte-identical; only `openwiki/index.md` and directory indexes are rebuilt. This is the only sanctioned index-refresh path for distillation (step 7) and the remediation `docs-lint` prints for index drift.

## Relationships and state

- **Precondition provider + orchestrator:** `learning-distill` and `docs-lint` delegate `PATH` and contract checks to these scripts rather than duplicating them. Bootstrap owns the full wiring so sibling skills only verify preconditions via `check_peer_tools.mjs` / `attach_wiki_contract.mjs`.
- **Single writer per zone:** closeout writes only `.agents/sessions/`; distillation writes curated wiki trees, `.agents/AGENTS.md`, and playbooks via these helpers; OpenWiki owns `OPENWIKI:START/END` and `openwiki/index.md`; baseline zone owned by `init_agents_md.mjs`.
- **State is the markers.** Presence and trimmed/normalized equality of a marked block is the idempotency signal; second run after no template change is a no-op without rewriting the file.

## Invariants and failure semantics

- **Never installs silently.** Every failure prints the verbatim command (`npm i -g …`, `npx skills add -g -a …`, `openwiki --init`) and exits without side effects from the failing step. No script spawns an installer beyond the explicit global lane or mutates `PATH`.
- **Never half-installs.** `bootstrap.mjs` prints exact remaining INSTRUCT commands and exits clean (`0`) when a step cannot run; `attach_*` scripts either fully write or not at all.
- **Append-only and idempotent.** Content outside `AKSK:*` / `AKSK:WIKI-CONTRACT` markers is never replaced. `refresh()` swaps only between the pair; normalized compare prevents trailing-whitespace churn.
- **Zone isolation.** Refreshing one template (e.g. `lifecycle-template.md`) leaves every other zone byte-identical; damaging one zone's markers is reported for that family only.
- **Only known peer tools accepted.** Unknown names exit `2`; no lookup attempted.
- **Missing-target asymmetry:** `attach_wiki_contract.mjs` never creates `openwiki/INSTRUCTIONS.md` (fail-fast); `attach_section.mjs` and `init_agents_md.mjs` do create a missing root `AGENTS.md` (owners of record). All appends normalize trailing newline.
- **Universal+current is default; extra hosts require explicit user consent.** No persistent consent artifact — choice recorded only at install invocation.

## Change recipe — adding a new managed section

1. Add a template under `.agents/skills/aksk-bootstrap/references/` carrying a unique `<!-- AKSK:<NAME>:BEGIN -->` / `<!-- AKSK:<NAME>:END -->` pair.
2. Attach with `node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs <root> <target-file> <template-name>` — `markersOf()` picks it up with no code change.
3. Extend wiring checks in `.agents/skills/docs-lint/SKILL.md` so the new block is integrity-checked like `ROUTING`/`LIFECYCLE`.
4. Validate: run attachment twice (second must log no-op), damage the block and confirm lint reports that family, then `bash scripts/check-agents-structure.sh .agents`.

## Operations and focused validation

| Probe | Command | Proves |
| --- | --- | --- |
| Peer tools present | `node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki` | Missing fails with exact `npm i -g` lines; unknown names fail naming the tool |
| Contract idempotency | `node .agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs` twice | Second `already up to date`; template change refreshes only marked block |
| Managed-section idempotency | `node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs . AGENTS.md routing-note-template.md` twice | Second no-op; each template refreshes only its own block |
| Missing target creation | `rm AGENTS.md && node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs . AGENTS.md routing-note-template.md` | File created containing only the requested section |
| Unknown template | `node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs . AGENTS.md no-such-template.md` | Exits 2 with unknown-template remediation |
| Baseline seed idempotency | `node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs` twice | Second no-op via normalized compare; existing non-matching without flag exits 2 with replace-vs-combine prompt |
| Baseline combine | `node .../init_agents_md.mjs . --combine` with existing `AGENTS.md` | Stages `existing.md` + `baseline.md` + `COMBINE.md` under `.agents/sessions/agents-md-combine/<ts>/`, original untouched |
| Baseline refresh check | `node .../refresh_agents_baseline.mjs --check` | Validates upstream anchors without writing; offline exits non-zero with remediation, template byte-identical |
| Index drift | `node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs` | Indexes rebuilt; missing `openwiki/` or global package exits 2 with init/install hint |
| Bootstrap idempotency | `node .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs` twice | Second run reports no changes; partially bootstrapped fixture completes only missing steps |
| Global lane skip | `node bootstrap.mjs` with both tools present | Skips `npm i -g`, reports versions |

Non-goals: installing peer tools silently, writing OpenWiki-owned files outside marker contracts, or scaffolding consumer repos outside the per-repo lane — all remain explicitly commanded and verifiable.
