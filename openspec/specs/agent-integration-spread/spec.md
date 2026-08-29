# agent-integration-spread Specification

## Purpose
Spreads OpenWiki's coding-agent integration across the agents detected on a user's machine using `openwiki integrations install` (v0.4.3+; skill + MCP atomically) for supported hosts and falling back to headless CLI usage for agents without a supported integration, enforcing single-owner destinations via install receipts.

## Requirements

### Requirement: Integration lane selection
The integration spread SHALL select, per detected agent: `openwiki integrations install <codex|claude|opencode>` (v0.4.3 registry; skill + MCP config `openwiki mcp --host <target>` installed atomically with `.openwiki-install.json` receipt) when that host is supported, otherwise the headless ladder (agent drives `openwiki --init -p` / `--update -p` directly) for agents with no supported integration.

#### Scenario: Supported host detected (codex|claude|opencode)
- **WHEN** a supported host (codex, claude, or opencode) is detected among installed agents
- **THEN** the spread uses `openwiki integrations install <host>` for that host rather than headless CLI

#### Scenario: Agent without supported integration
- **WHEN** a detected agent has no supported `openwiki integrations install` host (not codex|claude|opencode)
- **THEN** the spread records that agent for headless CLI operation (`openwiki --init -p` / `--update -p`) instead of failing

### Requirement: Ownership partition by receipt
Before spreading integration into any agent's skill directory, the spread SHALL skip any agent whose target skill directory already contains an `.openwiki-install.json` receipt, treating the official lane as the owner of that agent, and SHALL report the skip and its reason.

#### Scenario: Official-lane agent skipped
- **WHEN** an agent's skill directory already holds an `.openwiki-install.json` receipt from the official lane
- **THEN** the spread skips that agent entirely and lists it as owned by the official lane

#### Scenario: Unowned agent integrated
- **WHEN** an agent has no receipt in its target skill directory
- **THEN** the spread integrates that agent through its selected lane

### Requirement: Spread result report
After running, the integration spread SHALL produce a per-agent report naming each detected agent, the lane chosen (`openwiki integrations install <host>` vs headless), whether the action succeeded (`installed`/`unchanged`/`modified` via `openwiki integrations list`), and any installer output (including backup path on `--force`), so the user can verify or finish steps manually.

#### Scenario: Mixed-agent machine
- **WHEN** the spread completes on a machine with supported (codex|claude|opencode) and unsupported agents
- **THEN** the report shows one line per agent with lane, outcome (`installed`/`unchanged`/`modified`), and installer details
