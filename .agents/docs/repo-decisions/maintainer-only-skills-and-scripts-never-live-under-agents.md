---
id: maintainer-only-skills-and-scripts-never-live-under-agents
title: "Maintainer-only skills and scripts never live under `scaffold/`"
last_updated: 2026-04-19
---

# Maintainer-only skills and scripts never live under `scaffold/`

### Status

Accepted

### Context

Skills under `scaffold/skills/` are what adopters copy into their `.agents/skills/` tree. Maintainer workflows for this repository (for example selective sync from `scaffold/` into dogfood `.agents/`) are not portable kit content.

### Rationale

Putting a maintainer skill in `scaffold/` ships it to consumers, who often have no `.agents/` directory, and erases the boundary between generic template and starter-repo dogfood.

### Consequences

- Maintainer-only skills and any helper scripts stay under this repo’s `.agents/skills/<skill-name>/` beside `SKILL.md`.
- Portable skills and agent role files remain under `scaffold/skills/` and `.agents/agents/` and are merged into `.agents/` when maintainers run the documented sync.
