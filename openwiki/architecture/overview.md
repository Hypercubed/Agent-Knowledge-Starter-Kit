---
type: architecture-overview
title: "AKSK Architecture Overview"
description: "What the Agent Knowledge Starter Kit is, its design principles, the starter-versus-consumer duality, and how closeout, distillation, and lint form a knowledge maintenance loop."
tags: [architecture, overview, agents, knowledge-management]
timestamp: 2026-08-23T18:30:00Z
---

# AKSK Architecture Overview

The Agent Knowledge Starter Kit (AKSK) is a shareable, tool-agnostic starter kit for maintaining a compiled repository knowledge layer for coding agents (`package.json` name `agent-knowledge-starter`, version `2.0.0`). It ships **markdown conventions, agent skills, and thin validation scripts** — not an application. There is no runtime service, no database, and no test suite; `npm test` intentionally prints `Error: no test specified`. The kit's value is behavioral: it structures what coding agents read before working, what they capture when work ends, and how durable lessons get promoted into reviewed files.

## The problem it solves

Per `/README.md`, repo learning by coding agents degrades into one of two failure modes: useful lessons are lost after the session ends, or too much low-quality context gets stuffed into instruction files until they become noise. AKSK introduces a small maintenance system with three roles:

- A **coding agent** finishes work and emits a structured handoff packet ([task-closeout](../skills/task-closeout.md)).
- A **learning agent** distills only the durable parts into `.agents/` ([learning-distill](../skills/learning-distill.md)).
- An optional **lint agent** keeps the knowledge layer coherent over time ([docs-lint](../skills/docs-lint.md)).

## Design principles

These are normative in `/docs/architecture.md`:

1. **Raw evidence is not durable knowledge.** Session bundles under `.agents/sessions/` are evidence of one task; `.agents/` proper holds only information that is stable, reusable, and likely to help future agents.
2. **`.agents/AGENTS.md` stays small.** No session history, long rationale, failed experiments, speculative notes, or one-off debugging details. Those belong in session bundles, `decisions/`, `troubleshooting/`, or playbooks.
3. **Distillation is a separate role.** The agent implementing code is rarely the best judge of what should become permanent guidance; a distinct learning pass creates better boundaries.
4. **Knowledge is maintained incrementally.** Future agents consult the compiled `.agents/` layer first instead of rediscovering lessons from raw task history.

## Repository layout

```text
.
├── AGENTS.md                  # root agent entrypoint (routing directives)
├── CLAUDE.md                  # thin pointer to AGENTS.md OpenWiki section
├── INSTALL.md                 # agent-facing install + merge checklist
├── README.md                  # human overview + maintenance loop diagram
├── package.json               # skills CLI devDep; npm run search wrapper
├── openspec.yaml              # read-and-reference rules for .agents/** and docs/**
├── docs/
│   ├── architecture.md        # design principles (source of this page)
│   └── integrations/          # patterns.md + 15 per-tool guides
├── scripts/
│   ├── check-publish.sh       # release hygiene wrapper
│   └── check-agents-structure.sh  # portable .agents/ validator
├── .agents/                   # THE kit: portable knowledge layer
│   ├── AGENTS.md              # portable durable policy (routing + learnings)
│   ├── docs/                  # index, MAINTENANCE.md, log.md
│   │   ├── decisions/         # 17 frontmatter-carried decision entries
│   │   ├── troubleshooting/   # 24 recurring-issue entries
│   │   └── plan-archive/      # retired maintainer plans (pre-OpenSpec)
│   ├── playbooks/             # 5 durable multi-step procedures
│   ├── workflows/             # opsx-* slash-command definitions
│   ├── sessions/              # gitignored task bundles (README tracked)
│   └── skills/                # portable skills (see Skills index)
├── example/                   # generated consumer-install illustration
├── openspec/                  # change management: config.yaml, changes/, specs/
├── .claude-plugin/plugin.json # Claude Code plugin registration surface
└── .github/workflows/openwiki-update.yml  # on disk; see governance note below
```

## Starter versus consumer

A key duality documented in `/docs/architecture.md`: this GitHub repository is the **starter kit**, rooted in its own `.agents/` tree as the source of truth for generic templates. After adoption elsewhere, the **consumer's `.agents/` is the contract** — tools adjust wiring, not layout. The generated [`example/`](../distribution/packaging-and-install.md) tree illustrates what a fully bootstrapped consumer install looks like; it is explicitly *not* a second source of truth. That single-tree rule is recorded as decision entry `single-tree-architecture-agents` (superseding an earlier dual-tree `scaffold/` approach).

## The knowledge loop

<!-- openwiki: mermaid parse failed and this diagram was converted to a text fence so it does not break rendering. Fix the diagram source and restore the mermaid fence. Parser error: Heuristic: an unescaped angle bracket inside a label breaks rendering; rephrase the label. -->
```text
flowchart LR
    A["Code task"] --> B["task-closeout skill"]
    B --> C["Session bundle<br/>.agents/sessions/folder"]
    C --> D["learning-distill skill"]
    D --> E{"Classify lesson"}
    E -->|ephemeral| F["Keep in bundle"]
    E -->|agent guidance| G[".agents/AGENTS.md"]
    E -->|troubleshooting| H[".agents/docs/troubleshooting/"]
    E -->|repo decision| I[".agents/docs/decisions/"]
    E -->|playbook| J[".agents/playbooks/"]
    G --> K["Refresh indexes<br/>docs-compile"]
    H --> K
    I --> K
    J --> K
    K --> L["Append log.md row"]
    L --> M["Periodic docs-lint pass"]
    M --> N["Deduplicate, resolve contradictions,<br/>flag stale guidance"]
```

*Caption: the closeout → distill → lint maintenance loop from `/README.md` and `/docs/architecture.md`, including the five classification targets used by distillation.*

The lifecycle detail — task identity rules, bundle shape, state transitions, and logging format — lives on [Task lifecycle and session bundles](task-lifecycle.md). Where each lesson may land and why is governed by the [knowledge layer contract](knowledge-layer.md).

## Tool-agnosticism and integration model

AKSK ships content rather than vendor-specific config: consumers register `.agents/skills/*/SKILL.md` however their stack expects, while keeping the on-disk layout under `.agents/` stable so switching tools does not invalidate accumulated knowledge. The shared integration model ("thin tool-native wiring, canonical `.agents/` knowledge") plus the per-tool quick references are covered under [Tool integrations](../distribution/tool-integrations.md), and install paths under [Packaging and install](../distribution/packaging-and-install.md).

## Governance context

Two adjacent systems matter for understanding where this repo is heading:

- **OpenSpec** manages intent/process artifacts (proposals, specs, tasks) under `openspec/`; see [OpenSpec workflow](../governance/openspec-workflow.md).
- An active two-change repositioning recasts AKSK 2.0 as the experiential/curation glue between OpenSpec (process layer) and OpenWiki (descriptive layer): `adopt-openspec-openwiki` adopts both as peer dependencies with fail-fast preconditions, routes descriptive distillation to OKF wiki pages under `openwiki/`, and retires `docs-search`, `docs-compile`, and the forked `openspec-*` skills; the dependent `aksk-bootstrap-system` then automates installation and per-agent wiring. Pages describing affected skills document **current shipped behavior**; their truthfulness horizon is noted in the governance page.

## Scope boundaries

- No application code, no CI-required test suite, no runtime dependencies (`dependencies` in `package.json` is empty).
- Session bundles never become commits; only `.agents/sessions/README.md` is tracked (enforced by `.agents/.gitignore` and verified by `scripts/check-agents-structure.sh`).
- Maintainer-only automation is excluded from distribution via the `metadata.internal: true` frontmatter flag (decision `maintainer-skills-mark-internal-in-frontmatter`).
