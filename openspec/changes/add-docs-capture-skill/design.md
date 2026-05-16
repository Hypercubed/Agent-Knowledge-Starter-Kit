## Context

The kit currently relies on a strict two-step pipeline (`task-closeout` then `learning-distill`) to abstract complex session history into durable documentation (`.agents/docs/`). However, maintainers often know exactly what they want to document in real-time, making the session abstraction loop excessive for explicit human prompts like "Capture this rule into decisions."

To support immediate, low-friction knowledge capture, we need a formalized `docs-capture` skill. This will enable agents to write directly into the domain folders while automatically executing required maintenance scripts (like `generate-durable-indexes.py`) to keep the repo state clean without losing index parity.

## Goals / Non-Goals

**Goals:**
- Provide a clear, callable skill that agents can recognize for direct documentation tasks.
- Abstract the file layout logic so agents automatically route updates to `decisions/`, `troubleshooting/`, etc., appropriately.
- Ensure the docs compiler scripts run post-write to maintain the automated indexes.
- Make the skill easily portable across different repos using the `.agents` structure.

**Non-Goals:**
- Replacing the existing `task-closeout` and `distill` flow—that remains necessary for abstracting deep codebase lessons.
- Auto-extracting knowledge without explicit prompts.

## Decisions

**Decision 1: The Skill Name and Concept**
- Name: `docs-capture` (fits uniformly with `docs-search`, `docs-compile`, `docs-lint`).
- Location: `.agents/skills/docs-capture/`.

**Decision 2: Tooling Workflow**
- The skill instructions (`SKILL.md`) will define a procedure:
  1. Parse the user's explicit documentation directive.
  2. Determine the correct location (`.agents/docs/decisions/`, `.agents/docs/troubleshooting/`, etc.).
  3. Write the markdown file with frontmatter outlining the standard context (author, date, tags).
  4. Automatically execute `.agents/skills/docs-compile/scripts/generate-durable-indexes.py` to index the new file.
  5. Sync updates to `example/` if present via the example sync script.

**Decision 3: Agent Capability**
- This doesn't involve any daemon or background hook; it's activated simply by the agent matching the semantic intent of "Capture this into docs" to the `docs-capture` skill instruction set.

## Risks / Trade-offs

- **Risk:** Agents might overuse `docs-capture` when `task-closeout` is more appropriate.
  - **Mitigation:** The `docs-capture` `SKILL.md` will explicitly define its boundary: "Only use this when the user gives an explicit, known rule. If abstracting from a complex bug hunt organically, use `task-closeout` instead."
- **Trade-off:** Having two entry points to documentation might confuse new kit adopters.
  - **Mitigation:** We will update `MAINTENANCE.md` and `AGENTS.md` (or the kit root `README.md`) to clarify the distinction between "Direct Writing" vs "Distilled Sessions".
