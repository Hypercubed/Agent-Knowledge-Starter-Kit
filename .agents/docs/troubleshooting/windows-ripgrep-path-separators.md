---
id: windows-ripgrep-path-separators
title: "Windows ripgrep path separators"
last_updated: 2026-04-25
description: Normalize Windows ripgrep backslashes in cross-platform scripts.
tags:
  - python
  - ripgrep
  - cross-platform
---

# Windows ripgrep path separators

When using `ripgrep` (`rg`) within cross-platform python scripts, be sure to normalize backslashes (`\`) to forward slashes (`/`) on the subprocess stdout.

Without normalization, Windows `ripgrep` outputs may cause string splitting and path resolution issues.
