---
id: windows-to-wsl-tool-path-failures
title: Windows-to-WSL Tool Path Failures
last_updated: 2026-04-19
description: 'Agents running on Windows against a WSL workspace can fail file operations when paths cross the Windows/Linux boundary incorrectly.

  '
tags:
- windows
- wsl
- tooling
---

# Windows-to-WSL Tool Path Failures

#### Symptom

Agent tool calls to list, read, or write files in a WSL workspace fail with "The system cannot find the file specified" or "The directory name is invalid" from a Windows host.

#### Likely causes

- Agent is targeting Linux-style paths (`/Ubuntu/home/`) or improperly formatted network paths (`//wsl.localhost/`) directly in Windows APIs.

#### Fix

- Ensure path targets are properly formatted Windows paths (e.g., `\\wsl.localhost\Ubuntu\home\...`) matching the actual host environment layout.

#### Validation

- Tool calls complete successfully.
