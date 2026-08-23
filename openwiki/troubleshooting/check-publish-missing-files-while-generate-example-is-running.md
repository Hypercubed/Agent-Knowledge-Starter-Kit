---
type: Troubleshooting
title: '`check-publish.sh` reports missing files while `generate-example` is running'
description: 'Validation can fail with transient missing-file errors when checks run
  while `generate-example` is actively rebuilding `example/`.

  '
tags:
- validation
- scripts
- example
- maintenance
timestamp: '2026-04-22T00:00:00Z'
---

# `check-publish.sh` reports missing files while `generate-example` is running

#### Symptom

`bash scripts/check-publish.sh` fails with missing-file or path-not-found errors during a maintenance pass that is also running `bash .agents/skills/generate-example/run.sh`.

#### Likely causes

`generate-example` removes and recreates `example/` as part of its normal flow, so concurrent validation can observe partial state and fail transiently.

#### Fix

- Run these commands sequentially, not concurrently.
- Wait for `generate-example` to finish, then rerun `check-publish.sh`.
- Keep `generate-example` as on-demand validation (request/release scope) instead of part of the default edit/check loop.

#### Validation

- `check-publish.sh` passes on rerun after generation completes.
- No persistent missing-file errors remain once command ordering is corrected.
