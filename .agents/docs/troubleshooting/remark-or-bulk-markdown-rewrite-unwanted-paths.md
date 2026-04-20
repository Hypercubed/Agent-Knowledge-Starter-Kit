---
id: remark-or-bulk-markdown-rewrite-unwanted-paths
title: "Remark or bulk Markdown rewrite touched unwanted paths"
last_updated: 2026-04-19
description: >
  Wide Markdown formatter runs can touch many files; this pattern explains how
  to restore only the intended paths without discarding unrelated work.
tags: [markdown, git, tooling]
---

# Remark or bulk Markdown rewrite touched unwanted paths

#### Symptom

A repo-wide or wide `remark` (or similar) pass rewrote many tracked `*.md` files, or you need to back out formatter output and are unsure which paths to restore.

#### Likely causes

- Running `remark --output` (or an npm script) over `git ls-files '*.md'` without verifying on a small set first.
- Using `git restore .` or a broad path list that includes files the formatter never touched, which can drop unrelated uncommitted work.

#### Fix

- Restore only paths that match what the command actually processed (for example `git restore -- $(git ls-files '*.md')` when that was the input list).
- If `git status` shows extra modified paths, stop and disambiguate before restoring; use editor local history or other recovery for paths you must not lose.
- For future runs, test on one file or a branch before applying across the tree.

#### Validation

- `git status` shows only the intended Markdown set (or a clean tree after a deliberate commit).
