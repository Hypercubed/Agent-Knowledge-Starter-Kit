---
id: living-architecture-intent-capture
title: Living Architecture & Intent Capture
last_updated: 2026-04-27
description: Enable an agent to automatically capture the "Why" behind code changes at the moment of creation via a guided Editor workflow.
tags:
- architecture
- intent
- automation
status: active
kind: initiative
author_kind: ai
prompter: User
---

# AKSK Module: Living Architecture & Intent Capture
## 1. Objective
Enable an agent to automatically capture the "Why" behind code changes at the moment of creation. The agent proposes architectural and operational decisions, which the user reviews and commits to a persistent, manifest-indexed store. This shifts documentation from a manual chore to a guided "Editor" workflow.
## 2. Structural Changes
### Manifest Updates (.agents/manifest.json)
The manifest becomes the source of truth for location and governance rules, ensuring portability across different environments.
{
"paths": {
"decisions": "docs/decisions",
"templates": ".agents/templates"
},
"governance": {
"capture_on_closeout": true,
"adr_template": "adr-template.md"
}
}
### New Directory: docs/decisions/
This folder houses all Markdown records. It replaces or consolidates any legacy decisions folders.
 * Naming Convention: NNNN-slug-title.md (e.g., 0001-spherical-coordinate-system.md).
 * Content: Combined Architectural Decision Records (ADR) and Operational Decisions.
## 3. The "Editor" Workflow (The Playbook)
This logic is integrated into the task-closeout playbook to ensure context is captured before a session ends.
 1. Detection: Upon task completion, the agent performs a git diff against the starting state of the mission.
 2. Inference: The agent categorizes changes as Architectural (System Design) or Operational (Workflow/Tactical).
 3. The Proposal: The agent presents a draft to the user:
   "I've drafted a decision record for the new stack-limit in f-flat minor. I've noted the trade-off is reduced recursion depth for better memory stability. Confirm or Edit?"
 4. Persistence: Once approved or corrected, the agent writes the file to the path defined in the manifest.
## 4. Decision Points: Internal vs. External Tools
Strategic choices on where to lean on external software versus custom AKSK logic.
| Feature | Option A: Internal (AKSK Skill) | Option B: External Tool | Recommendation |
|---|---|---|---|
| Record Management | Custom agent scripts to name and number files. | git-adr: A CLI for managing ADR lifecycle. | Option B: Use git-adr for plumbing; wrap it in an AKSK skill. |
| Diff Analysis | Agent reads git diff directly in the prompt. | Aider / Roo Code: Built-in diff summarization features. | Option A: Custom prompt in document-intent to ensure "Why" vs "What". |
| Visual Mapping | Agent manually edits Mermaid.js files in /docs. | Structurizr / IcePanel: Dedicated architecture-as-code tools. | Option A: Keep it simple with Mermaid.js inside your Markdown docs. |
## 5. Skill Implementation Tasks
### document-intent.md (New Skill)
 * Instruction: Analyze the session history and diff. Draft a record using the {adr_template} found in the manifest.
 * Prompting Strategy: Never ask an open-ended "Why?" Always propose a draft based on the current context and ask for validation/correction.
 * Constraint: Never save a decision without an explicit "Looks good" or "Approved" from the user.
### knowledge-lint.md (Updated)
 * New Check: Verify that any modified file in /src/core has a corresponding entry in docs/decisions.
 * New Check: Ensure the decisions path in manifest.json is reachable and indexed.
### distill-learning.md (Updated)
 * New Source: Add docs/decisions to the knowledge ingestion list.
 * Action: Synthesize recurring "Consequences" into global patterns for future project initialization.
## 6. Execution Roadmap
 1. Phase 1: Manifest & Store. Create .agents/manifest.json and move existing contents to docs/decisions.
 2. Phase 2: The Template. Standardize the ADR format in .agents/templates/adr-template.md.
 3. Phase 3: Closeout Integration. Update the task-closeout playbook to trigger the document-intent proposal loop.
 4. Phase 4: Linting. Update knowledge-lint to enforce the new "Intent-First" standard.
