---
type: concept
title: AGENTS.md Zoning and Baseline
description: How root AGENTS.md is split into marker-delimited zones, which zones are shipped today, and the proposal-only FerroxLabs baseline that would add a vendored behavioral contract with isolated refresh and combine semantics.
tags: [agents-md, baseline, zoning, markers, aksk-bootstrap]
verified:
  - by: openwiki/0.4.3
    at: 2026-08-29T04:36:52.163Z
sources:
  - id: openwiki-source-0294ec7c02cfa2beeca87331
    resource: repo://.agents/skills/aksk-bootstrap/references/routing-note-template.md
  - id: openwiki-source-5398a69cb2cf8d556809da57
    resource: repo://.agents/skills/aksk-bootstrap/scripts/attach_section.mjs
  - id: openwiki-source-dc8872a5e7d386c22ea2f135
    resource: repo://.agents/skills/aksk-bootstrap/SKILL.md
  - id: openwiki-source-8037e2358a2c4f9b2c722a11
    resource: repo://AGENTS.md
  - id: openwiki-source-b6e79252193061d60ba3d3fd
    resource: repo://openspec/changes/add-agents-md-bootstrap/design.md
  - id: openwiki-source-d41529889f3599c07d9ebea6
    resource: repo://openspec/changes/add-agents-md-bootstrap/proposal.md
  - id: openwiki-source-36b26de7796cfb15924f3fb9
    resource: repo://openspec/changes/add-agents-md-bootstrap/specs/agents-md-bootstrap/spec.md
  - id: openwiki-source-01e5ef396f81ed8bdfc16f89
    resource: repo://openspec/changes/add-agents-md-bootstrap/tasks.md
generated: { by: "openwiki/0.4.3", at: "2026-08-29T04:36:52.163Z" }
---

# AGENTS.md Zoning and Baseline

Root `AGENTS.md` is a stacked, marker-delimited file where each content family has one writer, one marker pair, and one integrity check. Today the shipped file carries two families — OpenWiki and AKSK. A proposal would add a third family at the top — the FerroxLabs behavioral baseline — without letting any writer rewrite another zone.

> **Proposal-only scope:** The FerroxLabs baseline, its vendored template, `init_agents_md.mjs`, and `refresh_agents_baseline.mjs` are described in `openspec/changes/add-agents-md-bootstrap/**` and are **not yet in `openspec/specs/**`**. The rest of this page labels that material explicitly and does not present it as shipped.

## Zone stack and order

Shipped state (observed in the repository) contains two families. The proposal adds a baseline family at the top, yielding three families in a fully bootstrapped file:

<!-- openwiki: mermaid parse failed and this diagram was converted to a text fence so it does not break rendering. Fix the diagram source and restore the mermaid fence. Parser error: Heuristic: an unescaped angle bracket inside a label breaks rendering; rephrase the label. -->
```text
flowchart TB
  B["Zone 1 - FerroxLabs baseline - Proposal-only<br>AKSK AGENTS-BASELINE markers<br>Owned by init_agents_md.mjs and refresh_agents_baseline.mjs<br>Vendored template plus provenance header"]
  O["Zone 2 - OpenWiki block - Shipped<br>OPENWIKI START END markers<br>Owned by OpenWiki tooling<br>Generated evidence index"]
  R["Zone 3a - AKSK Routing - Shipped<br>AKSK ROUTING markers<br>Thin pointers into .agents and openwiki"]
  L["Zone 3b - AKSK Lifecycle - Shipped<br>AKSK LIFECYCLE markers<br>Self-improvement loop mandate"]

  B --> O --> R --> L
```

*Stacked zone order for a fully bootstrapped AGENTS.md: proposal-only baseline on top, then shipped OpenWiki and AKSK families.*

| Zone | Markers | Owner script / tool | Status | Content |
| --- | --- | --- | --- | --- |
| FerroxLabs behavioral baseline | `<!-- AKSK:AGENTS-BASELINE:BEGIN -->` / `<!-- AKSK:AGENTS-BASELINE:END -->` | `init_agents_md.mjs` (seed) + `refresh_agents_baseline.mjs` (update) | **Proposal-only** | ~200-line operating contract: anti-sycophancy, verification loops, surgical diffs, sections 0–9 |
| OpenWiki | `<!-- OPENWIKI:START -->` / `<!-- OPENWIKI:END -->` | OpenWiki tooling (`openwiki --update` / wiki attachment) | Shipped | Generated evidence index — optional just-in-time context, not required startup reading |
| AKSK Routing | `<!-- AKSK:ROUTING:BEGIN -->` / `<!-- AKSK:ROUTING:END -->` | `attach_section.mjs` with `routing-note-template.md` | Shipped | Discovery pointers: read `.agents/AGENTS.md`, use `openwiki/index.md`, search durable knowledge first |
| AKSK Lifecycle | `<!-- AKSK:LIFECYCLE:BEGIN -->` / `<!-- AKSK:LIFECYCLE:END -->` | `attach_section.mjs` with `lifecycle-template.md` | Shipped | Self-improvement loop: analyze → closeout → distill → prune |

Ordering matters for fresh files. The proposal defines the order baseline → OpenWiki → AKSK; in combine-merge mode the result should be reordered to this sequence per the generated `COMBINE.md` brief. The current live `AGENTS.md` follows OpenWiki → AKSK order today — the baseline markers are not yet present — but the proposal preserves that relative order and inserts the baseline above OpenWiki so no existing zone moves.

Markers follow the kit convention: each template carries its own `<!-- AKSK:*:BEGIN/END -->` pair and scripts read markers from the template at runtime, never hard-code them. That makes marker renames a template-only change and lets `docs-lint` treat each zone as an independent integrity unit.

## Vendored baseline and provenance header — Proposal-only

> This section describes `openspec/changes/add-agents-md-bootstrap/**` (not yet in `openspec/specs/**`).

The proposal vendors the upstream FerroxLabs `AGENTS.md` (`https://raw.githubusercontent.com/FerroxLabs/agents-md/main/AGENTS.md`) offline at

```
.agents/skills/aksk-bootstrap/references/agents-md-baseline-template.md
```

whose body is the upstream content wrapped in the `AKSK:AGENTS-BASELINE` block. Inside that block, the first lines are a provenance header containing upstream source URL, capture date, MIT license notice, and a pointer to the refresh command. Seeding would never touch the network; file creation copies the vendored block verbatim including the header. The `AKSK:` prefix is intentional — kit scripts own every block they write, and provenance inside the header identifies the actual upstream origin even if the source changes vendor later.

In the current repository this template file does not yet exist — `references/` contains `routing-note-template.md`, `lifecycle-template.md`, and `wiki-contract-template.md` only — so the offline-safe seeding guarantee remains a proposed invariant, not an observed one.

This satisfies the kit's never-installs / offline-safe invariant the proposal targets: a fresh repo on an airplane would get the same baseline as CI.

## Script ownership

### `attach_section.mjs` — routing and lifecycle owner — Shipped

```bash
node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs [repo-root] [target-file-name] [template-name]
```

The existing N-template mechanism: markers are parsed from `references/routing-note-template.md` (`AKSK:ROUTING`) or `references/lifecycle-template.md` (`AKSK:LIFECYCLE`) via `markersOf()`, which extracts the `AKSK:*` BEGIN/END pair with a regex and normalizes whitespace. Behavior is append-only outside markers:

- Existing content is never replaced or removed; sections attach below it.
- Idempotent and self-updating: re-running is a no-op when `match.trim() === section.trim()`, otherwise only the marked block is refreshed in place via `refresh()` with a dot-all regex `BEGIN.*?END`.
- A missing target file is created containing only the attached section — before the baseline work, this made `attach_section.mjs` the owner of record for empty router files.
- Unknown template names exit 2 with `error: unknown template`.

The implementation reads the template file, derives markers at runtime, checks whether the target is a directory (exit 2), and either creates, refreshes, or appends. No network access, no mutation outside the marker pair.

### `init_agents_md.mjs` — baseline owner — Proposal-only

> This section describes `openspec/changes/add-agents-md-bootstrap/**` (not yet in `openspec/specs/**`).

One deterministic command for seeding, upgrading, or combining `AGENTS.md`:

```bash
node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs [repo-root]
node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs [repo-root] --replace
node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs [repo-root] --combine
```

Proposed behavior contract:

- **Missing file:** creates `AGENTS.md` containing the marked baseline section (markers read from the template) and exits 0. No network access.
- **Idempotent re-run:** if the marked baseline section already matches the vendored template (comparison normalizes trailing whitespace and newline-at-EOF), reports success as a no-op without rewriting.
- **Existing file, no flag:** does not write anything. Exits 2 naming the conflict and printing the exact question the agent must relay to the user — *Replace AGENTS.md with the FerroxLabs baseline, or combine both using the LLM?* — plus the two flags that encode each answer. No interactive stdin; fail-fast with remediation, matching `check_peer_tools.mjs` conventions.
- **`--replace`:** overwrites `AGENTS.md` with the marked baseline section including the provenance header.
- **`--combine`:** never modifies the original. Stages the current `AGENTS.md`, the vendored baseline, and a generated `COMBINE.md` merge brief side-by-side under `.agents/sessions/agents-md-combine/<timestamp>/` and prints instructions for the agent to produce the merged file with the LLM. The brief constrains the merge: preserve project-specific learnings and filled-in context, prefer baseline structure for sections 0–9, keep all `AKSK:*` and `OPENWIKI` marker blocks verbatim.

<!-- openwiki: mermaid parse failed and this diagram was converted to a text fence so it does not break rendering. Fix the diagram source and restore the mermaid fence. Parser error: Heuristic: an unescaped angle bracket inside a label breaks rendering; rephrase the label. -->
```text
flowchart TD
  A["init_agents_md.mjs - Proposal-only"] --> B{"root AGENTS.md exists?"}
  B -- no --> C["attach marked baseline incl provenance header"]
  C --> Z["exit 0"]
  B -- yes --> D{"marked section matches template?"}
  D -- yes --> Z
  D -- no --> E["exit 2 - name conflict<br>print replace vs combine options"]
  E --> F["--replace"]
  E --> G["--combine"]
  F --> H["overwrite with marked baseline"]
  G --> I["stage existing plus baseline plus COMBINE brief<br>under .agents/sessions - print instructions"]
  H --> J["openwiki block attaches then attach_section adds ROUTING and LIFECYCLE below"]
  I --> J
```

*Proposed conflict-resolution flow for `init_agents_md.mjs`: fail-fast exit 2 with flags, never silent overwrite.*

`init_agents_md.mjs` is intentionally separate from `attach_section.mjs`. The latter has an append-only invariant — existing content is never replaced — while seeding introduces replace/combine semantics that would muddy that contract.

### `refresh_agents_baseline.mjs` — baseline updater — Proposal-only

> This section describes `openspec/changes/add-agents-md-bootstrap/**` (not yet in `openspec/specs/**`).

```bash
node .agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs
```

Opt-in updater, never run implicitly:

1. Fetches upstream to a temp file.
2. Validates response is non-empty and contains expected section anchors.
3. Swaps only the content between `AKSK:AGENTS-BASELINE` markers in the vendored template, updates the provenance header date, and leaves all other zones in the consumer's `AGENTS.md` byte-identical.
4. On offline or validation failure, exits non-zero with remediation and leaves the previously vendored baseline intact and usable.

### OpenWiki — middle zone owner — Shipped

The `<!-- OPENWIKI:START -->` / `<!-- OPENWIKI:END -->` block is owned by OpenWiki, not by AKSK. It is the generated catalog that `openwiki --update` or `sync_wiki_indexes.mjs` refreshes. Agents treat it as generated evidence, not durable policy. The block in `AGENTS.md` explicitly notes *Do not hand-edit generated OpenWiki pages unless explicitly asked; prefer updating source code/docs and letting OpenWiki regenerate.*

### Composition order — Proposal-only for the full stack

The supported bootstrap sequence the proposal defines is deterministic:

1. `init_agents_md.mjs` — seeds baseline (or resolves conflict). **Proposal-only.**
2. OpenWiki attachment — inserts its block below baseline. Shipped mechanism.
3. `attach_section.mjs` routing, then lifecycle — append below OpenWiki. Shipped mechanism.

Every script is idempotent, so re-running the full sequence after an upstream template refresh only touches the zone whose template changed. Today steps 2–3 are the shipped path; step 1 would become the prefix once the proposal lands.

## Why the behavioral contract lives in root while repo knowledge routes away

The decision *Use the Routing Pattern for agentic tool bootstrap files* states that root router files should stay thin and route to `.agents/` to avoid forking durable guidance. That invariant targets *repo knowledge* — project-specific decisions, troubleshooting, and playbooks that belong under `.agents/` and `openwiki/`.

The proposal argues the FerroxLabs baseline is different: it is a *behavioral operating contract* — how the agent works (no flattery, disagree when wrong, verify before claiming done, surgical diffs, context hygiene). It is not repo knowledge and therefore does not fork it. The routing and lifecycle blocks would still attach below it, so the repo-specific pointers that route to `.agents/AGENTS.md`, `openwiki/index.md`, and `.agents/playbooks/` remain thin and authoritative. Design D5 records this as a scoped amendment to the routing-pattern decision rather than a new contradictory decision: behavioral baseline in root is the exception; durable repo guidance remains routed. This reconciliation is proposal-only until the decision page is amended and the spec is promoted to `openspec/specs/**`.

## Invariants and failure semantics

- **Marker integrity is load-bearing.** Each zone is validated independently. Damaging one zone's markers is reported for that family only; fixing it never rewrites another zone. Shipped for `AKSK:ROUTING`/`AKSK:LIFECYCLE` and `OPENWIKI`; the proposal extends the same treatment to `AKSK:AGENTS-BASELINE` with provenance-URL presence.
- **Zone isolation.** Refreshing a zone swaps only content between its markers. Other zones remain byte-identical. Shipped for routing/lifecycle via `refresh()`; the proposal extends the guarantee to baseline refresh and combine staging.
- **No silent overwrite — Proposal-only.** An existing `AGENTS.md` would block seeding until explicitly resolved with `--replace` or `--combine`. The original is recoverable from git in any case, and `--replace` requires the explicit flag that only exists after the conflict message was shown. Today `attach_section.mjs` already upholds a weaker form: it never replaces content outside markers.
- **LLM combine is staged, not applied — Proposal-only.** The script never modifies the original during combine; the agent produces the merged file and presents the diff to the user before writing, per the upstream install guidance. The `COMBINE.md` brief instructs the LLM to keep markers verbatim and preserve section 10/11 user edits.
- **Provenance survives seeding — Proposal-only.** Every seeded file carries the header, so drift is visible without network access.
- **Fail-fast, offline-safe.** Missing-file and unknown-template cases exit 2 with remediation; the proposed offline refresh would exit non-zero without corrupting the vendored baseline; trailing-whitespace normalization prevents false-negative idempotency from formatting-only diffs.
- **Marker ownership is strict.** Content between `AKSK:*` markers is owned by the writer that created it; hand-editing is corrected by rerunning the owning script. `OPENWIKI:START/END` blocks are never hand-edited.

## Operations and validation

### Shipped verification

Current verification exercises the shipped path:

- `attach_section.mjs` idempotency: attaching the same template twice no-ops; changing the template refreshes only the marked block.
- Missing target creation: invoking with a non-existent `AGENTS.md` creates a file containing only the requested section.
- Unknown template: exit 2 with remediation.
- Lint pass: wiring checks for `AKSK:ROUTING`/`AKSK:LIFECYCLE` remain green.

### Proposed bootstrap verification (tasks 6.1–6.5) — Proposal-only

> The change's verification matrix in `openspec/changes/add-agents-md-bootstrap/tasks.md` maps to spec scenarios in `specs/agents-md-bootstrap/spec.md`; not yet in `openspec/specs/**`.

- **Fresh repo:** temp dir with no `AGENTS.md` → run `init_agents_md.mjs` → file created with marked baseline + header → re-run → no-op → run OpenWiki attach then `attach_section.mjs` → all three zones present, distinct, ordered baseline → OpenWiki → AKSK.
- **Existing file:** temp dir with custom `AGENTS.md` → run init → exit 2, file untouched → `--replace` → replaced with marked baseline → restore original, `--combine` → staged bundle exists under `.agents/sessions/agents-md-combine/<timestamp>/`, original untouched.
- **Zone isolation:** modify content outside baseline markers, re-run init → only baseline zone considered → damage one zone's markers → `docs-lint` reports that family.
- **Lint pass:** `bash scripts/check-agents-structure.sh .agents` and the `docs-lint` skill pass; no regressions in existing `AKSK:ROUTING`/`AKSK:LIFECYCLE` wiring checks.

### Extended wiring checks — Proposal-only extension

`docs-lint` today integrity-checks the shipped families. The proposal extends it to all three:

- `AKSK:AGENTS-BASELINE` — exactly one block, markers intact, provenance header with source URL present. **Proposal-only.**
- `OPENWIKI:START/END` — presence only, never hand-edited. Shipped.
- `AKSK:ROUTING` / `AKSK:LIFECYCLE` — exactly one of each, targets named inside exist, stale blocks refreshed via `attach_section.mjs`. Shipped.

A `docs-lint` run that reports a missing or damaged block prints the refresh command for that family; index drift in `openwiki/` is fixed by rerunning `sync_wiki_indexes.mjs`, not by hand-editing.

### Staleness and hygiene

The proposed vendored baseline capture date in the provenance header makes drift observable. A capture older than six months would be surfaced as informational advice, not a blocking failure, so CI does not break on age alone. Byte-compare idempotency normalizes trailing whitespace and newline-at-EOF to avoid churn from formatters like `remark`. This staleness advice is proposal-only; no such date exists in the shipped `references/` templates.

## Related

- Architecture overview — zone stack from root router to portable prescriptive to curated descriptive.
- `use-the-routing-pattern-for-agentic-tool-bootstrap-files` — thin-router invariant and its proposed scoped baseline exception.
- `aksk-bootstrap` skill — contract attachment, managed-section attachment, and peer-tool verification entrypoints.
- `docs-lint` skill — wiring checks that fail the pass versus content checks that report.
