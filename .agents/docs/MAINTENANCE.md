# Template .agents Maintenance Rules

## Purpose

This file belongs in `.agents/docs/`, alongside `.agents/AGENTS.md`.

## Knowledge model

- Session bundles under `.agents/sessions/` are raw evidence.
- Files in `.agents/` are synthesized durable knowledge.
- Durable knowledge should be incremental, concise, and reviewable.
- Architectural decisions live under `.agents/docs/repo-decisions/` (one file per decision plus `index.md`). Troubleshooting patterns live under `.agents/docs/troubleshooting/` (one file per pattern plus `index.md`). Each **entry** file (every `*.md` except `index.md` in those folders) carries YAML frontmatter so tools can parse metadata without reading the body.

## Entry shape

When adding a new markdown file under `repo-decisions/` or `troubleshooting/`, follow the frontmatter and body headings used by existing entries in that folder, including the [Frontmatter contract](#frontmatter-contract-durable-entries) below. During **knowledge-lint**, verify that contract by inspection (duplicate `id`, missing keys, scalar `tags` instead of a list, `status` only on decisions, and so on). Automated enforcement may be added later as maintainer-only tooling.

### Frontmatter contract (durable entries)

Applies to every `*.md` file under `repo-decisions/` and `troubleshooting/` **except** each folder’s `index.md`.

**Required keys (all entries):**

- `id`: stable slug, **must match** the filename without `.md`, lowercase `[a-z0-9_-]`, **globally unique** across both `repo-decisions/` and `troubleshooting/`.
- `title`: short human title (quoted if it contains colons).
- `last_updated`: ISO calendar date `YYYY-MM-DD`.
- `description`: one or two sentences summarizing the entry for query and index output (machine-oriented).
- `tags`: non-empty YAML **list** of topic labels (`auth`, `build`, `testing`, `release`, `docs`, `sessions`, `skills`, and so on). Each tag is lowercase `[a-z0-9_-]` only—**not** a comma-separated scalar string.

**Required keys (`repo-decisions/` only):**

- `status`: lifecycle for the decision record: `accepted`, `superseded`, or `provisional` (lowercase). Prefer aligning the body’s status section with this value.

**Optional keys (any entry):**

- `depends_on`: YAML **list** of other durable **entry ids** (the `id` frontmatter value on any `repo-decisions/` or `troubleshooting/` entry file, regardless of folder). Use this when there is a hard dependency or ordering readers should follow. Omit the key when there is no explicit graph edge.

**Do not** put `status` on troubleshooting entries; lifecycle applies to decision records.

### Linking rules (for indexes, maps, and prose)

- Link to another durable entry using a **relative** Markdown link to that file, for example `[Regenerate example](regenerate-example-when-portable-kit-changes.md)` from a file in the same folder.
- Prefer **sibling** paths (`other-id.md`) or explicit relative paths (`../MAINTENANCE.md`) so links stay stable when the repo is checked out on different machines.
- Avoid bare URLs as the only pointer when a durable repo file exists; URLs are fine for external references.

### Example (`repo-decisions/`)

```yaml
---
id: example-decision-slug
title: "Example decision title"
last_updated: 2026-04-19
description: >
  One or two sentences explaining what the reader gets from this file
  and how it relates to the kit.
tags: [architecture, agents]
status: accepted
depends_on: [single-tree-architecture-agents]
---
```

### Example (`troubleshooting/`)

```yaml
---
id: example-troubleshooting-slug
title: "Example troubleshooting title"
last_updated: 2026-04-19
description: >
  One or two sentences on the failure mode and who should read this entry.
tags: [git, markdown, tooling]
---
```

### Compile backend (Phase 1 checkpoint, Note A)

**Decision (this repo):** document the durable-entry metadata contract first; keep any future `knowledge-compile` step on **thin local maintainer scripts** when implemented. Revisit [`markdowndb` / `mddb`](https://github.com/datopian/markdowndb) as an internal index adapter when that compile step exists, as long as markdown under `.agents/` remains the source of truth.

**Repository decisions** typically use body sections: `### Decision`, `### Status` (human-readable; mirror `status` in frontmatter), `### Context`, `### Rationale`, `### Consequences`.

**Troubleshooting** typically uses: `#### Symptom`, `#### Likely causes`, `#### Fix`, `#### Validation`.

## File roles

### `.agents/AGENTS.md`

Compact, high-signal operational guidance.

### `.agents/docs/repo-decisions/`

Durable rationale, tradeoffs, and architectural choices. Each decision is a markdown file; [index.md](repo-decisions/index.md) lists them.

### `.agents/docs/troubleshooting/`

Recurring issue patterns, causes, fixes, and validations. Each pattern is a markdown file; [index.md](troubleshooting/index.md) lists them.

### `.agents/playbooks/`

Durable multi-step procedures.

### `.agents/docs/index.md`

Catalog of durable knowledge assets.

### `.agents/docs/log.md`

Append-only maintenance log.

## Distillation policy

A lesson belongs in `.agents/AGENTS.md` only if it is:

- stable
- concise
- broadly applicable
- actionable
- high confidence

## Task bundle policy

Task bundles live in `.agents/sessions/` and are temporary.

After closeout, treat them as immutable except for status fields in `summary.json`.

Keep bundle subfolders under `.agents/sessions/` gitignored. The kit may track a single `.agents/sessions/README.md` for human-facing guidance while every per-task bundle folder stays local-only.

Use one session folder per task-closeout bundle and name folders with a sortable pattern such as `YYYYMMDD-HHMMSS-short-topic`.

## Logging policy

**Who may edit:** In general, do not append to `.agents/docs/log.md` unless the user explicitly instructs you to, or you are executing the **learning-distill** workflow after distilling a session bundle. Periodic **knowledge-lint** passes and other routine edits do **not** get a log row by default.

Each successful **learning-distill** run should append a concise entry to `.agents/docs/log.md`.

Treat `.agents/docs/log.md` as a **minimal maintenance audit trail**, not a narrative summary.

Include only what future maintainers need to understand that a distillation happened:

- date
- task id
- high-level outcome
- files updated
- short accepted/rejected lesson counts or labels
- one brief maintenance note if needed

Do **not** include:

- secrets, tokens, credentials, or auth material
- personal data, customer data, or private business details
- private URLs, hostnames, inbox contents, or externally identifying strings unless they are already intended to be public repo knowledge
- long copied command output, stack traces, transcripts, or raw error text
- narrative task history better left in the session bundle

## Lint policy

Periodically review `.agents/` for:

- duplication
- contradictions
- stale entries
- oversized `.agents/AGENTS.md` sections
- missing index coverage
- misplaced content

### Mechanical hygiene (after bulk edits or migrations)

Automated **knowledge-lint** runs are still human-guided; they do not prove prose is sensible. After any wide find-and-replace across markdown:

- Re-check durable entry frontmatter against [Frontmatter contract](#frontmatter-contract-durable-entries) (required keys, list-shaped `tags`, `status` only on decisions, no duplicate `id` across both folders).
- Re-read a sample of `repo-decisions/` and `troubleshooting/` entries for broken sentences or doubled kit path segments (the `.agents` directory name repeated in one filesystem path).
- Search for doubled `.agents/` path segments (for example the substring `.agents/.agents` in paths under `.agents/`, `README.md`, `INSTALL.md`, and `docs/`) before publishing; hits usually mean a bad global replace.
- Prefer scoped replacements (limit to `.agents/docs/`, or a single file), whole-word or whole-path patterns, and commit-sized diffs instead of repo-wide blind replace.
