---
type: architecture-overview
title: "AKSK Architecture Overview"
description: "What the Agent Knowledge Starter Kit is, its peer-dependency design (OpenSpec + OpenWiki), the prescriptive-versus-curated knowledge split, and how closeout, distillation, and lint form a knowledge maintenance loop."
tags: [architecture, overview, agents, knowledge-management]
timestamp: 2026-08-23T23:30:00Z
openwiki:
  roles: [architecture]
  source_paths: [docs/architecture.md, package.json]
  invariants: ["OpenSpec and OpenWiki are peer dependencies: skills verify binaries before use and never install anything.", "Durable descriptive knowledge lives only as curated OKF pages under openwiki/; .agents/ holds only prescriptive guidance."]
---

# AKSK Architecture Overview

The Agent Knowledge Starter Kit (AKSK) is a shareable, tool-agnostic starter kit for maintaining a compiled repository knowledge layer for coding agents (`package.json` name `agent-knowledge-starter`, version `2.0.0`). It ships **markdown conventions and agent skills** — not an application. There is no runtime service, no database, and no test suite; `npm test` intentionally prints `Error: no test specified`. The kit's value is behavioral: it structures what coding agents read before working, what they capture when work ends, and how durable lessons get promoted into reviewed files.

## Peer dependencies (the 2.0 repositioning)

`docs/architecture.md` opens with the defining constraint: AKSK is glue over two globally installed tools it **never installs**:

- **OpenSpec** (`@fission-ai/openspec`) — owns the intent/process layer under `openspec/`.
- **OpenWiki** (`openwiki`, plus a one-time `openwiki --init` per repo) — owns the descriptive knowledge layer: curated OKF pages under `openwiki/`.

Skills verify these prerequisites before acting — `node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki` — and fail fast printing exactly those install commands. The [aksk-bootstrap skill](../skills/aksk-bootstrap.md) owns every precondition check. Automated installation belongs to the still-open change `aksk-bootstrap-system`; until it lands, adoption is manual.

## The problem it solves

Per `/README.md`, repo learning by coding agents degrades into one of two failure modes: useful lessons are lost after the session ends, or too much low-quality context gets stuffed into instruction files until they become noise. AKSK introduces a small maintenance system with three roles:

- A **coding agent** finishes work and emits a structured handoff packet ([task-closeout](../skills/task-closeout.md)).
- A **learning agent** distills durable lessons, routed by kind ([learning-distill](../skills/learning-distill.md)).
- A periodic **lint agent** keeps the wiring between AKSK, OpenSpec, and OpenWiki coherent ([docs-lint](../skills/docs-lint.md)).

## Design principles

These are normative in `/docs/architecture.md`:

1. **Raw evidence is not durable knowledge.** Session bundles under `.agents/sessions/` are evidence of one task; durable layers hold only information that is stable, reusable, and likely to help future agents.
2. **`.agents/AGENTS.md` stays small.** No session history, long rationale, failed experiments, speculative notes, or one-off debugging details. Those belong in session bundles, `openwiki/troubleshooting/`, playbooks, or `openwiki/decisions/`.
3. **Distillation is a separate role.** The agent implementing code is rarely the best judge of what should become permanent guidance; a distinct learning pass creates better boundaries.
4. **Knowledge is maintained incrementally.** Future agents consult the compiled layers first instead of rediscovering lessons from raw task history.

## Repository layout

```text
.
├── AGENTS.md                  # root agent entrypoint (managed blocks + working discipline)
├── CLAUDE.md                  # thin pointer to AGENTS.md (tracked since the migration)
├── INSTALL.md                 # agent-facing install + merge checklist
├── README.md                  # human overview + maintenance loop diagram
├── package.json               # skills CLI devDep; no search script anymore
├── openspec.yaml              # read-and-reference rules for .agents/** and docs/**
├── docs/
│   ├── architecture.md        # design principles (source of this page)
│   └── integrations/          # patterns.md + 15 per-tool guides
├── scripts/
│   ├── check-publish.sh       # release hygiene wrapper
│   └── check-agents-structure.sh  # portable .agents/ validator
├── .agents/                   # prescriptive layer + capture machinery
│   ├── AGENTS.md              # portable routing directives + project learnings
│   ├── playbooks/             # 5 durable multi-step procedures
│   ├── workflows/             # opsx-* slash-command definitions (retirement pending)
│   ├── sessions/              # gitignored task bundles (README tracked)
│   └── skills/                # task-closeout, learning-distill, docs-lint,
│                              #   aksk-bootstrap, generate-example (internal)
├── openwiki/                  # THE durable knowledge layer (curated OKF pages)
│   ├── decisions/             # 23 decision records with aksk_status lifecycle
│   ├── troubleshooting/       # 26 recurring failure patterns
│   ├── overview.md            # curated entry point
│   └── maintenance-format.md  # curated schema reference
├── example/                   # generated consumer-install illustration (stale, see below)
├── openspec/                  # change management: config.yaml, changes/, specs/
└── .claude-plugin/plugin.json # registers the 4 portable skills for Claude Code
```

The former `.agents/docs/` tree (MAINTENANCE.md, decisions/, troubleshooting/, index.md, log.md) was deleted in the migration; its content lives on as curated wiki pages. Decision record `knowledge-consolidation-into-openwiki` explains why, and [knowledge layer](knowledge-layer.md) documents the resulting division.

## Starter versus consumer

A key duality documented in `/docs/architecture.md`: this GitHub repository is the **starter kit**, rooted in its own `.agents/` tree as the source of truth for generic templates. After adoption elsewhere, the **consumer's `.agents/` is the contract** — tools adjust wiring, not layout. The generated [`example/`](../distribution/packaging-and-install.md) tree illustrates what a bootstrapped consumer install looks like; it is explicitly *not* a second source of truth. That single-tree rule is recorded as decision entry `single-tree-architecture-agents` (its location aspect superseded by `knowledge-consolidation-into-openwiki`).

## The knowledge loop

<!-- openwiki: mermaid parse failed and this diagram was converted to a text fence so it does not break rendering. Fix the diagram source and restore the mermaid fence. Parser error: Heuristic: an unescaped angle bracket inside a label breaks rendering; rephrase the label. -->
```text
flowchart LR
    A["Code task"] --> B["task-closeout skill"]
    B --> C["Session bundle under<br/>.agents/sessions"]
    C --> D["learning-distill skill"]
    D --> E{"Classify lesson"}
    E -->|ephemeral| F["Keep in bundle"]
    E -->|prescriptive| G[".agents/AGENTS.md or playbook"]
    E -->|descriptive| H["Curated wiki page in<br/>openwiki decisions or troubleshooting"]
    G --> K["sync_wiki_indexes.mjs<br/>deterministic refresh"]
    H --> K
    K --> L["Mark bundle distilled"]
    L --> M["Periodic docs-lint pass"]
    M --> N["Routing blocks, coverage pairing,<br/>stale curated pages"]
```

*Caption: closeout → distill → sync → lint. Descriptive lessons land in the curated wiki trees; prescriptive behavior rules stay in `.agents/`.*

The lifecycle detail — task identity rules, bundle shape, state transitions, and the `openspec_change` link — lives on [Task lifecycle and session bundles](task-lifecycle.md). Where each lesson may land and why is governed by the [knowledge layer contract](knowledge-layer.md).

## Tool-agnosticism and integration model

AKSK ships content rather than vendor-specific config: consumers register `.agents/skills/*/SKILL.md` however their stack expects, while keeping the on-disk layout stable so switching tools does not invalidate accumulated knowledge. The shared integration model ("thin tool-native wiring pointing at `.agents/AGENTS.md` and `openwiki/index.md`") plus the per-tool quick references are covered under [Tool integrations](../distribution/tool-integrations.md), and install paths under [Packaging and install](../distribution/packaging-and-install.md). Portability of *tooling* was retired with the consolidation: AKSK now hard-requires Node ≥ 22 plus both peer CLIs (decision `node-single-runtime-for-kit-scripts`).

## Governance context

- **OpenSpec** manages intent/process artifacts (proposals, specs, tasks) under `openspec/`; see [OpenSpec workflow](../governance/openspec-workflow.md).
- Step 1 of the 2.0 pipeline (`adopt-openspec-openwiki`) is **applied and archived**: peer dependencies adopted, distillation rerouted to OKF pages, `docs-search`/`docs-compile` retired, the forked `openspec-*` skills deleted, the knowledge base consolidated into this wiki's curated trees, and all six affected active changes reconciled; its four capabilities graduated to specs under `openspec/specs/`. Step 2 (`aksk-bootstrap-system`) and the newer `add-agents-md-bootstrap` proposal remain unstarted. Details and the truthfulness horizon are on the [governance page](../governance/openspec-workflow.md).
- The three-layer division of labor (process / descriptive / experiential-curation) is recorded once in decision `openspec-openwiki-aksk-division-of-labor`.

## Scope boundaries

- No application code, no CI-required test suite, no runtime dependencies (`dependencies` in `package.json` is empty).
- Session bundles never become commits; only `.agents/sessions/README.md` is tracked (enforced by `.agents/.gitignore` and verified by `scripts/check-agents-structure.sh`).
- Maintainer-only automation is excluded from distribution via the `metadata.internal: true` frontmatter flag (decision `maintainer-skills-mark-internal-in-frontmatter`); currently that covers only [generate-example](../skills/generate-example-and-scripts.md).
- Distillation never invokes `openwiki --update`; the CLI remains the scheduled whole-wiki reconciliation path (see [learning-distill](../skills/learning-distill.md) and the [entrypoints note on CI](../governance/agent-entrypoints.md)).
