---
type: Decision
title: Agents do not stage or commit changes
description: 'Coding agents should leave git staging and commits to the maintainer
  so history and review boundaries stay human-controlled.

  '
tags:
- git
- agents
- workflow
timestamp: '2026-04-19T00:00:00Z'
aksk_status: accepted
---

# Agents do not stage or commit changes

### Status

Accepted

### Context

When finishing work, agents might try to stage (`git add`) or commit the changes they made.

### Rationale

The repository maintainer prefers to manually review all uncommitted changes, stage them selectively, and write the commit messages themselves. Agents staging or committing changes circumvents this manual review step.

### Consequences

- Agents should never run `git add` or `git commit`.
- Leave all modified, created, or deleted files in the working directory as unstaged changes.
- Use `/local-review-uncommitted` to let the maintainer review the uncommitted files.
