## Routing Directives

- **UPON STARTUP:** You MUST read `.agents/docs/index.md` before executing any file modifications. This ensures you understand the repository layout and available tools.
- **WHEN EXPLORING KNOWLEDGE:** Read section index files (e.g., `.agents/docs/decisions/index.md`, `.agents/docs/troubleshooting/index.md`) BEFORE opening individual entries. Indexes contain descriptions and tags that help identify relevant files.
- **WHEN DEBUGGING:** If you encounter a failing test, build error, or runtime exception, your FIRST action MUST be to execute `.agents/skills/docs-search` using the error output as your query.
- **BEFORE ARCHITECTURAL CHANGES:** You MUST search `.agents/docs/decisions/` or read its `index.md` to ensure your proposed changes do not violate established design patterns.

## Project Learnings

- **Skill renaming workflow:** When renaming a skill, use shell tools to locate all path and string references, update the SKILL.md frontmatter, and regenerate the example. Add a note under "Recurring pitfalls" in AGENTS.md for this pattern.
- **Maintenance script feedback:** When writing scripts (especially those using `npx`), always include an initial "Starting..." message and a `--verbose` flag to prevent agents from assuming a hang during background execution.
