---
id: integration-guides-belong-in-docs-integrations-not-agents
title: "Integration guides belong in `docs/integrations/`, not `.agents/`"
last_updated: 2026-04-19
description: >
  Product-specific install and wiring guides live under root `docs/integrations/`
  so `.agents/` stays portable kit knowledge rather than vendor how-tos.
tags: [docs, integrations, architecture]
status: accepted
depends_on:
  - shared-integration-patterns-belong-in-docs-integrations-patterns-md
---

# Integration guides belong in `docs/integrations/`, not `.agents/`

#### Status

Accepted

#### Context

The starter kit needs guides explaining how different agent tools (Hermes, Claude Code, Cursor, etc.) work with the `.agents/` knowledge system.

#### Rationale

Integration guides are user-facing setup documentation for humans configuring their tools. They are not agent-consumable structured knowledge, so they do not belong inside `.agents/`. The `docs/` directory at the repo root is the natural home.

#### Consequences

- `docs/integrations/` contains per-tool guides and any shared template.
- `.agents/` stays focused on what agents actually consume at runtime.
- Published integration guides should be grounded in verified tool behavior, not just analogy or one-off runs.
