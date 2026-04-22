# Plan frontmatter contract (write-plan)

This document defines the YAML and placement rules for maintainer **plans** under `.agents/docs/plans/`. It ships **inside the write-plan skill** so agents using a skill-only install still have the contract in-tree.

When the full kit is present, the same rules are recorded in [`.agents/docs/MAINTENANCE.md`](../../docs/MAINTENANCE.md#frontmatter-contract-plans). If anything disagrees, **MAINTENANCE.md** is authoritative until this file is updated.

## Where plans live

| Location | Role |
| --- | --- |
| `.agents/docs/plans/*.md` | Active plans |
| `.agents/docs/plans/archive/*.md` | Retired plans (same `id` as before the move) |

Ignore `plans/index.md` for frontmatter unless you intentionally add plan-style metadata there.

## Global `id` namespace

Plan **`id`** values must be **unique across** all of:

- `.agents/docs/decisions/*.md` (except `index.md`)
- `.agents/docs/troubleshooting/*.md` (except `index.md`)
- `.agents/docs/plans/*.md` (except `index.md`)
- `.agents/docs/plans/archive/*.md`

The filename stem (without `.md`) **must equal** `id`. Use lowercase `[a-z0-9_-]` only. Prefer a prefix such as `plan-` when a slug might collide with a decision or troubleshooting entry.

## Required YAML keys (every plan entry)

- `id` — stable slug; must match filename; globally unique as above.
- `title` — short human title (JSON-quoted in YAML if it contains colons).
- `last_updated` — `YYYY-MM-DD`; bump when the plan meaningfully changes.
- `description` — one or two sentences, machine-oriented (docs-search uses this in listings).
- `tags` — non-empty YAML **list** of lowercase `[a-z0-9_-]` labels (not a comma-separated scalar).
- `status` — plan lifecycle (see table below). **Not** the same vocabulary as decision `status`.

### Plan `status` values (lowercase only)

| Value | Meaning |
| --- | --- |
| `draft` | Outline; not committed as direction |
| `active` | Current initiative; work may proceed |
| `paused` | Intentionally on hold |
| `completed` | Outcomes achieved; body lists where knowledge landed |
| `cancelled` | Stopped without outcomes; body records why |
| `superseded` | Replaced by another plan; set `superseded_by` |
| `archived` | Obsolete context kept for history only |

## Optional YAML keys

- `kind` — `initiative` \| `meta` \| `exploration` (default: treat as `initiative` if omitted).
- `related_decisions` — list of durable entry **ids** (from `decisions/` or `troubleshooting/`).
- `anticipated_decisions` — planned decision slugs not yet filed.
- `outcome_decisions` — durable entry ids produced or materially updated by this plan.
- `supersedes` / `superseded_by` — other plan `id` values.
- `related_plans` — other plan `id` values.
- `consumer_portable` — boolean; `true` if the plan is intended to ship in generated `example/`.
- `author_kind` — `human` \| `ai` (audit).
- `prompter` — free text when `author_kind` is `ai`.

Use `author_kind` / `prompter` instead of legacy `writer` / `created` fields.

## Example frontmatter

```yaml
---
id: plan-example-initiative
title: "Example initiative"
last_updated: 2026-04-22
description: >
  Short summary for search results and indexes.
tags: [docs, plans]
status: draft
kind: initiative
related_decisions: [single-tree-architecture-agents]
consumer_portable: false
author_kind: ai
prompter: example
---
```

## Archive

When a plan reaches a terminal state and should leave the active set: move the file to `plans/archive/` with `git mv`, keep the same `id` and basename, bump `last_updated`, then sweep repo links.

## Plan-only rule

Plans are **intent and roadmap** documents. They do **not** change shipped skill behavior until a maintainer explicitly requests implementation.
