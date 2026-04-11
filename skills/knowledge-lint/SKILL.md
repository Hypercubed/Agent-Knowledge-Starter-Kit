---
name: knowledge-lint
description: Check the .agents knowledge layer for duplication, contradiction, staleness, oversized guidance, missing links, and uncategorized knowledge. Use as a periodic maintenance pass.
---

# Knowledge Lint

## Goal
Keep the compiled repo knowledge layer coherent, minimal, and current.

## Inputs
- .agents/AGENTS.md
- .agents/MAINTENANCE.md
- .agents/index.md
- .agents/log.md
- .agents/repo-decisions.md
- .agents/troubleshooting.md
- .agents/playbooks/

## Checks
- duplicate guidance
- contradictions
- stale or superseded rules
- oversized AGENTS sections
- missing index coverage
- troubleshooting entries that should be decisions or playbooks
- decisions that should be compressed into AGENTS guidance

## Output
Produce:
- a lint report
- optional minimal edits
- a log entry in `.agents/log.md`

## Constraints
- Prefer reclassification and compression over adding more text.
- Do not modify source code.
- Do not delete knowledge without explicit justification.
