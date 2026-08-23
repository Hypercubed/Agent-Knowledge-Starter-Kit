---
type: skill-reference
title: "docs-lint Skill"
description: "Checklist-driven periodic pass over the .agents/ knowledge layer for duplication, contradictions, staleness, oversized guidance, index gaps, and frontmatter contract violations."
tags: [skills, docs-lint, lint, maintenance]
timestamp: 2026-08-23T18:30:00Z
---

# docs-lint

**Folder:** `.agents/skills/docs-lint/` · **Files:** `SKILL.md`, `CONTRACT.md`, `bootstrap/README.md`

## Goal

Keep the compiled repo knowledge layer coherent, minimal, and current. This is a **procedure-and-checklist skill only — no bundled executable script**. The maintainer (or agent) runs the checks by inspection, aided by sibling skills.

## Inputs (read-only scope)

`.agents/AGENTS.md`, `.agents/docs/MAINTENANCE.md` + `index.md` + `log.md`, `.agents/docs/decisions/` and `troubleshooting/` with their entries and indexes, and `.agents/playbooks/`.

## Initialization — depends on learning-distill templates

This kit keeps exactly **one** copy of scaffold templates under learning-distill's `bootstrap/`; docs-lint's own bootstrap folder contains only a README pointing there. Initialization requires learning-distill to be present (install or copy it first if missing), then performs the same copy-missing-only scaffold steps and adds its **Skills docs registry** row to `MAINTENANCE.md`. If sessions layout is also missing, it defers to learning-distill or task-closeout initialization.

## Refresh before lint

When durable entries were added, removed, or renamed, run the optional compiler first so indexes are fresh:

```bash
python .agents/skills/docs-compile/scripts/docs-compile.py
```

If docs-compile isn't installed, continue linting but skip freshness checks that depend on generated indexes. Use [docs-search](docs-search.md) (`search-docs.py "<topic>"`) as the discovery tool inside several checks below rather than relying on manual reading alone.

## The checks

- **Duplicate guidance** — search key terms from each major guidance block in AGENTS.md / decisions / troubleshooting; multiple high-ranked hits on one topic are dedup candidates.
- Contradictions between entries.
- Stale or superseded rules; troubleshooting entries that should be decisions/playbooks; decisions that should compress into AGENTS guidance.
- Oversized AGENTS sections.
- Missing index coverage in `.agents/docs/index.md`.
- Broken links in indexes and cross-links.
- **Index/entry alignment** — when section `index.md` files exist, verify listed files exist; each entry has frontmatter `id` aligned with filename slug; `id` values unique within each folder; `depends_on` uses qualified `decisions/…`/`troubleshooting/…` form.
- **Durable entry metadata contract** — read frontmatter (not just prose) for required `id`, `title`, `last_updated`, `description`, list-typed `tags`; `status` present on decisions (`accepted|superseded|provisional`), absent on troubleshooting; optionally validate against the JSON Schemas under `learning-distill/references/`.
- **Uncategorized knowledge** — search for related entries; propose merge if found, new category otherwise.
- **Mechanical path hygiene** — grep for doubled `.agents/.agents` segments under `.agents/`, `README.md`, `INSTALL.md`, `docs/` (symptom of bad global replace); the same check hard-fails in `scripts/check-publish.sh`.

## Outputs and constraints

Produce a **lint report** plus optional minimal edits. Do **not** append to `.agents/docs/log.md` unless explicitly asked — distillation owns that file. Prefer reclassification and compression over adding text; do not modify source code; do not delete knowledge without explicit justification.

The contract's "Commands used during a lint pass" table documents the refresh/search commands as optional-skill integrations, keeping this folder self-describing even when installed alone.

## Repurpose horizon (2.0)

Active change `adopt-openspec-openwiki` converts this skill into a **cross-tool lint** (`cross-tool-lint` capability): routing-block integrity (root AGENTS.md / CLAUDE.md OpenWiki markers), archived-change↔wiki coverage pairing (with a recorded-deferral exemption), and stale-decision detection. Index-coverage checks move out of scope — the wiki tooling owns indexes once `docs-compile` retires. See [OpenSpec workflow](../governance/openspec-workflow.md).
