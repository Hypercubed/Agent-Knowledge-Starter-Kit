---
id: maintainer-skill-lives-under-agents-skills-by-mistake
title: "Maintainer skill lives under `.agents/skills/` by mistake"
last_updated: 2026-04-19
---

# Maintainer skill lives under `.agents/skills/` by mistake

#### Symptom

A skill meant only for this repo’s dual-tree maintenance appears under `.agents/skills/`, or adopters would inherit maintainer-only automation.

#### Likely causes

- Skill added before deciding whether the audience is **every kit adopter** or **this repository only**.

#### Fix

- Remove the skill from `.agents/skills/`. Keep it only under `.agents/skills/<skill-name>/` with any helper script in the same folder as `SKILL.md`.

#### Validation

- `.agents/skills/` lists only portable kit skills; maintainer sync or similar tooling exists only under `.agents/skills/` when applicable.
