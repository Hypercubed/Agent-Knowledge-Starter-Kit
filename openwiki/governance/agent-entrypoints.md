---
type: Reference
title: Agent Entrypoints and Routing
description: Root AGENTS.md router, portable dot-agents knowledge layer, and JIT OpenWiki lookup with startup order and bootstrap composition.
tags: [agents-md, routing, entrypoints, aksk, openwiki, bootstrap]
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-221b8d1823c4691ef36ad664
    resource: repo://.agents/AGENTS.md
  - id: openwiki-source-f62b29e03158ee0b0736e6c7
    resource: repo://.agents/skills/aksk-bootstrap/references/agents-md-baseline-template.md
  - id: openwiki-source-da03faceacac4fd818b473f3
    resource: repo://.agents/skills/aksk-bootstrap/references/lifecycle-template.md
  - id: openwiki-source-0294ec7c02cfa2beeca87331
    resource: repo://.agents/skills/aksk-bootstrap/references/routing-note-template.md
  - id: openwiki-source-c056a1ca61c0634d11844713
    resource: repo://.agents/skills/aksk-bootstrap/references/versions.json
  - id: openwiki-source-7381bbb8d2e7fd02da7469ce
    resource: repo://.agents/skills/aksk-bootstrap/references/wiki-contract-template.md
  - id: openwiki-source-5398a69cb2cf8d556809da57
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_section.mjs
  - id: openwiki-source-d56b5afb22742020f2ab6b59
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-78293e08bbba4e65fb2685ae
    resource: repo://.agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs
  - id: openwiki-source-181fd64540d760eef80f754f
    resource: repo://.agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs
  - id: openwiki-source-dce50581779fda5dd507dc34
    resource: repo://.agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
  - id: openwiki-source-ea70eb6c045047448e446296
    resource: repo://.gitignore
  - id: openwiki-source-8037e2358a2c4f9b2c722a11
    resource: repo://AGENTS.md
  - id: openwiki-source-a2371d6362e5db4bc834ad03
    resource: repo://CLAUDE.md
  - id: openwiki-source-d37bb090eddfcd3c233c8f14
    resource: repo://docs/integrations/README.md
  - id: openwiki-source-096a781fb160ef979fa31121
    resource: repo://INSTALL.md
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# Agent Entrypoints and Routing

Coding agents entering this repository have one primary entrypoint and two JIT knowledge indexes. Root `AGENTS.md` is the **router**; `.agents/AGENTS.md` is the **portable prescriptive layer**; `openwiki/index.md` (plus `openwiki/overview.md` for curated trees) is the **descriptive evidence index**. Every durable instruction has exactly one home — root holds bootstrap behavior, `.agents/` holds repo conventions, `openwiki/` holds facts and decisions. Layer rules live in [Knowledge Layer](../architecture/knowledge-layer.md); marker-zone mechanics in [AGENTS.md Zoning](../concepts/agents-md-zoning.md).

## Entrypoint Map

| File | Role | Writer / Owner |
| --- | --- | --- |
| `/AGENTS.md` | Checkout entrypoint — behavioral contract plus managed routing blocks | Hand-authored baseline + OpenWiki tooling (`OPENWIKI` block) + `attach_section.mjs` (`AKSK:*` blocks) |
| `/.agents/AGENTS.md` | Portable knowledge-layer file — routing directives, project learnings, loop summary; must stay small | Maintainer / `learning-distill` (high-confidence actionable rules only) |
| `/openwiki/index.md` | Generated catalog — JIT lookup entry, never hand-edited | OpenWiki-owned, rebuilt deterministically |
| `/openwiki/overview.md` | Curated entry point for decisions and troubleshooting trees | AKSK-authored, preserved across updates |
| `docs/integrations/*.md` | Per-tool wiring guides | Manual fallback; preferred path is `aksk-bootstrap` |

Root `AGENTS.md` points **into** `.agents/AGENTS.md` and `openwiki/index.md`; `.agents/AGENTS.md` points **outward** to `openwiki/index.md`, `openwiki/decisions/`, and `.agents/playbooks/`. In this repo the behavioral baseline is hand-authored inline without `AKSK:AGENTS-BASELINE` markers (pre-seed state) — `init_agents_md.mjs` has not yet vendored the baseline zone.

## Startup read order (mandatory)

1. Read `/.agents/AGENTS.md` — portable directives and learnings.
2. Read `/openwiki/index.md` — generated catalog; use directory indexes to locate relevant pages.

Both reads happen **before executing any file modifications**. `openwiki/` is optional JIT context, not a mandatory preload — grep the catalog on demand, then open the relevant page. Source code and tests remain authoritative; wiki pages are evidence, not spec.

## Mandated searches

- **Before debugging** (failing test, build error, runtime exception), the **first** action is `grep -ri "<symptom>" openwiki/ .agents/` — recurring failures already have curated entries; blind debugging duplicates work and risks reintroducing rejected approaches.
- **Before architectural changes**, search `openwiki/decisions/` for recorded decisions to avoid violating established patterns. Distillation also checks `openspec/specs/` so wiki pages never duplicate SHALL requirements.

## Tool integration entrypoints

Per-tool equivalents are catalogued under `docs/integrations/`: root-native files (Codex, OpenCode, Kilo Code, Warp, OpenClaw), tool-specific bootstrap files (Claude Code `CLAUDE.md`, Gemini `GEMINI.md`), rules-based IDE wiring (Cursor, Copilot), and persistent-memory boundaries (Hermes, Antigravity). The shared invariant is identical — native files stay thin routers pointing at `.agents/` (decision `use-the-routing-pattern-for-agentic-tool-bootstrap-files`). Preferred path is the EXECUTE lane via the two lane scripts (`bootstrap-global.mjs`, then `bootstrap-repo.mjs`); per-tool guides are the manual fallback.

## Invariants

- Single source of truth per instruction; distillation routes to exactly one durable home.
- One marker block per family, ordered baseline → OpenWiki → AKSK; `OPENWIKI:START/END` never hand-edited; AKSK blocks refreshed only via `attach_section.mjs`.
- **Concurrency guard:** before editing while `openwiki` may be active, check `.run.json` phase — editing mid-run leaves `.last-update.json` interrupted and forces replanning.
- Missing prerequisites fail closed with exact remediation; verification never silently installs beyond the deterministic global lane.
