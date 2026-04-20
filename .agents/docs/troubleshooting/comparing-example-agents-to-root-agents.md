---
id: comparing-example-agents-to-root-agents
title: "Comparing greenfield `example/.agents/` to this repo’s root `.agents/`"
last_updated: 2026-04-19
description: >
  Consumers expect `example/.agents/` to mirror a portable install; diffs against
  root `.agents/` usually mean the example tree needs regeneration or a doc fix.
tags: [example, maintenance, agents]
---

# Comparing greenfield `example/.agents/` to this repo’s root `.agents/`

#### Symptom

Expectation that a `diff` between a fresh consumer-style tree (for example `example/.agents/` from [`generate-example`](../../skills/generate-example/SKILL.md)) and this repository’s root `.agents/` should be empty aside from sessions.

#### Likely causes

- Treating the **minimal generated example** as the full maintainer dogfood tree. The kit uses a **single-tree** layout: portable skills and templates live under root `.agents/`; this repo adds richer docs, more playbooks, historical `sessions/`, and maintainer-only skills (for example `generate-example` with `internal: true`).

#### Fix

- Use **root `.agents/`** as the source of truth for what the starter kit ships and how this repo dogfoods it.
- Use **`example/.agents/`** only as a disposable illustration of a bootstrap install, not as a second canonical tree to keep aligned byte-for-byte. When the illustrated tree should match recent portable or bootstrap changes, regenerate **`example/`** (see [Regenerate `example/` when the portable kit or bootstrap changes](../repo-decisions/regenerate-example-when-portable-kit-changes.md)).

#### Validation

- Changes intended for **every adopter** land in portable paths under root `.agents/` (and are appropriate for `npx skills add` consumers). Maintainer-only behavior stays flagged (`internal: true`) or in root docs, not in consumer-misleading places.
