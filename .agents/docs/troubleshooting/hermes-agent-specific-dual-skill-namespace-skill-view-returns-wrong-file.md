---
id: hermes-agent-specific-dual-skill-namespace-skill-view-returns-wrong-file
title: "Hermes Agent–specific: Dual skill namespace (`skill_view` returns wrong file)"
last_updated: 2026-04-19
description: >
  Hermes may resolve `skill_view` against a different skill namespace than the
  repo’s `.agents/skills/` tree, returning unexpected stub content.
tags: [hermes, skills, tooling]
---

# Hermes Agent–specific: Dual skill namespace (`skill_view` returns wrong file)

#### Symptom

Agent calls `skill_view(name="task-closeout")` and gets back a stub or different content than what exists at `.agents/skills/task-closeout/SKILL.md` in the repo.

#### Likely causes

- **Hermes install vs repo tree:** `skill_view` resolves skills from the Hermes system directory (`~/.hermes/skills/`), not from the repository’s `.agents/skills/` directory. This “two namespaces” behavior is tool-specific and unrelated to the repository’s single-tree kit layout.
- The two namespaces can have entries with the same name but completely different content.
- Subagents especially will grab whichever one they find first via the skill system, never looking at the repo file tree.

#### Fix

- Read skills directly from the repo filesystem (`read_file` or `cat .agents/skills/<name>/SKILL.md`) rather than using `skill_view`.
- Do not rely on the Hermes skill system for repo-local skills.

#### Validation

- The skill content matches the repo file exactly.
- `skill_view` and direct filesystem read return the same content (or `skill_view` returns nothing).
