---
id: ts-codex-cannot-write-under-agents-during-closeout-or-distill
title: "Codex cannot write under `.agents/` during closeout or distill"
last_updated: 2026-04-19
description: >
  Codex runs may treat `.agents/` as read-only or require extra approval when
  creating session bundles or updating durable knowledge during workflows.
tags: [codex, sessions, skills, agents]
---

# Codex cannot write under `.agents/` during closeout or distill

#### Symptom

Codex can read `.agents/` but creating a session folder or updating durable knowledge files fails with a read-only filesystem or approval-related error.

#### Likely causes

- Codex sandbox settings protect `.agents/` under workspace-write mode.
- The current session is running in read-only mode.

#### Fix

- Approve the specific `.agents/` write needed for closeout or distillation, or use a configuration that permits the intended maintenance edit.
- Do not treat the error as a kit layout problem; `.agents/` is still the correct location for dogfood knowledge and session bundles in this repo.

#### Validation

- The intended `.agents/` file or session folder is created or updated.
- `git status --short` shows only expected durable knowledge changes; per-task session bundles remain ignored.
