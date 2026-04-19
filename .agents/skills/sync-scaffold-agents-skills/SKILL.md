---
name: sync-scaffold-agents-skills
description: Maintainer-only for this repository. Sync kit skills from scaffold into .agents/skills using the Skills CLI. One-way merge; leaves other .agents files intact. Use when scaffold/skills is canonical and this repo keeps a dual-tree layout.
metadata:
  internal: true
---

# Sync scaffold agents and skills (this repo)

## Placement

This skill folder lives **only** under `.agents/skills/` here. It is **not** part of `scaffold/` and is **not** shipped to kit adopters via sync. Generic kit skills belong in `scaffold/skills/` and flow into `.agents/skills/` when synced; maintainer workflow skills belong here.

## Goal

Refresh `.agents/skills/` from **`scaffold/skills/`** using the Skills CLI so the published kit stays canonical for shared skills.

## When to use

- After editing shared skills under `scaffold/skills/`.
- When bringing this repo’s dogfood `.agents/` install up to date without overwriting repo-local `.agents` content (docs, playbooks, sessions, extra maintainer-only skills like this one, etc.).

## Canonical direction

- **Source:** `scaffold/skills/`
- **Destination:** `.agents/skills/`
- **Never** copy from `.agents/` back into `scaffold/` as part of this task unless the user explicitly asked to promote changes into the kit.

## Procedure

1. Confirm the repository root contains `scaffold/skills` and `.agents/`.

2. From the repository root, run:

   ```bash
   npx skills add . -y
   ```

   The `-y` flag is for non-interactive maintainer bootstrap in this repository only; do not document it for kit adopters.

   Equivalent npm script:

   ```bash
   npm run bootstrap
   ```

3. Review `git diff` under `.agents/skills/` only; commit if appropriate.

## What the CLI does

- Adds or updates skills in `.agents/skills/` from package-local `scaffold/skills/`.
- Leaves non-skill `.agents/` paths unchanged.
- Preserves maintainer-only skills that are not part of the published shared skill set.

## Prerequisites

- Requires package-local `scaffold/skills/` at the repo root and the `skills` CLI (`npx skills ...`).

## Constraints

- Do not sync `.agents/docs/`, `.agents/playbooks/`, `.agents/AGENTS.md`, or other non-skill paths via this skill unless the user asks for a different scope.
- Do not delete maintainer-only skills to "match" scaffold.
