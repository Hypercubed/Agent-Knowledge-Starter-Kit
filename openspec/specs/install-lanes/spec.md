# install-lanes Specification

## Purpose
Defines the supported install lanes for the Agent Knowledge Starter Kit, their preferred order, and the removal of the `example/` demo path so consumers have one agent-driven path and one human fallback that both use `aksk-bootstrap`'s scripts.

## Requirements

### Requirement: Preferred install lane is agent-assisted via aksk-bootstrap
The documentation SHALL present the agent-assisted lane as the preferred install path. The agent runs `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit` (or `npx skills add <path-to-kit>` from a kit checkout, executed from the target repo), allowing the consumer to choose agents and scope (`-a <agents>`, `-g`, or `--all`; defaults to prompted selection and the manual fallback in the docs); `.claude-plugin/plugin.json` lists the 4 user skills and is loaded by default. If `npx` is unavailable, the agent clones the repository to a temporary folder and copies `.agents/skills/` manually, then follows `INSTALL.md` Skill initialization. When a kit checkout is available, the agent may instead run the deterministic `node .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs [repo-root]` (EXECUTE/INSTRUCT) with the same result.

#### Scenario: Fresh repo via agent
- **WHEN** a consumer asks an agent to install the kit into an empty repo
- **THEN** the agent runs `npx skills add` (or the clone-and-copy fallback when `npx` is unavailable, or `bootstrap.mjs` from a checkout) and the docs point to that as the first Quick start option

### Requirement: Fallback install lane is npx skills add
The documentation SHALL present `npx skills add` as the second (fallback/manual) lane, allowing the consumer to choose agents and scope (`-a <agents>`, `-g`, or `--all`; see INSTALL.md for narrowing installs).

#### Scenario: Human manual install without an agent
- **WHEN** a human runs the fallback lane in a target repo
- **THEN** `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit` (or `npx skills add <path-to-kit>` from the target repo) places all 4 skills under `.agents/skills/` and the docs direct the human to run each skill's Skill initialization

### Requirement: example/ directory and generate-example are not supported
The repository SHALL NOT contain an `example/` directory as an install method, and SHALL NOT ship the maintainer-only skill `.agents/skills/generate-example/` or its playbook `.agents/playbooks/generate-example.md`. Documentation, playbooks, and shell scripts SHALL NOT reference `example/` as an install path or as a validation target.

#### Scenario: Consumer looks for copy-example install
- **WHEN** a consumer reads README Quick start or INSTALL.md
- **THEN** no `cp example/.agents` path is listed; the two lanes above are the only install options

#### Scenario: Maintainer checks repo structure
- **WHEN** `scripts/check-agents-structure.sh .agents` runs or `scripts/check-publish.sh` runs
- **THEN** no generator or `example/`-specific bypass is required; only `.agents` is validated
