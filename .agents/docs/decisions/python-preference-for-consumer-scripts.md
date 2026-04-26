---
id: python-preference-for-consumer-scripts
title: Python preference for consumer-facing scripts
last_updated: 2026-04-25
description: Consumer-facing scripts and tooling in the repository should be implemented in Python to ensure cross-platform compatibility and consistent development experience.
tags:
- scripts
- python
- maintenance
- conventions
status: accepted
depends_on:
- decisions/regenerate-example-when-portable-kit-changes
---

# Python preference for consumer-facing scripts

### Status

Accepted

### Context

The repository uses Python as the primary language for consumer-facing scripts and tooling. This applies to scripts that users or other agents invoke directly.

### Decision

All consumer-facing scripts and tooling in the repository should be implemented in Python. Internal maintainer-only scripts (like `run.sh` or build checks) may continue to use Bash.

### Rationale

- Cross-platform compatibility (works on Windows without WSL)
- Consistent development experience for Python-focused users
- Easier to integrate with Python-based documentation tooling

### Implementation

When replacing an existing script (e.g., Bash → Python):

1. Perform a comprehensive `grep` search across the entire repository for both the filename and command invocations
2. Update all references in documentation, contracts, skill files, and example directories
3. Verify the new script executes correctly
4. Identify old script files for deletion

### Related

- [Regenerate example/ when portable kit changes](regenerate-example-when-portable-kit-changes.md)