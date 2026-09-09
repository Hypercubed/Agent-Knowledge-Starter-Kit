---
type: Decision
title: Single runtime - Node for kit scripts
description: Kit consumer-facing scripts are plain ESM JavaScript (.mjs) running on
  Node; the former Python preference is superseded because openspec and openwiki already
  make Node a hard peer dependency.
tags:
- scripts
- conventions
- architecture
timestamp: '2026-08-23T00:00:00Z'
aksk_status: accepted
aksk_depends_on:
- decisions/python-preference-for-consumer-scripts
---

# Single runtime - Node for kit scripts

### Status

Accepted — supersedes [Python preference for consumer-facing scripts](python-preference-for-consumer-scripts.md)

### Context

The kit's peer dependencies (`@fission-ai/openspec`, `openwiki`) both require Node, so every consumer of AKSK skills has Node regardless of script language. Requiring Python as a second runtime for four small scripts added setup burden with no offsetting benefit. The index-sync script in particular was a Python shell around embedded JavaScript driving openwiki's exports.

### Decision

Consumer-facing kit scripts are plain ESM JavaScript files (`.mjs`) executed with `node`. No TypeScript and no build step: the kit stays zero-toolchain. Cross-platform PATH resolution and process behavior use Node built-ins only.

### Rationale

One runtime matches the dependency reality; direct ESM imports replace subprocess plumbing; `.mjs` keeps portability benefits that originally motivated the Python preference (Node runs on Windows natively).

### Implementation notes

When replacing an existing script, grep the repository for both filename and invocation forms and update skills, playbooks, contracts, and example trees; verify each rewritten script's success and failure paths before deleting the old file.
