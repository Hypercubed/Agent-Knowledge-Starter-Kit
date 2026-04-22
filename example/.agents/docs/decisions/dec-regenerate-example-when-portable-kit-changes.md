---
id: dec-regenerate-example-when-portable-kit-changes
title: "Regenerate `example/` when the portable kit or bootstrap changes"
last_updated: 2026-04-19
description: >
  When portable `.agents/` templates or bootstrap behavior change, refresh the
  generated `example/` tree so the illustrated consumer install stays accurate.
tags: [example, maintenance, release, skills]
status: accepted
---

# Regenerate `example/` when the portable kit or bootstrap changes

### Status

Accepted

### Context

The **`example/`** directory is a **generated** illustration of a consumer-style install (skills copy + bootstrap files). It is not a hand-maintained second canonical tree.

### Rationale

When portable skills, `skills/*/bootstrap/` payloads, or other material that `generate-example` copies into a fresh layout change, an outdated `example/` misleads readers about what they will actually get.

### Consequences

- After substantive portable or bootstrap changes, run [`.agents/skills/generate-example/run.sh`](../../skills/generate-example/run.sh) and commit the resulting `example/` diff when it should track the kit (see [`.agents/playbooks/generate-example.md`](../../playbooks/generate-example.md)).
- Release-style passes should align with [`.agents/playbooks/pre-publish.md`](../../playbooks/pre-publish.md), which already treats validating or refreshing `example/.agents` as part of the workflow when relevant.
