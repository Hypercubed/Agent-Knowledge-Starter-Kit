---
type: Decision
title: 'Sessions directory: tracked README with ignored bundles'
description: 'Track only `.agents/sessions/README.md` in git while per-task bundle
  folders stay ignored so temporary closeout evidence does not pollute history.

  '
tags:
- sessions
- git
- workflow
timestamp: '2026-04-19T00:00:00Z'
aksk_status: accepted
---

# Sessions directory: tracked README with ignored bundles

### Status

Accepted

### Context

Consumers need a `.agents/sessions/` directory with guidance while keeping per-task bundle folders local.

### Rationale

A short `.agents/sessions/README.md` gives human-facing context; in `.agents/.gitignore`, pairing `sessions/*` with `!sessions/README.md` (paths relative to `.agents/`) tracks exactly one file there while bundle subfolders stay ignored.

### Consequences

- After copying or merging the kit, confirm `.gitignore` exceptions match the tracked filename exactly (path segments and case).
