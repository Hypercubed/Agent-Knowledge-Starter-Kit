---
id: example-agents-looks-like-full-dogfood-copy
title: "`example/.agents/` looks like a full mirror of root dogfood"
last_updated: 2026-04-22
description: >
  The generated example tree contains large slices of this repository’s durable
  `.agents/docs/`, playbooks, or other maintainer paths instead of the minimal
  bootstrap-driven layout from generate-example.
tags: [example, maintenance, skills, docs]
---

# `example/.agents/` looks like a full mirror of root dogfood

#### Symptom

`example/.agents/` closely matches root `.agents/` (many extra docs, playbooks, or indexes) rather than the **small** tree produced by [`generate-example`](../../playbooks/generate-example.md).

#### Likely causes

Someone refreshed `example/` by **copying, rsyncing, or hand-merging** canonical kit paths from root `.agents/` instead of running the generator script.

#### Fix

- Remove the fat `example/` tree and regenerate it: `bash .agents/skills/generate-example/run.sh` (see [`.agents/playbooks/generate-example.md`](../../playbooks/generate-example.md)).
- Keep durable changes in **root** portable paths under `.agents/`; let `example/` stay a disposable illustration only.

#### Validation

- After regeneration, `example/.agents/` should reflect **skills install + bootstrap templates** (and copied agent personas), not a byte-for-byte dogfood mirror. See [Comparing greenfield `example/.agents/` to this repo’s root `.agents/`](comparing-example-agents-to-root-agents.md) and [Regenerate `example/` when the portable kit or bootstrap changes](../decisions/regenerate-example-when-portable-kit-changes.md).
