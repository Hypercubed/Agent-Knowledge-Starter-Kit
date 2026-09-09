# global-openspec-skills Specification

## Purpose

Provides once-per-user global installation of OpenSpec agent skills (`openspec-*`) via the existing `npx skills` path, so every repo inherits them from the canonical `~/.agents/skills` store without per-repo `openspec init --tools` duplication.

## Requirements

### Requirement: Global OpenSpec skills installation

The system SHALL install OpenSpec agent skills globally (once per user) as part of the bootstrap global lane, using `npx skills add` with host-aware scoping (`-g -a <agent>` for the self-reported host and `-g --all` for universal `~/.agents/skills`), mirroring the existing kit skill spread.

#### Scenario: Fresh global install

- **WHEN** bootstrap global lane runs on a machine with `openspec` CLI present but no `openspec-*` skills in `~/.agents/skills/`
- **THEN** it runs `npx skills add <openspec-source> -g -a <agent>` (or `-g --all` when universal) for the resolved OpenSpec source and reports installed skills

#### Scenario: Already installed

- **WHEN** bootstrap global lane runs and `openspec-*` skills are already present at a compatible version in the canonical store
- **THEN** it skips installation and reports detected skills without reinstalling

#### Scenario: Missing npx

- **WHEN** `npx` is not on PATH during global skill spread
- **THEN** the system prints the exact `npx skills add` command(s) in the INSTRUCT lane and exits clean without partial state from the failed step

### Requirement: Idempotent detection

Re-running the global lane when OpenSpec skills are already present at a compatible version SHALL be a no-op for the skills step (skip install, report versions). Detection SHALL use file probes (e.g., `~/.agents/skills/openspec-*/SKILL.md` or the host-mirror equivalent) or `npx skills list -g` output, not a journal.

#### Scenario: Re-run on bootstrapped machine

- **WHEN** user re-runs the global lane with skills already present
- **THEN** it detects presence and does not invoke `npx skills add`

### Requirement: Version source for OpenSpec skills

The global lane SHALL resolve the OpenSpec skills package source/version from `references/versions.json` when pinned (via `versionsFromPackageJson()`-like lookup), falling back to the canonical registry id (`@fission-ai/openspec` or its dedicated skills package) with `@latest` only when unpinned. Hard-coded version strings outside `references/versions.json` are not allowed.

#### Scenario: Pinned version present

- **WHEN** `references/versions.json` contains a caret entry for the OpenSpec skills source
- **THEN** the install command uses that caret range

#### Scenario: Unpinned fallback

- **WHEN** no pin exists in `references/versions.json` or the consumer repo's `package.json`
- **THEN** the install uses the bare registry id (equivalent to `@latest` semantics) and does not hard-code a version

### Requirement: Never half-install for skills step

When any skill-spread step cannot execute locally (no `npx`, no write, sandboxed worker), the bootstrap flow SHALL print exact remaining `npx skills add` commands for that step and exit clean without leaving partial state from the failed step. It MUST NOT continue past a failed prerequisite and MUST preserve partitioned INSTRUCT semantics (global-lane failures print only global commands, not repo-lane commands).

#### Scenario: No execution capability for skills

- **WHEN** skill installation cannot run locally
- **THEN** it prints every remaining `npx skills add` command, exits clean, and has applied only fully completed earlier steps

### Requirement: Repo lane does not duplicate global skills by default

The per-repo lane (`aksk-init`) SHALL default to inheriting globally installed OpenSpec skills and MUST NOT reinstall them repo-locally. It MUST continue to run `openspec init --tools none` (no skill generation) and only install skills repo-locally when invoked with an explicit opt-in flag (e.g., `--local-skills`).

#### Scenario: Default per-repo init

- **WHEN** user runs `aksk-init` with defaults after global bootstrap
- **THEN** it inherits global `openspec-*` skills and does not run `npx skills add` without `-g` or generate skills via `openspec init`

#### Scenario: Explicit repo-local opt-in

- **WHEN** user invokes per-repo init with `--local-skills`
- **THEN** it may install skills repo-locally (`npx skills add` without `-g`) and record per-project receipts
