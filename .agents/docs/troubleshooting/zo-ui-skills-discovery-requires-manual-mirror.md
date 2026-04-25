---
id: zo-ui-skills-discovery-requires-manual-mirror
title: Zo UI skill discovery does not auto-show repo-local skills
last_updated: 2026-04-22
description: Kit skills installed to canonical path are not visible in Zo's Skills UI without manual mirroring.
tags:
  - environment-zo
  - skills
  - discovery
---

# Zo UI skill discovery does not auto-show repo-local skills

## Symptom

Skills installed via `npx skills add` into `.agents/skills/` (the canonical location) are not visible in Zo's Skills UI. The Skills panel does not show the kit skills until their `SKILL.md` files are manually copied into `/home/workspace/Skills/`.

## Cause

Zo Computer scans `/home/workspace/Skills/` for runnable skills. Skills installed via `npx skills add` land in `.agents/skills/<name>/` (canonical), but the Zo UI does not auto-discover them there. Agents must manually mirror or symlink skill folders into `/home/workspace/Skills/`.

## Fix

Keep canonical skill definitions under `.agents/skills/` and mirror `SKILL.md` files into `/home/workspace/Skills/` for Zo UI discovery. After mirroring, the Skills UI reflects the kit skills.

## Validation

1. Run `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit --yes` to install the kit.
2. Check Zo's Skills UI — kit skills may not appear.
3. Copy each skill's `SKILL.md` from `.agents/skills/<skill>/` to `/home/workspace/Skills/<skill>/`.
4. Refresh the Skills UI — kit skills should now be visible.

## Related

- `single-tree architecture` decision: `.agents/skills/` is the canonical home for portable kit skills.
