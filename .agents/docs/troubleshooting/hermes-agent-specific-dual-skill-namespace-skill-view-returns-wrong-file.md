---
id: hermes-agent-specific-dual-skill-namespace-skill-view-returns-wrong-file
title: "Hermes Agent–specific: Dual skill namespace (`skill_view` returns wrong file)"
last_updated: 2026-04-19
---

# Hermes Agent–specific: Dual skill namespace (`skill_view` returns wrong file)

#### Symptom

Agent calls `skill_view(name="task-closeout")` and gets back a stub or different content than what exists at `.agents/skills/task-closeout/SKILL.md` in the repo.

#### Likely causes

- `skill_view` looks up skills from the Hermes system directory (`~/.hermes/skills/`), not from the repo's `.agents/skills/` directory.
- The two namespaces can have entries with the same name but completely different content.
- Subagents especially will grab whichever one they find first via the skill system, never looking at the repo file tree.

#### Fix

- Read skills directly from the repo filesystem (`read_file` or `cat .agents/skills/<name>/SKILL.md`) rather than using `skill_view`.
- Do not rely on the Hermes skill system for repo-local skills.

#### Validation

- The skill content matches the repo file exactly.
- `skill_view` and direct filesystem read return the same content (or `skill_view` returns nothing).
