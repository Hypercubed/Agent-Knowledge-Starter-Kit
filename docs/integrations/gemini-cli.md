# Gemini CLI Integration Guide

Gemini CLI is an interactive, agentic command-line interface designed for collaborative software engineering. It uses a **Research -> Strategy -> Execution** lifecycle and employs specialized sub-agents and skills to manage complex tasks.

- **Gemini CLI** uses `GEMINI.md` for foundational mandates, `.gemini/` for project configuration, and has a native `save_memory` system for persistent facts.
- **This kit** provides the **repo-scoped knowledge layer** under `.agents/`: durable guidance, docs, playbooks, skills, and session bundles for distillation.

This guide was verified against Gemini CLI behavior in this repository on April 12, 2026.

## 1. Prerequisites

- Repository with the kit layout under `.agents/` — typically by copying `scaffold/` from this starter kit.
- Gemini CLI installed and on your PATH.
- Permission to add/modify `GEMINI.md` at the project root.

## 2. Discovery mechanism

### What Gemini CLI discovers natively

| Mechanism | Where it lives | Role |
| --- | --- | --- |
| `GEMINI.md` | Project root | Foundational mandates; takes absolute precedence over general defaults. |
| `.gemini/` | Project root | Configuration and project-specific internal state. |
| `save_memory(scope="project")` | `~/.gemini/memory/` (user-local) | Persistent facts about the project, private to the user. |
| `activate_skill` | Built-in / Custom | Dynamic loading of specialized agent capabilities. |
| Sub-agents | Built-in | Delegation to experts like `codebase_investigator` or `generalist`. |
### Root `GEMINI.md` vs `.agents/AGENTS.md` (The Routing Pattern)

Gemini CLI treats `GEMINI.md` as its primary source of mandates. To maintain a single source of truth, follow the **Routing Pattern**:

- **Root `GEMINI.md`**: A "thin" bootstrap file that routes Gemini CLI to the `.agents/` directory.
- **`.agents/AGENTS.md`**: The authoritative, portable instructions file for the repository.

This pattern ensures that all agents (Gemini CLI, Cursor, Claude Code) follow the same durable repo guidance without duplicating prose in tool-specific config files.

### Project Memory vs Kit Durable Docs
...
## 6. Troubleshooting & Gotchas

### Tool Ignore Patterns in `sessions/`
Since `.agents/sessions/` is typically gitignored to keep bundles local, Gemini CLI's `read_file` tool may refuse to read them if configured to respect `.gitignore`.
- **Symptoms**: `read_file` returns an error for files under `.agents/sessions/`.
- **Workaround**: Use `run_shell_command` with `cat` or `ls` to interact with session bundles, or provide an explicit override if the tool allows it.

### Mandate Precedence
If Gemini CLI ignores `.agents/` playbooks, ensure the mandate in `GEMINI.md` uses strong language (e.g., "You MUST read and follow...") as Gemini CLI treats `GEMINI.md` as an absolute mandate that overrides its default system prompt.

## 7. Verification Statement

Gemini CLI's `save_memory` is **private to the user** and not version-controlled.

- **Durable Repo Knowledge**: Must live in `.agents/docs/` or `.agents/AGENTS.md`.
- **Private Setup/Notes**: Use `save_memory(scope="project")` for local environment quirks or personal reminders that shouldn't be committed.

## 3. Setup steps

### Recommended pattern: thin `GEMINI.md`, fat `.agents/` tree

1. Install the kit by copying `scaffold/` to `.agents/`.
2. Create or update `GEMINI.md` at the project root with the following content:

```markdown
# GEMINI.md

Foundational mandates for this repository:

- **Source of Truth**: All durable repository knowledge and agent guidance live in the `.agents/` directory.
- **Durable Guidance**: Read and follow `.agents/AGENTS.md` at the start of every session.
- **Task Boundaries**: Use the `task-closeout` skill (located at `.agents/skills/task-closeout/SKILL.md`) when completing, blocking, or abandoning a task.
- **Session Bundles**: Store session evidence in `.agents/sessions/`. Do not commit these files unless explicitly asked.
- **Knowledge Base**: Consult `.agents/docs/index.md` for architectural decisions, troubleshooting, and playbooks.
```

3. **Register Kit Skills**: Since Gemini CLI uses `activate_skill` for named skills, you should instruct it to treat the files under `.agents/skills/` as available resources.

## 4. Workflow: Research, Strategy, Execution

Gemini CLI's native lifecycle maps cleanly to the kit's distillation process:

1. **Research**: Use `codebase_investigator` and read `.agents/docs/` to understand the project.
2. **Strategy**: Formulate a plan that respects the playbooks in `.agents/playbooks/`.
3. **Execution**:
   - **Plan/Act/Validate**: Follow the kit's standards for surgical changes and testing.
   - **Closeout**: Run `activate_skill(name="task-closeout")` (if the skill is registered/aliased) or explicitly follow `.agents/skills/task-closeout/SKILL.md` to bundle the session.
4. **Distillation**: Periodically run the `learning-distill` skill to promote session findings to durable docs.

## 5. Concrete Two-Tool Workflow: Gemini CLI + Cursor

Gemini CLI and Cursor can share the same `.agents/` knowledge layer for a powerful hybrid workflow:

- **Gemini CLI (Terminal)**: Use for high-volume research, batch refactoring, and structured task closeout. It manages the lifecycle and ensures session bundles are created.
- **Cursor (IDE)**: Use for tactical code editing, UI work, and real-time completions. Cursor rules (`.cursor/rules/`) point to the same `.agents/AGENTS.md` file, ensuring consistent guidance.

**Scenario:**
1. Use Gemini CLI to research a complex bug using `codebase_investigator`.
2. Move to Cursor to implement the fix with AI-assisted editing, following the instructions shared in `.agents/AGENTS.md`.
3. Return to Gemini CLI to run the `task-closeout` skill, bundling the research and implementation details for later distillation.

## 6. Verification Statement

This guide was written and verified by Gemini CLI while operating within this repository on April 12, 2026. The integration pattern (thin `GEMINI.md` pointing to `.agents/`) was confirmed to effectively route the agent to the kit's knowledge layer.
