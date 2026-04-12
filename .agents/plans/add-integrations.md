# Plan: Add Integration Guides

**Status:** in-progress
**Goal:** Create `docs/integrations/` with per-tool integration guides so users of different agents/IDEs can connect this kit to their workflow.
**Date:** 2025-04-12
**Priority:** High
**Blocked by:** verify each tool against real behavior before documenting it
**Scope estimate:** multiple small docs PRs

---

## Overview

The kit explains *what* `.agents/` does but does not yet show users *how* to wire it into their specific tool. We need integration guides — step-by-step, per-tool, in `docs/integrations/`.

## Verified corrections from the Hermes pass

The first Hermes draft exposed a few planning/documentation mistakes that should not be repeated:

- integration guides belong in `docs/integrations/`, not at `docs/<tool>.md`
- this kit uses `.agents/docs/`, not `.agents/knowledge/`
- guides must distinguish root `AGENTS.md` bootstrap behavior from `.agents/AGENTS.md` durable repo guidance
- for Hermes specifically, repo-local `.agents/skills/` and Hermes system skills are separate namespaces and must be documented that way
- broad product claims should be avoided unless reproduced and verified; earlier write-tool failures were too weak to treat as general Hermes behavior

## Guide structure

Each guide should follow a consistent structure (a template file can be added once at least two guides need it):

1. **Prerequisites** — what the tool needs (version, extension, API key, access level, etc.)
2. **Discovery mechanism** — how the tool finds repo knowledge
3. **Setup steps** — exact files to copy/create, config to set, and what stays outside the repo
4. **Workflow** — how the tool should interact with `.agents/` during real sessions
5. **Two-tool example** — what it looks like when this tool and a second tool share the repo
6. **Troubleshooting** — common issues, verified gotchas, and debug tips
7. **References** — links to tool docs and relevant repo docs

## Guides to write

Each guide should focus on what makes the tool's integration unique. Persistent assistants (Hermes, OpenClaw) need explicit coverage of how their native memory/skills interact with the kit's repo knowledge. IDE-integrated tools (Cursor, Copilot, VS Code extensions) need explicit coverage of discovery files and rule formats.

| Guide | Tool type | Discovery mechanism | Key integration question | Status |
|---|---|---|---|---|
| `hermes.md` | Persistent assistant | memory, session recall, Hermes skills, `AGENTS.md` | When to use Hermes memory vs repo knowledge, and how to avoid the dual-skill-namespace trap | **done / verified** |
| `openclaw.md` | Persistent assistant | `AGENTS.md`, startup files, native memory, session tools, automation, `.agents/skills/` | How OpenClaw's native memory, automation, and startup behavior overlap with the kit without replacing the repo knowledge layer | **done** — verified against local OpenClaw docs/CLI and live `openclaw status` |
| `codex.md` | Coding agent / IDE / app | `AGENTS.md`, `.agents/skills/`, config, sandbox approvals | How Codex's native `AGENTS.md` and `.agents/skills/` discovery should use the kit without duplicating repo knowledge | **done** — verified against official Codex docs |
| `kilo-code.md` | Coding agent / CLI / app | `AGENTS.md`, `kilo.json`, `.kilo/command/*.md`, `.kilo/agent/*.md`, Kilo-native skills | How Kilo's native commands, agents, skills, and instructions should point to canonical repo knowledge under `.agents/` without forking it | **done** — based on documented Kilo config/discovery model and repo-local config locations |
| `claude-code.md` | Coding agent / IDE | `CLAUDE.md`, settings, AGENTS.md | How to point Claude Code at the kit cleanly | planned |
| `cursor.md` | IDE (rules-based) | `.cursor/rules` MDC files | How to map rules to `.agents/` content without duplication | **done** — verified against Cursor Rules docs |
| `copilot.md` | IDE (rules-based) | `.github/copilot-instructions.md` | How to reference `.agents/` from Copilot instructions | planned |
| `vscode-extensions.md` | IDE extensions | varies by extension | How to document per-extension discovery and setup without overclaiming | planned |

## Tasks

### 1. Create `docs/integrations/` directory + index

- `docs/integrations/README.md` — links to each guide, brief "pick your tool" framing
- Keep the index lightweight; it is a routing page, not a second copy of each guide
- **Status:** done

### 2. Write and validate `hermes.md`

- cover Hermes discovery (`AGENTS.md`, memory, session recall, Hermes skills)
- explain memory vs repo knowledge boundaries
- explicitly warn about repo-local `.agents/skills/` vs Hermes system skills
- include a real root-cause assessment of the earlier failures
- avoid broad claims unsupported by current verification
- **Status:** done

### 3. Write `openclaw.md`

- verify OpenClaw integration points directly before drafting
- explain native memory/skills vs repo `.agents/`
- clarify `.agents/skills/` vs any OpenClaw-native skill system
- include a two-tool example
- **Status:** done — verified against local OpenClaw docs/CLI and a live `openclaw status` run

### 4. Write `codex.md`

- document `AGENTS.md`, `.agents/skills/`, Codex config, and sandbox approval behavior
- make root `AGENTS.md` vs `.agents/AGENTS.md` roles explicit
- explain Codex repo-local skill discovery vs user/admin/system skills
- include a two-tool example
- **Status:** done — verified against official Codex docs

### 5. Write `claude-code.md`

- document `CLAUDE.md` setup and any pointer/config files
- make root `AGENTS.md` vs `.agents/AGENTS.md` roles explicit
- include a two-tool example

### 6. Write `cursor.md`

- document `.cursor/rules` MDC format
- show how to map rules to `.agents/` content without splitting the source of truth
- include a two-tool example
- **Status:** done

### 6.5 Write `kilo-code.md`

- document `kilo.json` / `.kilo/kilo.json`, `.kilo/command/*.md`, `.kilo/agent/*.md`, Kilo-native skills, and instruction discovery
- make root `AGENTS.md` vs `.agents/AGENTS.md` roles explicit
- keep one source of truth under `.agents/`; Kilo-specific config under `.kilo/` should be thin wiring only
- include a two-tool example
- **Status:** done — based on documented Kilo configuration/discovery behavior and repo-local config locations

### 7. Write `copilot.md`

- document `.github/copilot-instructions.md`
- show how to reference `.agents/` from Copilot instructions
- include a two-tool example

### 8. Write `vscode-extensions.md`

- cover only extensions whose discovery/setup behavior is verified
- likely candidates: Cline, Continue, other widely used extensions
- include a two-tool example

### 9. Update main README as guides land

- add a brief "Integrations" section linking to `docs/integrations/`
- keep it concise and guide-oriented
- **Status:** partial — Hermes, Cursor, Codex, and Kilo Code links added

## Out of scope (for now)

- tools not yet verified in practice
- automated integration detection scripts
- cross-tool knowledge sync automation
- claiming interoperability details that have not been tested

## Definition of done

- `docs/integrations/` directory exists with an index and verified guides
- each published guide follows the 7-section structure above
- main README links to `docs/integrations/`
- every published guide is grounded in real tool behavior or clearly labeled as provisional
- at least one persistent-assistant guide (Hermes) and one IDE-oriented guide are both verified
