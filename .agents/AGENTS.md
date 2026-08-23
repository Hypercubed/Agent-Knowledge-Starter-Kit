## Routing Directives

- **UPON STARTUP:** You MUST read `openwiki/index.md` and `.agents/AGENTS.md` before executing any file modifications. This ensures you understand the repository layout and available tools.
- **WHEN EXPLORING KNOWLEDGE:** Start from `openwiki/index.md` and the directory indexes under `openwiki/decisions/` and `openwiki/troubleshooting/`. Indexes contain descriptions and tags that help identify relevant files.
- **WHEN DEBUGGING:** If you encounter a failing test, build error, or runtime exception, your FIRST action MUST be to search durable knowledge for it: `grep -ri "<error or symptom>" openwiki/ .agents/` before debugging blind.
- **BEFORE ARCHITECTURAL CHANGES:** You MUST search `openwiki/decisions/` for recorded decisions to ensure your proposed changes do not violate established design patterns.

## Project Learnings

- **Skill renaming workflow:** When renaming a skill, use shell tools to locate all path and string references, update the SKILL.md frontmatter, and regenerate the example. Add a note under "Recurring pitfalls" in AGENTS.md for this pattern.
- **Maintenance script feedback:** When writing scripts (especially those using `npx`), always include an initial "Starting..." message and a `--verbose` flag to prevent agents from assuming a hang during background execution.
