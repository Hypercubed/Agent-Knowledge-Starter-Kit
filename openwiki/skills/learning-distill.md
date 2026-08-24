---
type: skill-reference
title: "learning-distill Skill"
description: "Converts a gitignored session bundle into durable knowledge routed by kind: descriptive lessons become curated OKF wiki pages authored directly by the distilling agent under openwiki/, prescriptive lessons stay in .agents/; fail-closed prerequisites, deterministic index refresh, no log file."
tags: [skills, learning-distill, distillation, knowledge, okf]
timestamp: 2026-08-23T23:30:00Z
openwiki:
  roles: [workflow, domain]
  source_paths:
    - .agents/skills/learning-distill/SKILL.md
    - .agents/skills/learning-distill/references/CONTRACT.md
    - .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
  symbols: ["createSystemPrompt", "validateOkfFrontmatter", "synchronizeWikiIndexes"]
  invariants: ["Distillation fails closed before any wiki write when peer tools or the curation contract are missing.", "Descriptive lessons never go to .agents/; prescriptive rules never go to the wiki.", "Never invokes openwiki --update; index refresh is deterministic via sync_wiki_indexes.mjs."]
---

# learning-distill

**Folder:** `.agents/skills/learning-distill/` · **Files:** `SKILL.md`, `references/CONTRACT.md`, `references/*.schema.json`, `bootstrap/` (AGENTS.md, playbooks/, sessions/)

## Goal and inputs

Convert raw task evidence into concise durable knowledge, **routed by kind**:

- **Descriptive** (facts, rationale, architecture, troubleshooting patterns, repo decisions) → curated OKF pages under `openwiki/{decisions,troubleshooting}/` and topical pages under `openwiki/`.
- **Prescriptive** (agent behavior rules, procedures) → `.agents/AGENTS.md` or `.agents/playbooks/`.

Inputs: one session bundle under `.agents/sessions/<bundle>/` (layout per [task-closeout](task-closeout.md)), `.agents/AGENTS.md`, `.agents/playbooks/`, `openwiki/INSTRUCTIONS.md` (the curation contract), and existing curated pages. Canonical identity is the bundle's `summary.json` `task_id` — never the folder name.

## Prerequisites (fail closed)

Before writing any wiki output, verify; on failure stop without writing and print remediation:

1. Peer binaries on PATH: `node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki`
2. `openwiki/INSTRUCTIONS.md` exists **and** carries the `AKSK:WIKI-CONTRACT` markers. If missing or stub-only, run `node .agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs`.

Treating an absent contract as "nothing curated" could silently regenerate away hand-curated pages, so absence fails closed (design decision D3 of the archived step-1 change `adopt-openspec-openwiki`, now spec'd under [`openspec/specs/distill-routing/`](../../openspec/specs/distill-routing/spec.md)).

## Skill initialization (before first distillation)

Idempotent, once per repo. Creates only what a consumer needs:

- `.agents/playbooks/README.md` (from `bootstrap/playbooks/`)
- `.agents/sessions/README.md` (from `bootstrap/sessions/`)
- `.agents/AGENTS.md` template (copy-missing-only)
- session ignore lines merged into `.agents/.gitignore` (`sessions/*`, `!sessions/README.md`)
- runs the aksk-bootstrap peer-tool check and contract attachment so the wiki side is ready

The kit's durable knowledge base lives in the wiki; this skill **no longer seeds any `.agents/docs/` scaffold**.

## Finding bundles under gitignore

**Invariant:** per-task folders under `.agents/sessions/` are deliberately gitignored (only `README.md` tracked), so many search and listing tools skip them by default. **Never conclude that no bundles exist based on an ignore-aware search or glob.** Locate bundles with at least one method that sees ignored files:

- filesystem listing (`ls`, `find`, shell APIs) rather than an IDE index;
- ripgrep with `--no-ignore-vcs` (or `--no-ignore` when scoped to the sessions subtree).

Then open each candidate's `summary.json`: treat `task_id` as canonical and filter/prioritize using state fields (`distilled`, `status`, `distillation_status`) instead of folder names. This failure mode also has a curated entry at [`troubleshooting/session-discovery-fails-during-distillation-or-closeout`](../../openwiki/troubleshooting/session-discovery-fails-during-distillation-or-closeout.md).

## Procedure

1. Locate and read the correct bundle per the invariant above; read `task_id` from `summary.json`.
2. Search related existing knowledge with grep over `openwiki/` (page bodies are plain Markdown) before comparing manually. For decision- or requirement-shaped candidates, also search `openspec/specs/` — a rule already codified as a SHALL requirement there must **not** be duplicated as a wiki page.
3. Compare candidates against existing knowledge; remove duplication.
4. Classify each lesson.
5. For wiki-bound lessons, load authoring guidance at runtime from the installed package — with `NPM_ROOT="$(npm root -g)"`, import `openwiki/dist/agent/prompt.js` and call `m.createSystemPrompt(process.argv[1] ?? "init")` (`init` for new pages, `update` for edits) — then author the page directly under the correct curated tree following OKF frontmatter rules, and validate it with `dist/okf/frontmatter.js`'s `validateOkfFrontmatter(file)`; fix every reported issue before continuing. The exact node one-liners are in [`SKILL.md`](../../.agents/skills/learning-distill/SKILL.md).
6. Draft minimal updates to `.agents/AGENTS.md` or playbooks for prescriptive lessons.
7. Refresh wiki indexes deterministically (never via the CLI): `node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs`.
8. Mark the session bundle as distilled (its `summary.json` flags).

There is no activity log to append; accountability lives in the bundle flags plus git history.

## Classification categories

| Category | Destination | Bar |
| --- | --- | --- |
| ephemeral | stays in bundle | one-off detail |
| AGENTS guidance | `.agents/AGENTS.md` | high confidence, broadly useful, likely to recur, concise, actionable |
| playbook | `.agents/playbooks/<name>.md` | multi-step procedure |
| decision record | `openwiki/decisions/<slug>.md` | rationale needing explanation later |
| troubleshooting record | `openwiki/troubleshooting/<slug>.md` | recurring failure + fix |
| descriptive lesson | topical page under `openwiki/` | stable fact or pattern worth keeping |

Entry-file rules: filename stem is the identity, unique within its tree; page frontmatter is OKF base plus AKSK extensions (`aksk_status` on decisions, optional `aksk_superseded_by`, optional qualified `aksk_depends_on`) — see [knowledge layer](../architecture/knowledge-layer.md). Validation against the JSON Schemas in `references/` is available.

## Allowed writes (contract)

- Wiki (only after prerequisite checks pass): `openwiki/decisions/*.md`, `openwiki/troubleshooting/*.md`, `openwiki/<topic>.md`; deterministic index sync via `sync_wiki_indexes.mjs`
- `.agents/AGENTS.md` (only lessons meeting the AGENTS criteria) and `.agents/playbooks/*.md`
- the bundle's own `summary.json` distillation flags

**Never:** OpenWiki-owned files (`index.md`, run metadata like `.last-update.json`) except through index sync; `openspec/`; source code outside the knowledge layer; invented rules unsupported by evidence; narrative expansion of AGENTS.md; secrets/private data anywhere durable.

## Evidence of behavior

The migration itself was distilled through this path: the curated trees now hold 23 decision pages and 26 troubleshooting pages migrated from (or grown after) the former `.agents/docs/` base, each carrying `aksk_status` (see [overview](../overview.md)). End-to-end dogfood validation of a fresh distill run — bundle selection, fail-closed triggers, OKF authoring, index sync, distilled flagging — was executed as bundle `20260823-240000-dogfood-distill-e2e` (task 5.2 of the archived step-1 change, [OpenSpec workflow](../governance/openspec-workflow.md)).
