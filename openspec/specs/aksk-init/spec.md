# aksk-init Specification

## Purpose
Provides idempotent per-repo initialization for the Agent Knowledge Starter Kit after global prerequisites are satisfied: scaffolds `.agents/` and `AGENTS.md` baseline, initializes `openspec` and `openwiki`, attaches routing/lifecycle and wiki contract, and supports optional repo-local skills with partitioned instruct fallback.

## Requirements

### Requirement: Per-repo init preflight
The system MUST verify global prerequisites before repo work: Node >=22 and `openspec`/`openwiki` on PATH. If missing, it MUST fail fast with a message directing to `aksk-bootstrap` (`node .agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs`) and MUST NOT attempt global installs. It MUST NOT be invocable transitively through `aksk-bootstrap`; the only entry point is `aksk-init/scripts/bootstrap-repo.mjs` directly or via the `aksk-init` skill.

#### Scenario: Happy path
- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

#### Scenario: Shim no longer delegates
- **WHEN** documentation or automation refers to repo initialization
- **THEN** it references `aksk-init` / `bootstrap-repo.mjs` explicitly, never the deleted `bootstrap.mjs` shim

### Requirement: Repo scaffolding
The system MUST provide an idempotent per-repo init that first scaffolds `.agents/` and seeds `AGENTS.md` baseline via `init_agents_md.mjs` (step 1), then creates `openspec/` (via `openspec init`) via `init_agents_md.mjs`, and attaches routing + lifecycle sections via `attach_section.mjs`. Re-running on a fully initialized repo MUST be a no-op.

#### Scenario: Happy path
- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

### Requirement: Wiki contract per repo
The system MUST attempt `openwiki --init` when `openwiki/` is missing (noting CLI needs OPENAI_API_KEY while harness path needs no extra key) and then attach the AKSK wiki contract via `attach_wiki_contract.mjs` without replacing OpenWiki-owned content.

#### Scenario: Happy path
- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

### Requirement: Optional repo-local skills
The system MUST default to inheriting global skills; when invoked with an explicit opt-in flag (e.g. `--local-skills`), it MUST install skills repo-locally (`npx skills add` without `-g`) and record per-project receipts.

#### Scenario: Happy path
- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

### Requirement: Partitioned INSTRUCT
When repo-lane steps cannot execute locally, the system MUST print only repo-scoped remaining commands and MUST NOT include global-lane install commands.

#### Scenario: Happy path
- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

### Requirement: Version source
The per-repo lane MUST use tool versions from `aksk-bootstrap/references/versions.json` (single source; aksk-init does not duplicate versions.json) for diagnostic messages; it MUST NOT hard-code `openwiki@latest`.

#### Scenario: Happy path
- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

### Requirement: Repo lane execution model
The repo lane script MUST be non-interactive; the `aksk-init` skill (agent) prompts [Y/n/skip] before invoking it. The script MUST describe harness vs CLI paths for `openwiki --init` (harness needs no extra key; CLI needs OPENAI_API_KEY) and MUST NOT block on stdin. **The skill and script SHALL be documented as independent from `aksk-bootstrap`; ordering (global first, then per-repo) is stated in docs, not enforced by cross-skill spawning.**

#### Scenario: Happy path
- **WHEN** the agent invokes the repo lane
- **THEN** it completes without blocking, scaffolding .agents/ and baseline first

### Requirement: Documentation budget distribution via aksk-init
The per-repo init lane (`bootstrap-repo.mjs`) SHALL distribute the Documentation budget by (a) ensuring the wiki contract template carrying the brief is attached via `attach_wiki_contract.mjs` and (b) installing `.openwikiignore` from `references/openwikiignore-template.md` via the ignore installer with merge-not-clobber semantics. The lane SHALL perform these steps after `openwiki --init` and contract attachment, SHALL be non-interactive, and SHALL be idempotent — re-running on a fully initialized repo with current templates is a no-op. When execution is not possible locally, it SHALL print repo-scoped INSTRUCT commands for remaining steps without including global-lane commands.

#### Scenario: Happy path — fresh repo init
- **WHEN** user runs `aksk-init` with defaults in a fresh repo
- **THEN** `.openwikiignore` is created from the template and `openwiki/INSTRUCTIONS.md` contains the Documentation brief inside `AKSK:WIKI-CONTRACT` markers

#### Scenario: Idempotent re-run
- **WHEN** `aksk-init` re-runs on a repo where the ignore and contract already match current templates
- **THEN** no files are modified

#### Scenario: Customized ignore preserved
- **WHEN** `aksk-init` re-runs and the user has added rules outside the AKSK markers in `.openwikiignore`
- **THEN** those rules are preserved and only the marked section is refreshed if needed
