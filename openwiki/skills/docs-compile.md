---
type: skill-reference
title: "docs-compile Skill"
description: "Two-script Python pipeline that regenerates section index.md files under .agents/docs/ from entry frontmatter while preserving human-curated content above the ## Index marker."
tags: [skills, docs-compile, indexes, python]
timestamp: 2026-08-23T18:30:00Z
---

# docs-compile

**Folder:** `.agents/skills/docs-compile/` · **Scripts:** `scripts/docs-compile.py` (orchestrator), `scripts/generate-durable-indexes.py` (index generator)

## What it does

Regenerates derived documentation artifacts: one `index.md` per **immediate subdirectory** of `.agents/docs/` (`decisions/`, `troubleshooting/`, `plan-archive/`, any future section). Optional for search correctness — [docs-search](docs-search.md) works without indexes — but required hygiene after distillation writes: [learning-distill](learning-distill.md) and [docs-lint](docs-lint.md) both invoke it when installed.

## Pipeline

<!-- openwiki: mermaid parse failed and this diagram was converted to a text fence so it does not break rendering. Fix the diagram source and restore the mermaid fence. Parser error: Heuristic: an unescaped angle bracket inside a label breaks rendering; rephrase the label. -->
```text
flowchart LR
    A["docs-compile.py"] -->|"AGENTS_ROOT or<br/>walk parents for .agents"| B["chdir to repo root"]
    B --> C{"generate-durable-indexes.py<br/>exists?"}
    C -->|yes| D["subprocess run,<br/>no extra args"]
    C -->|no| E["print skip message"]
    D --> F["docs-compile: done."]
    E --> F
```

*Caption: orchestrator flow in `docs-compile.py`; a missing helper degrades to a printed skip rather than an error.*

The orchestrator resolves `.agents` via `AGENTS_ROOT` (normalized so basename must be `.agents`) else by walking parents of cwd; failure exits 1. It then `cd`s to the repo root before spawning the generator.

## The index generator

`generate-durable-indexes.py` (Python 3.9+, PyYAML) behavior:

- **Targets:** every immediate subdirectory of `<agents-root>/docs/`, or repeatable `--target/-t DIR` overrides; `--dry-run` prints actions and exits **2** if anything would change.
- **Entry collection:** reads YAML frontmatter of each sibling `*.md` except `index.md`; warns on missing title/description/tags, non-list `tags`, `id` ≠ filename stem, slug regex violations, decisions missing valid `status` (`accepted|superseded|provisional`), troubleshooting carrying `status`.
- **Sorting:** entries sorted casefold-by-title then filename.
- **Kind inference:** folder name decides template flavor — `decisions`, `troubleshooting`, `plans`, or generic.
- **Human-content preservation:** `_parse_existing_index()` keeps frontmatter `id`/`title` and everything above the `## Index` heading (the human-editable blurb, where Quick Reference sections live). Regeneration reassembles parsed blurb + fresh generated list, implementing the curation contract in MAINTENANCE.md and the troubleshooting entry "index compilation drops human edits".
- **last_updated stability:** `_resolve_last_updated()` keeps the previous date when the body is byte-identical, avoiding churn-only diffs.

Index output shape:

```markdown
---
id: decisions-index
title: "Decisions index"
last_updated: YYYY-MM-DD
---
# Decisions
<blurb>
## Index
<!-- openwiki: broken internal link [file.md] file "file.md" does not exist. Fix the href or restore the target, then delete this comment. -->
- **[Title](file.md)** — description
  - Tags: `tag1`, `tag2`
```

## CLI summary

| Command | Use |
| --- | --- |
| `python .agents/skills/docs-compile/scripts/docs-compile.py` | standard refresh from anywhere in repo |
| `python ... generate-durable-indexes.py --agents-root PATH` | explicit base dir for default targets |
| `python ... generate-durable-indexes.py -t .agents/docs/decisions -t .agents/docs/troubleshooting` | targeted regen |
| append `--dry-run` | preview; exit 2 signals pending changes |

An open OpenSpec change (`escalate-quick-reference`) proposes auto-pinning important entries into the Quick Reference blurb zone during generation, but its 2.0 reconciliation task would drop this script dependency — see [OpenSpec workflow](../governance/openspec-workflow.md).

## Retirement horizon

Slated for deletion by active change `adopt-openspec-openwiki` (OpenWiki owns indexing). Until retired it remains part of the shipped kit and the post-distill habit encoded across skills and playbooks.
