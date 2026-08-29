## MODIFIED Requirements

### Requirement: Integration lane selection
The integration spread SHALL select, per the self-reported current agent and the canonical universal host (`codex`), one lane for each host that should receive an integration: `openwiki integrations install <codex|claude|opencode>` (v0.4.3 registry; skill + MCP config `openwiki mcp --host <target>` installed atomically with `.openwiki-install.json` receipt) when that host is supported, otherwise the unified tooling `npx skills add -g -a <self-reported> langchain-ai/openwiki --full-depth` for the lifecycle skill plus `npx add-mcp -g -a <host>` (neon-solutions/add-mcp) or `openwiki mcp --host <target>` for the MCP. The default install is `~/.agents/skills` (universal, Codex) plus the self-reported host's dir; extra hosts or `--all` occur only when the user explicitly asked at install time. The spread SHALL be verified via `openwiki integrations list` (user scope) vs `list --project` (repo override).

#### Scenario: Supported host detected (codex|claude|opencode)
- **WHEN** a supported host (codex, claude, or opencode) is detected among installed agents
- **THEN** the spread uses `openwiki integrations install <host>` for that host rather than headless CLI

#### Scenario: Agent without supported integration
- **WHEN** a detected agent has no supported `openwiki integrations install` host (not codex|claude|opencode)
- **THEN** the spread installs the lifecycle skill via `npx skills add -g -a <self-reported> langchain-ai/openwiki --full-depth` and the MCP via `npx add-mcp` (neon-solutions/add-mcp) or `openwiki mcp --host <target>` rather than the headless `openwiki --init -p` ladder

#### Scenario: Current host is supported by openwiki integrations
- **WHEN** the self-reported host is one of `codex`, `claude`, or `opencode`
- **THEN** the spread installs via `openwiki integrations install <that-host>` (skill + MCP atomically, receipt written)

#### Scenario: Current host is not supported by openwiki integrations
- **WHEN** the self-reported host is outside that set
- **THEN** the skill is installed via `npx skills add -g -a <self-reported> langchain-ai/openwiki --full-depth` and the MCP via `npx add-mcp`.

#### Scenario: Universal plus current is the default
- **WHEN** the install runs without an explicit `-a <other>` or `--all`
- **THEN** only `~/.agents/skills` and the self-reported host's skills dir are written

#### Scenario: Extra host was explicitly asked
- **WHEN** the user asked for `-a <other>` or `--all` at install time
- **THEN** that other host also receives the integration in addition to the universal+current pair
