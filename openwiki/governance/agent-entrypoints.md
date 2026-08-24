---
type: governance-page
title: "Agent Entrypoints"
description: "Root AGENTS.md with its three managed blocks (OPENWIKI, AKSK:ROUTING, AKSK:LIFECYCLE), the CLAUDE.md pointer, openspec.yaml rules, and the self-hosting OpenWiki workflow's tracking status."
tags: [agents, entrypoints, routing, agentic-tools]
timestamp: 2026-08-23T23:30:00Z
openwiki:
  roles: [architecture, integration]
  source_paths: [AGENTS.md, CLAUDE.md, openspec.yaml, .agents/skills/aksk-bootstrap/scripts/attach_section.mjs]
  invariants: ["Each AKSK managed block appears exactly once per file and is refreshed only via attach_section.mjs.", "The OPENWIKI block is never hand-edited; lint verifies presence only."]
---

# Agent Entrypoints

Several root files exist solely to route coding agents into durable knowledge. This page documents each one's role and current state.

## Root `AGENTS.md`

The primary agent entrypoint for this checkout (~160 lines). Structure:

- **§0 Non-negotiables** — behavioral overrides: no flattery/filler; disagree when you disagree; never fabricate paths/hashes/APIs/results; stop when confused; touch only what you must.
- **§1–8** — working discipline: plan before editing; simplicity first; surgical diffs; verifiable goals; tool verification; session hygiene; direct communication style; when to ask vs proceed.
- **OpenWiki managed block** (`<!-- OPENWIKI:START/END -->`) — states that `openwiki/` is an optional just-in-time evidence index, source/tests remain authoritative, brief unknowns are verification gaps rather than automatic requirements, narrow quiet validation is preferred, and the scheduled GitHub Actions workflow refreshes the wiki (so generated pages should not be hand-edited).
- **`AKSK:ROUTING` block** (attached by `attach_section.mjs`) — thin discovery pointers: read `.agents/AGENTS.md` for durable guidance; use `openwiki/index.md` for repo knowledge and `.agents/playbooks/` for procedures; consult `openwiki/decisions/` before architectural changes; when debugging search durable knowledge first (`grep -ri "<symptom>" .agents/ openwiki/`); follow `.agents/skills/task-closeout/SKILL.md` at closeout; keep temporary evidence in `.agents/sessions/`.
- **`AKSK:LIFECYCLE` block** (attached by `attach_section.mjs`) — the self-improvement loop mandate: analyze root cause after mistakes, run task-closeout, distill (descriptive lessons → curated OpenWiki pages under `openwiki/`; behavior rules → `.agents/AGENTS.md` or playbooks), periodically prune guidance.

The two AKSK blocks replaced a hand-written §0.5 routing trio and hand-merged self-improvement section during the 2.0 migration; both are now refreshed only via [aksk-bootstrap](../skills/aksk-bootstrap.md) attachment so they cannot drift silently from their templates ([docs-lint](../skills/docs-lint.md) checks integrity).

Per `/INSTALL.md` doctrine, root `AGENTS.md` holds only bootstrap guidance; every durable instruction has exactly one home. The [`.agents/AGENTS.md`](../../.agents/AGENTS.md) portable file repeats only the routing directives plus distilled project learnings so it works standalone in consumer installs ([knowledge layer](../architecture/knowledge-layer.md)).

## Root `CLAUDE.md`

A pointer file whose entire body lives inside an OpenWiki-managed block linking back to `AGENTS.md` for OpenWiki agent instructions. It was committed as part of the migration and is tracked today. It demonstrates the thin-bootstrap pattern from decision `use-the-routing-pattern-for-agentic-tool-bootstrap-files`: tool-specific entry files route rather than duplicate.

## `openspec.yaml`

Registers a read-and-reference rule named "AKSK Knowledge Persistence" covering `.agents/**/*.md` and `docs/**/*.md`, making the OpenSpec CLI treat both trees as reference material during change work (see [OpenSpec workflow](openspec-workflow.md)). The shipped integration guide [`docs/integrations/openspec.md`](../../docs/integrations/openspec.md) teaches consumers the same wiring ("capture-as-you-go" model).

## `.github/workflows/openwiki-update.yml` — self-hosting status

This scheduled workflow refreshes `openwiki/` daily (cron `0 8 * * *` plus manual dispatch): checkout with full history (so `openwiki code --update` can diff HEAD against the last documented commit), Node 22, global install of `openwiki@0.3.3` + mermaid + jsdom for diagram validation, then `openwiki code --update --print` using OpenRouter model `stealth/ox-alpha`, followed by a `peter-evans/create-pull-request` step targeting branch `openwiki/update` with add-paths covering `openwiki/`, `AGENTS.md`, `CLAUDE.md`, and the workflow itself.

**Tracking anomaly:** the workflow file exists on disk but is **not tracked by git** — the root `.gitignore` contains a bare `.github` line, and `git ls-files .github` returns nothing. Consequences:

- The scheduled-refresh loop described in AGENTS.md and in this wiki's own generation is **aspirational until committed**: on fresh clones the workflow does not exist.
- Any fix requires un-ignoring at least `.github/workflows/openwiki-update.yml` in `.gitignore`.
- Until then, wiki updates happen through local interactive runs of the OpenWiki CLI rather than CI — and those runs abort when launched from agent shells with command timeouts (curated entry: [openwiki --update aborts when run from agent shells](../troubleshooting/openwiki-update-aborts-in-agent-shells.md)).

## Tool integration entrypoints (consumers)

For adopters, the equivalent entrypoint set per tool (root `AGENTS.md` / `CLAUDE.md` / `GEMINI.md` / `.cursor/rules/` / `.github/copilot-instructions.md` …) is catalogued under [Tool integrations](../distribution/tool-integrations.md). The shared principle is identical: keep native files thin, point them at `.agents/`. Consumers attach the same `AKSK:ROUTING` block with `node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs` instead of pasting unmarked snippets — ten integration guides were converted to this instruction during dogfood task 5.4.

**Future zones:** the active proposal [`add-agents-md-bootstrap`](openspec-workflow.md#proposal-add-agents-md-bootstrap--seed-consumer-agentsmd-new-unstarted) would add a first zone to consumer `AGENTS.md` files — a vendored behavioral baseline under `AKSK:AGENTS-BASELINE` markers, seeded before OpenWiki and AKSK blocks attach. Nothing on disk implements it yet; see [OpenSpec workflow](openspec-workflow.md).
