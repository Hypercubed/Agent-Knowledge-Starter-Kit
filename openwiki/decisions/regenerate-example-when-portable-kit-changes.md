---
type: Decision
title: Regenerate `example/` when the portable kit or bootstrap changes
description: 'When portable `.agents/` templates or bootstrap behavior change, refresh
  the generated `example/` tree so the illustrated consumer install stays accurate.

  '
tags:
- example
- maintenance
- release
- skills
aksk_status: accepted
generated: { by: "openwiki/0.4.3", at: "2026-08-29T20:18:58.499Z" }
---

# Regenerate `example/` when the portable kit or bootstrap changes

### Status

Accepted

### Context

The **`example/`** directory is a **generated** illustration of a consumer-style install (skills copy + bootstrap files). It is not a hand-maintained second canonical tree.

### Rationale

When portable skills, `skills/*/bootstrap/` payloads, or other material that `generate-example` copies into a fresh layout change, an outdated `example/` misleads readers about what they will actually get.

### Consequences

- Keep `generate-example` out of the default iterative edit/check loop; run it on explicit maintainer request, release-bound validation, or when `example/` output is part of the deliverable.
<!-- openwiki: broken internal link [../../.agents/skills/generate-example/run.sh] file "../../.agents/skills/generate-example/run.sh" does not exist. Fix the href or restore the target, then delete this comment. -->
<!-- openwiki: broken internal link [../../.agents/playbooks/generate-example.md] file "../../.agents/playbooks/generate-example.md" does not exist. Fix the href or restore the target, then delete this comment. -->
- After substantive portable or bootstrap changes, run [`.agents/skills/generate-example/run.sh`](../../.agents/skills/generate-example/run.sh) and commit the resulting `example/` diff when it should track the kit (see [`.agents/playbooks/generate-example.md`](../../.agents/playbooks/generate-example.md)).
- Release-style passes should align with [`.agents/playbooks/pre-publish.md`](../../.agents/playbooks/pre-publish.md), which already treats validating or refreshing `example/.agents` as part of the workflow when relevant.
