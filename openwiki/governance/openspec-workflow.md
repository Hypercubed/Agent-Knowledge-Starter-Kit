---
type: governance-page
title: "OpenSpec Workflow"
description: "How openspec/ governs change management: config.yaml spec-driven schema, the active change set with the largely-implemented 2.0 pipeline (adopt-openspec-openwiki then aksk-bootstrap-system), archived supersession lineage, and the remaining reconciliation work."
tags: [openspec, governance, changes, specs]
timestamp: 2026-08-23T19:30:00Z
openwiki:
  roles: [architecture, operations]
  source_paths:
    - openspec/config.yaml
    - openspec/changes/adopt-openspec-openwiki/tasks.md
    - openspec/changes/aksk-bootstrap-system/tasks.md
---

# OpenSpec Workflow

Since May 2026 this repository manages substantive work through [OpenSpec](https://github.com/fission-ai/openspec) instead of ad-hoc maintainer plans. The `openspec/` tree is the intent/process layer of the kit's tool stack ([division of labor](../overview.md)).

## Configuration

`openspec/config.yaml` selects the **spec-driven** schema and embeds project context plus artifact rules that make knowledge-capture non-negotiable:

- *proposal rules* — focus on impact to the durable knowledge layer; identify required decisions/troubleshooting entries;
- *design rules* — use Mermaid diagrams for workflow/architecture changes; follow `.agents/` structure; address cross-tool compatibility;
- *tasks rules* — always end with a task-closeout step; include learning-distill when reusable patterns emerged; verify via docs-lint or validation scripts.

The context block still summarizes AKSK principles in their pre-consolidation wording (`.agents/docs/decisions/`, `log.md`) — a known staleness inside OpenSpec-owned text that lint's stale-decision check is meant to catch eventually. Root `openspec.yaml` complements this with read-and-reference patterns over `.agents/**` and `docs/**`.

## Active changes (14)

Two of them form the AKSK 2.0 pipeline (see below); the other twelve are independent:

| Change | Theme |
| --- | --- |
| `adopt-openspec-openwiki` | **2.0 step 1** — peer-dependency adoption; see below |
| `aksk-bootstrap-system` | **2.0 step 2** — bootstrap automation; depends on the above |
| `add-task-start` | proactive `task-start` skill + `manifest.json`; closeout consumes existing manifests |
| `implement-operating-contract-and-triggers` | `OPERATING_CONTRACT.md` (<50 lines) + `.agents/triggers.yaml` event system |
| `adopt-workflows-taxonomy` | merge `playbooks/` into `workflows/` under unified terminology |
| `add-integrations`, `add-script-tests`, `consumer-upgrade-path`, `escalate-quick-reference`, `formalize-superseded-obsolete`, `out-of-repo-trees`, `rules-in-scaffold`, `ship-structure-check-script`, `worked-lifecycle-example` | docs coverage, pytest suite for scripts, upgrade guidance, auto-pinned Quick Reference, deprecation convention, overlay trees, `.agents/rules/` taxonomy, structure-script distribution, worked loop example |

Each folder carries `.openspec.yaml` plus `proposal.md` (+ `design.md`/`tasks.md` for larger ones) and optional `specs/<capability>/spec.md` requirement files. Two changes shipped merged specs under `openspec/specs/`: `openspec-integration` and `remove-write-plan`. Six older maintainer plans were also relocated into `archive/` as plain markdown during the migration.

## Archived changes — the supersession lineage

`openspec/changes/archive/` is dated and tells three waves:

1. **2026-05-16 · `add-openspec-integration`** — adopted OpenSpec itself; produced spec `openspec-integration`.
2. **2026-07-18/19 batch** — five wiki-related proposals (`add-docs-capture-skill`, `introduce-docs-manifest`, `living-architecture-intent-capture`, `repo-centric-wiki-tooling`, `wiki-system`) were marked Overcome-By-Events by `integrate-openwiki-skills`, which proposed extracting OpenWiki's internal prompts into native AKSK skills and standardizing on OKF v0.1. Also here: `remove-write-plan` (deleted the write-plan skill while keeping a plans directory; its merged spec lives in `openspec/specs/`).
3. **2026-08-23 batch** — three wiki/installer-related proposals archived as superseded: `integrate-openwiki-skills` (would have extracted OpenWiki's internal prompts into native AKSK skills on OKF v0.1), `aksk-install-tools` (embedded installer/scaffolding scope), and `aksk-openspec-bridge` (OpenSpec schemas binding AKSK skills as a capability library). Their scope was re-cut into the two active 2.0 changes: upstream skill bundles replace prompt extraction, native `openspec init` skills replace forks, and installation automation moved to `aksk-bootstrap-system`.

Reading order for anyone tracing why current tooling exists: wave 2 explains the ripgrep-era design of the now-deleted docs-search/docs-compile tools; wave 3 explains why they were retired in favor of upstream tooling rather than re-implemented.

## Step 1: `adopt-openspec-openwiki` — implemented and dogfooded

The defining constraint: **OpenSpec and OpenWiki are peer dependencies** (globally installed, assumed present). AKSK verifies before use and never installs anything; every invocation path checks for the binary first and fails fast printing the exact remediation (`npm i -g @fission-ai/openspec openwiki`, then `openwiki --init` in the repo). Its four capabilities and their shipped state:

<!-- openwiki: mermaid parse failed and this diagram was converted to a text fence so it does not break rendering. Fix the diagram source and restore the mermaid fence. Parser error: Heuristic: an unescaped angle bracket inside a label breaks rendering; rephrase the label. -->
```text
flowchart LR
    subgraph S1["adopt-openspec-openwiki capabilities"]
        WC["wiki-contract:<br/>attach_wiki_contract.mjs<br/>append-only curation contract"]
        DR["distill-routing:<br/>descriptive pages to OKF wiki,<br/>prescriptive stays in .agents"]
        CL["cross-tool-lint:<br/>routing blocks, coverage pairing,<br/>stale curated pages"]
        CO["closeout-change-linking:<br/>summary.json openspec_change field"]
    end
    DR -.->|"writes"| OW[("openwiki/<br/>curated OKF pages")]
    WC -->|"attaches contract to"| INS["openwiki/INSTRUCTIONS.md"]
    CL -.->|"lints"| OW
```

*Caption: how the four capabilities land in shipped files. All four are implemented; tasks 5.2–5.4 (end-to-end dogfood validation) and phase 6 (reconciling six affected active changes) remain open.*

- **`distill-routing`** — descriptive lessons become OKF wiki pages authored directly by the distilling agent, loading authoring guidance at runtime from OpenWiki's exported prompts (`createSystemPrompt`) and validating with deterministic OKF helpers (`okf/frontmatter`); prescriptive lessons stay in `.agents/`. Shipped as the rewritten [learning-distill](../skills/learning-distill.md). Per design decision D6, the headless CLI stays reserved for scheduled whole-wiki reconciliation because a CLI-run LLM re-discovers evidence from the repo and cannot see what the session learned.
- **`wiki-contract`** — appends the AKSK curation contract to an existing `openwiki/INSTRUCTIONS.md`; append-only, idempotent by marker detection, stub-aware, never replacing OpenWiki-owned content. Shipped as [aksk-bootstrap](../skills/aksk-bootstrap.md)'s `attach_wiki_contract.mjs`; this repo's own `INSTRUCTIONS.md` carries the attached contract.
- **`cross-tool-lint`** — docs-lint repurposed into checks spanning both artifacts: routing-block integrity, archived-change↔wiki coverage pairing (with recorded-deferral exemption), stale-curated-page detection. Index-coverage checking moved out of scope because the wiki tooling owns indexes. Shipped as [docs-lint](../skills/docs-lint.md).
- **`closeout-change-linking`** — adds an `openspec_change` field to `summary.json` linking bundles to OpenSpec changes; spec updates move to `/opsx:archive` time so closeout never modifies `openspec/` for in-flight changes. Shipped in the slimmed [task-closeout](../skills/task-closeout.md).

**BREAKING retirements landed:** `docs-search` and `docs-compile` deleted (superseded by OpenWiki's index/query tooling); the forked `openspec-*` skills deleted; `.agents/workflows/opsx-*` copies remain tracked but are slated for deletion in favor of files regenerated by native `openspec init` (task 4.2 partially applied — the workflow copies are still present on disk). Supersessions are recorded as curated decision pages so stale pointers redirect. Explicitly deferred during design: migrating the existing knowledge base was later done anyway under task 4.5 (see below).

The knowledge-base consolidation itself (design decision D8) went beyond the original proposal: every decision and troubleshooting entry moved under `openwiki/` as OKF pages with `aksk_status` lifecycle fields, six pre-OpenSpec maintainer plans were relocated into `archive/` as plain markdown, `MAINTENANCE.md` became the curated [`maintenance-format.md`](../maintenance-format.md) reference, and `.agents/docs/` — including hand-built indexes and `log.md` — was deleted. Recorded as decision `knowledge-consolidation-into-openwiki`; consequences are documented on [knowledge layer](../architecture/knowledge-layer.md).

### Remaining open work (tasks unchecked in `tasks.md`)

- **5.2–5.4 dogfood validation** — verify distill routing end-to-end (including fail-closed triggers), run cross-tool lint against the dogfooded state without false positives, and convert integration guides from hand-added routing snippets to the attachment script.
- **Phase 6 reconciliation** — revise six affected active changes (`escalate-quick-reference`, `formalize-superseded-obsolete`, `worked-lifecycle-example`, `implement-operating-contract-and-triggers`, `add-task-start`) so their text matches the shipped reality (e.g., no more `docs-compile` or `log.md` dependencies).

## Step 2: `aksk-bootstrap-system` — automate what step 1 required by hand (unstarted)

Adopting step 1 manually means global installs, repo initialization, scaffolding, contract attachment, and per-agent wiring — right for dogfooding, wrong for consumers. This follow-on depends on step 1 being fully applied and copies its finalized skill set as templates:

- Preflight detection (Node >= 22, tools on PATH, existing receipts `.agents/`, `openspec/`, `openwiki/`, `.openwiki-install.json`) with state report; once-per-user global npm lane; per-repo lane running `openspec init`, minimal `.agents/` scaffold, curation-contract attachment, idempotent routing-block merge into root `AGENTS.md`.
- A **never-half-install guard**: failed steps print exact remaining commands and exit clean without partial state; idempotency by detection, not journal.
- **Agent-integration spread** across detected agents via a lane ladder: official claude/codex lanes → `add-mcp` + tag-pinned `npx skills add …/integrations/openwiki` → headless CLI fallback for MCP-less agents; **ownership partition** rule: any target skill dir holding an `.openwiki-install.json` receipt is owned by the official lane and skipped.
- Regenerates `example/` to include the bootstrap skill and names bootstrap the primary wiring path in integration guides. Its tasks also plan open-question experiments (bare `openwiki mcp` stdio mode, tag-pinned `npx skills add` behavior) before implementation.

Release sequencing between the two changes is deliberately undecided; each stands alone documentation-wise (step 1 states peer-dependency prerequisites as manual steps).

**Truthfulness horizon for wiki readers:** the pages describing [docs-lint](../skills/docs-lint.md), [learning-distill](../skills/learning-distill.md), [task-closeout](../skills/task-closeout.md), and [aksk-bootstrap](../skills/aksk-bootstrap.md) document shipped behavior; the `.agents/workflows/opsx-*` command definitions below describe content whose retirement is pending; everything under step 2 is proposal-only.

## Workflows and forked slash-commands (retirement pending)

`.agents/workflows/` still holds four markdown command definitions — `opsx-propose`, `opsx-explore`, `opsx-apply`, `opsx-archive` — mirroring the forked `openspec-*` skills: propose creates a change and generates artifacts in dependency order via `openspec new/status/instructions --json`; explore is a thinking-partner stance that never implements; apply loops through pending tasks checking `- [ ]`→`- [x]`; archive verifies completion before moving a change to `archive/`. These are local copies of OpenSpec's own agent integration; step 1 deletes them in favor of files regenerated by `openspec init`. Unlike the forked skills, these files were not yet removed — treat them as pending retirement, not current doctrine.

Step 1 also re-times the archive workflow relative to capture: under `closeout-change-linking`, spec updates happen at `/opsx:archive` time rather than at task-closeout time, so a session bundle can reference an in-flight change without touching it.
