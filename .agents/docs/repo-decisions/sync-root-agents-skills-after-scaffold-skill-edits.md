---
id: sync-root-agents-skills-after-scaffold-skill-edits
title: "Sync root `.agents` skills after scaffold skill edits"
last_updated: 2026-04-19
---

# Sync root `.agents` skills after scaffold skill edits

### Status

Accepted

### Context

This repo dogfoods the starter kit through a root `.agents/` tree while publishing portable shared skills under `scaffold/skills/`.

### Rationale

When `scaffold/skills/` changes, the root dogfood `.agents/skills/` copy should receive those portable updates in the same maintenance pass. That keeps local behavior aligned with the kit without copying maintainer-only files into `.agents/`.

### Consequences

- After portable edits under `.agents/skills/`, run `npx skills add . -y` (or `npm run bootstrap`) from the repository root.
- Review the resulting diff under `.agents/skills/`.
- Do not use this sync for non-skill paths unless a separate task explicitly changes the sync scope.
