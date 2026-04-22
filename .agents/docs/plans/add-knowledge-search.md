# Plan: Add Knowledge Search Skill

**Status:** planned **Goal:** Add a `knowledge-search` skill to prevent context bloat and explicitly train agents on how to dynamically locate and read relevant docs rather than loading the entire knowledge layer into context. **Date:** 2026-04-12 **Priority:** Medium **Blocked by:** none **Scope estimate:** Small (1 skill creation, minor doc updates)

---

## Overview

Currently, the primary entry point is `.agents/AGENTS.md` and `.agents/docs/index.md`. On large, long-lived projects, the number of files in `.agents/docs/` and `.agents/playbooks/` will grow significantly. Less sophisticated or overly eager agents might try to load *all* documentation into their context window at session start to find answers, leading to massive token costs and context degradation.

Introducing a `knowledge-search` skill formally codifies the behavior of **searching before reading**. It will instruct agents to use their native file-search tools (like grep, ripgrep, or similar tool APIs) against `.agents/` targeting specific keywords before attempting to `read_file` or load entire directories.

## Guide structure for the skill

The skill should be structured similarly to `task-closeout` and `learning-distill`.

1. **Goal**: Locate relevant repo knowledge without loading unnecessary context.
2. **Inputs**: A query string or keyword.
3. **Procedure**:
   - Do NOT attempt to read every file in `.agents/docs/`.
   - Use a filesystem search tool (like grep) to search for the query text across `.agents/docs/` and `.agents/playbooks/`.
   - Read `.agents/docs/index.md` as a fallback to locate structural categories.
   - Once a relevant file is identified from the search hit, read *only* that specific file.
4. **Constraints**: Never run a `cat` or `read` blindly on the entire `.agents/` directory.

## Tasks

### 1. Create the `knowledge-search` skill

- Draft the skill as portable kit content: add `knowledge-search/SKILL.md` under the published skills surface (today: ship via the same mechanism as other kit skills — the plugin’s skill set and the generated `example/.agents/skills/` tree from `generate-example`).
- Ensure maintainer `.agents/skills/knowledge-search/SKILL.md` exists when the skill is ready so this repo dogfoods it like the other maintenance skills.
- Add an example or helper script if necessary (though text instructions are usually enough for agentic models).

### 2. Update architectural docs

- Detail this skill in `docs/architecture.md` and list it among the core tools (`task-closeout`, `knowledge-lint`, `learning-distill`).
- Update `example/.agents/AGENTS.md` (and any skill bootstrap `AGENTS.md` fragments) to include a line like: *“If you cannot find the answer immediately, use the `knowledge-search` skill before guessing or asking the user.”*

### 3. Verification pass

- Run a dummy task on a repository with a bloated `.agents/` folder using an agent like Antigravity, OpenClaw, or Claude Code.
- Ask a highly specific question ("How do we handle the database migration lock?").
- Verify that the agent successfully discovers and uses `knowledge-search` rather than indiscriminately mapping the whole directory structure.

## Definition of Done

- `example/.agents/skills/knowledge-search/SKILL.md` exists after `generate-example` (or equivalent published kit path), and the source-of-truth skill lives with other kit skills for packaging.
- The root `README.md` and `docs/architecture.md` list `knowledge-search` as a standard kit skill.
- The interaction pattern relies purely on standard agent utilities (grep/read) and does not require third-party vector databases.
