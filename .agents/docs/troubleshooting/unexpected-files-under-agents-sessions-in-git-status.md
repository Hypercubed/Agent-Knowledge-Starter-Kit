---
id: unexpected-files-under-agents-sessions-in-git-status
title: "Unexpected files under `.agents/sessions/` in git status"
last_updated: 2026-04-19
description: >
  Session bundles or stray files under `.agents/sessions/` can show up as
  tracked or modified when ignore rules and README expectations drift.
tags: [sessions, git, workflow]
---

# Unexpected files under `.agents/sessions/` in git status

#### Symptom

`git status` shows unwanted tracked files, or bundles appear tracked, under `.agents/sessions/`.

#### Likely causes

- `.agents/.gitignore` negation rules do not match the tracked `README` path or filename (including case).
- A local `.gitignore` differs from the kit after a partial copy.

#### Fix

- Confirm the pattern pair in `.agents/.gitignore`: ignore `sessions/*` (or equivalent) and a single negated path such as `!sessions/README.md` (relative to `.agents/`) that exactly matches the file you intend to track.
- Remove accidental `git add` of bundle paths; keep bundles untracked.

#### Validation

- Only the intended `.agents/sessions/README.md` (if any) is tracked; bundle directories stay ignored.
