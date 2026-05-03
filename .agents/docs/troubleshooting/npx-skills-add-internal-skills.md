---
id: npx-skills-add-internal-skills
title: "npx skills add includes internal skills"
last_updated: 2026-05-03
---

# `npx skills add` includes internal skills

## Symptoms

- Running `npx skills add .` installs skills despite them being marked as `internal: true` in the `metadata` block.

## Fix

If `npx skills add` includes skills marked as `internal: true`, check if:
1. Duplicate definitions of the skill exist in other directories (e.g., `.github`, `scripts`) that lack the `internal` flag.
2. The `internal: true` flag is placed at the very top of the `metadata` block in `SKILL.md` to ensure maximum compatibility with different versions of the `skills` CLI.

Use `npx skills list <source>` before running `add` to verify which skills the CLI actually considers internal.
