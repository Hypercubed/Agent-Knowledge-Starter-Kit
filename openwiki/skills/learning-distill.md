---
type: skill-reference
title: learning-distill Skill
description: 'Converts a session bundle into durable knowledge routed by kind: descriptive lessons become curated OKF wiki pages, prescriptive lessons stay in .agents/.'
tags:
- skills
- learning-distill
- distillation
- knowledge
- okf
verified:
  - by: openwiki/0.5.0
    at: 2026-09-04T04:19:45.757Z
sources:
  - id: openwiki-source-7381bbb8d2e7fd02da7469ce
    resource: repo://.agents/skills/aksk-bootstrap/references/wiki-contract-template.md
  - id: openwiki-source-d56b5afb22742020f2ab6b59
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs
  - id: openwiki-source-d1960e41bf9a48af26e81829
    resource: repo://.agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs
  - id: openwiki-source-dce50581779fda5dd507dc34
    resource: repo://.agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
  - id: openwiki-source-5ac6c307239e5546722dfd07
    resource: repo://.agents/skills/learning-distill/bootstrap/AGENTS.md
  - id: openwiki-source-513536a60f0bc38be6c6d845
    resource: repo://.agents/skills/learning-distill/references/CONTRACT.md
  - id: openwiki-source-6780607585e38503f5da5e5e
    resource: repo://.agents/skills/learning-distill/references/decision-frontmatter.schema.json
  - id: openwiki-source-20b14eec3201468748607f5c
    resource: repo://.agents/skills/learning-distill/references/troubleshooting-frontmatter.schema.json
  - id: openwiki-source-7fe0106a3a83528f5b3d3755
    resource: repo://.agents/skills/learning-distill/SKILL.md
  - id: openwiki-source-bc5af49c81a8aed294e3b8b0
    resource: repo://.agents/skills/task-closeout/CONTRACT.md
  - id: openwiki-source-764361c18355af2544814f55
    resource: repo://.agents/skills/task-closeout/SKILL.md
  - id: openwiki-source-eeb2cc49563df1de1086bb7e
    resource: repo://openspec/specs/distill-routing/spec.md
generated: { by: "opencode", at: "2026-09-04T04:19:45.757Z" }
---

# learning-distill

**Folder:** `.agents/skills/learning-distill/` (`SKILL.md`, `references/CONTRACT.md`, frontmatter JSON Schemas, `bootstrap/` templates) · **Spec:** `openspec/specs/distill-routing/spec.md`

Converts raw task evidence into concise, durable repository knowledge **routed by kind**. Routing detail lives in [Task Lifecycle](../architecture/task-lifecycle.md) and the [Curation Contract](../concepts/knowledge-curation-contract.md); this page covers the role and write path.

## Routing

| Category | Destination | Bar to clear |
| --- | --- | --- |
| `ephemeral` | stays in bundle | one-off detail |
| `AGENTS guidance` | `.agents/AGENTS.md` | high confidence, broadly useful, likely to recur, concise, actionable |
| `playbook` | `.agents/playbooks/<name>.md` | durable multi-step procedure |
| `decision record` | `openwiki/decisions/<slug>.md` | rationale needing explanation later; `aksk_status` required |
| `troubleshooting record` | `openwiki/troubleshooting/<slug>.md` | recurring failure + fix |
| `descriptive lesson` | topical `openwiki/` page | stable fact or pattern worth keeping |

Descriptive lessons **never** go to `.agents/`; prescriptive rules **never** go to the wiki. No duplication with codified `openspec/specs/` SHALL requirements — cite the spec instead. Canonical identity is the bundle's `summary.json:task_id`, never the folder name.

## Write path

1. **Fail closed before any write** — peer binaries on PATH plus `AKSK:WIKI-CONTRACT` markers in `openwiki/INSTRUCTIONS.md`; on failure stop with exact remediation, no writes.
2. **Author directly** — runtime-loaded authoring guidance, frontmatter validated against the JSON Schemas; fix every issue before continuing.
3. **Refresh indexes deterministically** — `sync_wiki_indexes.mjs` keeps curated bodies byte-identical while rebuilding catalogs. Never invoke `openwiki --update`.
4. **Mark distilled** — `distilled: true` plus `distillation_status` on `summary.json`; bundle flags plus git history are the audit trail, with no separate log file.

## Related

- [Task Lifecycle](../architecture/task-lifecycle.md) — bundle shape, state machine, and classification bar.
- [Knowledge Curation Contract](../concepts/knowledge-curation-contract.md) — contract enforced at distill time.
- [task-closeout](task-closeout.md) — the capture procedure feeding this skill.
