---
type: knowledge-layer-contract
title: "The Knowledge Layer: .agents/ and Curated Wiki Trees"
description: "How AKSK 2.0 splits durable knowledge: prescriptive agent-behavior files under .agents/ (AGENTS.md, playbooks) versus curated OKF pages under openwiki/{decisions,troubleshooting}/ with aksk_* lifecycle frontmatter, plus the sessions model that feeds both."
tags: [knowledge-layer, frontmatter, agents, documentation, okf]
timestamp: 2026-08-23T19:30:00Z
openwiki:
  roles: [architecture, domain]
  source_paths: [".agents/skills/learning-distill/references/CONTRACT.md", ".agents/skills/learning-distill/references/decision-frontmatter.schema.json", "docs/architecture.md"]
  symbols: ["aksk_status", "aksk_superseded_by", "aksk_depends_on"]
  invariants: ["Entry identity is the filename stem, unique within its tree.", "Decision pages carry aksk_status; requirements already codified in openspec/specs/ are never duplicated as wiki pages.", "Everything under .agents/sessions/ except README.md stays untracked."]
---

# The Knowledge Layer: `.agents/` and Curated Wiki Trees

Durable knowledge lives in two complementary layers. **Prescriptive** guidance — how agents should behave — lives under `.agents/` as plain markdown. **Descriptive** knowledge — facts, rationale, decisions, troubleshooting patterns — lives as curated OKF pages under `openwiki/{decisions,troubleshooting}/` plus two curated root pages. The former single-tree layout with `.agents/docs/`, hand-built indexes, and `log.md` was deleted by the consolidation (decision `knowledge-consolidation-into-openwiki`, which supersedes the location aspect of `single-tree-architecture-agents`). The lifecycle that writes into these layers is covered by [Task lifecycle](task-lifecycle.md); the skills are indexed under [Skills](../skills/index.md).

## Tree shape

```text
.agents/                          # prescriptive layer + capture machinery
├── AGENTS.md                     # portable routing directives + project learnings
├── .gitignore                    # sessions/* + !sessions/README.md
├── playbooks/                    # durable multi-step procedures
│   └── README.md …
├── sessions/README.md            # only tracked session file
├── workflows/opsx-*.md           # OpenSpec command definitions (retirement pending)
└── skills/                       # task-closeout, learning-distill, docs-lint,
                                  #   aksk-bootstrap, generate-example (internal)

openwiki/                         # descriptive layer (curated OKF concept pages)
├── INSTRUCTIONS.md               # OpenWiki-owned scope brief + AKSK curation contract
├── index.md                      # OpenWiki-owned catalog (never hand-edited)
├── overview.md                   # curated entry point to the knowledge base
├── maintenance-format.md         # curated schema & policy reference
├── decisions/<slug>.md           # one page per decision, aksk_status lifecycle
└── troubleshooting/<slug>.md     # one page per recurring failure pattern
```

## `.agents/AGENTS.md`

The portable file holds exactly two parts:

- **Routing directives** — behavioral triggers such as: upon startup read `openwiki/index.md` and `.agents/AGENTS.md` before any file modification; on a failing test/build/runtime error, first search durable knowledge with `grep -ri "<error or symptom>" openwiki/ .agents/`; before architectural changes, search `openwiki/decisions/`.
- **Project learnings** — short distilled rules (e.g., the skill-renaming workflow; always include an initial "Starting..." message and a `--verbose` flag in npx-based scripts so agents do not assume hangs).

The [bootstrap template](../distribution/packaging-and-install.md) ships the same routing directives plus placeholder sections and explicit "what does not belong here" rules. Placement discipline now reads: rationale goes to `openwiki/decisions/`, recurring failures to `openwiki/troubleshooting/`, multi-step procedures to `playbooks/`, temporary artifacts stay in `sessions/`.

The relationship to root `AGENTS.md` is doctrine from `/INSTALL.md`: root file = agent entrypoint for the checkout; `.agents/AGENTS.md` = portable knowledge-layer file; exactly one source of truth per instruction.

## Curated wiki trees

### Frontmatter contract (OKF base + AKSK extensions)

Curated pages follow OpenWiki's OKF base (`type`, `title`, `description`, `tags`, `timestamp`) extended with AKSK lifecycle fields. JSON Schemas live at `.agents/skills/learning-distill/references/decision-frontmatter.schema.json` and `troubleshooting-frontmatter.schema.json`; both require the OKF base keys and allow additional properties.

| Field | Applies to | Contract |
| --- | --- | --- |
| `type`, `title`, `description`, `tags`, `timestamp` | all pages | OKF base; `tags` is a non-empty list of lowercase slugs |
| `aksk_status` | decision pages (**required** there) | `accepted`, `superseded`, or `provisional` |
| `aksk_superseded_by` | superseded pages | successor slug; pair it with a relative link to the successor |
| `aksk_depends_on` | any page | YAML list of qualified references `decisions/<slug>` or `troubleshooting/<slug>`, where `<slug>` equals the target's filename stem |

Identity rules: the filename stem is the entry identity and must be unique **within its tree**; filenames carry no type prefix because qualified references disambiguate. Body shapes stay conventional rather than schema-enforced: decisions use `### Decision / Status / Context / Rationale / Consequences`; troubleshooting entries use `#### Symptom / Likely causes / Fix / Validation`. The full schema reference lives on the curated page [`maintenance-format.md`](../maintenance-format.md); [`overview.md`](../overview.md) indexes both trees.

### No duplication with OpenSpec requirements

If a candidate lesson restates something already codified as a SHALL requirement in `openspec/specs/`, distillation must not create or extend a wiki page for it — cite the spec capability instead. Wiki pages record facts and rationale; requirements live only in OpenSpec ([workflow page](../governance/openspec-workflow.md)).

### Preserve-and-link semantics

The curation contract attached to [`openwiki/INSTRUCTIONS.md`](../INSTRUCTIONS.md) marks these trees curated. Update runs keep AKSK-authored content, link generated material to it instead of replacing it, and never drop `aksk_*` fields. Distillation fails closed before any wiki write when the contract is absent — treating absence as "nothing curated" could silently regenerate away hand-curated pages (design decision D3).

## Playbooks

`.agents/playbooks/` holds durable multi-step procedures as prescriptive layer content. Shipped examples: `pre-publish.md` (validation sequence around `check-publish.sh`), `major-version-release.md` (deprecated-artifact grep, portability review, example regeneration), `generate-example.md` (the never-hand-copy rule), and `writing-integration-guides.md` (the integration-guide method). An active OpenSpec change (`adopt-workflows-taxonomy`) proposes merging this directory into `workflows/` under unified OpenSpec terminology — see [OpenSpec workflow](../governance/openspec-workflow.md).

## Sessions model

Per-task closeout bundles live under `.agents/sessions/YYYYMMDD-HHMMSS-short-topic/`. `.agents/.gitignore` ignores `sessions/*` while un-ignoring `sessions/README.md`, so the folder exists in fresh clones with zero bundle noise. Repositories that intentionally don't track `.agents/.gitignore` replicate the equivalent patterns in the repo-root `.gitignore` (`.agents/sessions/*` and `!.agents/sessions/README.md`). Bundle immutability after closeout is defined in [Task lifecycle](task-lifecycle.md).

## Superseding durable knowledge

Lifecycle state rides in frontmatter: `aksk_status: superseded` plus `aksk_superseded_by` pointing at the successor slug (with a link). The triple-lock markdown convention (index-section move, bold marker, strikethrough) from change `formalize-superseded-obsolete` predates the consolidation; reconciling it against `aksk_status` is an open task (6.2 on the active pipeline), so treat the frontmatter route as authoritative today.

## Validation

- Structure of the `.agents/` tree (required files present, sessions tracking clean, SKILL.md frontmatter valid): `bash scripts/check-agents-structure.sh .agents` — detailed on [Validation scripts](../skills/generate-example-and-scripts.md).
- Entry frontmatter conformance: validate curated pages against the JSON Schemas above; [docs-lint](../skills/docs-lint.md) verifies the same contract by inspection during periodic passes.
- Index freshness after curated-page writes: `node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs` (deterministic; see [aksk-bootstrap](../skills/aksk-bootstrap.md)).
