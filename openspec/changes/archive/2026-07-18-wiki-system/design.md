# Design: Wiki System Architecture

## Wiki vs. Skills/Playbooks

The wiki is distinct from skills and playbooks:

|             | Wiki                                    | Skills / Playbooks           |
| ----------- | --------------------------------------- | ---------------------------- |
| Type        | Declarative                             | Procedural                   |
| Purpose     | Describe what the system is and why     | Describe how to do something |
| Consumer    | Humans and agents seeking understanding | Agents executing steps       |
| Source      | Session data + direct writes            | Session data                 |
| Grounded in | Codebase (via `code_refs`)              | Workflows and patterns       |

Both are updated during distillation from session data but neither derives from the other. Cross-references use links, not derivations.

## Update Paths

1. **Session-driven**: Distillation extracts wiki candidates from session bundles after task closeout.
2. **Direct write**: User or agent provides a fact, decision, or external reference; `wiki-update` skill writes the entry without a session bundle.

## Directory Structure

```
.agents/
  wiki/
    index.md              ← entry registry and table of contents
    decisions/            ← architectural decisions
    systems/              ← how subsystems work, grounded in code
    concepts/             ← domain concepts, patterns, terminology
```

The wiki tree is additive and can later absorb or cross-link entries from `.agents/docs/decisions/` and `.agents/docs/troubleshooting/`.

## Wiki Entry Format

Each entry is a markdown file with YAML frontmatter:

```markdown
---
id: auth-strategy
title: Authentication Strategy
tags: [auth, security]
source: session                   # session | manual | external
source_sessions: [t-20260401-...] # populated for session-driven entries
url:                              # populated for external entries
last_updated: 2026-04-15
code_refs:
  - src/auth/AuthService.ts
  - src/middleware/auth.ts
---

[Entry body — declarative, descriptive, grounded in code]
```

The `id` field provides stable identifiers for reconciliation and linting. The `code_refs` field scopes semantic linting.

## Workflow Changes

### Full cycle (session-driven)

```
design notes → plan → implementation → task-closeout → learning-distill → wiki update + skills/playbooks update → lint
```

### Direct write (ad hoc)

```
user/agent provides fact, decision, or URL → wiki-update skill → wiki entry written
```

### Drift repair (lint-triggered)

```
lint detects drift → small: fix inline | significant: emit wiki plan → reconciliation agent executes → wiki/skills updated → lint passes
```

## Skill Specifications

### `wiki-update` (new)

**Purpose:** Direct wiki write without a session bundle.

**Inputs:**
- A fact, decision, observation, or external URL
- Optional: target section (`decisions/`, `systems/`, `concepts/`)
- Optional: `code_refs` to associate

**Behavior:**
1. If URL provided, fetch and summarize relevant content
2. Classify into the appropriate wiki section
3. Check `wiki/index.md` for an existing entry with matching topic
4. If exists: update entry, preserve `id`, update `last_updated`
5. If new: create entry with generated `id`, set `source: manual` or `source: external`
6. Update `wiki/index.md`
7. Append to `docs/log.md`

### `task-closeout` additions

Add `wiki_candidates` to `learning-candidate.md`:

```markdown
## Wiki candidates

<!-- Declarative knowledge observed during this task.
     Describe the system, a decision, or a concept.
     Do not include procedural steps (those go in skill/playbook candidates). -->

- [topic]: [observation]
```

### `learning-distill` additions

**Classification step:** Descriptive candidates → wiki; prescriptive → skills/playbooks.

**Wiki write step:**
- Match candidate to existing wiki entry by topic or `id`
- If match: update entry body, add session to `source_sessions`, update `last_updated`
- If no match: create new entry, classify into `decisions/`, `systems/`, or `concepts/`
- Update `wiki/index.md`

**Multi-session reconciliation mode:**
- Accepts multiple session bundle paths
- Surfaces conflicting wiki candidates across sessions
- Merges non-conflicting updates
- Flags conflicts with context for human or agent review
- Updates wiki and skills/playbooks from reconciled output

**Linking guidance:**
- Wiki entries may reference playbooks: `See [playbook-name] for steps.`
- Playbooks may reference wiki entries: `See [wiki-entry] for context.`
- Linter checks for broken cross-references

### `docs-lint` additions

**Semantic lint pass:**
For each wiki entry with `code_refs`:
1. Verify each referenced file exists in the codebase
2. Optionally verify referenced symbols if tooling supports it
3. Classify drift:
   - **Cosmetic** (renamed file, moved path): fix inline, note in log
   - **Factual/reference** (interface changed): fix inline with note
   - **Structural/conceptual** (pattern deprecated, decision superseded): emit wiki plan

**Wiki plan format:**

```markdown
---
type: wiki-plan
trigger: lint
severity: structural
created: 2026-04-15
entries_affected:
  - auth-strategy
---

## Context
[What the linter detected]

## Research needed
[What the reconciliation agent should investigate]

## Entries to update
[Specific wiki entries, skills, or playbooks]
```

Wiki plans skip implementation and re-enter the cycle at the distill step.