## Purpose

Installs and wires OpenSpec and OpenWiki into a repository through one idempotent orchestrator skill plus a deterministic Python script: preflight detection, a once-per-user global install lane, per-repo scaffolding, and a clean-exit instruct fallback when local execution is not possible.

## ADDED Requirements

### Requirement: Preflight environment detection
The bootstrap flow SHALL detect, before making any change: the Node.js major version, whether `openspec` and `openwiki` are available on PATH, whether `.agents/`, `openspec/`, and `openwiki/` exist in the target repo, and whether OpenWiki install receipts (`.openwiki-install.json`) exist in known skill directories. It SHALL report this state to the user before acting.

#### Scenario: Fresh machine preflight
- **WHEN** bootstrap runs on a machine with Node >= 22 and neither tool installed
- **THEN** it reports Node is sufficient, both tools are missing, and proceeds to the global install lane

#### Scenario: Unsupported Node version
- **WHEN** bootstrap runs with Node < 22
- **THEN** it stops before installing anything and prints the required Node version and how to upgrade

### Requirement: Global tool installation lane
The bootstrap flow SHALL install `@fission-ai/openspec@latest` and `openwiki` globally once per user, and SHALL skip installation for any tool already present at a compatible version.

#### Scenario: First global install
- **WHEN** neither tool is globally installed
- **THEN** bootstrap runs the global npm install for both tools exactly once

#### Scenario: Tools already installed
- **WHEN** both tools are already globally installed
- **THEN** bootstrap performs no global installation and reports the detected versions

### Requirement: Per-repo bootstrapping on demand
For a target repository, the bootstrap flow SHALL run `openspec init` when `openspec/` is missing, scaffold a minimal `.agents/` tree from kit templates when `.agents/` is missing or incomplete, attach the AKSK curation contract to `openwiki/INSTRUCTIONS.md` using the append-only merge semantics defined in `adopt-openspec-openwiki`, and merge a thin routing block into the root `AGENTS.md` without disturbing other content in that file, including any existing OpenWiki-managed block.

#### Scenario: Bare repository
- **WHEN** the target repo has none of `openspec/`, `.agents/`, or `openwiki/`
- **THEN** bootstrap creates all three: initialized OpenSpec structure, scaffolded minimal `.agents/` tree, and `openwiki/INSTRUCTIONS.md` with the AKSK curation contract attached

#### Scenario: Existing AGENTS.md with OpenWiki block
- **WHEN** the root `AGENTS.md` already contains an OpenWiki-managed block
- **THEN** bootstrap merges its routing block alongside the existing block and leaves the managed block intact

#### Scenario: Repo already bootstrapped
- **WHEN** bootstrap re-runs against a fully bootstrapped repo
- **THEN** it detects prior completion, changes nothing, and exits successfully reporting idempotent completion

### Requirement: Never half-install
When any bootstrap step cannot be executed locally, the bootstrap flow SHALL print the exact commands for the remaining steps and exit cleanly without leaving partial state from the failed step. It MUST NOT continue past a failed prerequisite step.

#### Scenario: No execution capability
- **WHEN** bootstrap cannot run a step locally (no execution bridge)
- **THEN** it prints every remaining step as copy-paste commands, exits cleanly, and has applied only steps that completed in full

