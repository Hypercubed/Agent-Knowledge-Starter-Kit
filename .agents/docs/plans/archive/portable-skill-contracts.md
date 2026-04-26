---
id: portable-skill-contracts
title: "Portable skill CONTRACT.md rollout"
last_updated: 2026-04-22
description: >
  Add skill-local CONTRACT.md beside each user-facing kit skill, link from SKILL.md, and document the pattern and precedence in MAINTENANCE.md (repo and learning-distill bootstrap).
tags: ["skills", "docs", "maintenance"]
status: completed
kind: initiative
consumer_portable: false
---

# Portable skill CONTRACT.md rollout

## Related decisions

- [Regenerate `example/` when the portable kit or bootstrap changes](../../decisions/regenerate-example-when-portable-kit-changes.md)
- [Single-tree architecture (`.agents/`)](../../decisions/single-tree-architecture-agents.md)
- [Use the routing pattern for agentic tool bootstrap files](../../decisions/use-the-routing-pattern-for-agentic-tool-bootstrap-files.md)

## Goal

Agents that receive **only** a skill folder (without the full kit checkout) still need **stable, machine-oriented rules**: output filenames, CLI flags, bundle artifacts, and index JSON shape. Today only **write-plan** ships that as `CONTRACT.md`. This initiative adds the same pattern to the other **user-facing** skills and records **precedence** next to the durable-doc rules in `MAINTENANCE.md` so maintainers know which document wins when guidance overlaps.

## Scope / non-goals

**In scope**

- New `CONTRACT.md` files for **docs-search**, **docs-compile**, **docs-lint**, **learning-distill**, and **task-closeout** (narrow specs; link to `MAINTENANCE.md` instead of duplicating durable frontmatter prose).
- A **Portable skill contracts** section in [`.agents/docs/MAINTENANCE.md`](../../MAINTENANCE.md) and the same section in [`.agents/skills/learning-distill/bootstrap/docs/MAINTENANCE.md`](../../../skills/learning-distill/bootstrap/docs/MAINTENANCE.md) (table of contract paths + precedence).
- `SKILL.md` updates for those five skills so each points at its `CONTRACT.md` and the new `MAINTENANCE.md` anchor.
- Optional one-line pointer in **write-plan** `CONTRACT.md` to the new `MAINTENANCE.md` section.
- Regenerate [`example/`](../../../../example/) via `generate-example` so the illustrated install matches the kit.

**Non-goals**

- New automation enforcing `CONTRACT.md` presence (optional follow-up).
- Maintainer-only **generate-example** does not gain a consumer contract unless needed later.

## Approach

- Mirror the **write-plan** pattern: `CONTRACT.md` lives beside `SKILL.md`; overlapping **durable docs** rules remain in `MAINTENANCE.md`, which stays **authoritative** until skill contracts are updated.
- Author each contract from the **actual scripts** (`index-docs.py`, `docs-compile.py`, `generate-durable-indexes.py`) and existing **SKILL.md** procedures so contracts stay short and accurate.
- Keep bootstrap `MAINTENANCE.md` text aligned with `.agents/docs/MAINTENANCE.md` so **learning-distill** initialization does not fork policy.

## Phases or milestones

1. Land **Portable skill contracts** in both `MAINTENANCE.md` trees (anchor: `#portable-skill-contracts`).
2. Add five `CONTRACT.md` files + write-plan `CONTRACT.md` pointer; wire **SKILL.md** links.
3. Run **docs-compile**; run **generate-example**; optional **docs-lint** pass.

## Success criteria

- [x] Every targeted user-facing skill ships a `CONTRACT.md` beside `SKILL.md`, and **write-plan** keeps its existing contract; **generate-example** does not need a contract unless we later decide otherwise.
- [x] Both `MAINTENANCE.md` copies include the **Portable skill contracts** section (anchor `#portable-skill-contracts`) with the contract path table and precedence rule.
- [x] Each affected `SKILL.md` points at its `CONTRACT.md` and the new `MAINTENANCE.md` anchor where helpful.
- [x] `example/.agents/` regenerated via **generate-example** matches the shipped kit after the rollout.

## Risks

| Risk                                                     | Mitigation                                                                                 |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Contract text drifts from scripts                        | Anchor bullets to filenames and flags; review when scripts change.                         |
| Duplicated policy between `MAINTENANCE.md` and contracts | Precedence rule + links; contracts defer to `MAINTENANCE.md` for durable YAML and logging. |

## Knowledge routing

| Output                            | Destination                                                                                         |
| --------------------------------- | --------------------------------------------------------------------------------------------------- |
| Normative policy for all installs | [`.agents/docs/MAINTENANCE.md`](../../MAINTENANCE.md) and bootstrap twin under **learning-distill** |
| Portable per-skill specs          | `.agents/skills/<skill>/CONTRACT.md`                                                                |
| Illustrated consumer tree         | Regenerated `example/.agents/`                                                                      |
