---
type: distribution-page
title: "Tool Integrations"
description: "How docs/integrations/ wires AKSK into agent products via four shared patterns, with the quick matrix, guide-writing playbook, content-location decisions, and the completed routing-block attachment conversion."
tags: [integrations, agentic-tools, patterns, docs]
timestamp: 2026-08-23T23:30:00Z
openwiki:
  roles: [integration]
  source_paths:
    - docs/integrations/patterns.md
    - docs/integrations/README.md
    - .agents/playbooks/writing-integration-guides.md
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-161a7ae8592c3bd90751661f
    resource: repo://docs/integrations/patterns.md
---

# Tool Integrations

`docs/integrations/` is the user-facing layer that connects specific agent products to the kit. It is deliberately **outside** `.agents/` — decision `integration-guides-belong-in-docs-integrations-not-agents` keeps vendor how-tos out of the portable knowledge layer, and `kit-installation-guidance-lives-in-root-docs` does the same for install guidance.

## The core pattern

From [patterns.md](../../docs/integrations/patterns.md): keep one source of truth. Tool-native files (bootstrap files, project rules, command wrappers, local config) are *wiring*; `.agents/` files are *durable repo knowledge*. Never copy long-lived policy into each tool's native config — point the tool at `.agents/AGENTS.md`, `openwiki/index.md`, `.agents/playbooks/`, and `.agents/skills/`.

## Four pattern groups

| Pattern | Tools | Mechanism |
| --- | --- | --- |
| Root `AGENTS.md` native or compatible | Codex, OpenCode, Kilo Code, Warp, OpenClaw | attach the `AKSK:ROUTING` section with `attach_section.mjs` instead of hand-writing a short root AGENTS.md |
| Tool-specific bootstrap file | Claude Code (`CLAUDE.md`), Gemini CLI (`GEMINI.md`) | thin router; native memory stays user-local |
| Rules-based IDE wiring | Cursor (`.cursor/rules/`), GitHub Copilot (`.github/copilot-instructions.md`) | short rule bodies referencing `.agents/` paths |
| Persistent memory & runtime boundary | Hermes, Antigravity, OpenClaw, Agentic Sandbox | native memory for local continuity only; export durable evidence to `.agents/sessions/<folder>/` at task boundaries |

## Quick matrix (condensed)

The full comparison table in patterns.md maps every tool across bootstrap file, native config/storage, native memory/artifacts, skill behavior, and primary caveat. Representative rows:

- **Claude Code** — `CLAUDE.md` + `.claude/commands/` wrappers; auto-memory must never become repo docs.
- **Codex** — discovers repo `.agents/skills/` natively; sandbox may treat `.agents/` read-only during closeout ([troubleshooting entry](../../openwiki/troubleshooting/codex-cannot-write-under-agents-during-closeout-or-distill.md)).
- **Cursor / Copilot** — avoid duplicating long policy in rules/instruction files; nested `.agents/` files are not auto-visible.
- **Hermes** — dual skill namespaces: runtime skills vs repo `.agents/skills/`; read the repo files from disk ([troubleshooting entry](../../openwiki/troubleshooting/hermes-agent-specific-dual-skill-namespace-skill-view-returns-wrong-file.md)).
- **Agentic Sandbox** — execute procedural SKILL.md steps via tool calls or run scripts directly.

**Session export rule:** native memory helps during work, but `.agents/sessions/` is the shared task boundary — a closeout bundle captures commands, changed files, validation, and learning candidates so any later tool can distill. Promoted lessons commit to `.agents/AGENTS.md`, the curated wiki trees, or `.agents/playbooks/` — never back into a tool's private memory.

## Available guides

README lists per-tool pages: Integration Patterns (start here), Agentic Sandbox, Antigravity, Claude Code, Codex, Copilot, Cursor, Gemini CLI, Hermes, Kilo Code, OpenClaw, OpenSpec, OpenCode, Warp, Zo Computer. Planned: VS Code extensions (only after verification against real tool behavior). Each product page is a quick reference — exact filenames, minimal snippets, discovery/config table, unique caveats, verification date — while shared concepts live once in patterns.md (decision `shared-integration-patterns-belong-in-docs-integrations-patterns-md`).

All fifteen pages were updated during the 2.0 migration to route at `openwiki/index.md` instead of the deleted `.agents/docs/index.md`. Dogfood task 5.4 then converted ten of them (patterns plus the nine guides that embed a bootstrap snippet: Claude Code, Codex, Copilot, Gemini CLI, Kilo Code, OpenClaw, OpenCode, Warp, Zo Computer) from hand-written routing blocks to instructions to run the [aksk-bootstrap attachment](../skills/aksk-bootstrap.md) (`attach_section.mjs` + `AKSK:ROUTING` markers), noting its append-only idempotent in-place refresh behavior. The remaining pages (Cursor rules, Hermes, Antigravity, Agentic Sandbox, OpenSpec) never carried a root-file routing snippet, so they have nothing to convert.

## Writing new guides — the playbook

[`.agents/playbooks/writing-integration-guides.md`](../../.agents/playbooks/writing-integration-guides.md) governs guide authorship for convergent tools:

1. Inventory the tool's native structures; map overlaps and gaps against kit conventions.
2. Apply the Routing Pattern for high-precedence root instruction files.
3. Present three integration options with trade-offs: kit-as-bridge, replicate, hybrid; prefer canonical skill files when the tool discovers them natively.
4. Include a concrete two-tool workflow; verify claims by reproduction before documenting limitations.
5. Update routing docs together (root README, integrations README, tracker) in one change.
6. One post-dogfood refinement pass; if authoring from inside the target tool, note that session as the dogfood pass explicitly.
7. Keep session-metadata guidance conservative — document `agent_session_id` capture only where the tool exposes it.
8. Pitfalls: don't assume adoption, don't oversell, address namespace collisions, separate personal memory from repo knowledge, don't generalize single weak runs, no template residue.

## Relationship to other layers

Integration guides consume the vocabulary defined in the [knowledge layer](../architecture/knowledge-layer.md) and route users through [installation](packaging-and-install.md). Their maintenance workflow (closeout → distill → lint) is the same loop documented in [task lifecycle](../architecture/task-lifecycle.md); several troubleshooting entries originated as integration-guide dogfood sessions (Gemini, Hermes, Copilot, Zo).
