---
id: dec-use-the-routing-pattern-for-agentic-tool-bootstrap-files
title: "Use the Routing Pattern for agentic tool bootstrap files"
last_updated: 2026-04-19
description: >
  Bootstrap files for agentic tools should route to `.agents/AGENTS.md` and
  portable skills rather than embedding long forked guidance.
tags: [agents, integrations, docs]
status: accepted
---

# Use the Routing Pattern for agentic tool bootstrap files

#### Status

Accepted

#### Context

Multiple agentic tools (Claude Code, Cursor, Gemini CLI) use root-level instruction files (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`) that take precedence.

#### Rationale

To maintain a single source of truth, these root files should not contain full policy. Instead, they should "route" the agent to the durable knowledge under `.agents/`.

#### Consequences

- Root files stay "thin" (bootstrap only).
- `.agents/` remains the authoritative location for durable repo knowledge.
- Cross-tool consistency is improved across different AI toolchains.
