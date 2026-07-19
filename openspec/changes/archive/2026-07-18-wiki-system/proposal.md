# Proposal: Wiki Expansion for Agent Knowledge Starter Kit

## Problem

The Agent Knowledge Starter Kit maintains knowledge in skills, playbooks, decisions, and troubleshooting sections, but lacks a declarative, codebase-grounded wiki as a first-class knowledge store. Existing knowledge layers focus on procedural "how" (skills/playbooks) or specific categories (decisions/troubleshooting), but there's no dedicated space for descriptive "what and why" knowledge that is grounded in the codebase.

## Proposed Change

Extend the starter kit with a `.agents/wiki/` directory containing declarative knowledge entries as a peer to skills and playbooks (not derived from them). Implement two update paths: session-driven distillation and direct write via a new skill. Add linting for drift detection between wiki entries and actual code.

## Impact

- **Comprehensive Knowledge Layer**: Adds wiki as a first-class store for declarative knowledge alongside procedural skills/playbooks.
- **Codebase Grounding**: Wiki entries include `code_refs` to link knowledge to actual code, enabling automated maintenance.
- **Maintenance Automation**: Semantic linting detects drift and emits wiki plans for reconciliation, keeping knowledge current.
- **Flexible Updates**: Supports both structured session-driven updates and ad hoc direct writes.

## Success Criteria

- `.agents/wiki/` directory exists with `index.md` registry and subdirectories (`decisions/`, `systems/`, `concepts/`).
- Wiki entry format is defined and implemented with YAML frontmatter including `id`, `code_refs`, and metadata.
- Skills are updated: `task-closeout` captures `wiki_candidates`, `learning-distill` writes wiki entries, `docs-lint` performs semantic linting, and new `wiki-update` skill enables direct writes.
- Workflow changes support full cycle (session-driven), direct write (ad hoc), and drift repair (lint-triggered) paths.
- Documentation is updated to reflect the new wiki layer in architecture and index files.