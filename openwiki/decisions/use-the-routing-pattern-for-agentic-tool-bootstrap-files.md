---
type: Decision
title: Use the Routing Pattern for agentic tool bootstrap files
description: 'Bootstrap files for agentic tools should route to `.agents/AGENTS.md`
  and portable skills rather than embedding long forked guidance.

  '
tags:
- agents
- integrations
- docs
timestamp: '2026-04-19T00:00:00Z'
aksk_status: accepted
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

#### Amendment (2026-08-29, `add-agents-md-bootstrap`)

Scoped exception for `AGENTS.md`: the FerroxLabs behavioral baseline (`AKSK:AGENTS-BASELINE:BEGIN/END`, provenance header inside) is a *behavioral operating contract* — how the agent works (verification loops, surgical diffs, working-code discipline) — not repo knowledge. Root `AGENTS.md` remains a router for repo knowledge via `AKSK:ROUTING`/`AKSK:LIFECYCLE` attached below the baseline (and `OPENWIKI:START/END` between them), preserving the single-source-of-truth invariant for repo knowledge. Zon ed order is baseline → OpenWiki → AKSK; each zone is owned by one writer and integrity-checked by `docs-lint`. Practice predates the kit: this repo's own root `AGENTS.md` carries full behavioral content below OpenWiki/AKSK blocks.
