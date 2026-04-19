---
name: maintainer-install-smoke-test
description: Maintainer-only wrapper to run the local consumer install smoke test in `_test-target-repo` and verify expected artifacts.
metadata:
  internal: true
---

# Maintainer Install Smoke Test

## Placement

This skill is maintainer-only for this repository. It must stay under `.agents/skills/` and is not part of `scaffold/`.

## Goal

Run a repeatable local smoke test for the consumer install path:

- rebuild `_test-target-repo`
- install kit skills without `--all`
- verify exactly three consumer skills
- bootstrap and validate key `.agents/` artifacts

## Canonical reference

Follow [`.agents/playbooks/maintainer-install-smoke-test.md`](../../playbooks/maintainer-install-smoke-test.md) as the source of truth for expectations and troubleshooting notes.

## Procedure

1. From the repo root, run:

   ```bash
   .agents/skills/maintainer-install-smoke-test/run.sh
   ```

2. Review command output for:
   - `Found 3 skills` during listing
   - install summary containing only `knowledge-lint`, `learning-distill`, and `task-closeout`
   - absence of `sync-scaffold-agents-skills` in `_test-target-repo/.agents/skills/`
3. If any validation line reports `FAIL`, stop and inspect the generated target tree before continuing maintainer work.

## Constraints

- Do not use `--all` for this smoke test.
- Keep `_test-target-repo` disposable and gitignored.
- Do not modify `scaffold/` from this skill.
