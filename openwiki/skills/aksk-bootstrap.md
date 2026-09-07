---
type: skill-reference
title: aksk-bootstrap Skill
description: Per-user global lane for AKSK — Node preflight, peer-tool installs, global skill spread. Per-repo setup lives in aksk-init.
tags:
- skills
- aksk-bootstrap
- bootstrap
- preconditions
- peer-tools
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-da03faceacac4fd818b473f3
    resource: repo://.agents/skills/aksk-bootstrap/references/lifecycle-template.md
  - id: openwiki-source-0294ec7c02cfa2beeca87331
    resource: repo://.agents/skills/aksk-bootstrap/references/routing-note-template.md
  - id: openwiki-source-c056a1ca61c0634d11844713
    resource: repo://.agents/skills/aksk-bootstrap/references/versions.json
  - id: openwiki-source-7381bbb8d2e7fd02da7469ce
    resource: repo://.agents/skills/aksk-bootstrap/references/wiki-contract-template.md
  - id: openwiki-source-5398a69cb2cf8d556809da57
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_section.mjs
  - id: openwiki-source-d56b5afb22742020f2ab6b59
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-78293e08bbba4e65fb2685ae
    resource: repo://.agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs
  - id: openwiki-source-5ffa21d5a23117c638ca72b7
    resource: repo://.agents/skills/aksk-bootstrap/scripts/bootstrap.mjs
  - id: openwiki-source-d1960e41bf9a48af26e81829
    resource: repo://.agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs
  - id: openwiki-source-181fd64540d760eef80f754f
    resource: repo://.agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs
  - id: openwiki-source-67d81b3c5bf101f8b3eb3d2a
    resource: repo://.agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs
  - id: openwiki-source-dce50581779fda5dd507dc34
    resource: repo://.agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
  - id: openwiki-source-dc8872a5e7d386c22ea2f135
    resource: repo://.agents/skills/aksk-bootstrap/SKILL.md
  - id: openwiki-source-c23cb9e8edf20ed2740abea1
    resource: repo://openspec/specs/aksk-bootstrap/spec.md
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# aksk-bootstrap

**Folder:** `.agents/skills/aksk-bootstrap/` · **Spec:** `openspec/specs/aksk-bootstrap/spec.md` · **Full procedure:** `SKILL.md` (orchestrator prompts, exact commands, lane ladder)

Per-user **global lane only**. The skill is the orchestrator, `bootstrap-global.mjs` is the deterministic executor. It verifies the host can run the kit and never touches per-repo files except reading receipts for reporting. Per-repo scaffolding, routing, and contract attachment live in [aksk-init](aksk-init.md). Other skills reuse its preconditions instead of reimplementing PATH checks.

## Global lane

Single verb — **Verify CLIs**: Node >= 22 and `openspec`/`openwiki` on PATH; `npm i -g` with caret ranges from `references/versions.json` (via `versionsFromPackageJson()`, `@latest` only when unpinned) for missing tools; skip tools already present. `bootstrap.mjs` is a backward-compat shim running the global lane then the `aksk-init` repo lane when present. Failed steps print exact remaining commands and exit clean with no partial state (never half-installs); without local execution the INSTRUCT lane prints the commands verbatim. The lane script is non-interactive — the skill prompts `[Y/n/skip]` before invoking it — and host integrations are excluded from the lane (manual opt-in).

## Canonical store

Default is the user-scoped universal store `~/.agents/skills` plus the self-reported host's directory via `npx skills add -g -a <self-reported> <source>` — for the kit and for `langchain-ai/openwiki --full-depth`, with extra hosts or `--all` only on explicit install-time request. `npx` is required; the clone-and-copy fallback is removed. Repo-local `./.agents/skills` is an override, not the default.

## Scripts

| Script | Role |
| --- | --- |
| `bootstrap-global.mjs` | Global-only orchestrator: detect state, verify CLIs, report, INSTRUCT fallback |
| `bootstrap.mjs` | Shim: global lane then repo lane |
| `check_peer_tools.mjs` | PATH-only verifier (allowlist `openspec`/`openwiki`, unknown names exit 2, never installs) |
| `attach_wiki_contract.mjs` | `AKSK:WIKI-CONTRACT` → existing `openwiki/INSTRUCTIONS.md` (owned here, invoked by repo lane) |
| `attach_section.mjs` | Generic `AKSK:*` → root files |
| `init_agents_md.mjs` / `refresh_agents_baseline.mjs` | Baseline seed (offline) / vendored refresh (opt-in, validated) |
| `sync_wiki_indexes.mjs` | Deterministic index rebuild without LLM or CLI run |

Templates under `references/` (`versions.json` caret pins, `wiki-contract-template.md`, `routing-note-template.md`, `lifecycle-template.md`, vendored baseline) are the offline sources of truth.

## Related

- [aksk-init](aksk-init.md) — per-repo lane consuming these preconditions.
- [Bootstrap and Attachment](../workflows/bootstrap-and-attachment.md) — end-to-end composition order.
- [Distribution and Tool Wiring](../integrations/distribution-and-tool-wiring.md) — peer wiring detail.
