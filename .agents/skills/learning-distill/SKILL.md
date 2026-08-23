---
name: learning-distill
description: Read a completed temporary session bundle from `.agents/sessions/` and distill durable repo knowledge - descriptive lessons become curated OpenWiki pages, prescriptive agent-behavior lessons stay in `.agents/`. Use only after task-closeout has produced a bundle and when the goal is to separate stable guidance from temporary task notes.
---

# Learning Distill

## Goal

Convert raw task evidence into concise, durable repo knowledge, routed by kind:

- **Descriptive** (facts, rationale, architecture, troubleshooting patterns, repo decisions) -> OKF pages under the curated wiki trees `openwiki/{decisions,troubleshooting}/` and `openwiki/`.
- **Prescriptive** (agent behavior rules, procedures) -> `.agents/AGENTS.md` or `.agents/playbooks/`.

Distillation never invokes `openwiki --update`; it authors pages directly and refreshes indexes deterministically.

## Prerequisites (fail closed)

Before writing any wiki output, verify all of the following; on failure stop without writing and print the remediation:

1. `openspec` / `openwiki` binaries on PATH:
   `node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki`
2. `openwiki/INSTRUCTIONS.md` exists AND carries the AKSK contract markers
   (`AKSK:WIKI-CONTRACT`). If missing or stub-only, run the attachment:
   `node .agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs`

## Inputs

- session bundle directory under `.agents/sessions/`
- `.agents/AGENTS.md`, `.agents/playbooks/`
- `openwiki/INSTRUCTIONS.md` (curation contract: curated trees and rules)
- existing curated pages under `openwiki/`

Read the canonical task/session identifier from the `task_id` field in the bundle's `summary.json`. Do not infer identity from the session folder name.

## Skill initialization (before first distillation)

Run once per target repo after this skill folder is present under `.agents/skills/learning-distill/`. Idempotent.

1. Resolve the repo root (the directory containing `.git/`).
2. Ensure `.agents/` exists.
3. Ensure `.agents/playbooks/` exists. If `.agents/playbooks/README.md` is missing, copy `bootstrap/playbooks/README.md` into place.
4. Ensure `.agents/sessions/` exists. If `.agents/sessions/README.md` is missing, copy `bootstrap/sessions/README.md` into place.
5. If `.agents/AGENTS.md` is missing, copy `bootstrap/AGENTS.md` into place. Never overwrite an existing one.
6. Ensure `.agents/.gitignore` contains exactly these two lines (merge if absent, do not remove unrelated rules):
   ```gitignore
   sessions/*
   !sessions/README.md
   ```
7. Run the aksk-bootstrap peer-tool check and wiki-contract attachment (see Prerequisites) so the wiki side of distillation is ready.

The kit's durable knowledge base lives in the wiki; this skill no longer seeds any `.agents/docs/` scaffold.

## Classification categories

Classify each candidate lesson as one of:

- ephemeral
- AGENTS guidance
- playbook
- decision record (curated wiki page)
- troubleshooting record (curated wiki page)
- descriptive lesson (any other curated wiki page)

## Distillation rules

- Preserve only stable, reusable knowledge. Reject low-confidence or one-off lessons.
- Do not copy task history into `.agents/AGENTS.md`.
- Decision records -> `openwiki/decisions/<slug>.md`; troubleshooting records -> `openwiki/troubleshooting/<slug>.md`; other descriptive lessons -> a topical page under `openwiki/`. The filename stem is the entry identity; keep it unique within its tree.
- Wiki page frontmatter follows OpenWiki OKF (`type`, `title`, `description`, `tags`, `timestamp`) plus AKSK extensions: `aksk_status` (`accepted`, `superseded`, or `provisional`) on decision pages; optional `aksk_superseded_by`; optional `aksk_depends_on` listing qualified slugs (`decisions/<slug>`, `troubleshooting/<slug>`).
- Cross-references between knowledge pages use relative Markdown links; superseded pages point at their successor via `aksk_superseded_by` plus a link.
- **No duplication with OpenSpec:** if a candidate decision restates or overlaps a requirement that already exists in `openspec/specs/`, do not create or extend a wiki page for it; cite the spec capability instead. Wiki pages record facts and rationale; requirements live only in OpenSpec.
- Curated-page preservation: treat trees marked curated in `INSTRUCTIONS.md` as preserve-and-link targets - update AKSK-authored content in place; link generated material to it rather than overwriting it; never drop `aksk_*` frontmatter fields.
- Use `.agents/playbooks/` for durable multi-step procedures; add to `.agents/AGENTS.md` only if the lesson is broad, stable, concise, and actionable.

## Finding session bundles (gitignore)

Per-task folders under `.agents/sessions/` are gitignored (only `README.md` is tracked). Many search tools skip ignored paths by default.

**Do not** conclude there are no bundles based on an ignore-aware search alone. Locate bundles with at least one ignore-blind method: filesystem listing (`ls`, `find`) or ripgrep with `--no-ignore-vcs`.

Then read each candidate's `summary.json`: treat `task_id` as canonical and filter using distillation state fields (`distilled`, `status`, `distillation_status`). Do not select a bundle from its folder name.

## Procedure

1. Locate and read the session bundle (see above); read `summary.json` for `task_id`.
2. Search related existing knowledge with grep over `openwiki/` (page bodies are plain Markdown) before comparing manually. For decision- or requirement-shaped candidates, also search `openspec/specs/` - a rule already codified as a SHALL requirement there must not be duplicated as a wiki page.
3. Compare candidates against existing knowledge; remove duplication.
4. Classify each lesson.
5. For wiki-bound lessons: load authoring guidance at runtime from the installed package, then author the page directly. With `NPM_ROOT="$(npm root -g)"`:

   Load upstream authoring guidance (use `init` for new pages, `update` for edits):

   ```bash
   NPM_ROOT="$(npm root -g)" node --input-type=module -e '
     import { pathToFileURL } from "node:url"; import path from "node:path";
     const m = await import(pathToFileURL(path.join(process.env.NPM_ROOT, "openwiki/dist/agent/prompt.js")).href);
     console.log(m.createSystemPrompt(process.argv[1] ?? "init"));
   ' init
   ```

   Write the page under the correct curated tree following that guidance and the OKF frontmatter rules above, then validate it:

   ```bash
   NPM_ROOT="$(npm root -g)" node --input-type=module -e '
     import { readFileSync } from "node:fs";
     import { pathToFileURL } from "node:url"; import path from "node:path";
     const fm = await import(pathToFileURL(path.join(process.env.NPM_ROOT, "openwiki/dist/okf/frontmatter.js")).href);
     const file = process.argv[1];
     console.log(JSON.stringify(fm.validateOkfFrontmatter(readFileSync(file, "utf8"), file)));
   ' openwiki/<path>.md
   ```

   Fix every reported issue before continuing.
6. Draft minimal updates to `.agents/AGENTS.md` or playbooks for prescriptive lessons.
7. Refresh wiki indexes deterministically (never via the CLI):
   ```bash
   node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
   ```
8. Mark the session bundle as distilled (its `summary.json` flags).

There is no activity log to append; accountability lives in the bundle flags and git history.

## Constraints

- Do not modify source code outside the knowledge layer.
- Do not invent new repo rules unsupported by task evidence.
- Do not expand `.agents/AGENTS.md` with rationale or narrative.
- Do not copy secrets, private identifiers, personal data, or long raw output into durable docs or wiki pages.
- Never edit OpenWiki-owned files: `index.md` files, run metadata (`.last-update.json`), or anything outside the curated trees except through deterministic index sync.
- Prefer small edits over large rewrites.

## AGENTS criteria

A lesson belongs in `.agents/AGENTS.md` only if it is high confidence, broadly useful in this repo, likely to recur, concise, and actionable.
