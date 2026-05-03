---
id: browser-subagent-filesystem-access-error
title: "Browser subagent fails with invalid_args on view_file"
last_updated: 2026-05-03
---

# Browser subagent fails with invalid_args on view_file

## Symptoms

- Subagent error: "model output error: invalid tool call error (invalid_args) you may only view files in the allowlist".
- The subagent enters a retry loop trying to view or edit repository files.

## Fix

- **Cause**: Attempting to use a browser-only subagent for local file system tasks.
- **Resolution**: Use the main agent's core tools for file operations (like `view_file`, `write_to_file`). The `browser_subagent` is strictly for web/browser interactions and cannot be used for repository file manipulation.
