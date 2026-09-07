---
type: workflow
title: Bootstrap and Attachment Workflow
description: End-to-end bootstrap flow — per-user global lane then per-repo lane — with EXECUTE/INSTRUCT, never-half-install, and attachment order.
tags:
- bootstrap
- agents-md
- aksk-bootstrap
- aksk-init
- attachment
- workflows
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-c056a1ca61c0634d11844713
    resource: repo://.agents/skills/aksk-bootstrap/references/versions.json
  - id: openwiki-source-5398a69cb2cf8d556809da57
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_section.mjs
  - id: openwiki-source-d56b5afb22742020f2ab6b59
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-78293e08bbba4e65fb2685ae
    resource: repo://.agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs
  - id: openwiki-source-d1960e41bf9a48af26e81829
    resource: repo://.agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs
  - id: openwiki-source-67d81b3c5bf101f8b3eb3d2a
    resource: repo://.agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs
  - id: openwiki-source-dce50581779fda5dd507dc34
    resource: repo://.agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
  - id: openwiki-source-dc8872a5e7d386c22ea2f135
    resource: repo://.agents/skills/aksk-bootstrap/SKILL.md
  - id: openwiki-source-860daeb113838f15883fdf83
    resource: repo://.agents/skills/aksk-init/references/lifecycle-template.md
  - id: openwiki-source-93c78d1dd46b76df62cef2f6
    resource: repo://.agents/skills/aksk-init/references/routing-note-template.md
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
  - id: openwiki-source-3916774ed58b99715e8ff081
    resource: repo://openspec/specs/agent-integration-spread/spec.md
  - id: openwiki-source-c23cb9e8edf20ed2740abea1
    resource: repo://openspec/specs/aksk-bootstrap/spec.md
  - id: openwiki-source-d682bd16449a28825541bbed
    resource: repo://openspec/specs/aksk-init/spec.md
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# Bootstrap and Attachment Workflow

Two idempotent phases take any repository from bare to fully wired without ever leaving partial state: a once-per-user **global lane** (`aksk-bootstrap`) for Node and peer tools, then a **per-repo lane** (`aksk-init`) for scaffold, baseline, init, and marker attachment. Lane behavior is specified in `openspec/specs/aksk-bootstrap/spec.md` and `openspec/specs/aksk-init/spec.md`; script detail lives in [aksk-bootstrap](../skills/aksk-bootstrap.md) and [aksk-init](../skills/aksk-init.md).

## Ownership

| Layer | Owner | Scope |
| --- | --- | --- |
| Global lane + preflight | `bootstrap-global.mjs` | Node >= 22 check, PATH checks, receipt peek, per-user `npm i -g`; never touches per-repo files except receipt verification |
| Per-repo scaffold | `bootstrap-repo.mjs` + shipped helpers | `.agents/` tree, baseline-first seed, `openspec init`, `openwiki --init`, routing/lifecycle and contract attachment |

Leaf scripts are deterministic Node `.mjs` that never install software and fail fast with exit 2 plus exact remediation; only the global orchestrator performs per-user installs, and never half-installs — a failed step prints exact remaining commands and exits clean. Scripts are non-interactive (no stdin); the skills prompt `[Y/n/skip]` before invoking them, with `--yes` passthrough and no-TTY falling back to partitioned INSTRUCT.

## End-to-end flow

1. **Global preflight and lane** — detect Node major, tools on PATH, repo trees, markers, and receipts; report state before acting. Install missing tools per-user (`npm i -g` with caret ranges, skip when present, single combined invocation when both missing) or print INSTRUCT and exit clean when sandboxed.
2. **Repo preflight** — verify Node >= 22 and tools on PATH, else fail fast directing to `aksk-bootstrap` with no global install attempts.
3. **Scaffold and seed baseline first** — minimal `.agents/` tree, then `init_agents_md.mjs` vendors the baseline zone (offline; conflicts fail closed with replace-vs-combine).
4. **`openspec init --tools none`** and **`openwiki --init`** when missing (harness path needs no extra key, CLI needs `OPENAI_API_KEY`).
5. **Attach routing then lifecycle** below the OpenWiki block, then **attach the wiki contract** to the existing `openwiki/INSTRUCTIONS.md` — append-only, idempotent, marker-scoped.

Re-runs converge by detection without replaying history; refreshing one marker family never rewrites another.

## Integration spread (manual opt-in)

Host spread is not part of the global lane script. Supported hosts (`codex`, `claude`, `opencode`) use `openwiki integrations install <host>` — atomic skill plus MCP config with a `.openwiki-install.json` receipt, where the installer skips receipt-owned destinations and reports `modified` on hash drift (overwrite requires `--force` with backup). All other hosts use the unified fallback: lifecycle skill via `npx skills add -g -a <self-reported> langchain-ai/openwiki --full-depth` plus MCP via `npx add-mcp` or `openwiki mcp --host <target>`. Full lane detail in [Distribution and Agent Spread](../integrations/distribution-and-agent-spread.md).

## Failure semantics

Node < 22, missing peer tools, missing wiki init, unknown templates, directory targets, baseline conflicts, and symlinked install dirs all fail fast with exit 2 and exact remediation — no writes, no partial state, no silent overwrites. Upstream refresh failures leave the vendored baseline byte-identical.

## Related pages

- [AGENTS.md Zoning](../concepts/agents-md-zoning.md) — zone stack and vendored baseline.
- [Knowledge Curation Contract](../concepts/knowledge-curation-contract.md) — contract attachment semantics.
- [Distribution and Agent Spread](../integrations/distribution-and-agent-spread.md) — spread lanes and receipt ownership.
- [aksk-bootstrap Skill](../skills/aksk-bootstrap.md) — global lane detail.
- [aksk-init Skill](../skills/aksk-init.md) — per-repo lane detail.
