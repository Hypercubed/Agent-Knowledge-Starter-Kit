# Antigravity Integration Guide

Antigravity operates with its own built-in systems for artifacts and context, but integrates cleanly with the Agent Knowledge Starter Kit. Antigravity handles high-context iterative reasoning and creates localized memory, while the starter kit acts as the canonical, shared repository memory.

- **Antigravity** is a powerful agentic AI coding assistant that maintains Persistent Context via locally stored Knowledge Items (KIs) and workspace logs. It actively uses Planning Mode to create artifacts (like Implementation Plans and Walkthroughs) within its own agent-private `<appDataDir>`.
- **This kit** is a **repo-scoped knowledge layer** under `.agents/`: durable guidance, docs, playbooks, skills, and gitignored session bundles for distillation.

This guide was verified against Antigravity's current behavior using the standard Antigravity tool interface.

## 1. Prerequisites

You should have:
- A repository populated with the kit layout under `.agents/` (typically by copying `scaffold/` from the starter kit).
- Access to the Antigravity agent CLI or tool interface.

## 2. Discovery mechanism

### What Antigravity discovers natively

| Mechanism | Where it lives | Role |
| --- | --- | --- |
| Knowledge Items (KIs) | Agent-private `<appDataDir>\knowledge` | Curated, distilled localized knowledge. Looked up dynamically before research. |
| Conversation Logs | Agent-private `<appDataDir>\brain\<conversation-id>` | Local memory of raw logs and artifacts generated during the current/recent tasks. |
| Tool system | Natively injected | Allows Antigravity to read files, grep search, execute bash commands, and manipulate file content. |

### Antigravity Knowledge Items (KIs) vs kit `.agents/docs/`

Antigravity maintains KIs as part of its **Persistent Context**. These files are:
- **Agent-private & Local**: Typically stored locally and persisting across multiple sessions on that machine for the user.
- **Dynamic**: Natively searched and summarized at the beginning of interactions based on the repository state.

The kit's `.agents/` folder is:
- **Repo-shared & Committed**: Used by *any* agent or team member on any machine.
- **Version-controlled**: Trackable via `git diff`.

**Integration pattern:** Treat the kit's `.agents/` folder as the true repo-shared knowledge. Antigravity can dynamically pull context, but you must still persist durable knowledge using the kit's systems so *other tools* can read it.

### Antigravity Artifacts vs kit `.agents/sessions/`

When Antigravity enters Planning Mode, it creates markdown files (Implementation Plans, Tasks, Walkthroughs) natively tracking its work. However, it stores these in its own `<appDataDir>`, **not** the repo. 
To follow the kit's philosophy, you must instruct Antigravity to deliberately copy/export its closeout summaries to `.agents/sessions/<id>/` when the work is done.

## 3. Setup steps

### Recommended pattern: Thin wiring, explicit exporting

1. Install the kit by copying or merging `scaffold/` into the target repo's `.agents/` directory.
2. Setup a root `AGENTS.md` to point generic agents to `.agents/AGENTS.md`. Antigravity does not strictly require this, as you can directly prompt it or let it discover it, but keeping it helps interoperability.
3. Treat Antigravity's KIs as a fast, local cache. If knowledge must be shared with teammates, run a distillation pass that explicitly writes to `.agents/docs/` or `.agents/AGENTS.md`.

## 4. Workflow

Suggested flow for Antigravity in a kit-enabled repo:

1. **Initial Task Setup:** The USER assigns Antigravity a task. Antigravity natively loads its KIs and begins.
2. **Implementation:** Antigravity operates natively, creating its own `implementation_plan.md` and `walkthrough.md` in its local AppData folder.
3. **Closing out:** At task completion, the USER explicitly instructs Antigravity: "Run the task-closeout skill" or "Copy your final Walkthrough to `.agents/sessions/<conversation-slug>/`".
4. **Distillation:** With the artifact now inside the repo's `.agents/sessions/` directory, the team can invoke a `learning-distill` pass to promote stable lessons into `.agents/docs/`.
5. **Commit:** The human developer uses `git diff` to review documentation changes and commits the durable insights. KIs within Antigravity's memory remain as its own powerful context layer.

## 5. Two-tool example: Antigravity + Cursor

**Scenario:** A developer uses Antigravity for heavy, continuous iterative reasoning (e.g. bootstrapping a complex refactor over 20 steps), and uses the Cursor IDE for lightweight, day-to-day code editing.

- **Antigravity** executes the complex task, utilizing its Native Planning artifacts locally.
- At the end of the session, the user asks: "Write the session closeout to `.agents/sessions/antigravity-refactor/`."
- The user (or Antigravity) runs `learning-distill` to update the canonical `.agents/AGENTS.md` with new architectural lessons learned during the refactor.
- **Cursor** is naturally pointed (via its `.cursor/rules` or `AGENTS.md`) at `.agents/AGENTS.md`. It automatically benefits from the updated knowledge on the very next codebase edit, without needing access to Antigravity's context database.

## 6. Troubleshooting

### Other tools aren't seeing what Antigravity learned

#### Symptom
Antigravity thoroughly researched and optimized a pattern, but Cursor or Codex keeps breaking it.

#### Likely causes
Antigravity either saved the context inside its private Knowledge Items (KIs) or kept its artifacts in `<appDataDir>\brain\`. Neither is visible to a CI agent or a teammate's IDE. 

#### Fix
Prompt Antigravity to write the finalized documentation or conventions into `.agents/docs/` or `.agents/AGENTS.md`. The `.agents/` tree is the shared communication boundary for all tools. 

## 7. References

- [`README.md`](../../README.md) — kit overview and root vs `.agents/AGENTS.md` split
- [`INSTALL.md`](../../INSTALL.md) — adopting `scaffold/` into `.agents/`
- [`cursor.md`](./cursor.md) — how to map rules to `.agents/` content without duplication
- [`.agents/plans/add-integrations.md`](../../.agents/plans/add-integrations.md) — integration doc conventions
