---
name: aksk-bootstrap
description: Per-user global bootstrap for AKSK — Node check, npm i -g for openspec/openwiki, global skill spread, and host OpenWiki integrations. Per-repo setup lives in aksk-init. Falls back to printed INSTRUCT commands when local execution is not possible. Also owns the AKSK curation contract attachment and peer-tool verification preconditions.
---

# AKSK Bootstrap

## Goal

Per-user global setup (skill plus deterministic JS script). Prepares the machine for per-repo init. Reuses the finalized kit templates and `adopt-openspec-openwiki` curation-contract semantics; never replaces OpenWiki-owned content.

The skill is the orchestrator; the JS script is the deterministic executor. Other skills (`learning-distill`, `docs-lint`, `task-closeout`) reuse its preconditions.

## Bootstrap (orchestrator)

### EXECUTE lane — run locally

```bash
node .agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs  # global lane (interactive) [repo-root] [--force]
```

Global lane (non-interactive; skill is interactive) (idempotent by detection):

1. **Verify CLIs** — Node >= 22, `openspec`/`openwiki` on PATH (`npm i -g @fission-ai/openspec@^1.11.0 openwiki@^0.4.3` if missing, caret from `references/versions.json` via `versionsFromPackageJson()`); skip any tool already present at a compatible version; verify `openwiki` resolves before MCP registration.
2. **Verify skills** — ensure `~/.agents/skills/<name>/SKILL.md` plus current host's dir; if missing `npx skills add -g -a <self-reported> <source>` (versions from `references/versions.json`, `@latest` only when unpinned; `npx` required, no clone fallback) for the kit and for `langchain-ai/openwiki --full-depth` when that lifecycle skill is needed, otherwise `openwiki integrations install <self-reported>` when that host is in `codex|claude|opencode` (skill+MCP+receipt atomically) else fallback `npx add-mcp "openwiki mcp --host <self-reported>" -g -a <self-reported> --name openwiki` (command form; equivalent `--args` form `npx add-mcp openwiki -g -a <self-reported> --args mcp --args --host --args <self-reported> --name openwiki`) — bare `npx add-mcp openwiki` omits `mcp --host` and yields `["npx","-y","openwiki"]` → `MCP -32000 Connection closed`; `openwiki mcp --host <self-reported>` is the non-`add-mcp` alternative. Per-repo steps now live in `aksk-init`. **Never half-install**: failed step prints exact remaining commands and exits clean without partial state from that step.

### INSTRUCT lane — no local execution bridge

When any step cannot run locally (no `npm`, no write, sandboxed worker), the script prints the exact remaining commands and exits clean. The skill then surfaces those commands verbatim as the answer.

```
INSTRUCT lane — run these commands manually (versions from `references/versions.json`, caret-pinned):
  npm i -g @fission-ai/openspec@^1.11.0 openwiki@^0.4.3
  openwiki integrations install codex
```

No partial state from the failed step is left behind; completed steps remain.

### Idempotency

Re-running on a fully bootstrapped fixture changes nothing; re-running on a partially bootstrapped fixture completes only missing steps (detection-driven).

## Peer-tool verification

Standalone:

```bash
node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki
```

From Python (sibling skills may import; import from this scripts directory):

```python
import { requireBinaries } from "./check_peer_tools.mjs";
requireBinaries(["openspec", "openwiki"]); // exits 2 with install commands if absent
```

Only known peer tools are accepted (`openspec`, `openwiki`); any other name
exits 2 with an error naming the unknown tool rather than attempting a PATH
lookup.

Behavior contract:

- Checks PATH resolution only; never attempts installation.
- On missing tools, prints one error per tool plus the exact install commands
  (`npm i -g @fission-ai/openspec@^1.11.0`, `npm i -g openwiki@^0.4.3` with caret from `references/versions.json`, falling back to `@latest` if unpinned) and exits 2.

## Related

- Curation semantics consumed at distill time are specified by the `distill-routing`
  capability; contract attachment semantics by the `wiki-contract` capability.
- Design and lane ladder for `openwiki integrations install` are tracked in
  `openspec/changes/aksk-bootstrap-system/`.
