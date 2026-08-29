## MODIFIED Requirements

### Requirement: Global tool installation lane
The bootstrap flow SHALL install `@fission-ai/openspec@latest` and `openwiki@latest` in user scope (per-user global via `npm i -g`, not repo-local `npx` or repo-local `node_modules`) once per user (Node >=22 for openwiki), and SHALL skip installation for any tool already present at a compatible version.

#### Scenario: First global install
- **WHEN** neither tool is globally installed
- **THEN** bootstrap runs the global npm install for both tools exactly once

#### Scenario: Tools already installed
- **WHEN** both tools are already globally installed
- **THEN** bootstrap performs no global installation and reports the detected versions

### Requirement: Per-repo bootstrapping on demand
For a target repository, the bootstrap flow SHALL run `openspec init` when `openspec/` is missing, scaffold a minimal `.agents/` tree from kit templates when `.agents/` is missing or incomplete, attach the AKSK curation contract to `openwiki/INSTRUCTIONS.md` using the append-only merge semantics defined in `adopt-openspec-openwiki`, and merge a thin routing block into the root `AGENTS.md` without disturbing other content in that file, including any existing OpenWiki-managed block. Before scaffolding, the bootstrap SHALL ensure required skills are present in the canonical user store `~/.agents/skills` plus the self-reported host's directory (`npx skills add -g -a <self-reported> <source>` for the kit and for `langchain-ai/openwiki` when that lifecycle skill is needed; see `canonical-user-skills-scope`), installing them via `npx` if missing; `npx` SHALL be treated as required and no `git clone` fallback SHALL be presented. For openwiki the skill is also made available via the host's integrations registry (`openwiki integrations install <self-reported>` when that host is supported, otherwise the `npx` path) and the MCP is installed via `openwiki mcp --host <self-reported>` or the generic `npx add-mcp` chooser as a backup when the host lacks explicit `openwiki` support.

#### Scenario: Bare repository
- **WHEN** the target repo has none of `openspec/`, `.agents/`, or `openwiki/`
- **THEN** bootstrap creates all three: initialized OpenSpec structure, scaffolded minimal `.agents/` tree, and `openwiki/INSTRUCTIONS.md` with the AKSK curation contract attached

#### Scenario: Bare repository via agent-assisted lane
- **WHEN** an agent runs `node .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs [repo-root]` in a repo with none of `openspec/`, `.agents/`, or `openwiki/`
- **THEN** the same three artifacts are created via the agent-driven EXECUTE lane (or INSTRUCT printed commands when sandboxed)

#### Scenario: Bare repository via npx skills fallback
- **WHEN** a human runs `npx skills add -g -a <self-reported>` and then each skill's initialization
- **THEN** the same `.agents/` scaffold and routing/contract attachments are produced via the copied `scripts/*.mjs` without a separate `example/` path

#### Scenario: Existing AGENTS.md with OpenWiki block
- **WHEN** the root `AGENTS.md` already contains an OpenWiki-managed block
- **THEN** bootstrap merges its routing block alongside the existing block and leaves the managed block intact

#### Scenario: Repo already bootstrapped
- **WHEN** bootstrap re-runs against a fully bootstrapped repo
- **THEN** it detects prior completion, changes nothing, and exits successfully reporting idempotent completion
