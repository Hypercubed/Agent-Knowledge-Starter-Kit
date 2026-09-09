# canonical-user-skills-scope Specification — Delta

## MODIFIED Requirements

### Requirement: Canonical user store is ~/.agents/skills (universal + self-reported agent)

The system MUST treat `~/.agents/skills` (universal, Codex default) plus the current self-reported host's skill directory (e.g., `~/.config/opencode/skills` or `~/.claude/skills` when detected) as the single canonical store for every skill an agent installs, **including `openspec-*` skills installed globally via `npx skills add -g -a <agent>` by the `aksk-bootstrap` global lane**. `npx` is required; the only documented override is an explicit user request for another agent at install time or `--local-skills` for repo-local installation.

#### Scenario: Universal + host mirror holds kit and OpenSpec skills

- **WHEN** bootstrap has completed globally
- **THEN** `~/.agents/skills/` contains both kit skills (`aksk-*`, `task-closeout`, etc.) and `openspec-*` skills, mirrored to the self-reported host directory, and all are resolved from the canonical store

#### Scenario: Local override

- **WHEN** user requests a specific agent or `--local-skills`
- **THEN** the install targets that agent's directory or the repo-local `.agents/skills/` respectively, rather than the universal store

#### Scenario: AKSK default via agent
- **WHEN** a user asks the current agent (e.g. Codex) to install the kit
- **THEN** the agent runs `npx skills add -g -a <self-reported> Hypercubed/Agent-Knowledge-Starter-Kit` and the skills appear under `~/.agents/skills/<name>` plus the host dir

#### Scenario: AKSK default via human then bootstrap
- **WHEN** a human runs `npx skills add -g Hypercubed/Agent-Knowledge-Starter-Kit` from any repo and then asks the current agent to bootstrap
- **THEN** the bootstrap sees the skills already in `~/.agents/skills` and does not re-install them

#### Scenario: User asked for extra agent at install time
- **WHEN** the user explicitly asked for `-a <other>` or `--all` at the `npx` call
- **THEN** the skills also appear under that other agent's skill dir in addition to the universal + self-reported pair
