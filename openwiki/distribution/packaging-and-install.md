---
type: distribution
title: Packaging and Install Lanes
description: Supported install lanes after reorder — preferred agent-assisted via aksk-bootstrap (npx skills add -g -a self-reported then bootstrap.mjs EXECUTE/INSTRUCT) and manual fallback via npx skills add; bootstrap templates are source of truth, example and generate-example removed.
tags: [packaging, installation, bootstrap, skills, distribution]
verified:
  - by: openwiki/0.4.3
    at: 2026-08-29T20:18:58.499Z
sources:
  - id: openwiki-source-c056a1ca61c0634d11844713
    resource: repo://.agents/skills/aksk-bootstrap/references/versions.json
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
  - id: openwiki-source-dc8872a5e7d386c22ea2f135
    resource: repo://.agents/skills/aksk-bootstrap/SKILL.md
  - id: openwiki-source-d8d723e96d55a86c0b91977c
    resource: repo://.claude-plugin/plugin.json
  - id: openwiki-source-096a781fb160ef979fa31121
    resource: repo://INSTALL.md
  - id: openwiki-source-7ba4f01e3797f49e37ef0adc
    resource: repo://openspec/changes/canonical-universal-install/design.md
  - id: openwiki-source-90838e50b13f4d86fb3f6a42
    resource: repo://openspec/changes/canonical-universal-install/specs/agent-integration-spread/spec.md
  - id: openwiki-source-0311402371adf5cfcd658a84
    resource: repo://openspec/changes/canonical-universal-install/specs/aksk-bootstrap/spec.md
  - id: openwiki-source-7c39b0010ecc4bc50c9c670f
    resource: repo://openspec/changes/canonical-universal-install/specs/canonical-user-skills-scope/spec.md
  - id: openwiki-source-c16c0a8de8d2a3a0385db0af
    resource: repo://openspec/specs/install-lanes/spec.md
  - id: openwiki-source-5b54a58d1b51cd490b0e7162
    resource: repo://package.json
  - id: openwiki-source-23775c3de52f3ab95a13cb8b
    resource: repo://README.md
  - id: openwiki-source-2361cff43709905e22758cbb
    resource: repo://scripts/check-agents-structure.sh
  - id: openwiki-source-5d609834bdc11b93524d04a9
    resource: repo://scripts/check-publish.sh
generated: { by: "openwiki/0.4.3", at: "2026-08-29T20:18:58.499Z" }
---

# Packaging and Install Lanes

The kit ships content (markdown layout and conventions) rather than a runtime library. After `reorder-install-lanes-drop-example` and `canonical-universal-install` the only supported adoption paths are two `aksk-bootstrap`-owned lanes that both end in the same per-repo scaffold. `example/.agents` and the maintainer-only `generate-example` skill are removed, `git clone --depth 1 && cp -r` fallback is removed, and skill initialization copies **from** `bootstrap/` without deleting or renaming it.

## What the package is

Root `package.json` declares `agent-knowledge-starter` v2.0.0 — "A shareable, tool-agnostic starter kit for maintaining a compiled repo knowledge layer for coding agents."

- `devDependencies`: `skills` (Skills CLI), `remark-cli` + `remark-frontmatter`/`remark-gfm`, `markdown-link-check`, plus pinned peer-tool dev deps `@fission-ai/openspec@^1.11.0` and `openwiki@^0.4.3` — version source for the global lane via `references/versions.json`.
- `scripts`: `test` (intentionally errors — no test suite), `format` (`remark` over `.agents/**/*.md`), `check` (`bash scripts/check-publish.sh` which delegates to `scripts/check-agents-structure.sh`).
- `dependencies`: empty — peer tools are never declared as runtime deps or installed via `node_modules`; they are per-user globals verified before use.

Distributable surface is `.agents/` — four portable skills (`aksk-bootstrap`, `task-closeout`, `learning-distill`, `docs-lint`) plus shared `bootstrap/` templates, `assets/`, playbooks, and scripts. Curated wiki trees under `openwiki/` are this repository's own knowledge base (initialized with `openwiki --init`), not a distributable template. Maintainer-only material (session history) must never be copied into published artifacts.

```mermaid
flowchart LR
  PKG[package.json v2.0.0] --> DIST[.agents/skills/*\nbootstrap/ templates]
  PKG --> PLUGIN[.claude-plugin/plugin.json]
  DIST --> CLI[npx skills add -g -a self-reported]
  CLI --> USER[~/.agents/skills\n+ host mirror]
  USER --> BOOT[bootstrap.mjs\nEXECUTE / INSTRUCT]
  BOOT --> REPO[.agents/ scaffold\nopenspec/ & openwiki/\nAGENTS.md zones]
```

## Peer-dependency prerequisites (fail-fast, never install silently)

The kit is glue over two peer tools it never installs implicitly except through the deterministic global lane of `bootstrap.mjs`:

- **Node >= 22** (`MIN_NODE_MAJOR = 22`)
- `npm i -g @fission-ai/openspec@^1.11.0 openwiki@^0.4.3` — caret ranges read from `references/versions.json` via `versionsFromPackageJson()` (repo `package.json` override checked first, then bundled fallback), `@latest` only when unpinned; per-user global (`npm i -g`), not repo-local `npx` or `node_modules`.

`aksk-bootstrap` owns verification (`check_peer_tools.mjs`): `requireBinaries(["openspec","openwiki"])` checks PATH resolution only, prints one error per missing tool plus the exact `npm i -g` commands, and exits 2. Unknown tool names also exit 2 naming the unknown tool. Other skills import rather than reimplement. `bootstrap.mjs` re-verifies `openwiki` resolves before MCP registration and prints `INSTRUCT lane — run these commands manually` without partial state from the failed step.

## Registration surfaces

| Surface | File / command | Content |
| --- | --- | --- |
| Skills CLI (canonical) | `npx skills add -g -a <self-reported> Hypercubed/Agent-Knowledge-Starter-Kit` | installs to `~/.agents/skills/<name>/SKILL.md` plus current host's dir (`~/.<host>/skills`); `--full-depth` when source is `langchain-ai/openwiki` |
| Skills CLI override A (repo-local) | `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit` (without `-g`) | writes `./.agents/skills/` — documented override, not default |
| Claude Code plugin | `.claude-plugin/plugin.json` v2.0.0 | registers exactly four paths: `task-closeout`, `learning-distill`, `docs-lint`, `aksk-bootstrap`; remote without ref fetches `main`, use `@develop` until merged |
| Local receipts (gitignored) | `.openwiki-install.json` and `openwiki integrations list` | ownership partition for `openwiki integrations install`; `list` without `--project` is user scope, `--project` is repo override |

The Skills CLI flag `--all` fans out to every known agent directory (56 mirrors in `verify-install`); use it only when the user explicitly asked at install time.

## Canonical user store

`~/.agents/skills` (universal, Codex default) is the canonical store for every skill. The default shape is atomic:

```
npx skills add -g -a <self-reported> <source>
```

- `universal` = `~/.agents/skills` (Codex reads it natively; `~/.codex/skills/openwiki` does not exist as a separate store — `integrations list` without `--project` shows `codex installed` globally via the universal path).
- `<self-reported>` = calling agent's own host id. Self-report wins over env sniffing (`CODEX_HOME` vs `CLAUDE_CONFIG_DIR` is brittle). Spoofing is the agent's fault.
- Applies to both the kit and `langchain-ai/openwiki` (`--full-depth` yields three skills: `openwiki`, `mermaid-diagrams`, `write-connector`; lifecycle skill + MCP must both be made available).
- Extra hosts (`-a <other>` or `--all`) only when the user explicitly asked at install time; no persistent consent artifact — choice is recorded only at install time.
- `npx` is required — the `git clone --depth 1 && cp -r .agents/skills` lane was removed. When `npx` is missing, bootstrap reports it as prerequisite and prints the INSTRUCT commands without fallback copy.

Versions for skill installs also read `references/versions.json` via `versionsFromPackageJson()` (same path the global `npm i -g` lane uses), keeping `~/.agents/skills` and `./.agents/skills` in sync without hardcoding `@latest`. `verify-install` asserts `~/.agents/skills/<name>/SKILL.md` plus the self-reported host mirror as canonical; repo-local `./.agents/skills` is treated as an override case.

## Two supported lanes

### Lane 1 — Agent-assisted via aksk-bootstrap (preferred)

Give your agent this prompt (or local checkout variant):

```text
Install the Agent Knowledge Starter Kit into this repo:

1. npx skills add -g -a <self-reported> Hypercubed/Agent-Knowledge-Starter-Kit --skill aksk-bootstrap
   (or npx skills add -g -a <self-reported> <path-to-kit> --skill aksk-bootstrap)
2. Run the aksk-bootstrap skill.
```

What the skill does via `node .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs [repo-root] [--force] [--json]`:

**EXECUTE lane** — run locally (two idempotent verbs by detection):

1. **Verify CLIs** — Node >=22, `openspec`/`openwiki` on PATH. If missing and `npm` is on PATH, `npm i -g` with caret from `references/versions.json` (single combined install when both missing, else per-tool); skip when present. Verify `openwiki` resolves before MCP spread; if `npm` missing, print INSTRUCT and exit clean.
2. **Verify skills** — ensure `~/.agents/skills/<name>/SKILL.md` plus host dir; if missing `npx skills add -g -a <self-reported> <source>` (kit and `langchain-ai/openwiki` when needed, `@latest` only when unpinned). For openwiki, prefer `openwiki integrations install <self-reported>` when that host is in `codex|claude|opencode` (skill+MCP+receipt atomically), otherwise `openwiki mcp --host <self-reported>` or `npx --yes add-mcp -g -a <self-reported>` chooser as backup. Then per-repo: `openspec init --tools none` when `openspec/` missing, minimal `.agents/` scaffold from finalized kit templates when `.agents/` missing/incomplete, curation-contract attachment, `AGENTS.md` baseline seed, and routing/lifecycle attachment. **Never half-install**: failed step leaves no partial state from that step and prints exact remaining commands.

**INSTRUCT lane** — no local execution bridge (no `npm`, no write, sandboxed worker):

The script prints the exact remaining commands and exits clean; the skill surfaces them verbatim:

```
INSTRUCT lane — run these commands manually (versions from references/versions.json, caret-pinned):
  npm i -g @fission-ai/openspec@^1.11.0 openwiki@^0.4.3
  openspec init --tools none
  node .agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
  node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs AGENTS.md routing-note-template.md
  openwiki integrations install codex
```

Completed steps remain; only the failed step's partial state is withheld.

```mermaid
sequenceDiagram
  participant Agent
  participant CLI as npx skills add
  participant Boot as bootstrap.mjs
  participant Repo as target repo
  Agent->>CLI: npx skills add -g -a self-reported kit --skill aksk-bootstrap
  CLI->>Repo: ~/.agents/skills/aksk-bootstrap/SKILL.md + host mirror
  Agent->>Boot: node bootstrap.mjs [repo-root]
  Boot->>Boot: detectState() — tools, .agents/openspec/openwiki, markers, receipts
  alt Node <22
    Boot-->>Agent: error + no writes (exit 2)
  else missing openspec/openwiki
    Boot->>Boot: npm i -g caret (skip if present) else INSTRUCT
  end
  Boot->>Repo: openspec init --tools none (if missing)
  Boot->>Repo: scaffold .agents/ (if missing)
  Boot->>Repo: attach_wiki_contract.mjs (append-only)
  Boot->>Repo: init_agents_md.mjs → baseline zone
  Boot->>Repo: attach_section.mjs → routing + lifecycle zones
  Boot->>Repo: openwiki integrations install host (or npx + add-mcp fallback)
  Boot-->>Agent: Bootstrap complete — idempotent re-run is no-op
  Note over Boot,Agent: Failure at any step prints INSTRUCT and exits clean — no half-install
```

Re-running on a fully bootstrapped fixture changes nothing; on a partially bootstrapped fixture it completes only missing steps (detection-driven).

### Lane 2 — Manual fallback via npx skills add

For humans without an agent (or when the agent hit INSTRUCT):

```bash
npx skills add -g -a <self-reported> Hypercubed/Agent-Knowledge-Starter-Kit
# or: npx skills add -g -a <self-reported> <path-to-kit> --skill aksk-bootstrap
# override A (repo-local): omit -g
# extra hosts only with explicit consent: -a <other> / --all
```

Then run the `aksk-bootstrap` skill (or directly `node .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs`). Skill **definitions** may live in user/global locations, but initialization output and ongoing artifacts (`sessions/`, durable docs, `AGENTS.md` updates) belong under the target repo's `.agents/`. Register `SKILL.md` paths in the editor/product if it ignores the repo working directory.

There is no `cp example/.agents` path — `example/` and its `generate-example` skill/playbook were removed. Bootstrap templates are the source of truth.

## Skill initialization contract (bootstrap templates as source of truth)

Every shipped skill that has a `bootstrap/` subdirectory treats it as the template source:

- **Copy-missing-only** — agents use `cp` to copy missing directories and template files from `bootstrap/` rather than generating them from scratch. Existing repo-specific content is never overwritten.
- **Preserve the directory** — do **not** delete or rename `bootstrap/` after initialization or ever. Idempotent re-runs, peer skills, and scripts expect paths under the original `bootstrap/` name. Some skills also ship runtime templates under `assets/`.
- **Idempotent and self-updating** — re-running initialization is a no-op when current; when the template changed, only the marked section is refreshed.

Suggested order when installing multiple skills: `task-closeout` init creates `.agents/sessions/` only; `learning-distill` init additionally scaffolds `playbooks/`, template `.agents/AGENTS.md` when missing, session ignore rules, and wiki prerequisites (peer-tool check plus contract attachment); `docs-lint` owns no bootstrap templates and needs no separate init. When in doubt, run `learning-distill` init once, then proceed — other inits remain safe no-ops or small merges.

## Per-repo wiring (what bootstrap guarantees)

Executed in this zoned order after the global lane:

```
1. Global lane (user scope): npm i -g @fission-ai/openspec@^1.11.0 openwiki@^0.4.3 via versionsFromPackageJson()
2. init_agents_md.mjs → AGENTS.md baseline zone (AKSK:AGENTS-BASELINE)
3. OpenWiki block (OPENWIKI:START/END) via openwiki tooling — left intact
4. attach_section.mjs → AKSK:ROUTING + AKSK:LIFECYCLE below
```

| Zone | Markers | Owner |
| --- | --- | --- |
| FerroxLabs behavioral baseline | `<!-- AKSK:AGENTS-BASELINE:BEGIN/END -->` | `init_agents_md.mjs` / `refresh_agents_baseline.mjs` |
| OpenWiki block | `<!-- OPENWIKI:START/END -->` | OpenWiki tooling |
| AKSK routing | `<!-- AKSK:ROUTING:BEGIN/END -->` | `attach_section.mjs` (`routing-note-template.md`) |
| AKSK lifecycle | `<!-- AKSK:LIFECYCLE:BEGIN/END -->` | `attach_section.mjs` (`lifecycle-template.md`) |

### Wiki contract

```bash
node .agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs [repo-root]
```

Appends the section from `references/wiki-contract-template.md` between `<!-- AKSK:WIKI-CONTRACT:BEGIN/END -->` to an **existing** `openwiki/INSTRUCTIONS.md`. Never creates the file, replaces content, or removes OpenWiki-owned sections. Idempotent/self-updating; fail-fast with `openwiki --init` when the file is missing (exit 2, no writes). Attaching below OpenWiki's default stub (`A code wiki for this repository.`) is reported as such; downstream skills treat a file without AKSK markers as no-contract.

### Managed-section attachment

```bash
node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs [repo-root] [target-file] [template-name]
```

One mechanism for N marker-delimited sections — markers are read from the template, not hard-coded. Missing target file is created containing only the attached section (root router files have no upstream initializer, so this script is their owner of record). Existing content outside markers is never replaced or removed; re-running refreshes only the marked section when outdated. Unknown template name exits 2. The `.agents/AGENTS.md` template is owned by the scaffold, not this script; this script owns only the root `AGENTS.md` zones.

### AGENTS.md baseline

```bash
node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs [repo-root]          # seed when missing → exit 0
node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs [repo-root] --replace # overwrite with baseline
node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs [repo-root] --combine # stage for LLM merge
```

- Missing `AGENTS.md` → creates it with vendored baseline wrapped in `AKSK:AGENTS-BASELINE` markers including provenance header (source `https://raw.githubusercontent.com/FerroxLabs/agents-md/main/AGENTS.md`, capture date, MIT notice, refresh pointer). No network access; comparison is trailing-whitespace/newline-at-EOF normalized.
- Existing matching block → no-op.
- Existing non-matching with no flag → exit 2, no writes, prints `Replace ... or combine ...?` plus the two flags (mirrors fail-fast-with-remediation convention).
- `--replace` → overwrites with marked baseline; follow with OpenWiki attach + `attach_section.mjs` to restore other zones.
- `--combine` → never modifies original; stages `existing.md`, `baseline.md`, `COMBINE.md` brief under `.agents/sessions/agents-md-combine/<timestamp>/` for LLM merge.

Refresh is explicit and networked:

```bash
node .agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs        # fetch upstream + swap baseline zone
node .agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs --check # validate upstream without writing
```

Validates fetch is non-empty and contains anchors (`Non-negotiables`, `Before writing code`, `Surgical changes`, `Goal-driven execution`), then swaps only content between `AKSK:AGENTS-BASELINE` markers in the vendored template, updating capture date. Offline/failure exits non-zero; previously vendored baseline stays byte-identical.

### Peer-tool verification (standalone)

```bash
node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki
```

Or `import { requireBinaries } from "./check_peer_tools.mjs"`. Only `openspec`/`openwiki` are accepted.

## Integration spread (lane ladder)

Bootstrap selects one lane per host that should receive an integration, verified via `openwiki integrations list` (user scope) vs `list --project` (repo override):

- **Supported host** (`codex|claude|opencode` in v0.4.3 registry) → `openwiki integrations install <host>` — skill + `openwiki mcp --host <target>` installed atomically with `.openwiki-install.json` receipt. Receipt partitions ownership; already-installed is skipped, modified requires `--force` (backup created).
- **Unsupported host** → `npx skills add -g -a <self-reported> langchain-ai/openwiki --full-depth` for the lifecycle skill plus `npx --yes add-mcp -g -a <self-reported> openwiki` (neon-solutions/add-mcp) or `openwiki mcp --host <target>` for the MCP.
- Default is universal + current; extra hosts only on explicit install-time request.
- Headless lane (no supported integration) remains `openwiki --init -p` / `openwiki --update -p`.

## Before editing / new install checklist

1. Inspect target `.agents/`, root `AGENTS.md` if present, `.gitignore` and `.agents/.gitignore` if present, and `git status --short` — preserve unrelated user changes.
2. Install via preferred lane; preserve each skill folder layout including any `bootstrap/` subtree.
3. Open each installed `SKILL.md` and run its **Skill initialization** once (copy-missing-only).
4. Keep `.agents/.gitignore` tracked (`sessions/*`, `!sessions/README.md`) or replicate at repo root; add equivalent ignore only if the repo intentionally does not track `.agents/.gitignore`.
5. Edit `.agents/AGENTS.md` with real build/test conventions; record durable rationale as curated pages under `openwiki/decisions/` then run `node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs` so they are discoverable.
6. Attach the AKSK routing note to the root instruction file with `attach_section.mjs` so agents discover the knowledge layer.
7. Register `SKILL.md` paths in the editor/product as needed.

## Existing .agents/ merge checklist

Never replace wholesale unless confirmed disposable. Preserve repo-specific `rules/`, `playbooks/`, `skills/` first; add missing kit skills with `npx skills add -g -a <self-reported>` and run initializations; hand-merge `.agents/AGENTS.md` keeping it concise; prefer kit-default ignore patterns; update `openwiki/index.md` discovery via index sync so preserved assets stay discoverable.

## Root vs portable AGENTS relationship

When both exist: root `AGENTS.md` = agent entrypoint for that checkout (zoned: baseline → OpenWiki → AKSK); `.agents/AGENTS.md` = portable knowledge-layer file for durable repo conventions, commands, constraints, and recurring pitfalls. One source of truth per instruction; root points into `.agents/`.

## Validation before finishing

1. `bash scripts/check-agents-structure.sh .agents` — validates required files and that only `sessions/README.md` is tracked under `sessions/`.
2. `bash scripts/check-publish.sh` — structure plus remark/markdown-link checks plus leakage/doubled-path scans; no `example/`-specific bypass required.
3. Confirm existing repo-specific files were preserved and `sessions/` bundles are ignored.
4. Run `node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs` so preserved assets are indexed.
5. Summarize changed files plus any manual product-specific registration steps still required.

## What was removed

| Removed | Replacement |
| --- | --- |
| `example/.agents/` copy path and `cp example/.agents` instructions | Two lanes above; bootstrap templates are source of truth — no `example/` directory as install method |
| `.agents/skills/generate-example/` and `.agents/playbooks/generate-example.md` (maintainer-only) | `scripts/check-agents-structure.sh` validates only `.agents` |
| `git clone --depth 1 && cp -r .agents/skills` fallback | `npx` required; INSTRUCT lane prints prerequisite |

Documentation, playbooks, and shell scripts no longer reference `example/` as an install path or validation target. Any residual `example/` on disk is excluded from validation.

## Relationships

- **Owns**: peer-tool preconditions (`check_peer_tools.mjs`), curation-contract attachment (`attach_wiki_contract.mjs`), `AGENTS.md` zoned attachment (`attach_section.mjs` + `init_agents_md.mjs`), and the EXECUTE/INSTRUCT orchestrator (`bootstrap.mjs`) consumed by `learning-distill`, `docs-lint`, `task-closeout`.
- **Uses**: `references/versions.json` (single version source for `npm i -g` and `npx skills add`), `references/*-template.md` (all markers read from template, never hard-coded), `openwiki integrations` receipts for spread verification, `sync_wiki_indexes.mjs` for discovery after merges.
- **Specced in**: `install-lanes`, `canonical-user-skills-scope`, `aksk-bootstrap` (two verbs + global/per-repo lanes), `agent-integration-spread` (registry vs `add-mcp` ladder).
