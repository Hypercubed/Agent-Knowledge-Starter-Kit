---
type: Decision
title: 'Maintainer-only skills use `metadata.internal: true`'
description: 'Skills that are only for this repository’s maintenance must declare
  `metadata.internal: true` so portable installs do not surface them as kit skills.

  '
tags:
- skills
- maintenance
- release
aksk_status: accepted
generated: { by: "openwiki/0.4.3", at: "2026-08-29T20:18:58.499Z" }
---

# Maintainer-only skills use `metadata.internal: true`

### Status

Accepted

### Context

Portable kit skills live under `.agents/skills/` and are picked up by `npx skills add` and similar installs. Some folders under that path are meant **only** for maintainers of this repository (for example regenerating the disposable `example/` tree).

### Rationale

The Skills format supports marking a skill as internal so default consumer installs do not surface maintainer-only automation. That preserves a **single** `.agents/skills/` tree without a parallel export directory.

### Consequences

<!-- openwiki: broken internal link [../../.agents/skills/generate-example/SKILL.md] file "../../.agents/skills/generate-example/SKILL.md" does not exist. Fix the href or restore the target, then delete this comment. -->
- Any skill that must not ship as part of the default portable contract sets **`metadata.internal: true`** in YAML frontmatter. In this repo, [`.agents/skills/generate-example/SKILL.md`](../../.agents/skills/generate-example/SKILL.md) is the reference pattern.
- Before merging a new skill, decide whether the audience is every adopter or this repository only, and set frontmatter accordingly.
