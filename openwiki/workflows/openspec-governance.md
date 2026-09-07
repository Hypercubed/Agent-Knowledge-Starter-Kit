---
type: workflow
title: OpenSpec Governance
description: The propose-to-archive loop — opsx workflows, graduation via archive sync, proposal labeling, and archived-change wiki coverage.
tags: [openspec, governance, workflow, specs, changes]
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-5398a69cb2cf8d556809da57
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_section.mjs
  - id: openwiki-source-d56b5afb22742020f2ab6b59
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-d1960e41bf9a48af26e81829
    resource: repo://.agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs
  - id: openwiki-source-dce50581779fda5dd507dc34
    resource: repo://.agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
  - id: openwiki-source-5af7f373fcb21f142106673c
    resource: repo://.agents/skills/docs-lint/SKILL.md
  - id: openwiki-source-764361c18355af2544814f55
    resource: repo://.agents/skills/task-closeout/SKILL.md
  - id: openwiki-source-75cf85a44e08ef6c1c96b347
    resource: repo://openspec.yaml
  - id: openwiki-source-30179ef0180d39bd7ef5bef7
    resource: repo://openspec/changes/add-task-start/design.md
  - id: openwiki-source-c13ebc2b6ebca535d0e7e2e3
    resource: repo://openspec/changes/add-task-start/proposal.md
  - id: openwiki-source-bfc58f79a96e2ed041bc3436
    resource: repo://openspec/changes/add-task-start/specs/task-start/spec.md
  - id: openwiki-source-5f3d44600622b137a3e5c877
    resource: repo://openspec/changes/archive/2026-08-23-adopt-openspec-openwiki/.openspec.yaml
  - id: openwiki-source-3e1811396a656bb08f1eb927
    resource: repo://openspec/changes/archive/2026-08-23-adopt-openspec-openwiki/proposal.md
  - id: openwiki-source-7eee6646ba9305e43b2f3dfe
    resource: repo://openspec/changes/archive/2026-08-23-adopt-openspec-openwiki/tasks.md
  - id: openwiki-source-34143dd7ba62ba9e85637d98
    resource: repo://openspec/changes/archive/2026-08-29-canonical-universal-install/.openspec.yaml
  - id: openwiki-source-d791605efe5549a81ce1b6a0
    resource: repo://openspec/changes/archive/2026-08-29-canonical-universal-install/design.md
  - id: openwiki-source-1038e04a8d2ec385d7008057
    resource: repo://openspec/changes/archive/2026-08-29-canonical-universal-install/proposal.md
  - id: openwiki-source-49be4d0097fbe26b35c8d39d
    resource: repo://openspec/changes/archive/add-knowledge-search.md
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
  - id: openwiki-source-53df649d4fbc85ef0839d164
    resource: repo://openspec/specs/wiki-contract/spec.md
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# OpenSpec Governance

OpenSpec is the intent and process layer: it owns *what* should be built and *in what order*, while OpenWiki owns descriptive knowledge and `.agents/` owns prescriptive behavior. Governance rules (contract ordering, change anatomy, invariants) live in [OpenSpec Workflow](../governance/openspec-workflow.md); this page covers the loop that moves a change from proposal to graduated spec.

> Only `openspec/specs/**` is the current contract. `openspec/changes/<name>/` entries are **Proposal-only** until `opsx:archive` promotes their deltas; `openspec/changes/archive/**` is frozen history.

## The loop

`opsx:propose` creates `openspec/changes/<kebab-name>/` and generates `proposal.md` → `design.md` → `tasks.md` → capability-scoped delta specs in dependency order. `opsx:explore` is an optional thinking-partner stance that never implements. `opsx:apply` works `tasks.md` to done. `opsx:archive` verifies completion, moves the change to `archive/YYYY-MM-DD-<name>/`, and optionally syncs deltas into `openspec/specs/` — the only writer of graduated SHALL requirements. In-flight edits belong in the change's delta spec, never directly in `openspec/specs/`.

## Graduation and labeling

Graduated requirements live at `openspec/specs/<capability>/spec.md`; deltas at `openspec/changes/<name>/specs/<capability>/spec.md` promote only via archive sync. Lessons duplicating a codified SHALL must cite the spec instead of creating wiki pages. Every script invoking `openspec` or `openwiki` verifies binaries on PATH first and fails with exact install commands, never installing.

## Coverage pairing

Each archived change carries descriptive outcomes in `openwiki/` or a recorded deferral — `docs-lint` fails the pass otherwise. Session bundles may reference in-flight changes via `summary.json:openspec_change` without touching `openspec/`; spec updates wait for archive time.

## Related

- [OpenSpec Workflow](../governance/openspec-workflow.md) — contract ordering, anatomy, and invariants.
- [Validation and Cross-Tool Lint](../operations/validation-and-lint.md) — coverage pairing checks.
- [Quickstart](../quickstart.md) — entry routes into this loop.
