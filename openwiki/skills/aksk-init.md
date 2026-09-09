---
type: skill-reference
title: aksk-init Skill
description: Per-repo lane for AKSK — scaffolds .agents/ and AGENTS.md baseline first, then openspec init, openwiki init, and routing/lifecycle plus wiki-contract attachment.
tags:
- skills
- aksk-init
- per-repo-init
- agents-md
- wiki-contract
- routing
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-c056a1ca61c0634d11844713
    resource: repo://.agents/skills/aksk-bootstrap/references/versions.json
  - id: openwiki-source-b7d2caf3a5a306ccd41f0115
    resource: repo://.agents/skills/aksk-init/references/agents-md-baseline-template.md
  - id: openwiki-source-860daeb113838f15883fdf83
    resource: repo://.agents/skills/aksk-init/references/lifecycle-template.md
  - id: openwiki-source-93c78d1dd46b76df62cef2f6
    resource: repo://.agents/skills/aksk-init/references/routing-note-template.md
  - id: openwiki-source-d786624ba23d2df437591102
    resource: repo://.agents/skills/aksk-init/references/wiki-contract-template.md
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
  - id: openwiki-source-d682bd16449a28825541bbed
    resource: repo://openspec/specs/aksk-init/spec.md
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# aksk-init

**Folder:** `.agents/skills/aksk-init/` · **Spec:** `openspec/specs/aksk-init/spec.md` · **Full procedure:** `SKILL.md`

Per-repo initialization lane. Verifies the global lane (`aksk-bootstrap`) is satisfied — never installs global tools, fails fast directing to it when they are missing — then deterministically scaffolds the repository. The skill is the interactive orchestrator; `bootstrap-repo.mjs` is the non-interactive executor.

## Per-repo sequence

1. **Preflight** — Node >= 22 and `openspec`/`openwiki` on PATH, else fail fast with the `aksk-bootstrap` remediation.
2. **Scaffold `.agents/` and seed the baseline first** — `init_agents_md.mjs` vendors the FerroxLabs baseline zone (offline; fails closed with replace-vs-combine on conflicts).
3. **`openspec init --tools none`** and **`openwiki --init`** when those trees are missing.
4. **Attach routing then lifecycle** — `attach_section.mjs` appends `AKSK:ROUTING` and `AKSK:LIFECYCLE` below the OpenWiki block, idempotent refresh only.
5. **Attach the wiki contract** — `attach_wiki_contract.mjs` appends the templated section between `AKSK:WIKI-CONTRACT` markers to the existing `openwiki/INSTRUCTIONS.md`; never creates the file, never removes OpenWiki-owned content, idempotent and self-updating, exits 2 with the verbatim `openwiki --init` prerequisite when missing.

## Scripts

| Script | Role |
| --- | --- |
| `bootstrap-repo.mjs` | Per-repo orchestrator: preflight + scaffold + init + attachments, idempotent |
| `init_agents_md.mjs` | Baseline seed with provenance header; `--replace` / `--combine` on conflicts |
| `attach_section.mjs` | Generic `AKSK:*` attachment to root router files |
| `attach_wiki_contract.mjs` | Contract attachment to existing `INSTRUCTIONS.md` |

Templates under `references/` (baseline, routing note, lifecycle, wiki contract) are the offline sources; markers are read from templates at runtime, never hard-coded.

## Related

- [aksk-bootstrap](aksk-bootstrap.md) — global preconditions this lane consumes.
- [Bootstrap and Attachment](../workflows/bootstrap-and-attachment.md) — end-to-end composition order.
- [AGENTS.md Zoning](../concepts/agents-md-zoning.md) — marker zones and owners.
