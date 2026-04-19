---
id: use-the-routing-pattern-for-agentic-tool-bootstrap-files
title: "Use the Routing Pattern for agentic tool bootstrap files"
last_updated: 2026-04-19
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
