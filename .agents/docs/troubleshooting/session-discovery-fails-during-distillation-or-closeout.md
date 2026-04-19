---
id: session-discovery-fails-during-distillation-or-closeout
title: "Session Discovery Fails During Distillation or Closeout"
last_updated: 2026-04-19
---

# Session Discovery Fails During Distillation or Closeout

#### Symptom

A first-pass glob suggests `.agents/sessions/` contains no bundles, even though active sessions exist.

#### Likely causes

- Searching for misspelled or non-existent directories.
- Using a narrow glob and accepting an incomplete result without structure-aware verification.

#### Fix

- Verify with a structure-aware query like `.agents/sessions/*/summary.json` before assuming the directory is empty.
- Read `summary.json` to filter sessions by state fields such as `distilled` rather than relying on folder names.

#### Validation

- The correct list of active or undistilled session bundles is found and enumerated.
