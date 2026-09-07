---
type: Reference
title: Packaging and Install Lanes
description: User-scope packaging (npm globals, caret versions, skill-first install) and the aksk-bootstrap global plus aksk-init per-repo lanes.
tags: [packaging, install, skills, bootstrap, npm, user-scope]
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-c056a1ca61c0634d11844713
    resource: repo://.agents/skills/aksk-bootstrap/references/versions.json
  - id: openwiki-source-d56b5afb22742020f2ab6b59
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-78293e08bbba4e65fb2685ae
    resource: repo://.agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs
  - id: openwiki-source-5ffa21d5a23117c638ca72b7
    resource: repo://.agents/skills/aksk-bootstrap/scripts/bootstrap.mjs
  - id: openwiki-source-d1960e41bf9a48af26e81829
    resource: repo://.agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs
  - id: openwiki-source-67d81b3c5bf101f8b3eb3d2a
    resource: repo://.agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs
  - id: openwiki-source-dc8872a5e7d386c22ea2f135
    resource: repo://.agents/skills/aksk-bootstrap/SKILL.md
  - id: openwiki-source-944a38bc18074fe81ed45b1f
    resource: repo://.agents/skills/aksk-init/scripts/attach_section.mjs
  - id: openwiki-source-ff2d87cb54c01d07d6371400
    resource: repo://.agents/skills/aksk-init/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-9930f2885b3cb73d38a9300a
    resource: repo://.agents/skills/aksk-init/scripts/bootstrap-repo.mjs
  - id: openwiki-source-5a97b1d59b72f21589de6133
    resource: repo://.agents/skills/aksk-init/scripts/init_agents_md.mjs
  - id: openwiki-source-4ab0b6cc58dd78f7a5c0603e
    resource: repo://.agents/skills/aksk-init/SKILL.md
  - id: openwiki-source-d8d723e96d55a86c0b91977c
    resource: repo://.claude-plugin/plugin.json
  - id: openwiki-source-096a781fb160ef979fa31121
    resource: repo://INSTALL.md
  - id: openwiki-source-3916774ed58b99715e8ff081
    resource: repo://openspec/specs/agent-integration-spread/spec.md
  - id: openwiki-source-c23cb9e8edf20ed2740abea1
    resource: repo://openspec/specs/aksk-bootstrap/spec.md
  - id: openwiki-source-e057169748acea114e857ee9
    resource: repo://openspec/specs/canonical-user-skills-scope/spec.md
  - id: openwiki-source-c16c0a8de8d2a3a0385db0af
    resource: repo://openspec/specs/install-lanes/spec.md
  - id: openwiki-source-5b54a58d1b51cd490b0e7162
    resource: repo://package.json
  - id: openwiki-source-23775c3de52f3ab95a13cb8b
    resource: repo://README.md
  - id: openwiki-source-2361cff43709905e22758cbb
    resource: repo://scripts/check-agents-structure.sh
  - id: openwiki-source-5d609834bdc11b93524d04a9
    resource: repo://scripts/check-publish.sh
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# Packaging and Install Lanes

The kit ships content (markdown layout and conventions) rather than a runtime library. The only supported adoption paths are two skill-owned lanes ending in the same per-repo scaffold: `aksk-bootstrap` (per-user global) then `aksk-init` (per-repo). Bootstrap templates are the source of truth — there is no `cp example/.agents` path. Full installer-facing procedure lives in [INSTALL.md](../../INSTALL.md); lane behavior is specified in `openspec/specs/aksk-bootstrap/spec.md` and `openspec/specs/aksk-init/spec.md`.

## What the package is

Root `package.json` declares `agent-knowledge-starter` — description, `devDependencies` (Skills CLI, remark, markdown-link-check, pinned peer-tool dev deps as the version source for the global lane), `scripts` (`test` intentionally errors, `format`, `check`), and empty `dependencies`: peer tools are per-user globals verified before use, never repo-local installs. The distributable surface is `.agents/` (portable skills, bootstrap templates, playbooks, scripts); curated wiki trees under `openwiki/` are this repository's own knowledge base, not a template.

## Prerequisites (fail-fast, never silent)

- **Node >= 22**, the single kit runtime for all `.mjs` scripts.
- `npm i -g @fission-ai/openspec@^<caret> openwiki@^<caret>` — caret ranges from `references/versions.json` (consumer `package.json` override first, bundled fallback second), `@latest` only when unpinned; per-user global scope, never `node_modules`.

`aksk-bootstrap` owns verification and exits 2 with exact install commands on missing tools; other skills import rather than reimplement. Only the deterministic global lane performs installs — everything else only verifies.

## Two supported lanes

**Lane 1 — agent-assisted (preferred):** `npx skills add <source> -g -a <agent> --skill aksk-bootstrap`, run the `aksk-bootstrap` skill (global: preflight, tool installs, skill spread), then the `aksk-init` skill (per-repo: scaffold `.agents/` and baseline first, `openspec init`, `openwiki --init`, routing/lifecycle/contract attachment). The `bootstrap.mjs` shim preserves the old entrypoint by running global then per-repo sequentially. Without local execution the script prints exact remaining commands (INSTRUCT lane) and exits clean with no partial state — never half-installs.

**Lane 2 — manual fallback:** `npx skills add <source> -g -a <agent>` (omit `-g` for the repo-local override), then run each installed skill's **Skill initialization** once (copy-missing-only, never overwrite repo content). Then edit `.agents/AGENTS.md`, attach the routing note to the root instruction file, and register `SKILL.md` paths in the editor if required.

Positional `<source>` must come first (`-a` consumes the next token). `--all` fans out to every known agent directory — use only on explicit request. Skill definitions may live in user/global locations, but initialization output and ongoing artifacts belong under the target repo's `.agents/`.

## Registration surfaces

| Surface | Content |
| --- | --- |
| Skills CLI (canonical) | `npx skills add <source> -g -a <self-reported>` → `~/.agents/skills/` plus host mirror; `universal` store plus self-reported host, extra hosts only on request |
| Claude Code plugin | `.claude-plugin/plugin.json` registers the user skills |
| Local receipts (gitignored) | `.openwiki-install.json` partitions ownership for `openwiki integrations install`; host integrations are manual opt-in, never auto-spread |

## Per-repo wiring (what aksk-init guarantees)

Zoned order after the global lane: seed the `AGENTS.md` baseline zone first → `openspec init` / `openwiki --init` when missing → attach routing then lifecycle zones → attach the wiki contract to the existing `openwiki/INSTRUCTIONS.md` (never creates it, idempotent refresh). Skill initialization templates under each skill's `bootstrap/` are copy-missing-only sources — never delete or rename them. Merging into an existing `.agents/`: preserve repo-specific content, add missing skills, hand-merge `AGENTS.md` concisely.

## Validation before finishing

`bash scripts/check-agents-structure.sh .agents` for structure and session tracking, `bash scripts/check-publish.sh` (or `npm run check`) for full publish hygiene, then `sync_wiki_indexes.mjs` so preserved assets stay discoverable.

See also [Distribution and Tool Wiring](../integrations/distribution-and-tool-wiring.md) for host wiring and [Quickstart](../quickstart.md) for the intent-routed entry point.
