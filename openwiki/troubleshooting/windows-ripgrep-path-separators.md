---
type: Troubleshooting
title: Windows ripgrep path separators
description: Normalize Windows ripgrep backslashes in cross-platform scripts.
tags:
- python
- ripgrep
- cross-platform
timestamp: '2026-04-25T00:00:00Z'
---

# Windows ripgrep path separators

When using `ripgrep` (`rg`) within cross-platform python scripts, be sure to normalize backslashes (`\`) to forward slashes (`/`) on the subprocess stdout.

Without normalization, Windows `ripgrep` outputs may cause string splitting and path resolution issues.
