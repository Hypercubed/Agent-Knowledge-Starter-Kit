---
id: comparing-agents-to-agents-in-this-starter-repo
title: "Comparing `.agents/` to `.agents/` in this starter repo"
last_updated: 2026-04-19
---

# Comparing `scaffold/` to `.agents/` in this starter repo

#### Symptom

Expectation that `diff` between `scaffold/` and `.agents/` should be empty (aside from sessions).

#### Likely causes

- Assumption that the two trees are meant to stay mirrored. They are not: `scaffold/` is the generic kit; `.agents/` is optional maintainer dogfood and may differ.

#### Fix

- Use `scaffold/` when changing what **consumers** receive. Use `.agents/` for **this repo’s** durable notes without forcing them back into the template.

#### Validation

- `.agents/` files contain no references to this repository’s layout beyond what a normal consumer would write in `.agents/`.
