---
id: overlapping-session-bundles-for-one-initiative
title: "Overlapping session bundles for one initiative"
last_updated: 2026-04-19
---

# Overlapping session bundles for one initiative

#### Symptom

Two or more folders under `.agents/sessions/` describe related work, or `summary.json` includes a `prior_session` pointer.

#### Likely causes

- Multi-agent flows where an orchestrator wrote a second closeout instead of editing an earlier bundle.
- Legitimate split of evidence across bundles for the same arc.

#### Fix

- During `learning-distill`, merge lessons mentally (or in durable docs) using `task_id`, timestamps, and `prior_session`; do not edit earlier session files to combine narratives.
- Prefer adding a new bundle that references the prior path over mutating an already closed packet.

#### Validation

- Durable doc updates reference the right bundle IDs; raw session trees remain unchanged aside from allowed `summary.json` status fields.
