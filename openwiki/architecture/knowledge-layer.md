---
type: knowledge-layer-contract
title: "The .agents/ Knowledge Layer"
description: "The durable knowledge tree under .agents/: AGENTS.md policy file, docs schema and frontmatter contract, decisions and troubleshooting entries, playbooks, log policy, plan archive, and the gitignored sessions model."
tags: [knowledge-layer, frontmatter, agents, documentation]
timestamp: 2026-08-23T18:30:00Z
---

# The `.agents/` Knowledge Layer

`.agents/` is the compiled, durable knowledge layer that the kit installs into consumer repositories. Everything under it (except `sessions/` bundles) is meant to be tracked in git and shared across agents and humans. This page documents the tree's structure and its normative contracts. The lifecycle that writes into it is covered by [Task lifecycle](task-lifecycle.md); the skills that read/write each part are indexed under [Skills](../skills/index.md).

**Scope boundary ahead:** the AKSK 2.0 repositioning keeps this tree as the home of *prescriptive* agent-behavior knowledge only; *descriptive* repo knowledge (architecture rationale, troubleshooting patterns) would distill into OKF wiki pages under `openwiki/` instead. The existing decisions/troubleshooting base is explicitly not migrated. See [OpenSpec workflow](../governance/openspec-workflow.md).

## Tree shape

```text
.agents/
├── AGENTS.md            # compact durable repo policy for future agents
├── .gitignore           # sessions/* + !sessions/README.md
├── docs/
│   ├── MAINTENANCE.md   # normative schema & policy document
│   ├── index.md         # catalog of knowledge assets
│   ├── log.md           # append-only maintenance record
│   ├── decisions/       # one markdown file per decision + index.md
│   ├── troubleshooting/ # one markdown file per pattern + index.md
│   └── plan-archive/    # retired maintainer plans (historical)
├── playbooks/           # durable multi-step procedures (sibling of docs/)
├── sessions/README.md   # only tracked session file
├── workflows/           # opsx-* slash-command definitions (OpenSpec fork)
└── skills/              # portable skills; see Skills index
```

## `.agents/AGENTS.md`

In this repository the portable `AGENTS.md` contains two parts:

- **Routing directives** — behavioral triggers such as: upon startup read `.agents/docs/index.md` before file modifications; on a failing test/build/runtime error, first execute docs-search with the error output as the query; before architectural changes, search `.agents/docs/decisions/`.
- **Project learnings** — short distilled rules (e.g., the skill-renaming workflow; always include an initial "Starting..." message and `--verbose` flag in npx-based scripts so agents do not assume hangs).

The [bootstrap template version](../distribution/packaging-and-install.md) ships the same routing directives plus placeholder sections (Build and test / Coding conventions / Recurring pitfalls / Before submitting changes) and explicit "what does not belong here" rules. Its **Maintenance rules** section encodes placement discipline: rationale goes to `decisions/`, recurring failures to `troubleshooting/`, multi-step procedures to `playbooks/`, temporary artifacts stay in `sessions/`, and `log.md` is appended only during learning-distill runs.

The relationship to root `AGENTS.md` is doctrine from `/INSTALL.md`: root file = agent entrypoint for the checkout; `.agents/AGENTS.md` = portable knowledge-layer file; exactly one source of truth per instruction.

## MAINTENANCE.md — the schema authority

`.agents/docs/MAINTENANCE.md` defines the knowledge model and wins precedence conflicts with skill contracts:

| Topic | Authority |
| --- | --- |
| Durable YAML for `decisions/` and `troubleshooting/`; logging; task bundle lifecycle; distillation policy; index prose conventions | `MAINTENANCE.md` |
| Script paths, flags, generated filenames, session bundle artifacts | the skill's `CONTRACT.md` |

### Frontmatter contract (durable entries)

Applies to every entry under `decisions/` and `troubleshooting/` except each folder's `index.md`. JSON Schemas live at `.agents/skills/learning-distill/references/decision-frontmatter.schema.json` and `troubleshooting-frontmatter.schema.json`.

Required keys (all entries):

- `id` — stable slug matching the filename without `.md`, lowercase `[a-z0-9_-]`, unique **within that folder**.
- `title` — short human title.
- `last_updated` — ISO calendar date `YYYY-MM-DD`.
- `description` — one or two machine-oriented summary sentences.
- `tags` — non-empty YAML **list** of lowercase `[a-z0-9_-]` labels (never a comma-separated scalar string).

Decisions-only key: `status` with values `accepted`, `superseded`, or `provisional`. Troubleshooting entries must **not** carry `status` in `MAINTENANCE.md` prose, though the troubleshooting JSON Schema additionally permits an enum value of `obsolete` — the schema-level formalization of the superseded/obsolete convention below.

Optional key: `depends_on` — YAML list of **qualified references** `decisions/<slug>` or `troubleshooting/<slug>`, where `<slug>` equals the target entry's `id`.

Body shapes are conventional rather than enforced: decisions use `### Decision`, `### Status`, `### Context`, `### Rationale`, `### Consequences`; troubleshooting entries use `#### Symptom`, `#### Likely causes`, `#### Fix`, `#### Validation`.

## Decisions and troubleshooting content

The dogfooded layer currently holds 17 decision entries and 24 troubleshooting patterns (excluding each folder's `index.md`). Representative anchors:

- [`single-tree-architecture-agents`](../../.agents/docs/decisions/single-tree-architecture-agents.md) — canonical kit lives only under root `.agents/`; depends on the internal-skill-flag and regenerate-example decisions.
- [`docs-tooling-scripts-resolve-target-from-override-then-nearest-agents`](../../.agents/docs/decisions/docs-tooling-scripts-resolve-target-from-override-then-nearest-agents.md) — why scripts honor `--agents-root`/`AGENTS_ROOT` before walking parents for `.agents`.
- [`session-discovery-fails-during-distillation-or-closeout`](../../.agents/docs/troubleshooting/session-discovery-fails-during-distillation-or-closeout.md) — ignore-aware search hiding bundles; the fix list mirrors the distill skill's discovery invariant.

Both sections carry generated `## Index` blocks plus a **human-curated Quick Reference** above them (see [docs-compile](../skills/docs-compile.md)).

## Playbooks

`.agents/playbooks/` holds durable multi-step procedures as a sibling of `docs/`, not inside it. Shipped examples: `pre-publish.md` (validation sequence around `check-publish.sh`), `major-version-release.md` (deprecated-artifact grep, portability review, example regeneration), `generate-example.md` (the never-hand-copy rule), and `writing-integration-guides.md` (the integration-guide method). An active OpenSpec change (`adopt-workflows-taxonomy`) proposes merging this directory into `workflows/` under unified OpenSpec terminology — see [OpenSpec workflow](../governance/openspec-workflow.md).

## log.md policy

Append-only record of maintenance actions. Rows follow the bootstrap template: date, workflow name (`learning-distill` | `docs-lint`), task id, outcome (`updated` | `proposed` | `no net durable edits`), files touched, classification counts, and brief notes. Constraints: no secrets, personal data, private business details, long raw outputs, or copied transcript text; routine maintenance does not append rows — distillation is the routine writer.

## Sessions model

Per-task closeout bundles live under `.agents/sessions/YYYYMMDD-HHMMSS-short-topic/`. `.agents/.gitignore` ignores `sessions/*` while un-ignoring `sessions/README.md`, so the folder exists in fresh clones with zero bundle noise. Repositories that intentionally don't track `.agents/.gitignore` replicate the equivalent patterns in the repo-root `.gitignore` (`.agents/sessions/*` and `!.agents/sessions/README.md`). Bundle immutability after closeout (except status/distillation fields) is defined in [Task lifecycle](task-lifecycle.md).

## Plan archive

`.agents/docs/plan-archive/` preserves six pre-OpenSpec maintainer plans (e.g., `plans-as-first-class-artifacts.md`, `replace-indexing-with-ripgrep.md`) with their own index. They are historical: maintainer planning moved to `openspec/changes/` when plans were migrated to OpenSpec (see [governance history](../governance/openspec-workflow.md)). A superseded decision entry still describes plans living under `.agents/docs/plans/`; the migration made that location obsolete.

## Deprecating durable knowledge

The formalized convention (OpenSpec change `formalize-superseded-obsolete`) uses a triple lock so both humans and agents recognize inactive guidance in indexes: (1) move the row to a `## Superseded` / `## Obsolete` section at the bottom of the index, (2) prefix the item with bold text `**[SUPERSEDED]**` or `**[OBSOLETE]**`, (3) strike through the link text, e.g. `~~Title~~`. Frontmatter-level lifecycle complements this via `status: superseded` on decisions and the schema-permitted `status: obsolete` on troubleshooting entries.

## Validation

- Structure of the whole tree (required files present, sessions tracking clean, SKILL.md frontmatter valid): `bash scripts/check-agents-structure.sh .agents` — detailed on [Validation scripts](../skills/generate-example-and-scripts.md).
- Entry frontmatter conformance can be checked against the JSON Schemas above; [docs-lint](../skills/docs-lint.md) verifies the same contract by inspection during periodic passes.
