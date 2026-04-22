---
id: maintainer-skill-lives-under-agents-skills-by-mistake
title: Maintainer-only skill appears as a portable kit skill
last_updated: 2026-04-19
description: 'Maintainer automation placed under `.agents/skills/` without `internal: true` can be picked up by consumer installs; mark it internal or relocate it.

  '
tags:
- skills
- maintenance
- release
depends_on:
- decisions/maintainer-skills-mark-internal-in-frontmatter
---
# Maintainer-only skill appears as a portable kit skill

#### Symptom

A skill meant only for this repository’s maintenance is present under `.agents/skills/<name>/` **without** `metadata.internal: true` (or equivalent), so consumers running `npx skills add` would inherit maintainer-only automation.

#### Likely causes

- Skill added before deciding whether the audience is **every kit adopter** or **this repository only**.
- Copied a maintainer workflow into the same tree as portable skills without marking it internal.

#### Fix

- Add `metadata.internal: true` to the skill’s YAML frontmatter (see [`.agents/skills/generate-example/SKILL.md`](../../skills/generate-example/SKILL.md) and the repo decision [Maintainer-only skills use `metadata.internal: true`](../decisions/maintainer-skills-mark-internal-in-frontmatter.md)), **or** remove the skill from the paths that ship to consumers per your publishing process.
- Keep portable kit skills free of repo-private scripts unless they are clearly part of the shared contract.

#### Validation

- `npx skills add` for this repository does not surface maintainer-only skills to generic adopters, or your docs explicitly scope who should install which folders.
