---
type: Reference
title: OpenSpec Workflow
description: How OpenSpec specs, changes, and archive govern intent and process in this repository — configuration, lifecycle, and graduation rules.
tags: [openspec, governance, specs, changes, workflow]
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-df46a321fce7026f92166a02
    resource: repo://.agents/playbooks/pre-publish.md
  - id: openwiki-source-d786624ba23d2df437591102
    resource: repo://.agents/skills/aksk-init/references/wiki-contract-template.md
  - id: openwiki-source-e119253b3c3737247dc63f2a
    resource: repo://.openwikiignore
  - id: openwiki-source-75cf85a44e08ef6c1c96b347
    resource: repo://openspec.yaml
  - id: openwiki-source-ce9c6fa422edfe6d8c0a16ae
    resource: repo://openspec/changes/add-integrations/.openspec.yaml
  - id: openwiki-source-30179ef0180d39bd7ef5bef7
    resource: repo://openspec/changes/add-task-start/design.md
  - id: openwiki-source-c13ebc2b6ebca535d0e7e2e3
    resource: repo://openspec/changes/add-task-start/proposal.md
  - id: openwiki-source-bfc58f79a96e2ed041bc3436
    resource: repo://openspec/changes/add-task-start/specs/task-start/spec.md
  - id: openwiki-source-547397f9c7fb44fd8703fc5d
    resource: repo://openspec/changes/aksk-init-doc-budget/design.md
  - id: openwiki-source-4915603a4d75b2621e33496a
    resource: repo://openspec/changes/aksk-init-doc-budget/proposal.md
  - id: openwiki-source-86a9684ec741e30bd1256f13
    resource: repo://openspec/changes/aksk-init-doc-budget/tasks.md
  - id: openwiki-source-1611464d292180a472498834
    resource: repo://openspec/changes/archive/2026-08-29-canonical-universal-install/specs/canonical-user-skills-scope/spec.md
  - id: openwiki-source-6d68533449d90d69bc412375
    resource: repo://openspec/changes/archive/2026-08-29-split-bootstrap-init/proposal.md
  - id: openwiki-source-9f96bcfc863dad6387706711
    resource: repo://openspec/changes/archive/2026-08-29-split-bootstrap-init/specs/aksk-bootstrap/spec.md
  - id: openwiki-source-287201707e8924698f8d616b
    resource: repo://openspec/changes/archive/2026-08-29-split-bootstrap-init/specs/aksk-init/spec.md
  - id: openwiki-source-43ce16c9519efbeb0e4e5479
    resource: repo://openspec/changes/archive/2026-09-03-adopt-doc-budget/design.md
  - id: openwiki-source-4423f6b2b66a1d5130a5bbdd
    resource: repo://openspec/changes/archive/2026-09-03-adopt-doc-budget/proposal.md
  - id: openwiki-source-94b96512c301954136083d7c
    resource: repo://openspec/changes/archive/2026-09-03-adopt-doc-budget/specs/wiki-contract/spec.md
  - id: openwiki-source-38af7bdd34d817fbd3c29077
    resource: repo://openspec/config.yaml
  - id: openwiki-source-3916774ed58b99715e8ff081
    resource: repo://openspec/specs/agent-integration-spread/spec.md
  - id: openwiki-source-f7767c74e12e946558d335f1
    resource: repo://openspec/specs/agents-md-bootstrap/spec.md
  - id: openwiki-source-c23cb9e8edf20ed2740abea1
    resource: repo://openspec/specs/aksk-bootstrap/spec.md
  - id: openwiki-source-d682bd16449a28825541bbed
    resource: repo://openspec/specs/aksk-init/spec.md
  - id: openwiki-source-e057169748acea114e857ee9
    resource: repo://openspec/specs/canonical-user-skills-scope/spec.md
  - id: openwiki-source-86a9b374cb99ed0befc3bb8d
    resource: repo://openspec/specs/closeout-change-linking/spec.md
  - id: openwiki-source-dc51f338f00dcd0763b107a6
    resource: repo://openspec/specs/cross-tool-lint/spec.md
  - id: openwiki-source-eeb2cc49563df1de1086bb7e
    resource: repo://openspec/specs/distill-routing/spec.md
  - id: openwiki-source-c16c0a8de8d2a3a0385db0af
    resource: repo://openspec/specs/install-lanes/spec.md
  - id: openwiki-source-53df649d4fbc85ef0839d164
    resource: repo://openspec/specs/wiki-contract/spec.md
  - id: openwiki-source-2361cff43709905e22758cbb
    resource: repo://scripts/check-agents-structure.sh
  - id: openwiki-source-5d609834bdc11b93524d04a9
    resource: repo://scripts/check-publish.sh
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# OpenSpec Workflow

This repository manages substantive work through OpenSpec as the **intent and process layer**. OpenWiki owns descriptive knowledge and `.agents/` owns prescriptive behavior; `openspec/` owns *what* should be built and *in what order*. Full propose→archive procedure lives in [OpenSpec Governance Workflow](../workflows/openspec-governance.md); this page states the governance rules.

> **Only `openspec/specs/**` is the current contract. `openspec/changes/<name>/` are proposals. `openspec/changes/archive/**` is frozen history until its delta requirements graduate.**

Cite shipped behavior from `openspec/specs/**`. Material from `openspec/changes/**` is labeled **Proposal-only** and delta requirements (`ADDED`/`MODIFIED`/`REMOVED`) are never presented as shipped. Archived changes become source of truth only after `opsx:archive` graduates their specs.

## Configuration

- **Root `openspec.yaml`** — minimal guardrail telling OpenSpec-aware agents to read and reference `.agents/**` and `docs/**`. It encodes no behavior.
- **`openspec/config.yaml`** — authoritative config: `schema: spec-driven` fixes the artifact graph (`proposal.md` → `design.md` → `tasks.md` plus optional delta specs), and per-artifact rules bind every change to the maintenance loop (knowledge-layer impact focus, Mermaid and `.agents/` layout, tasks ending with closeout → distill → lint).

## Change and spec anatomy

Each active change is a directory `openspec/changes/<kebab-name>/` with `.openspec.yaml` (schema receipt), `proposal.md` (what and why), `design.md` and `tasks.md` (how and checklist), plus optional capability-scoped delta specs. The graduated spec under `openspec/specs/<capability>/` is never edited while a change is active — edits belong in the change's delta spec and reconcile at archive time.

| Location | Lifecycle | Meaning |
| --- | --- | --- |
| `openspec/changes/<name>/specs/<cap>/spec.md` | in-flight | delta requirements for this change |
| `openspec/specs/<cap>/spec.md` | graduated | durable SHALL requirements, written only by archive sync |
| `openspec/changes/archive/YYYY-MM-DD-<name>/` | archived | frozen record of what shipped |

Graduated capabilities (see `openspec/specs/` for the SHALL text — requirements live only there, never duplicated into wiki pages): `openspec-integration`, `remove-write-plan`, `wiki-contract` (contract attachment, peer preconditions, documentation budget, `.openwikiignore`), `distill-routing` (descriptive → wiki, prescriptive → `.agents/`), `cross-tool-lint`, `closeout-change-linking` (`openspec_change` link, spec updates at archive time), `aksk-bootstrap` (global-only lane), `aksk-init` (per-repo lane), `agents-md-bootstrap`, `install-lanes`, `agent-integration-spread`, `canonical-user-skills-scope`.

## Opsx workflows

`opsx:propose` creates the change directory and generates artifacts in dependency order; `opsx:explore` is a thinking-partner stance that never implements; `opsx:apply` loops `tasks.md` to done; `opsx:archive` verifies completion, moves the change to `archive/YYYY-MM-DD-<name>/`, and optionally syncs deltas into `openspec/specs/`. Spec sync happens at archive time, never at closeout — a session bundle may reference an in-flight change via `openspec_change` without touching `openspec/`.

## Invariants

- **Source-of-truth ordering**: graduated specs > in-flight delta > archived history. Direct edits to `openspec/specs/` during an active change are a process violation.
- **Idempotency**: contract and section attachments are append-only and marker-idempotent; bootstrap re-runs are no-ops when present.
- **Never half-install**: failed bootstrap steps leave no partial files and print exact remaining commands per lane.
- **No durable writes at task boundaries**: start/closeout write only under `.agents/sessions/`; spec mutations wait for archive, wiki mutations for distill.
- **Coverage invariant**: each archived change carries wiki coverage or a recorded deferral; lint fails otherwise.
- **Budget guardrail**: wiki updates that only restate specs or paraphrase source without a boundary, ownership, flow, convention, or invariant change violate the documentation budget.

## Extension and operations

- New capability: `ADDED` requirements under the change, graduated at archive. Amendments: `MODIFIED` deltas reconciled at archive without touching graduated specs first.
- Validate before publish: `sync_wiki_indexes.mjs` after curated edits, then `docs-lint`, then `bash scripts/check-publish.sh`; `openspec validate <change> --strict` gates archival. Full sequence in `.agents/playbooks/pre-publish.md`.
