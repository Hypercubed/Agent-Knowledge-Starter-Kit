# Template .agents Maintenance Rules

## Purpose

This file belongs in `.agents/docs/`, alongside `.agents/AGENTS.md`.

## Knowledge model

- Session bundles under `.agents/sessions/` are raw evidence.
- Files in `.agents/` are synthesized durable knowledge.
- Durable knowledge should be incremental, concise, and reviewable.
- Architectural decisions live under `.agents/docs/decisions/` (one file per decision plus `index.md`). Troubleshooting patterns live under `.agents/docs/troubleshooting/` (one file per pattern plus `index.md`). Maintainer **plans** (initiatives and roadmaps) live under `.agents/docs/plans/` when you create that folder and add files (typically via **write-plan**). Each **entry** file in `decisions/`, `troubleshooting/`, and `plans/` carries YAML frontmatter so tools can parse metadata without reading the body. Session bundles under `.agents/sessions/` remain temporary evidence, not plans.

## Entry `id` and qualified graph references

- **Document `id`:** for every entry file under `decisions/`, `troubleshooting/`, or `plans/` (excluding each folder’s `index.md`), frontmatter `id` **must equal** the filename stem (without `.md`), lowercase `[a-z0-9_-]`, **unique within that folder only**. Filenames do **not** encode a type prefix; disambiguation lives in **qualified references** (below) and in normal Markdown paths.

- **Qualified reference** (for edges in YAML where the target kind is not obvious): `decisions/<slug>`, `troubleshooting/<slug>`, or `plans/<slug>` — the part after `/` is always the **same string** as that entry’s `id` / filename stem. Example: `depends_on: [decisions/example-upstream-topic, troubleshooting/example-known-failure]`.

- **Markdown links:** keep using normal relative file paths (for example `../decisions/example-upstream-topic.md` from a plan); those already disambiguate by directory.

## Entry shape

When adding a new markdown file under `decisions/` or `troubleshooting/`, follow the frontmatter and body headings used by existing entries in that folder, including the [Frontmatter contract](#frontmatter-contract-durable-entries) below. When adding a plan under `plans/`, follow the [Frontmatter contract (plans)](#frontmatter-contract-plans) and the portable rules in [`write-plan` `CONTRACT.md`](../skills/write-plan/CONTRACT.md) (see also [Portable skill contracts](#portable-skill-contracts)). During **knowledge-lint**, verify contracts by inspection (duplicate `id`, missing keys, scalar `tags` instead of a list, `status` only on decisions for durable entries, plan `status` vocabulary for `plans/`, and so on). Automated enforcement may be added later as maintainer-only tooling.

### Frontmatter contract (durable entries)

Applies to every `*.md` file under `decisions/` and `troubleshooting/` **except** each folder’s `index.md`.

**Required keys (all entries):**

- `id`: stable slug, **must match** the filename without `.md`, lowercase `[a-z0-9_-]`, **unique within this folder**.
- `title`: short human title (quoted if it contains colons).
- `last_updated`: ISO calendar date `YYYY-MM-DD`.
- `description`: one or two sentences summarizing the entry for query and index output (machine-oriented).
- `tags`: non-empty YAML **list** of topic labels (`auth`, `build`, `testing`, `release`, `docs`, `sessions`, `skills`, and so on). Each tag is lowercase `[a-z0-9_-]` only—**not** a comma-separated scalar string.

**Required keys (`decisions/` only):**

- `status`: lifecycle for the decision record: `accepted`, `superseded`, or `provisional` (lowercase). Prefer aligning the body’s status section with this value.

**Optional keys (any entry):**

- `depends_on`: YAML **list** of **qualified references** to other durable entries: each item is `decisions/<slug>` or `troubleshooting/<slug>` (see [Entry `id` and qualified graph references](#entry-id-and-qualified-graph-references)). Use this when there is a hard dependency or ordering readers should follow. Omit the key when there is no explicit graph edge.

**Do not** put `status` on troubleshooting entries; lifecycle applies to decision records.

### Frontmatter contract (plans)

The **write-plan** skill also ships a portable copy of this contract at `.agents/skills/write-plan/CONTRACT.md` for skill-only installs. Other user-facing skills ship their own `CONTRACT.md` files; see [Portable skill contracts](#portable-skill-contracts).

Applies to every `*.md` file under **`plans/`** and **`plans/archive/`**, except `plans/index.md` and any other index or README files unless they intentionally adopt plan frontmatter.

Plan `id` values are **unique within** `plans/` and `plans/archive/` only. The same stem may appear under `decisions/` or `troubleshooting/`; use **qualified** `plans/…`, `decisions/…`, or `troubleshooting/…` references in plan metadata whenever the target kind matters.

**Required keys (plans):**

- `id`: stable slug, **must match** the filename without `.md`, lowercase `[a-z0-9_-]`.
- `title`: short human title (quoted if it contains colons).
- `last_updated`: ISO calendar date `YYYY-MM-DD`.
- `description`: one or two sentences, machine-oriented (used by docs-search listings).
- `tags`: non-empty YAML **list** of lowercase `[a-z0-9_-]` labels.
- `status`: plan lifecycle, **distinct** from decision `status`. Allowed values: `draft`, `active`, `paused`, `completed`, `cancelled`, `superseded`, `archived` (all lowercase).

**Optional keys (plans):** `kind` (`initiative` | `meta` | `exploration`), `anticipated_decisions` (planned **`decisions/<slug>`** pointers not yet filed), `outcome_decisions` (**`decisions/<slug>`** or **`troubleshooting/<slug>`** pointers), `supersedes` / `superseded_by` (**`plans/<slug>`** pointers), `related_plans` (other **`plans/<slug>`** pointers), `consumer_portable` (boolean), `author_kind`, `prompter`.

**Cross-links to decisions or troubleshooting:** do **not** use a `related_decisions` YAML list. Add a **`## Related decisions`** section in the plan **body** with Markdown bullet links to `../decisions/<id>.md` or `../troubleshooting/<id>.md` (see `.agents/skills/write-plan/CONTRACT.md`).

**Provenance:** use `author_kind` and `prompter` instead of legacy `writer` / `created` fields.

**Archive:** when a plan is terminal, move `.agents/docs/plans/<id>.md` to `.agents/docs/plans/archive/<id>.md` (same basename; same `id` in frontmatter), bump `last_updated`, then sweep links in decisions, playbooks, indexes, and other plans.

### Linking rules (for indexes, maps, and prose)

- Link to another durable entry using a **relative** Markdown link to that file, for example `[Related topic](related-topic.md)` from a file in the same folder.
- Prefer **sibling** paths (`other-id.md`) or explicit relative paths (`../MAINTENANCE.md`) so links stay stable when the repo is checked out on different machines.
- Avoid bare URLs as the only pointer when a durable repo file exists; URLs are fine for external references.

### Example (`decisions/`)

```yaml
---
id: example-policy
title: "Example decision title"
last_updated: 2026-04-19
description: >
  One or two sentences explaining what the reader gets from this file
  and how it relates to the kit.
tags: [architecture, agents]
status: accepted
depends_on: [decisions/example-parent-topic]
---
```

### Example (`troubleshooting/`)

```yaml
---
id: example-troubleshooting-pattern
title: "Example troubleshooting title"
last_updated: 2026-04-19
description: >
  One or two sentences on the failure mode and who should read this entry.
tags: [git, markdown, tooling]
---
```

### Entry body shape (optional headings)

**Decision entries** under `decisions/` often use body sections such as `### Decision`, `### Status` (human-readable; mirror `status` in frontmatter), `### Context`, `### Rationale`, and `### Consequences`.

**Troubleshooting entries** under `troubleshooting/` often use `#### Symptom`, `#### Likely causes`, `#### Fix`, and `#### Validation`.

If you adopt heavier compile or index tooling, record the choice in your own `decisions/` files; keep markdown under `.agents/` as the source of truth and prefer thin local scripts over opaque pipelines.

## Portable skill contracts

User-facing kit skills ship a machine-oriented `CONTRACT.md` beside `SKILL.md` so agents that receive **only** that skill folder still have stable rules for script entrypoints, CLI flags, output paths, bundle filenames, and JSON shapes. Maintainer-only **generate-example** does not ship a separate consumer contract unless we add one later.

### Precedence

| When guidance overlaps                                                                                                                        | Authority                 |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| Durable YAML for `decisions/`, `troubleshooting/`, and `plans/`; logging; task bundle lifecycle; distillation policy; index prose conventions | This `MAINTENANCE.md`     |
| Script paths, flags, generated filenames, session bundle artifacts | The skill’s `CONTRACT.md` |

If a skill `CONTRACT.md` disagrees with this file on an overlapping topic (for example plan frontmatter wording), **this `MAINTENANCE.md` wins** until the skill contract is updated.

### Contract locations

| Skill            | Portable contract                                       |
| ---------------- | ------------------------------------------------------- |
| docs-search      | [`CONTRACT.md`](../skills/docs-search/CONTRACT.md)      |
| docs-compile     | [`CONTRACT.md`](../skills/docs-compile/CONTRACT.md)     |
| knowledge-lint   | [`CONTRACT.md`](../skills/knowledge-lint/CONTRACT.md)   |
| learning-distill | [`CONTRACT.md`](../skills/learning-distill/CONTRACT.md) |
| task-closeout    | [`CONTRACT.md`](../skills/task-closeout/CONTRACT.md)    |
| write-plan       | [`CONTRACT.md`](../skills/write-plan/CONTRACT.md)       |

## Skills docs registry

This section is the registry for how skills interact with `.agents/docs/` and related durable knowledge files. Skill-local operational details (CLI flags, output paths, JSON fields, required files) live in each skill's `CONTRACT.md`.

When adding a new skill that reads or writes `.agents/docs/`, add a row here and include:

- whether it reads and/or writes durable docs
- which durable paths it owns or updates
- where its operational contract lives

| Skill                              | Docs interaction                                                     | Durable paths touched                                                                    | Contract                                                |
| ---------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| docs-search                        | reads docs; fallback search mechanism                                | reads `.agents/docs/**/*.md` directly via scripts | [`CONTRACT.md`](../skills/docs-search/CONTRACT.md)      |
| docs-compile                       | reads docs; writes derived indexes                                   | writes `.agents/docs/*/index.md`                                                         | [`CONTRACT.md`](../skills/docs-compile/CONTRACT.md)     |
| knowledge-lint                     | reads docs; may suggest or apply minimal edits                       | `.agents/AGENTS.md`, `.agents/docs/**`, `.agents/playbooks/**`                           | [`CONTRACT.md`](../skills/knowledge-lint/CONTRACT.md)   |
| learning-distill                   | reads session bundles; writes durable docs and `.agents/docs/log.md` | `.agents/docs/**`, `.agents/AGENTS.md`, `.agents/playbooks/**`                           | [`CONTRACT.md`](../skills/learning-distill/CONTRACT.md) |
| task-closeout                      | writes temporary bundle only; no durable docs edits                  | `.agents/sessions/**`                                                                    | [`CONTRACT.md`](../skills/task-closeout/CONTRACT.md)    |
| write-plan                         | writes plan docs and contributes plan contract                       | `.agents/docs/plans/**`                                                                  | [`CONTRACT.md`](../skills/write-plan/CONTRACT.md)       |
| generate-example (maintainer-only) | rebuilds `example/` mirror for validation/demo                       | `example/.agents/**` (generated output)                                                  | none (maintainer-only)                                  |

### Registry row template (for new skills)

When a skill bootstrap introduces or updates docs behavior, add or refresh one row in the table above:

| Skill          | Docs interaction                | Durable paths touched                                | Contract                       |
| -------------- | ------------------------------- | ---------------------------------------------------- | ------------------------------ |
| `<skill-name>` | reads docs / writes docs / both | explicit `.agents/...` path globs owned by the skill | relative link to `CONTRACT.md` |

Keep this row synchronized with that skill's initialization steps in `SKILL.md`.

## Shared durable policies

These policies stay centralized here because they are cross-skill and must not drift:

- frontmatter contracts for durable entries and plans (above)
- precedence between this file and skill contracts ([Portable skill contracts](#portable-skill-contracts))
- task bundle lifecycle boundaries
- distillation logging constraints
- lint hygiene expectations

### Distillation placement

A lesson belongs in `.agents/AGENTS.md` only if it is stable, concise, broadly applicable, actionable, and high confidence. Keep rationale and nuanced history in `.agents/docs/` entries or playbooks.

### Task bundle boundary

Task bundles under `.agents/sessions/` are temporary evidence and should be treated as immutable after closeout except for status/distillation updates in `summary.json`. Closeout writes bundle files; durable knowledge updates are owned by `learning-distill`.

### Logging boundary

Do not append to `.agents/docs/log.md` for routine maintenance. Append concise, non-sensitive rows primarily during successful `learning-distill` runs (or when explicitly requested).

### Lint hygiene baseline

Use `knowledge-lint` guidance for checklist details. After broad markdown edits, re-check durable frontmatter conformance, verify qualified graph references, and scan for doubled `.agents/` path segments before publishing.
