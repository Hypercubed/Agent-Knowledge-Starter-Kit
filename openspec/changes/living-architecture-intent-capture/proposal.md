# Proposal: Living Architecture & Intent Capture

## Problem
The Agent Knowledge Starter Kit (AKSK) currently lacks a systematic way to capture the "Why" behind code changes at the moment of creation. Documentation remains a manual chore, leading to incomplete or outdated architectural and operational records.

## Proposed Change
Implement a "Living Architecture & Intent Capture" system that automatically captures the rationale behind code changes through a guided "Editor" workflow integrated into the task-closeout process. This includes creating a manifest-driven decision record store, standardizing ADR formats, and updating skills to enforce intent-first documentation.

## Impact
- **Intent-First Development**: Shifts documentation from retrospective chore to proactive, guided workflow.
- **Persistent Knowledge**: Architectural and operational decisions are captured and indexed in a manifest-managed store.
- **Improved Quality**: Agents propose drafts based on context, reducing cognitive load on users.
- **Tool Agnostic**: Uses internal skills for diff analysis while leveraging external tools like git-adr for record management.

## Success Criteria
- `.agents/manifest.json` exists and defines paths for decisions and templates.
- `docs/decisions/` directory is created with standardized naming convention.
- Task-closeout workflow triggers intent capture proposal loop.
- New `document-intent` skill analyzes diffs and drafts records.
- Updated `knowledge-lint` enforces decision record requirements.
- Roadmap phases completed: Manifest & Store, Template, Closeout Integration, Linting.