---
type: governance-page
title: "Agent Entrypoints"
description: "Root AGENTS.md routing directives and non-negotiables, the CLAUDE.md pointer, openspec.yaml rules, and the self-hosting OpenWiki workflow's tracking status."
tags: [agents, entrypoints, routing, agentic-tools]
timestamp: 2026-08-23T18:30:00Z
---

# Agent Entrypoints

Several root files exist solely to route coding agents into durable knowledge. This page documents each one's role and current state.

## Root `AGENTS.md`

The primary agent entrypoint for this checkout (~160 lines). Structure:

- **§0 Non-negotiables** — behavioral overrides: no flattery/filler; disagree when you disagree; never fabricate paths/hashes/APIs/results; stop when confused; touch only what you must.
- **§0.5 Routing Directives** — the load-bearing trio: (1) upon startup read `.agents/docs/index.md` before any file modification; (2) on failing test/build/runtime error, first execute `.agents/skills/docs-search` with the error output as query; (3) before architectural changes, search `decisions/` or its index to check established patterns.
- **§1–8** — working discipline: plan before editing; simplicity first; surgical diffs; verifiable goals; tool verification; session hygiene; direct communication style; when to ask vs proceed.
- **§9 Self-improvement loop** — after mistakes or significant pattern discoveries: analyze root cause, run task-closeout, then learning-distill, and periodically prune the file itself (target under 300 lines).
- **§10 Repository Knowledge & Context** — pointers into the knowledge layer catalog.
- **OpenWiki managed block** (`<!-- OPENWIKI:START/END -->`, lines ~150–162) — states that `openwiki/` is an optional just-in-time evidence index, source/tests remain authoritative, brief unknowns are verification gaps rather than automatic requirements, narrow quiet validation is preferred, and the scheduled GitHub Actions workflow refreshes the wiki (so generated pages should not be hand-edited).

Per `/INSTALL.md` doctrine, root `AGENTS.md` holds only bootstrap guidance; every durable instruction has exactly one home. The [`.agents/AGENTS.md`](../../.agents/AGENTS.md) portable file repeats only the routing directives plus distilled project learnings so it works standalone in consumer installs ([knowledge layer](../architecture/knowledge-layer.md)).

## Root `CLAUDE.md`

A pointer file whose entire body lives inside an OpenWiki-managed block linking back to `AGENTS.md` for OpenWiki agent instructions. It is currently untracked (not yet committed) but present on disk. It demonstrates the thin-bootstrap pattern from decision `use-the-routing-pattern-for-agentic-tool-bootstrap-files`: tool-specific entry files route rather than duplicate.

## `openspec.yaml`

Registers a read-and-reference rule named "AKSK Knowledge Persistence" covering `.agents/**/*.md` and `docs/**/*.md`, making the OpenSpec CLI treat both trees as reference material during change work (see [OpenSpec workflow](openspec-workflow.md)). The shipped integration guide [`docs/integrations/openspec.md`](../../docs/integrations/openspec.md) teaches consumers the same wiring ("capture-as-you-go" model).

## `.github/workflows/openwiki-update.yml` — self-hosting status

This scheduled workflow would refresh `openwiki/` daily (cron `0 8 * * *` plus manual dispatch): checkout with full history (so `openwiki code --update` can diff HEAD against the last documented commit), Node 22, global install of `openwiki@0.3.3` + mermaid + jsdom for diagram validation, then `openwiki code --update --print` using OpenRouter model `stealth/ox-alpha`, followed by a `peter-evans/create-pull-request` step targeting branch `openwiki/update` with add-paths covering `openwiki/`, `AGENTS.md`, `CLAUDE.md`, and the workflow itself.

**Tracking anomaly:** the workflow file exists on disk but is **not tracked by git** — the root `.gitignore` contains a bare `.github` line, and `git check-ignore` confirms exclusion (`git ls-files .github` returns nothing). Consequences:

- The scheduled-refresh loop described in AGENTS.md and in this wiki's own generation is **aspirational until committed**: on fresh clones the workflow does not exist.
- Any fix requires un-ignoring at least `.github/workflows/openwiki-update.yml` in `.gitignore`.
- Until then, wiki updates happen through local runs of the OpenWiki CLI rather than CI.

## Tool integration entrypoints (consumers)

For adopters, the equivalent entrypoint set per tool (root `AGENTS.md` / `CLAUDE.md` / `GEMINI.md` / `.cursor/rules/` / `.github/copilot-instructions.md` …) is catalogued under [Tool integrations](../distribution/tool-integrations.md). The shared principle is identical: keep native files thin, point them at `.agents/`.
