---
name: generate-example
description: Maintainer-only wrapper to generate the `example/` folder demonstrating a fully initialized kit.
metadata:
  internal: true
---

# Generate Example Folder

## Placement

This skill is maintainer-only for this repository. It has `internal: true` so it is not distributed to consumers.

## Goal

Generate a complete `example/` directory at the repository root that demonstrates what a fully bootstrapped consumer install looks like.

## Canonical reference

Follow [`.agents/playbooks/generate-example.md`](../../playbooks/generate-example.md) as the source of truth.

## Procedure

1. From the repo root, run:

   ```bash
   .agents/skills/generate-example/run.sh
   ```

2. Verify the `example/` directory has been updated.

## Constraints

- Keep `example/` disposable or updated.
- Do not modify portable skill files from this task.
