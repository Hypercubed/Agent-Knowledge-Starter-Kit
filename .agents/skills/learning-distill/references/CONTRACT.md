# Learning Distill Contract

Machine-oriented scope, outputs, and write boundaries.

## Scope

Boundary: pages under `openwiki/` record facts and rationale. Requirements already codified in `openspec/specs/` are never duplicated as wiki pages; distillation cites them instead.

- Reads: one session bundle under `.agents/sessions/<bundle>/`; `.agents/AGENTS.md`; `.agents/playbooks/`; `openwiki/INSTRUCTIONS.md`; curated pages under `openwiki/`.
- Writes (wiki, only after fail-closed prerequisite checks pass):
  - `openwiki/decisions/*.md`
  - `openwiki/troubleshooting/*.md`
  - `openwiki/<topic>.md` (descriptive lesson pages)
  - deterministic index refresh via `aksk-bootstrap/scripts/sync_wiki_indexes.mjs`
- Writes (.agents):
  - `.agents/AGENTS.md` (only lessons meeting the AGENTS criteria)
  - `.agents/playbooks/*.md`
  - the bundle's own `summary.json` distillation flags
- Never writes: OpenWiki-owned files (`index.md`, run metadata), `openspec/`, source code.

## summary.json flags

Set `distilled: true` and `distillation_status` on the bundle when finished; keep `task_id` unchanged.

## Page frontmatter

OKF base (`type`, `title`, `description`, `tags`, `timestamp`) plus AKSK extensions:

| Field | Applies to | Values |
| --- | --- | --- |
| `aksk_status` | decision pages | `accepted`, `superseded`, `provisional` |
| `aksk_superseded_by` | superseded pages | successor slug |
| `aksk_depends_on` | any knowledge page | list of qualified slugs |

Entry identity is the filename stem, unique within its tree.
