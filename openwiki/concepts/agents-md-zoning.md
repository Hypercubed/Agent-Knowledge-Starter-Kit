---
type: Reference
title: AGENTS.md Zoning and Routing
description: Root AGENTS.md marker zones versus .agents/AGENTS.md repo knowledge, and how the baseline, OpenWiki, routing, lifecycle, and wiki-contract blocks attach.
tags: [agents-md, zoning, routing, aksk, openwiki]
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-221b8d1823c4691ef36ad664
    resource: repo://.agents/AGENTS.md
  - id: openwiki-source-78293e08bbba4e65fb2685ae
    resource: repo://.agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs
  - id: openwiki-source-67d81b3c5bf101f8b3eb3d2a
    resource: repo://.agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs
  - id: openwiki-source-b7d2caf3a5a306ccd41f0115
    resource: repo://.agents/skills/aksk-init/references/agents-md-baseline-template.md
  - id: openwiki-source-860daeb113838f15883fdf83
    resource: repo://.agents/skills/aksk-init/references/lifecycle-template.md
  - id: openwiki-source-93c78d1dd46b76df62cef2f6
    resource: repo://.agents/skills/aksk-init/references/routing-note-template.md
  - id: openwiki-source-d786624ba23d2df437591102
    resource: repo://.agents/skills/aksk-init/references/wiki-contract-template.md
  - id: openwiki-source-944a38bc18074fe81ed45b1f
    resource: repo://.agents/skills/aksk-init/scripts/attach_section.mjs
  - id: openwiki-source-ff2d87cb54c01d07d6371400
    resource: repo://.agents/skills/aksk-init/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-9930f2885b3cb73d38a9300a
    resource: repo://.agents/skills/aksk-init/scripts/bootstrap-repo.mjs
  - id: openwiki-source-5a97b1d59b72f21589de6133
    resource: repo://.agents/skills/aksk-init/scripts/init_agents_md.mjs
  - id: openwiki-source-4ab0b6cc58dd78f7a5c0603e
    resource: repo://.agents/skills/aksk-init/SKILL.md
  - id: openwiki-source-5af7f373fcb21f142106673c
    resource: repo://.agents/skills/docs-lint/SKILL.md
  - id: openwiki-source-8037e2358a2c4f9b2c722a11
    resource: repo://AGENTS.md
  - id: openwiki-source-f7767c74e12e946558d335f1
    resource: repo://openspec/specs/agents-md-bootstrap/spec.md
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# AGENTS.md Zoning and Routing

Root `AGENTS.md` is a stacked, marker-delimited file with isolated ownership and deterministic upstream-first order. Three families, each owned by one writer and validated independently:

| Order | Zone | Markers | Owner | Content |
| --- | --- | --- | --- | --- |
| 1 | FerroxLabs baseline | `AKSK:AGENTS-BASELINE:BEGIN/END` | `init_agents_md.mjs` (seed) + `refresh_agents_baseline.mjs` (update) | Vendored behavioral operating contract with provenance header (source URL, capture date, MIT notice, refresh pointer) |
| 2 | OpenWiki | `OPENWIKI:START/END` | OpenWiki tooling | Generated knowledge-layer routing header. **Never hand-edit.** |
| 3a | AKSK routing | `AKSK:ROUTING:BEGIN/END` | `attach_section.mjs` + `routing-note-template.md` | Thin discovery pointers into `.agents/` and `openwiki/` |
| 3b | AKSK lifecycle | `AKSK:LIFECYCLE:BEGIN/END` | `attach_section.mjs` + `lifecycle-template.md` | Self-improvement loop mandate (closeout → distill → prune) |

A fully bootstrapped file contains exactly one block per family ordered **baseline → OpenWiki → AKSK**, per `openspec/specs/agents-md-bootstrap/spec.md`. The vendored template is the offline source of truth; markers are read from templates at runtime via `markersOf()`, never hard-coded. This repo's root `AGENTS.md` is in pre-seed state (hand-authored behavioral content without baseline markers), so an unflagged seed run fails closed with the replace-vs-combine prompt instead of overwriting.

## Root versus `.agents/AGENTS.md`

Root `AGENTS.md` is the checkout entrypoint agents load: behavioral operating contract on top, knowledge routing in the middle, self-improvement loop at the bottom. `.agents/AGENTS.md` is the portable repo-knowledge file with no marker zones: routing directives, project learnings, and the full loop. One source of truth per instruction — how the agent works lives in the root baseline, what the agent should know about this repo lives in `.agents/AGENTS.md`.

## Zone owners

- **Baseline zone** — `init_agents_md.mjs` seeds from the vendored template; existing non-matching files fail closed (replace vs combine, never silent overwrite). `refresh_agents_baseline.mjs` fetches upstream, validates anchors, and swaps only the baseline block in the vendored template. Repo `AGENTS.md` files are never touched by refresh.
- **Routing/lifecycle zones** — `attach_section.mjs` is the single N-template mechanism: existing content outside markers is never replaced, re-runs are idempotent no-ops or in-place refreshes of only the marked block, and a missing target file is created containing only the attached section.
- **Wiki contract** — `openwiki/INSTRUCTIONS.md` uses the same marker protocol via `attach_wiki_contract.mjs`, which never creates the file and never touches OpenWiki-owned content.

Bootstrap composition order: global lane installs → `init_agents_md.mjs` seeds baseline first → OpenWiki attaches its block → `attach_section.mjs` appends routing then lifecycle → `attach_wiki_contract.mjs` attaches the wiki contract. Each script is idempotent, so reruns after a template change only touch the zone whose template changed.

## Invariants and lint

Exactly one block per family per root instruction file; damage to one family's markers is reported for that family only. `docs-lint` wiring checks fail the pass on missing or duplicated `AKSK:*` blocks, missing baseline provenance header, wrong zone order, or missing wiki contract — index drift is fixed by rerunning `sync_wiki_indexes.mjs`, never by hand-editing. The behavioral baseline is a scoped exception to the thin-router invariant (decision `use-the-routing-pattern-for-agentic-tool-bootstrap-files`): it is a behavioral operating contract, not repo knowledge.

## Validation

```bash
node .agents/skills/aksk-init/scripts/init_agents_md.mjs          # seed + idempotency
node .agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs --check # upstream valid?
node .agents/skills/aksk-init/scripts/attach_section.mjs . AGENTS.md routing-note-template.md
node .agents/skills/aksk-init/scripts/attach_wiki_contract.mjs .  # wiki contract idempotency
```

## Related

- Templates: `agents-md-baseline-template.md`, `routing-note-template.md`, `lifecycle-template.md`, `wiki-contract-template.md` under `.agents/skills/aksk-init/references/`
- Spec: `openspec/specs/agents-md-bootstrap/spec.md` — workflows: [Bootstrap and Attachment](../workflows/bootstrap-and-attachment.md), [Validation and Lint](../operations/validation-and-lint.md) — layers: [Knowledge Layer](../architecture/knowledge-layer.md)
