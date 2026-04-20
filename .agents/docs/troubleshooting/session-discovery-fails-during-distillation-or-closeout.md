---
id: session-discovery-fails-during-distillation-or-closeout
title: "Session Discovery Fails During Distillation or Closeout"
last_updated: 2026-04-19
description: >
  Closeout or distillation workflows sometimes report no session bundles even
  when work exists; this entry covers common glob and layout causes.
tags: [sessions, skills, workflow]
---

# Session Discovery Fails During Distillation or Closeout

#### Symptom

A first-pass glob suggests `.agents/sessions/` contains no bundles, even though active sessions exist.

#### Likely causes

- Searching for misspelled or non-existent directories.
- Using a narrow glob and accepting an incomplete result without structure-aware verification.
- **Ignore-aware search hiding bundles:** everything under `.agents/sessions/` except `README.md` is gitignored, so tools that skip ignored paths can report an empty directory even when bundles exist on disk.

#### Fix

- Verify with a structure-aware query like `.agents/sessions/*/summary.json` before assuming the directory is empty.
- When using ripgrep or IDE search, include **gitignored** files if the tool supports it (for example `rg --no-ignore-vcs`), or enumerate the directory with the shell filesystem APIs instead of an ignore-aware index alone.
- Read `summary.json` to filter sessions by state fields such as `distilled` rather than relying on folder names.

#### Validation

- The correct list of active or undistilled session bundles is found and enumerated.
