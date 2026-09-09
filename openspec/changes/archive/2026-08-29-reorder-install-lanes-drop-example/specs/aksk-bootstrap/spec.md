## MODIFIED Requirements

### Requirement: Per-repo bootstrapping on demand
For a target repository, the bootstrap flow SHALL run `openspec init` when `openspec/` is missing, scaffold a minimal `.agents/` tree from kit templates when `.agents/` is missing or incomplete, attach the AKSK curation contract to `openwiki/INSTRUCTIONS.md` using the append-only merge semantics defined in `adopt-openspec-openwiki`, and merge a thin routing block into the root `AGENTS.md` without disturbing other content in that file, including any existing OpenWiki-managed block. Both the agent-assisted lane (preferred) and the `npx skills add --full-depth` lane SHALL delegate peer-tool checks and wiki/routing attachment to this orchestrator's `scripts/check_peer_tools.mjs`, `attach_wiki_contract.mjs`, and `attach_section.mjs` (and `init_agents_md.mjs`), and `npx skills add --full-depth` SHALL copy those `scripts/*.mjs` and `references/` for each discovered skill.

#### Scenario: Bare repository
- **WHEN** the target repo has none of `openspec/`, `.agents/`, or `openwiki/`
- **THEN** bootstrap creates all three: initialized OpenSpec structure, scaffolded minimal `.agents/` tree, and `openwiki/INSTRUCTIONS.md` with the AKSK curation contract attached

#### Scenario: Bare repository via agent-assisted lane
- **WHEN** an agent runs `node .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs [repo-root]` in a repo with none of `openspec/`, `.agents/`, or `openwiki/`
- **THEN** the same three artifacts are created via the agent-driven EXECUTE lane (or INSTRUCT printed commands when sandboxed)

#### Scenario: Bare repository via npx skills fallback
- **WHEN** a human runs `npx skills add --full-depth` and then each skill's initialization
- **THEN** the same `.agents/` scaffold and routing/contract attachments are produced via the copied `scripts/*.mjs` without a separate `example/` path

#### Scenario: Existing AGENTS.md with OpenWiki block
- **WHEN** the root `AGENTS.md` already contains an OpenWiki-managed block
- **THEN** bootstrap merges its routing block alongside the existing block and leaves the managed block intact

#### Scenario: Repo already bootstrapped
- **WHEN** bootstrap re-runs against a fully bootstrapped repo
- **THEN** it detects prior completion, changes nothing, and exits successfully reporting idempotent completion
