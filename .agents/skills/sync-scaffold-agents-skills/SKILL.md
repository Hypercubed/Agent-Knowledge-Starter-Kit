---
name: sync-scaffold-agents-skills
description: Maintainer-only for this repository. Copy kit agent definitions and skills from scaffold into .agents (scaffold/agents and scaffold/skills only). One-way merge; leaves other .agents files and any extra local skills intact. Use when scaffold is canonical for those two directories and this repo keeps a dual-tree layout.
metadata:
  internal: true
---

# Sync scaffold agents and skills (this repo)

## Placement

This skill folder (`SKILL.md` plus `sync.sh`) lives **only** under `.agents/skills/` here. It is **not** part of `scaffold/` and is **not** shipped to kit adopters via sync. Generic kit skills belong in `scaffold/skills/` and flow into `.agents/skills/` when synced; maintainer workflow skills belong here.

## Goal

Refresh `.agents/agents/` and `.agents/skills/` from **`scaffold/agents/`** and **`scaffold/skills/`** so the published kit stays canonical for those two trees only.

## When to use

- After editing agent markdown or skills under `scaffold/`.
- When bringing this repo’s dogfood `.agents/` install up to date without overwriting repo-local `.agents` content (docs, playbooks, sessions, extra skills like this one, etc.).

## Canonical direction

- **Source:** `scaffold/agents/`, `scaffold/skills/`
- **Destination:** `.agents/agents/`, `.agents/skills/`
- **Never** copy from `.agents/` back into `scaffold/` as part of this task unless the user explicitly asked to promote changes into the kit.

## Procedure

1. Confirm the repository root contains `scaffold/agents`, `scaffold/skills`, and `.agents/` (the script creates `agents` and `skills` subdirs under `.agents` if needed).

2. From the repository root, run:

   ```bash
   ./.agents/skills/sync-scaffold-agents-skills/sync.sh
   ```

   Or from this skill directory: `./sync.sh`

3. Review `git diff` under `.agents/agents/` and `.agents/skills/` only; commit if appropriate.

## What the script does

- Merges files from scaffold into `.agents` for **those two directories only**.
- Does **not** use `rsync --delete` (or equivalent): files present only under `.agents/skills/` or `.agents/agents/` are left unchanged.
- Prefers `rsync -a` when available; otherwise uses `cp -a`.

## Prerequisites

- Requires **`scaffold/`** at the repo root with `scaffold/agents` and `scaffold/skills`. If there is no scaffold tree, there is nothing to sync; do not guess alternate sources.

## Constraints

- Do not sync `scaffold/docs/`, `scaffold/playbooks/`, `scaffold/AGENTS.md`, `.agents/AGENTS.md`, or other paths via this skill unless the user asks for a different scope.
- Do not delete consumer-only skills or agents to “match” scaffold; missing kit files stay only in scaffold until the next successful sync adds them.
