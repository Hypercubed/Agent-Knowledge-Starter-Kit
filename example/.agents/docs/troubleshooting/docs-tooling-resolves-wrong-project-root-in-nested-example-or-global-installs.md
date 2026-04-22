---
id: docs-tooling-resolves-wrong-project-root-in-nested-example-or-global-installs
title: Docs tooling resolves wrong project root in nested `example/` or global installs
last_updated: 2026-04-20
description: 'Docs tooling may target the wrong project when scripts infer only git root; this entry describes override-first plus nearest-`.agents` resolution and checks.

  '
tags:
- docs
- skills
- tooling
- troubleshooting
depends_on:
- decisions/docs-tooling-scripts-resolve-target-from-override-then-nearest-agents
---
# Docs tooling resolves wrong project root in nested `example/` or global installs

#### Symptom

`docs-search` or `docs-compile` appears to run successfully but updates or searches the wrong project when invoked from nested directories (for example `example/`) or globally installed script locations.

#### Likely causes

- Script resolution assumes git root instead of the intended project target.
- No explicit `.agents` target override was passed for non-default execution context.
- Refactors changed path variables without validating both root and nested execution paths.

#### Fix

- Resolve target in this order:
  - explicit CLI argument or environment override,
  - nearest `.agents` from current working directory,
  - fail with a clear error if unresolved.
- Keep path-resolution logic centralized to avoid drift across docs tooling scripts.
- Validate from both repository root and `example/` after changes.

#### Validation

- `docs-compile` succeeds from root and nested `example/` with indexes updated in the intended target.
- `index-docs.py --dry-run` succeeds from root and nested `example/` and reports the expected docs tree.
