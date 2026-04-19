# Plan: Wiki Expansion for Agent-Knowledge-Starter-Kit

**Version:** 1.0  
**Status:** Draft  
**Scope:** Extend the starter kit to include a codebase-grounded wiki as a first-class knowledge store, alongside (not derived from) skills and playbooks.

---

## Background

The current kit maintains knowledge in:
- `.agents/AGENTS.md` — high-signal agent instructions
- `.agents/docs/repo-decisions.md` — architectural rationale
- `.agents/docs/troubleshooting.md` — failure patterns
- `.agents/playbooks/` — procedural multi-step workflows
- `.agents/docs/index.md` and `log.md` — catalog and audit trail

This plan adds a **wiki** as a declarative, codebase-grounded knowledge layer. The wiki is not the source of truth for skills/playbooks — both are maintained from session data, referenced from each other, but not derived from each other. The wiki captures the *what and why*; skills/playbooks capture the *how*.

---

## Design Decisions

### Wiki vs. skills/playbooks

| | Wiki | Skills / Playbooks |
|---|---|---|
| Type | Declarative | Procedural |
| Purpose | Describe what the system is and why | Describe how to do something |
| Consumer | Humans and agents seeking understanding | Agents executing steps |
| Source | Session data + direct writes | Session data |
| Grounded in | Codebase (via `code_refs`) | Workflows and patterns |

Both are updated during distillation from the same session data. Neither derives from the other. Cross-references are links, not derivations.

### Two update paths

1. **Session-driven** — distillation extracts wiki candidates from session bundles after task closeout
2. **Direct write** — user or agent provides a fact, decision, or external reference; `wiki-update` skill writes the entry without a session bundle

### Linter as maintenance loop

The linter detects drift between wiki entries and actual code:
- **Small drift** → fix inline
- **Significant drift** → emit a wiki plan

A wiki plan re-enters the cycle at the distill step, not the implementation step.

---

## New Directory Structure

```
.agents/
  wiki/
    index.md              ← entry registry and table of contents
    decisions/            ← architectural decisions (absorbs repo-decisions.md over time)
    systems/              ← how subsystems work, grounded in code
    concepts/             ← domain concepts, patterns, terminology
```

`repo-decisions.md` and `troubleshooting.md` are not removed. They migrate into the wiki gradually, or are linked from it. The wiki is additive, not a replacement.

---

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

The `id` field is the stable identifier for reconciliation and linting. The `code_refs` field scopes semantic linting.

---

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

---

## Files to Create or Modify

### New files

| File | Purpose |
|---|---|
| `.agents/wiki/index.md` | Wiki entry registry and table of contents |
| `.agents/wiki/decisions/` | Architectural decisions subdirectory |
| `.agents/wiki/systems/` | Systems knowledge subdirectory |
| `.agents/wiki/concepts/` | Concepts and patterns subdirectory |
| `.agents/skills/wiki-update/SKILL.md` | Direct write skill — accepts fact, decision, or external URL; writes wiki entry without session bundle |

### Modified files

| File | Changes |
|---|---|
| `.agents/skills/task-closeout/SKILL.md` | Add `wiki_candidates` field to session bundle. Separate from skill/playbook candidates. Captures declarative notes, decisions, system observations. |
| `.agents/skills/learning-distill/SKILL.md` | Add wiki as distillation target. Add classification logic: descriptive → wiki, prescriptive → skills/playbooks. Add multi-session reconciliation mode. Add linking guidance between wiki and skills/playbooks. |
| `.agents/skills/knowledge-lint/SKILL.md` | Add semantic lint pass: verify `code_refs` against codebase. Small drift → fix inline. Significant drift → emit wiki plan. |
| `.agents/docs/architecture.md` | Update lifecycle diagram to include wiki. Update distillation rules. Document wiki plan as a plan type. |
| `.agents/docs/index.md` | Register wiki in knowledge asset catalog. |
| `.agents/agents/learning-agent.md` | Add reconciliation agent role. Document multi-session reconciliation invocation. |

---

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

---

### `task-closeout` additions

Add `wiki_candidates` to `learning-candidate.md`:

```markdown
## Wiki candidates

<!-- Declarative knowledge observed during this task.
     Describe the system, a decision, or a concept.
     Do not include procedural steps (those go in skill/playbook candidates). -->

- [topic]: [observation]
```

---

### `learning-distill` additions

**Classification step** (after reading session bundle):

For each candidate in `learning-candidate.md`:
- Descriptive (what the system does, why a decision was made, how something works) → wiki
- Prescriptive (how to do X, steps to follow, agent instructions) → skills/playbooks or AGENTS.md

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

---

### `knowledge-lint` additions

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

Wiki plans skip implementation — they re-enter the cycle at the distill step.

---

## Phasing

**Phase 1 — Wiki foundation**
- Create `wiki/` directory structure and `wiki/index.md`
- Define entry format with frontmatter schema
- Update `task-closeout` to capture `wiki_candidates`
- Update `learning-distill` to write wiki entries (single-session)
- Update `docs/index.md` and `architecture.md`

**Phase 2 — Lint integration**
- Update `knowledge-lint` with semantic lint pass
- Add wiki plan emission
- Update `agents/learning-agent.md` with wiki plan handling

**Phase 3 — Direct write and reconciliation**
- Create `wiki-update` skill
- Add multi-session reconciliation mode to `learning-distill`
- Update `architecture.md` with full lifecycle including direct write path

---

## Open Questions

1. Should wiki plans live in `.agents/plans/` (a new directory) or alongside session bundles in `.agents/sessions/`? Plans feel more durable than sessions but less permanent than `docs/`.
2. Should `repo-decisions.md` and `troubleshooting.md` be formally deprecated in favor of wiki entries, or kept as summaries that link into the wiki?
3. What is the right conflict resolution policy for multi-session reconciliation — last-write-wins, flag for review, or something else?