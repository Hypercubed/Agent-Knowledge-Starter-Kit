---
type: governance-page
title: "OpenSpec Workflow"
description: "How openspec/ governs change management: config.yaml spec-driven schema, the active change set, archived supersession lineage, and the two-change AKSK 2.0 pipeline (adopt-openspec-openwiki then aksk-bootstrap-system)."
tags: [openspec, governance, changes, specs]
timestamp: 2026-08-23T18:30:00Z
---

# OpenSpec Workflow

Since May 2026 this repository manages substantive work through [OpenSpec](https://github.com/fission-ai/openspec) instead of ad-hoc maintainer plans. The `openspec/` tree is the intent/process layer of the kit's tool stack.

## Configuration

`openspec/config.yaml` selects the **spec-driven** schema and embeds project context plus artifact rules that make knowledge-capture non-negotiable:

- *proposal rules* — focus on impact to the durable knowledge layer; identify required decisions/troubleshooting entries;
- *design rules* — use Mermaid diagrams for workflow/architecture changes; follow `.agents/` structure; address cross-tool compatibility;
- *tasks rules* — always end with a task-closeout step; include learning-distill when reusable patterns emerged; verify via docs-lint or validation scripts; respect single-tree architecture.

The context block summarizes AKSK principles and the maintenance loop, so every generated artifact inherits them. Root `openspec.yaml` complements this with read-and-reference patterns over `.agents/**` and `docs/**`.

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

Each folder carries `.openspec.yaml` plus `proposal.md` (+ `design.md`/`tasks.md` for larger ones) and optional `specs/<capability>/spec.md` requirement files. Two changes shipped merged specs under `openspec/specs/`: `openspec-integration` and `remove-write-plan`.

## Archived changes — the supersession lineage

`openspec/changes/archive/` is dated and tells three waves:

1. **2026-05-16 · `add-openspec-integration`** — adopted OpenSpec itself; produced spec `openspec-integration`.
2. **2026-07-18/19 batch** — five wiki-related proposals (`add-docs-capture-skill`, `introduce-docs-manifest`, `living-architecture-intent-capture`, `repo-centric-wiki-tooling`, `wiki-system`) were marked Overcome-By-Events by `integrate-openwiki-skills`, which proposed extracting OpenWiki's internal prompts into native AKSK skills and standardizing on OKF v0.1. Also here: `remove-write-plan` (deleted the write-plan skill while keeping a plans directory; its merged spec lives in `openspec/specs/`).
3. **2026-08-23 batch** — three wiki/installer-related proposals archived as superseded: `integrate-openwiki-skills` (would have extracted OpenWiki's internal prompts into native AKSK skills on OKF v0.1), `aksk-install-tools` (embedded installer/scaffolding scope), and `aksk-openspec-bridge` (OpenSpec schemas binding AKSK skills as a capability library). Their scope was re-cut into the two active 2.0 changes below: upstream skill bundles replace prompt extraction, native `openspec init` skills replace forks, and installation automation moved to `aksk-bootstrap-system`.

Reading order for anyone tracing why current tooling exists: wave 2 explains docs-search/docs-compile's ripgrep-era design (also see plan-archive entry `replace-indexing-with-ripgrep.md`); wave 3 explains why those same tools are now slated for retirement.

## The 2.0 repositioning — a two-change pipeline (untracked work-in-progress)

AKSK 2.0 is planned as two dependent OpenSpec changes that together redefine what AKSK *is*: upstream tools own the duplicated layers — **OpenSpec** owns process/intent, **OpenWiki** owns descriptive knowledge (`openwiki/`, OKF wiki, indexing/search) — while AKSK becomes the **experiential/curation glue**: session capture, distillation judgment, lint guardrails.

<!-- openwiki: mermaid parse failed and this diagram was converted to a text fence so it does not break rendering. Fix the diagram source and restore the mermaid fence. Parser error: Heuristic: a semicolon inside a label breaks rendering; rephrase the label. -->
```text
flowchart LR
    subgraph S1["adopt-openspec-openwiki (step 1)"]
        WC["wiki-contract:<br/>append-only curation contract<br/>into openwiki/INSTRUCTIONS.md"]
        DR["distill-routing:<br/>descriptive -> OKF pages,<br/>prescriptive -> .agents"]
        CL["cross-tool-lint:<br/>routing blocks, archive/wiki<br/>pairing, stale decisions"]
        CO["closeout-change-linking:<br/>summary.json openspec_change field"]
    end
    subgraph S2["aksk-bootstrap-system (step 2)"]
        BS["aksk-bootstrap skill + script:<br/>preflight, global npm lane,<br/>per-repo scaffolding, EXECUTE/INSTRUCT"]
        SP["agent-integration-spread:<br/>official lanes / npx skills add /<br/>headless ladder; ownership partition"]
    end
    S1 -->|"finalized skill set copied<br/>as bootstrap templates"| S2
    DR -.->|"writes"| OW[("openwiki/<br/>OKF pages")]
    CL -.->|"lints"| OW
```

*Caption: step 1 rewires AKSK's experiential skills onto the peer tools; step 2 automates adoption using step 1's finalized skills as templates.*

### Step 1: `adopt-openspec-openwiki` — adopt the peers, retire duplicates

The defining constraint: **OpenSpec and OpenWiki are peer dependencies** (globally installed, assumed present). AKSK verifies before use and never installs anything; every invocation path checks for the binary first and fails fast printing the exact remediation (`npm i -g @fission-ai/openspec openwiki`, then `openspec init` / `openwiki --init` in the repo). Its four capabilities:

- **`distill-routing`** — descriptive lessons (facts, rationale, architecture, troubleshooting patterns) become OpenWiki pages authored directly by the distilling agent in OKF format; prescriptive agent-behavior lessons stay in `.agents/AGENTS.md`, playbooks, or `decisions/`. Per design decision D6, the host agent writes pages itself — loading authoring guidance at runtime from OpenWiki's exported prompts (`createSystemPrompt`) and validating with deterministic OKF helpers (`okf/frontmatter`, `okf/index-sync`) — while the headless CLI stays reserved for scheduled whole-wiki reconciliation, because a CLI-run LLM re-discovers evidence from the repo and cannot see what the session learned.
- **`wiki-contract`** — appends the AKSK curation contract (curated page trees, preserve-and-link semantics under `--update`, meaningful frontmatter extensions) to an existing `openwiki/INSTRUCTIONS.md`; append-only, idempotent by marker detection, stub-aware, never replacing OpenWiki-owned content. Distillation fails closed before any wiki write when the contract is absent — treating absence as "nothing curated" could silently regenerate away hand-curated pages.
- **`cross-tool-lint`** — repurposes docs-lint into checks spanning both artifacts: routing-block integrity, archived-change↔wiki coverage pairing (with recorded-deferral exemption), stale-decision detection. Index-coverage checking moves out of scope because the wiki tooling owns indexes.
- **`closeout-change-linking`** — adds an `openspec_change` field to `summary.json` linking bundles to OpenSpec changes; spec updates move to `/opsx:archive` time so closeout never modifies `openspec/` for in-flight changes.

**BREAKING retirements** land here: delete `docs-search` and `docs-compile` (superseded by OpenWiki's index/query tooling), delete the forked `openspec-*` skills and `opsx-*` workflow copies (replaced by native skills regenerated via `openspec init`; working-tree evidence already shows the forked skill folders removed), keeping `openspec/config.yaml` as legitimate customization. Supersessions are recorded as decision entries so stale pointers redirect. Explicitly deferred: migrating the existing `.agents/docs/{decisions,troubleshooting}` knowledge base into OpenWiki.

### Step 2: `aksk-bootstrap-system` — automate what step 1 requires by hand

Adopting step 1 manually means global installs, repo initialization, scaffolding, contract attachment, and per-agent wiring — right for dogfooding, wrong for consumers. This follow-on depends on step 1 being applied first and copies its finalized skill set as templates:

- An **`aksk-bootstrap` skill + deterministic Python script**: preflights Node >= 22, detects existing receipts (`.agents/`, `openspec/`, `openwiki/`, `.openwiki-install.json`), performs the once-per-user global npm lane, bootstraps per-repo on demand (`openspec init`, minimal `.agents/` scaffold, curation-contract attachment, AGENTS.md routing-block merge), and uses an **EXECUTE/INSTRUCT two-lane model** — run steps locally when possible, else print exact remaining commands and exit clean; never half-installs. Idempotency is **by detection, not journal**.
- **Agent-integration spread** across detected agents via a lane ladder: official claude/codex lanes → `add-mcp` + tag-pinned `npx skills add …/integrations/openwiki` → headless CLI fallback for MCP-less agents; **ownership partition** rule: any target skill dir holding an `.openwiki-install.json` receipt is owned by the official lane and skipped.
- Regenerates `example/` to include the bootstrap skill and names bootstrap the primary wiring path in integration guides.

Release sequencing between the two changes is deliberately undecided; each stands alone documentation-wise (step 1 states peer-dependency prerequisites as manual steps).

**Truthfulness horizon for wiki readers:** pages on [docs-search](../skills/docs-search.md), [docs-compile](../skills/docs-compile.md), [learning-distill](../skills/learning-distill.md), [docs-lint](../skills/docs-lint.md), [task-closeout](../skills/task-closeout.md), and the [workflows](#workflows-and-forked-slash-commands) below describe shipped behavior that these changes revise or retire. The forked openspec-* skill folders are already deleted in this working tree; the rest of the pipeline remains unimplemented.

## Workflows and forked slash-commands

`.agents/workflows/` holds four markdown command definitions — `opsx-propose`, `opsx-explore`, `opsx-apply`, `opsx-archive` — mirroring the forked `openspec-*` skills: propose creates a change and generates artifacts in dependency order via `openspec new/status/instructions --json`; explore is a thinking-partner stance that never implements; apply loops through pending tasks checking `- [ ]`→`- [x]`; archive verifies completion before moving a change to `archive/`. These are local copies of OpenSpec's own agent integration; step 1 of the 2.0 pipeline deletes them in favor of files regenerated by `openspec init`.

Step 1 also re-times the archive workflow relative to capture: under `closeout-change-linking`, spec updates happen at `/opsx:archive` time rather than at task-closeout time, so a session bundle can reference an in-flight change without touching it.
