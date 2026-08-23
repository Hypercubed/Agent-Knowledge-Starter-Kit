---
type: "Troubleshooting"
title: "openwiki --update aborts when run from agent shells"
description: "Headless OpenWiki update runs abort with a generic 'Request was aborted' when launched from agent shells with command timeouts; run interactively and confirm via .last-update.json."
tags: [openwiki, troubleshooting, cli]
timestamp: 2026-08-23T00:00:00Z
aksk_depends_on:
  - decisions/openwiki-integration-distribution-stack
---

# openwiki --update aborts when run from agent shells

## Symptoms

`openwiki --update -p` exits early with only `Request was aborted` and `.last-update.json` still shows the previous run.

## Likely cause

Agent shells wrap commands in timeouts; a full wiki update is a long LLM run that outlives them.

## Known fix

Run the update from an interactive terminal with provider credentials loaded. Confirm completion via `openwiki/.last-update.json` (`status` = `complete`). Take a filesystem snapshot of `openwiki/` before test runs so curated trees can be diffed afterwards.

## Validation

- `.last-update.json` reports the new run as complete.
- Curated trees (`decisions/`, `troubleshooting/`) are byte-identical to their pre-run state apart from OpenWiki flag comments.

## Related

- [Knowledge consolidation into OpenWiki](../decisions/knowledge-consolidation-into-openwiki.md)
