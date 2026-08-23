---
type: Decision
title: OpenWiki integration distribution stack (v0.3.x reality)
description: 'Records how OpenWiki reaches coding agents as of shipped v0.3.x: skills-CLI
  bundle plus headless CLI and runtime-importable helpers work; MCP lifecycle server
  and integrations lanes are unreleased upstream.'
tags:
- openwiki
- distribution
- integrations
timestamp: '2026-08-23T00:00:00Z'
aksk_status: accepted
aksk_depends_on:
- decisions/openspec-openwiki-aksk-division-of-labor
---

# OpenWiki integration distribution stack (v0.3.x reality)

### Status

Accepted (availability facts pinned to openwiki@0.3.x; revisit on upgrade)

### Context

AKSK skills need OpenWiki on any agent tool, but distribution mechanisms differ in maturity. Verified against the published npm package (v0.3.3) and upstream `main`: the npm package ships the headless CLI (`openwiki --init|-p|--update`), exported authoring prompts (`createSystemPrompt`), and deterministic OKF helpers (`okf/frontmatter`, `okf/index-sync`). The MCP lifecycle server (`src/integrations/mcp/`), its `openwiki_begin/finish/inspect_claims/resolve_claims` tools, and `integrations install` lanes exist only in unreleased main-branch source. `add-mcp`-style registration writes configs without checking binaries. Registry-based installers are excluded from consideration.

### Decision

The working integration surface today is:

1. **Skills-CLI bundle** (`npx skills add langchain-ai/openwiki`) installs the upstream skill markdown into supported agents.
2. **Headless CLI** for scheduled whole-wiki reconciliation runs.
3. **Runtime imports** of exported prompts and OKF helpers for host-agent authoring and validation at distill time.

MCP lifecycle registration and official per-agent install lanes are deferred until upstream ships them; adoption is tracked by the follow-on `aksk-bootstrap-system` change, not assumed by current skills.

### Rationale

Skills that assume unshipped lanes fail confusingly or silently skip setup. Pinning the dependency surface to what actually ships keeps every documented path executable today.

### Related

- [Agent-tool ownership partition](agent-tool-ownership-partition.md)
