## Purpose

Makes `~/.agents/skills` (universal, Codex default) the one canonical store for every skill an agent installs, with the current self-reported agent as the second target. `npx` is required; the only documented override is an explicit user request for another agent at install time.

## ADDED Requirements

### Requirement: Canonical user store is ~/.agents/skills (universal + self-reported agent)
Every skill installed by an agent SHALL be installed to the user-scoped universal store `~/.agents/skills` plus the current self-reported agent's host skill directory (e.g. Codex so both `~/.agents/skills/<name>` and `~/.codex/skills/<name>` are written), via `npx skills add -g -a <self-reported> <source>`. This default applies to the AKSK kit (`Hypercubed/Agent-Knowledge-Starter-Kit`) and to the `langchain-ai/openwiki` lifecycle skill (`--full-depth` when that source is used). Extra agents SHALL be installed only if the user explicitly asked for them at install time (`-a <other>` or `--all`); the agent self-report is the second target, not an override, and spoofing it is the agent's own failure. If the calling agent does not support universal, it SHALL prompt the user before writing to any other location.

#### Scenario: AKSK default via agent
- **WHEN** a user asks the current agent (e.g. Codex) to install the kit
- **THEN** the agent runs `npx skills add -g -a <self-reported> Hypercubed/Agent-Knowledge-Starter-Kit` and the skills appear under `~/.agents/skills/<name>` plus the host dir

#### Scenario: AKSK default via human then bootstrap
- **WHEN** a human runs `npx skills add -g Hypercubed/Agent-Knowledge-Starter-Kit` from any repo and then asks the current agent to bootstrap
- **THEN** the bootstrap sees the skills already in `~/.agents/skills` and does not re-install them

#### Scenario: User asked for extra agent at install time
- **WHEN** the user explicitly asked for `-a <other>` or `--all` at the `npx` call
- **THEN** the skills also appear under that other agent's skill dir in addition to the universal + self-reported pair

### Requirement: npx skills is required, clone fallback removed
`npx` SHALL be treated as required. The documentation SHALL NOT present a `git clone --depth 1 && cp -r .agents/skills` fallback lane. When `npx` is unavailable the bootstrap SHALL report it as a prerequisite (INSTRUCT lane prints `npm i -g` / `npx` required) and not silently fall back to a copy.

#### Scenario: npx unavailable
- **WHEN** the bootstrap runs where `npx` is not available
- **THEN** it reports the missing prerequisite and exits clean without a clone-and-copy fallback

### Requirement: Default is universal plus current, with user-choice override at install time
The default at install time SHALL be `universal` plus the current self-reported agent. An extra agent or wide spread (`--all`) SHALL occur only if the user explicitly asked for it when invoking the install. The choice is recorded only at install time; no persistent consent artifact is required.

#### Scenario: No extra asked
- **WHEN** the user ran the default without `-a <other>` or `--all`
- **THEN** only the universal store and the self-reported host receive the skills

#### Scenario: Extra asked
- **WHEN** the user added `-a <other>` or `--all`
- **THEN** that other host also receives the skills


### Requirement: Skill installs SHALL use versions from the install version list
Version pins for skill-installable packages SHALL be read from the install version list (`references/versions.json` via `versionsFromPackageJson()`), not hard-coded or fetched as `latest`. The bootstrap SHALL use the caret range from that file (e.g. `^1.11.0`) when invoking `npx skills add -g -a <self-reported> <source>` for the kit and for `langchain-ai/openwiki` (where applicable), falling back to `@latest` only if the entry is unpinned.

#### Scenario: Pinned version present
- **WHEN** `references/versions.json` contains a caret for the source
- **THEN** the skill install is invoked at that pinned range rather than `latest`

#### Scenario: Unpinned version
- **WHEN** the version list omits the entry
- **THEN** the install falls back to `@latest`

### Requirement: Verification treats user store as canonical
Verification (including `verify-install`) SHALL treat `~/.agents/skills/<name>/SKILL.md` as the canonical assertion for the default lane, plus the self-reported host's directory. Repo-local `./.agents/skills` is treated as an override, not the default.

#### Scenario: verify-install default lane
- **WHEN** `verify-install` runs its fresh or scoping scenarios
- **THEN** the `~/.agents/skills/aksk-bootstrap/SKILL.md` (and peers) exists and the self-reported host's mirror exists; repo-local `./.agents/skills` is not asserted unless the scenario explicitly tests an override
