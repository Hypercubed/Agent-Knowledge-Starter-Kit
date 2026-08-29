---
type: distribution
title: Distribution and Tool Wiring
description: How the kit ships as content, verifies Node >=22 and per-user caret-pinned openspec/openwiki globals plus openwiki --init, and wires product configs to the single .agents source of truth.
tags:
- distribution
- tool-wiring
- peer-dependencies
- skills-cli
- integrations
verified:
  - by: openwiki/0.4.3
    at: 2026-08-29T20:18:58.499Z
sources:
  - id: openwiki-source-62bd4cb693e4e881b3f88f6b
    resource: repo://.agents/.gitignore
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
  - id: openwiki-source-dce50581779fda5dd507dc34
    resource: repo://.agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
  - id: openwiki-source-dc8872a5e7d386c22ea2f135
    resource: repo://.agents/skills/aksk-bootstrap/SKILL.md
  - id: openwiki-source-115b2dad781e2a2c5b5a980d
    resource: repo://docs/architecture.md
  - id: openwiki-source-5368c3f7dc2d30e7d29a8985
    resource: repo://docs/integrations/codex.md
  - id: openwiki-source-6c612e4f72ec031c13325b86
    resource: repo://docs/integrations/cursor.md
  - id: openwiki-source-161a7ae8592c3bd90751661f
    resource: repo://docs/integrations/patterns.md
  - id: openwiki-source-d37bb090eddfcd3c233c8f14
    resource: repo://docs/integrations/README.md
  - id: openwiki-source-096a781fb160ef979fa31121
    resource: repo://INSTALL.md
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

# Distribution and Tool Wiring

The Agent Knowledge Starter Kit ships **content** (markdown layout, conventions, and portable skills) — not a runtime service. Consumers get a single portable `.agents/` tree; product-specific files are thin wiring that points into it. Two global peer tools are required; only `aksk-bootstrap` may install them per-user, every other skill fail-fasts.

## What ships

`package.json` name `agent-knowledge-starter` v2.0.0 declares no runtime `dependencies`. `devDependencies` are `skills` (the Skills CLI), `remark-cli` + frontmatter/GFM plugins, `markdown-link-check`, plus pinned `@fission-ai/openspec@^1.11.0` and `openwiki@^0.4.3`. Scripts are `format` (`remark ".agents/**/*.md" --output`) and `check` (`bash scripts/check-publish.sh`); `test` intentionally errors.

The distributable surface is root `.agents/`: four portable skills (`aksk-bootstrap`, `task-closeout`, `learning-distill`, `docs-lint`) plus shared templates and playbooks. The curated wiki trees under `openwiki/` are this repo's knowledge base; consumers initialize their own wiki with `openwiki --init`.

Registration surfaces:

| Surface | Mechanism | Notes |
| --- | --- | --- |
| Skills CLI | `npx skills add -g -a <self-reported> Hypercubed/Agent-Knowledge-Starter-Kit --skill aksk-bootstrap` | installs to `~/.agents/skills` plus host dir (`universal` is `~/.agents/skills`); skips `metadata.internal: true` folders |
| Claude Code plugin | `.claude-plugin/plugin.json` | registers the four portable skill paths |
| Local receipts | `skills-lock.json` (gitignored, untracked) | per-skill source + hash records from local `skills add` runs |

## Peer dependencies: bootstrap owns the global lane

The kit is glue over two peer CLIs plus Node:

- **Node >= 22** (`MIN_NODE_MAJOR = 22` in `bootstrap.mjs`)
- `npm i -g @fission-ai/openspec@^1.11.0 openwiki@^0.4.3` — caret ranges from `references/versions.json` (and `package.json` `devDependencies` when present), per-user `npm i -g`, not repo-local `npx` or `node_modules`
- plus one-time per-repo `openwiki --init` and `openspec init --tools none` when those trees are missing

Invariant: **only `aksk-bootstrap` may install**. `bootstrap.mjs` owns the global lane; `docs-lint`, `task-closeout`, `learning-distill` and other scripts never auto-install — they fail fast with the exact `npm i -g` command.

`.agents/skills/aksk-bootstrap/references/versions.json` is the single source for the caret versions:

```json
{
  "@fission-ai/openspec": "^1.11.0",
  "openwiki": "^0.4.3"
}
```

`bootstrap.mjs:versionsFromPackageJson()` resolves versions by trying `package.json` (`devDependencies`/`dependencies`) first to allow local override, then the bundled `references/versions.json`. `_note` documents `C` (caret) — bump via `npm install --save-dev` then copy here. When unpinned the fallback is `npm i -g @fission-ai/openspec@latest` / `npm i -g openwiki@latest`. `INSTALL.md` and `README.md` state the prerequisite; `docs/architecture.md` enforces it.

Flow:

```text
flowchart LR
    A["Consumer runs bootstrap or skill"] --> B["bootstrap.mjs: Node >=22? tools on PATH? .agents/openspec/openwiki receipts?"]
    B -- "tools missing, bootstrap lane" --> C["npm i -g @fission-ai/openspec@^1.11.0 openwiki@^0.4.3 (caret from versions.json)"]
    B -- "other skill, tools missing" --> D["check_peer_tools.mjs stderr: error per tool + exact npm i -g lines"]
    D --> E["exit 2, no writes, no install attempt"]
    B -- "all present" --> F["per-repo lane: openspec init, .agents scaffold, contract/routing, integrations spread"]
```

### Verification helper

`.agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs` owns fail-fast verification. It exports `INSTALL_COMMANDS` (`openspec` → `npm i -g @fission-ai/openspec@latest`, `openwiki` → `npm i -g openwiki@latest` as fallback), `onPath(cmd)`, `missing(tools)`, and `requireBinaries(tools)`. Standalone:

```bash
node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki
```

Behavior: PATH resolution only via `PATH`/`PATHEXT` + `existsSync`; unknown tool names throw and exit 2 naming the unknown tool; missing tools print one error per tool plus the exact `npm i -g` lines and exit 2. Importable by sibling skills:

```js
import { requireBinaries } from "./check_peer_tools.mjs";
requireBinaries(["openspec", "openwiki"]); // exits 2 with install commands if absent
```

`bootstrap.mjs` builds caret-pinned `INSTALL_COMMANDS` (`npm i -g @fission-ai/openspec@^1.11.0` etc.) and attempts a combined `npm i -g` when both are missing; if `npm` is absent or the install fails it prints an `INSTRUCT` lane with the exact remaining commands and exits clean without partial state from that step. `attach_wiki_contract.mjs` and `sync_wiki_indexes.mjs` add their own fail-fast checks (missing `openwiki/INSTRUCTIONS.md` → exit 2 with `openwiki --init`; missing `openwiki/` or global package → exit 2 with remediation). The `wiki-contract` spec requires every skill that invokes `openspec`/`openwiki` to verify first and never attempt installation.

## Bootstrap orchestrator

Skill: `.agents/skills/aksk-bootstrap/SKILL.md` (idempotent orchestrator — preflight detection, per-user global installs, per-repo scaffolding, contract/routing attachment, OpenWiki agent-integration spread). Script: `.agents/skills/aksk-bootstrap/scripts/bootstrap.mjs`.

Two lanes, both idempotent by detection:

1. **EXECUTE** — `node .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs [repo-root] [--force] [--json]` runs locally: verify Node >=22, verify/install globals (skip when present, verify `openwiki` resolves before MCP registration), verify skills under `~/.agents/skills` plus host dir, then per-repo `openspec init --tools none` if `openspec/` missing, minimal `.agents/` scaffold if missing, `attach_wiki_contract.mjs`, `init_agents_md.mjs` (FerroxLabs baseline zone), `attach_section.mjs` for `AKSK:ROUTING`/`AKSK:LIFECYCLE`, and `openwiki integrations install <host>` per lane ladder (`codex|claude|opencode` atomically, others headless via `openwiki --init -p`). `detectState()` snapshots tools, trees, markers, and `openwiki integrations list --project` receipts before acting; `printState()` reports it.

2. **INSTRUCT** — when any step cannot run locally (no `npm`, no write, sandboxed worker), the script prints the exact remaining commands and exits clean. Completed steps remain; the failed step leaves no partial state.

```
INSTRUCT lane — run these commands manually (versions from references/versions.json, caret-pinned):
  npm i -g @fission-ai/openspec@^1.11.0 openwiki@^0.4.3
  openspec init --tools none
  node .agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
  node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs . AGENTS.md routing-note-template.md
  openwiki integrations install codex
```

Re-running on a fully bootstrapped repo reports no changes; on a partially bootstrapped repo it completes only missing steps.

## Skills CLI distribution

Adoption is skill-first. `INSTALL.md` defines the two supported lanes (preferred agent-assisted via `aksk-bootstrap`, fallback manual via `npx skills add`):

1. `npx skills add -g -a <self-reported> Hypercubed/Agent-Knowledge-Starter-Kit --skill aksk-bootstrap` in the target repo to place shared skills under `~/.agents/skills` plus your host dir (`universal` is `~/.agents/skills`; `<self-reported>` is your host id; `npx` required; caret versions from `references/versions.json`, `@latest` only when unpinned; for openwiki use `--full-depth` or `openwiki integrations install <self-reported>` when that host is supported). Alternative: `npx skills add -g <path-to-kit> --skill aksk-bootstrap`. Override A without `-g` keeps repo-local `./.agents/skills` when you intend that override. Preserve each skill folder layout, including any `bootstrap/` subdirectory — initialization copies *from* `bootstrap/` and idempotent re-runs and peer skills expect that path. Initialization steps only copy from `bootstrap/`; they never remove it.
2. Open each installed `SKILL.md` and run its **Skill initialization** once (copy-missing-only, never overwrite existing content). Suggested order: closeout-only → `task-closeout` init; distillation/linting → `learning-distill` init first (scaffolds `sessions/`, `playbooks/`, template `.agents/AGENTS.md` when missing and runs wiki prerequisites); lint-only without distill → no separate init needed.
3. The bootstrap skill handles routing-note and lifecycle attachment; manually you can attach the routing note:

```bash
node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs . AGENTS.md
```

4. Register `SKILL.md` paths in the editor/product if required. Keep `.agents/.gitignore` tracked (`sessions/*` + `!sessions/README.md`) or replicate at repo root if `.agents/` is not tracked.

Skill *definitions* may live wherever the Skills CLI installs them (including user or global locations). Initialization and ongoing output (sessions, durable docs, `AGENTS.md` updates) still belong under the target repository's `.agents/` when work runs there. The `git clone --depth 1 && cp -r .agents/skills` fallback is removed — `npx` is required; when missing, the INSTRUCT lane prints the prerequisite.

Flags caveat: the upstream `skills --all` flag installs every skill into **every** agent integration directory it knows about, not only `.agents/skills/`. Prefer narrower installs (`-s <skill> -a <agent>`) for a minimal tree.

For an existing `.agents/` tree, never replace wholesale unless confirmed disposable. Preserve repo-specific `rules/`, `playbooks/`, `skills/` first, add missing kit skills and run initializations, hand-merge `.agents/AGENTS.md` (keep it concise; no session history), prefer the kit-default ignore patterns, record durable rationale as OKF pages under `openwiki/decisions/` or `openwiki/troubleshooting/`, then `node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs` so preserved assets become discoverable.

There is no `cp example/.agents` path — `example/` and its `generate-example` skill/playbook were removed per `install-lanes` (see `openspec/specs/install-lanes/spec.md`). Bootstrap templates are the source of truth and `scripts/check-agents-structure.sh` validates only `.agents`.

## Single .agents tree as source of truth

The portable prescriptive layer lives only under root `.agents/`. This is the `single-tree-architecture-agents` decision: canonical kit knowledge and portable skills live only there. Consumers may have product overlays (Cursor rules, Copilot instructions, Claude commands) but those are wiring — durable guidance stays in `.agents/AGENTS.md`, `.agents/playbooks/`, `.agents/skills/`, and curated wiki pages.

When both root `AGENTS.md` and `.agents/AGENTS.md` exist, root is the checkout entrypoint that routes into `.agents/`; the portable file is the canonical repo conventions file. One source of truth per instruction; root points, `.agents/` defines. Tool switching does not invalidate knowledge because the on-disk `.agents/` layout is stable — only the product registration changes.

Verification of the invariant:

- `.agents/sessions/` is gitignored except `sessions/README.md` (`sessions/*` + `!sessions/README.md`), enforced by `check-agents-structure.sh` via `git ls-files` and `git status --short --ignored`.
- `docs/integrations/` holds vendor how-tos; durable repo knowledge never moves into tool-specific config.

## Tool wiring: core pattern and four groups

`docs/integrations/patterns.md` is the shared integration model. The principle: **tool-native files are wiring; `.agents/` files are durable knowledge.** Point the tool at `.agents/AGENTS.md`, `openwiki/index.md`, `.agents/playbooks/`, and `.agents/skills/` instead of copying long-lived policy into every tool's native config.

`docs/integrations/README.md` and `patterns.md` define four pattern groups. Product pages provide exact filenames, minimal snippets, discovery/config tables, and caveats; shared concepts live once in `patterns.md`.

| Pattern group | Tools | Mechanism |
| --- | --- | --- |
| Root `AGENTS.md` native or compatible | Codex, OpenCode, Kilo Code, Warp, OpenClaw | short root `AGENTS.md` routes into `.agents/` via attached `AKSK:ROUTING` block |
| Tool-specific bootstrap file | Claude Code (`CLAUDE.md`), Gemini CLI (`GEMINI.md`) | thin router file; native memory stays user-local |
| Rules-based IDE wiring | Cursor (`.cursor/rules/*.mdc`), GitHub Copilot (`.github/copilot-instructions.md`) | short rule/instruction bodies referencing `.agents/` paths; glob-scoped rules only for extra constraints |
| Persistent memory & runtime boundary | Hermes, Antigravity, OpenClaw, Agentic Sandbox | private memory for local continuity only; export durable evidence to `.agents/sessions/<folder>/` at task boundaries |

### Quick matrix (condensed — full table in patterns.md)

Cursor project rules and Copilot instruction files stay short and route; nested `.agents/` files are not auto-visible outside `.agents/`, so root routing or an always-on rule is required. Claude Code uses `.claude/commands/` wrappers that point at repo skills (`Read and follow .agents/skills/task-closeout/SKILL.md`) and user-local auto-memory must never become repo docs. Codex discovers repo `.agents/skills/` natively but sandbox profiles may protect `.agents/` as read-only during closeout/distill (requires writable-root approval). Hermes has dual skill namespaces (runtime store vs repo `.agents/skills/` — read repo files from disk). Agentic Sandbox executes procedural `SKILL.md` steps via tool calls; stalled `npx` is a known troubleshooting case.

**Session export rule:** native memory helps during work, but `.agents/sessions/` is the shared task boundary. A closeout bundle (`summary.json` with canonical `task_id`, `active-task.md`, `learning-candidate.md`, `changed-files.txt`, `validation.txt`) captures what matters so any later tool can distill. Promoted lessons commit to `.agents/AGENTS.md`, curated wiki trees, or `.agents/playbooks/` — never back into a tool's private memory.

### Guide inventory

Available product guides under `docs/integrations/`: Agentic Sandbox, Antigravity, Claude Code, Codex, Copilot, Cursor, Gemini CLI, Hermes, Kilo Code, OpenClaw, OpenCode, Warp, Zo Computer, OpenSpec, plus `patterns.md` and `README.md`. Planned (only after verification against real tool behavior): VS Code extensions.

## Wiring mechanics: attachment scripts

All marker-delimited sections are owned by `.agents/skills/aksk-bootstrap/scripts/` — they never duplicate long policy, they route.

### `attach_section.mjs` — root router sections

```bash
node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs [repo-root] [target-file-name] [template-name]
```

One mechanism for N sections; markers are read from the template, not hard-coded:

| Template | Markers | Content |
| --- | --- | --- |
| `routing-note-template.md` (default) | `AKSK:ROUTING` | thin discovery pointers into `.agents/` and `openwiki/` |
| `lifecycle-template.md` | `AKSK:LIFECYCLE` | self-improvement loop mandate (closeout → distill → prune) |

Behavior: existing content outside markers is never replaced or removed; sections attach below it. Idempotent and self-updating: re-running is a no-op when the marked section matches the template; if the template changed, only that marked section is refreshed in place. If the target file is missing, it is created containing only the attached section — root router files have no upstream initializer. Unknown template name exits 2. The zoned order in a fully bootstrapped `AGENTS.md` is FerroxLabs baseline (`AKSK:AGENTS-BASELINE`) → OpenWiki (`OPENWIKI:START/END`) → AKSK routing/lifecycle.

Product pages that previously hand-wrote routing blocks were converted to call this script (Claude Code: `CLAUDE.md`; Codex/OpenCode/Kilo/Warp/OpenClaw: `AGENTS.md`; Copilot: `.github/copilot-instructions.md`; Gemini: `GEMINI.md`). Cursor rules use a `.cursor/rules/*.mdc` with `alwaysApply: true` referencing the same canonical paths instead of pasting policy.

### `attach_wiki_contract.mjs` — curated wiki contract

```bash
node .agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs [repo-root]
```

Appends the curation section from `references/wiki-contract-template.md` between `<!-- AKSK:WIKI-CONTRACT:BEGIN/END -->` markers to an **existing** `openwiki/INSTRUCTIONS.md`. Never creates the file, never replaces OpenWiki-owned content, never removes outside material. Idempotent and self-updating with the same no-op-or-refresh semantics. Fail-fast: missing file exits 2 naming `openwiki --init` with no writes. Stub-aware: attaching below the default stub (`A code wiki for this repository.`) is reported; downstream skills treat a file without the markers as no-contract.

### `sync_wiki_indexes.mjs` — deterministic index refresh

```bash
node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs [repo-root]
```

Refreshes all OpenWiki directory indexes with no LLM and no CLI run. Requires `openwiki/` to exist and the `openwiki` package to be installed globally (located via `npm root -g` → `openwiki/dist`). Dynamically imports `agent/docs-only-backend.js` (`OpenWikiLocalShellBackend` with `docsOnly: true`, `virtualMode: true`) and `okf/index-sync.js` (`synchronizeWikiIndexes`). Exits 2 with remediation when uninitialized or not installed. This is the only sanctioned way distillation refreshes indexes; `docs-lint` reports index drift as advice to rerun it.

### `init_agents_md.mjs` — FerroxLabs baseline

```bash
node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs [repo-root]          # seed when missing
node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs [repo-root] --replace # overwrite baseline zone
node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs [repo-root] --combine # stage for LLM merge
```

Seeds the `AKSK:AGENTS-BASELINE` zone from `references/agents-md-baseline-template.md` (vendored FerroxLabs `AGENTS.md` with provenance header). Missing `AGENTS.md` → creates it. Existing file with matching baseline block (whitespace-normalized) → no-op. Non-matching file with no flag → exits 2 with remediation (use `--replace` or `--combine` which stages `existing.md`/`baseline.md`/`COMBINE.md` under `.agents/sessions/agents-md-combine/<timestamp>/`). Bootstrap runs this before OpenWiki/ AKSK zones to enforce `baseline → OpenWiki → AKSK` order.

## Validation

Two bash validators under `scripts/` enforce the distribution contract. Both degrade gracefully when optional tools are absent (warnings, not failures for `jq`, `remark`, `markdown-link-check`, `rg`).

**`check-agents-structure.sh [target]`** (default `.agents`) — portable validator consumers can run on their installed tree. Checks: required files (`AGENTS.md`, `.gitignore`, `playbooks/README.md`, `sessions/README.md`, SKILL.md for all four portable skills plus the five task-closeout example-bundle files); session tracking (`git ls-files` under sessions equals exactly `sessions/README.md`; ignored bundles via `git status --short --ignored`); skill frontmatter (`---` plus `name:`/`description:` within first 12 lines); JSON validity via `jq` when present.

**`check-publish.sh`** — release wrapper that `cd`s to the git root. Runs the portable validator on root `.agents` only, then: Markdown formatting via `remark --frail` (local or `npx`, 60s timeout); Markdown links via `markdown-link-check --alive 200,0` per file excluding `example/` (30s timeout); leakage scan via `rg` for secret/local-path patterns across `README.md`, `INSTALL.md`, `docs`, `.agents` (warnings); doubled `.agents/.agents/` path hygiene (hard fail, trailing segment required so prose citing the anti-pattern survives). Exposed as `npm run check`.

## Invariants and failure semantics

- **Bootstrap owns installs; others never install.** `bootstrap.mjs` is the only place that runs `npm i -g` (per-user, caret-pinned). Every other missing-peer-tool path prints the exact caret-pinned remediation and exits without writing. `references/versions.json` is the single source for those version strings; `check_peer_tools.mjs` `INSTALL_COMMANDS` is the fallback (`@latest`) for fail-fast messages.
- **Append-only, idempotent attachment.** Content outside `AKSK:*` markers is never touched; re-runs are no-ops when current and in-place refreshes when the template changed. Hand-edits between markers are corrected by rerunning. Zoned order is enforced: baseline → OpenWiki → AKSK.
- **Never half-install.** A failed bootstrap step prints the exact remaining commands (`INSTRUCT` lane) and exits clean without partial state from that step; completed steps remain.
- **Single source of truth.** Durable guidance lives once under `.agents/` and curated wiki trees. Copying that guidance into every tool's native config creates forks; routing preserves portability when tools change.
- **No example mirror.** `example/` and `generate-example` are not supported install methods; bootstrap templates are the source of truth.
- **Bootstrap preservation.** Skill `bootstrap/` directories must not be deleted or renamed — idempotent re-runs and peer skills depend on them.

## Extension points

- **New managed section:** add a template under `.agents/skills/aksk-bootstrap/references/` carrying unique `<!-- AKSK:<NAME>:BEGIN -->`/`<!-- AKSK:<NAME>:END -->` markers; attach via `attach_section.mjs <root> <target> <template>`; extend `docs-lint` wiring checks similarly; validate with two runs (second is no-op) plus structure check.
- **New tool integration:** map the product's native structures against `docs/integrations/patterns.md`, apply the Routing Pattern for high-precedence root files, include a concrete two-tool workflow, verify claims by reproduction, and keep durable knowledge out of vendor config. Guides belong in `docs/integrations/`, not under `.agents/`.
- **New portable skill:** needs `SKILL.md` frontmatter with `name`/`description` plus `CONTRACT.md`; maintainer-only automation must set `metadata.internal: true` so `npx skills add` skips it.
