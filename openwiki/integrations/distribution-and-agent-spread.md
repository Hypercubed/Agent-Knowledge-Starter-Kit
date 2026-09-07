---
type: "Reference"
title: "Distribution and Agent Spread"
description: "How OpenWiki spreads across agents via registry lane or unified npx lane, with receipt ownership and verification."
tags: [integrations, distribution, openwiki, install]
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-62bd4cb693e4e881b3f88f6b
    resource: repo://.agents/.gitignore
  - id: openwiki-source-c056a1ca61c0634d11844713
    resource: repo://.agents/skills/aksk-bootstrap/references/versions.json
  - id: openwiki-source-78293e08bbba4e65fb2685ae
    resource: repo://.agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs
  - id: openwiki-source-dc8872a5e7d386c22ea2f135
    resource: repo://.agents/skills/aksk-bootstrap/SKILL.md
  - id: openwiki-source-d8d723e96d55a86c0b91977c
    resource: repo://.claude-plugin/plugin.json
  - id: openwiki-source-e119253b3c3737247dc63f2a
    resource: repo://.openwikiignore
  - id: openwiki-source-161a7ae8592c3bd90751661f
    resource: repo://docs/integrations/patterns.md
  - id: openwiki-source-096a781fb160ef979fa31121
    resource: repo://INSTALL.md
  - id: openwiki-source-3916774ed58b99715e8ff081
    resource: repo://openspec/specs/agent-integration-spread/spec.md
  - id: openwiki-source-c23cb9e8edf20ed2740abea1
    resource: repo://openspec/specs/aksk-bootstrap/spec.md
  - id: openwiki-source-d682bd16449a28825541bbed
    resource: repo://openspec/specs/aksk-init/spec.md
  - id: openwiki-source-e057169748acea114e857ee9
    resource: repo://openspec/specs/canonical-user-skills-scope/spec.md
  - id: openwiki-source-c16c0a8de8d2a3a0385db0af
    resource: repo://openspec/specs/install-lanes/spec.md
  - id: openwiki-source-5b54a58d1b51cd490b0e7162
    resource: repo://package.json
  - id: openwiki-source-5d609834bdc11b93524d04a9
    resource: repo://scripts/check-publish.sh
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# Distribution and Agent Spread

OpenWiki reaches agents through one invariant: **derive paths from the registry, never hardcode them, and respect receipt ownership**. Kit code maintains no path matrix — every target comes from `openwiki integrations list` at runtime. Lane behavior is specified in `openspec/specs/agent-integration-spread/spec.md` and `openspec/specs/canonical-user-skills-scope/spec.md`; this page maps the lanes.

## The two lanes

One lane per host, chosen by registry membership:

| Lane | When | Command | Effect |
| --- | --- | --- | --- |
| **Registry lane** | Host is `codex`, `claude`, or `opencode` | `openwiki integrations install <host>` | Atomically installs skill bundle plus MCP config (`openwiki mcp --host <target>`) and writes a `.openwiki-install.json` receipt |
| **Unified npx lane** | Any other host | `npx skills add -g -a <self-reported> langchain-ai/openwiki --full-depth` plus `npx add-mcp` or `openwiki mcp --host <target>` | Installs lifecycle skill to universal store plus host dir, then registers the MCP |

Default install is `~/.agents/skills` (universal, Codex default) plus the self-reported host's directory; extra hosts or `--all` only on explicit install-time request. `npx` is required — the clone-and-copy fallback is removed; missing `npx` reports via INSTRUCT with no silent copy. A skill install without MCP registration is inert. Ordering: `openwiki` must resolve on PATH before registering `openwiki mcp --host <target>` in host configs.

## Receipt ownership partition

`.openwiki-install.json` marks ownership. `openwiki integrations list` reports per host: `installed`/`unchanged` (receipt intact, re-run is a no-op), `modified` (hand-edits detected — overwrite requires explicit `--force` with backup), or `not-installed` (lane free to integrate). Before touching any skill directory, spread skips receipt-owned destinations entirely and reports the skip. User scope is default; `list --project` is the repo override. Host integrations are manual opt-in — the global lane never auto-spreads them.

## Verification and reporting

After spread, a per-agent report names each detected agent, the lane chosen, the outcome, and installer details including backup paths. Update path: `npm i -g openwiki@latest` then re-run `integrations install` (idempotent when unchanged). `uninstall` removes the receipt, returning the host to `not-installed`.

## Related Pages

- [Distribution and Tool Wiring](distribution-and-tool-wiring.md) — peer dependencies and Skills CLI distribution.
- [aksk-bootstrap Skill](../skills/aksk-bootstrap.md) — precondition provider and attachment scripts.
- [Bootstrap and Attachment](../workflows/bootstrap-and-attachment.md) — deterministic zoning and attachment order.
- [Architecture Overview](../architecture/overview.md) — repository layout and skill inventory.
