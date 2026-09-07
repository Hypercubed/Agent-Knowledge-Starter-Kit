---
type: "Reference"
title: "Distribution and Tool Wiring"
description: "Peer-tool prerequisites, verification scripts, attachment mechanisms, and skill distribution wiring."
tags: [integrations, distribution, bootstrap, peer-tools]
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-62bd4cb693e4e881b3f88f6b
    resource: repo://.agents/.gitignore
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
  - id: openwiki-source-dce50581779fda5dd507dc34
    resource: repo://.agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
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
  - id: openwiki-source-115b2dad781e2a2c5b5a980d
    resource: repo://docs/architecture.md
  - id: openwiki-source-5368c3f7dc2d30e7d29a8985
    resource: repo://docs/integrations/codex.md
  - id: openwiki-source-6c612e4f72ec031c13325b86
    resource: repo://docs/integrations/cursor.md
  - id: openwiki-source-161a7ae8592c3bd90751661f
    resource: repo://docs/integrations/patterns.md
  - id: openwiki-source-d37bb090eddfcd3c233c8f14
    resource: repo://docs/integrations/README.md
  - id: openwiki-source-096a781fb160ef979fa31121
    resource: repo://INSTALL.md
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

# Distribution and Tool Wiring

<!-- openwiki: broken internal link [packaging-and-install.md] file "packaging-and-install.md" does not exist. Fix the href or restore the target, then delete this comment. -->
Peer-tool wiring: what must be on PATH, which script verifies or installs it, and how skill distribution reaches user and host directories. Lane behavior is specified in `openspec/specs/aksk-bootstrap/spec.md`, `openspec/specs/aksk-init/spec.md`, and `openspec/specs/install-lanes/spec.md`; entry procedure in [INSTALL.md](../../INSTALL.md) and [Packaging and Install](packaging-and-install.md).

## Prerequisites and who installs them

Node >= 22 plus global `openspec` and `openwiki` (`openwiki --init` per repo, `openspec init --tools none` per repo). Only `aksk-bootstrap` (`bootstrap-global.mjs` via the `bootstrap.mjs` shim) may install them per-user via `npm i -g` with caret ranges from `references/versions.json`; `aksk-init` verifies globals before per-repo work and never installs. All other skills and scripts only verify — missing tools fail fast printing exact `npm i -g` commands with exit 2.

## Verification and attachment scripts

- **`check_peer_tools.mjs`** — PATH-only verifier exporting `INSTALL_COMMANDS`, `onPath`, `missing`, `requireBinaries`. Unknown tool names exit 2 naming the tool; missing tools print one error per tool plus install commands and exit 2.
- **`attach_section.mjs`** (shipped under both skills) — single append-only idempotent mechanism for N marker-delimited root sections (`AKSK:ROUTING`, `AKSK:LIFECYCLE`); markers read from the template at runtime, content outside markers never replaced, missing target file created, unknown template exits 2.
- **`attach_wiki_contract.mjs`** — appends the curation section between `AKSK:WIKI-CONTRACT` markers to an existing `openwiki/INSTRUCTIONS.md`; never creates the file or removes OpenWiki-owned content; idempotent and self-updating; exits 2 with the `openwiki --init` prerequisite when missing.
- **`sync_wiki_indexes.mjs`** — deterministic index refresh with no LLM and no CLI run: locates the global `openwiki` package, imports the docs-only backend and index sync, constructs the backend with docs-only virtual mode, and synchronizes. Exits 2 when the wiki is uninitialized or the package is missing globally.
- **`init_agents_md.mjs`** — seeds the `AKSK:AGENTS-BASELINE` zone when missing, no-ops when matching, fails closed with replace-vs-combine options otherwise; `--replace` overwrites, `--combine` stages merge inputs under `.agents/sessions/agents-md-combine/` without touching the original.

## Skill-first distribution

`npx skills add -g -a <self-reported> <source>` installs `.agents/skills/*` into `~/.agents/skills` plus the host dir, skipping `metadata.internal: true` folders. Each skill's `bootstrap/` directory must be preserved — initialization copies missing files from it and idempotent re-runs depend on the original name; `--all` sprays every known agent directory, so prefer narrow installs. Suggested order: `task-closeout` init for closeout-only, else `learning-distill` init first, then attach the routing note and register `SKILL.md` paths. Definitions may live globally but outputs belong under the target repo's `.agents/`.

## Bootstrap composition

The `bootstrap.mjs` shim runs `bootstrap-global.mjs` then `aksk-init`'s `bootstrap-repo.mjs` when present. The global orchestrator snapshots state (Node major, tools on PATH, repo trees, markers, receipts), installs missing globals per-user, and never half-installs — a failed step prints exact remaining commands and exits clean. The per-repo lane scaffolds `.agents/`, seeds the baseline first, runs `openspec init` and `openwiki --init` when missing, then attaches routing, lifecycle, and wiki contract. Fully bootstrapped `AGENTS.md` is zoned baseline → OpenWiki → AKSK (see [AGENTS.md Zoning](../concepts/agents-md-zoning.md)).

## Single-tree source of truth

`.agents/` is the source of truth for durable repo knowledge; root `AGENTS.md` routes into it and durable guidance is never duplicated into tool-native config, so tool switching does not invalidate knowledge.

## Related

- [Packaging and Install Lanes](../distribution/packaging-and-install.md) — package shape and the two supported lanes.
- [Bootstrap and Attachment](../workflows/bootstrap-and-attachment.md) — end-to-end composition order.
- [AGENTS.md Zoning](../concepts/agents-md-zoning.md) — marker zones and owners.
