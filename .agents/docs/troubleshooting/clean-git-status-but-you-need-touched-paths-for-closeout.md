---
id: clean-git-status-but-you-need-touched-paths-for-closeout
title: "Clean `git status` but you need touched paths for closeout"
last_updated: 2026-04-19
description: >
  After commits, the working tree is clean but **task-closeout** still needs an
  accurate list of paths touched in the session for the bundle record.
tags: [git, sessions, skills, workflow]
---

# Clean `git status` but you need touched paths for closeout

#### Symptom

The working tree is clean (changes already committed), but **task-closeout** needs an accurate list of paths touched in the session.

#### Likely causes

- Commits landed before closeout.
- The arc spans multiple commits.

#### Fix

- Use `git log -1 --name-only` for the latest commit, or widen the window (`git log -N --name-only`, or `git diff --name-only <base>..HEAD`) to match the task scope.

#### Validation

- Closeout artifacts (for example `changed-files.txt`) list the expected paths.
