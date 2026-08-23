## Purpose

Spreads OpenWiki's coding-agent integration across the agents detected on a user's machine using the skills CLI and MCP registration tools, preferring official lanes, enforcing single-owner destinations, and falling back to headless CLI usage for agents without MCP support.

## ADDED Requirements

### Requirement: Integration lane selection
The integration spread SHALL select, per detected agent: the official `openwiki integrations install claude|codex` lane when that agent's official install path applies, otherwise MCP registration via the `add-mcp` CLI for agents supporting arbitrary stdio commands, otherwise the headless ladder (agent drives `openwiki --init -p` / `--update -p` directly) for agents with neither.

#### Scenario: Claude Code detected
- **WHEN** Claude Code is detected among installed agents
- **THEN** the spread uses the official claude lane rather than registering via add-mcp

#### Scenario: Agent without MCP support
- **WHEN** a detected agent supports neither the official lanes nor stdio MCP registration
- **THEN** the spread records that agent for headless CLI operation instead of failing

### Requirement: Ownership partition by receipt
Before spreading integration into any agent's skill directory, the spread SHALL skip any agent whose target skill directory already contains an `.openwiki-install.json` receipt, treating the official lane as the owner of that agent, and SHALL report the skip and its reason.

#### Scenario: Official-lane agent skipped
- **WHEN** an agent's skill directory already holds an `.openwiki-install.json` receipt from the official lane
- **THEN** the spread skips that agent entirely and lists it as owned by the official lane

#### Scenario: Unowned agent integrated
- **WHEN** an agent has no receipt in its target skill directory
- **THEN** the spread integrates that agent through its selected lane

### Requirement: Spread result report
After running, the integration spread SHALL produce a per-agent report naming each detected agent, the lane chosen, whether the action succeeded, and any warnings emitted by the registration tool (for example dropped capability fields), so the user can verify or finish steps manually.

#### Scenario: Mixed-agent machine
- **WHEN** the spread completes on a machine with officially supported, MCP-capable, and unsupported agents
- **THEN** the report shows one line per agent with lane, outcome, and warnings

