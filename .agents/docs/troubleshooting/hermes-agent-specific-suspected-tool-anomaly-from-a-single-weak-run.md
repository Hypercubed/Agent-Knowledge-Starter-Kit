---
id: hermes-agent-specific-suspected-tool-anomaly-from-a-single-weak-run
title: "Hermes Agent–specific: Suspected tool anomaly from a single weak run"
last_updated: 2026-04-19
description: >
  A single flaky tool invocation in Hermes should be validated against the real
  filesystem before promoting it as a durable repo-wide incident pattern.
tags: [hermes, tooling, debugging]
---

# Hermes Agent–specific: Suspected tool anomaly from a single weak run

#### Symptom

An earlier session reports that `write_file`, `patch`, or `read_file` behaved inconsistently with the real repository state.

#### Likely causes

- The observation came from a low-confidence or weak-model run and may have included incorrect conclusions.
- The failure may have been specific to a delegated or unusual execution context rather than Hermes as a whole.
- The reported symptom was not reproduced in a later direct verification pass.

#### Fix

- Reproduce the issue in the current execution context before recording it as durable repo knowledge.
- Verify important writes with an independent follow-up check such as `read_file`, `git status`, or terminal inspection.
- If the anomaly only appears in a delegated or sandboxed context, document it narrowly with that context spelled out.

#### Validation

- A direct rerun in the current session reproduces the failure consistently, or later verification shows normal behavior and the broad claim is removed.
