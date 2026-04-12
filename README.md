# Agent Knowledge Starter Kit v1.1

A shareable, tool-agnostic starter kit for maintaining a compiled repo knowledge layer for coding agents.

This pattern separates three concerns:

1. **Temporary session outputs** live inside the repo under `.agents/sessions/`, with one folder per task-closeout bundle.
2. **Durable repo knowledge** lives under `.agents/`.
3. **Agent roles and skills** live in that same `.agents/` tree and describe how coding, learning, and maintenance workflows run.

In this repository, `scaffold/` is the template for that tree. Copy everything under `scaffold/` into `.agents/` at the root of a project that adopts the kit.

The goal is to avoid bloating a single `.agents/AGENTS.md` with temporary notes, while still preserving useful lessons from completed work.

## Disclaimer

This repository and the kit under `scaffold/` were produced with the help of AI tools. Everything here is **as-is**; **use at your own risk**. Validate instructions, commands, and policies for your environment before relying on them.

## Quick start

### For humans

You can install the kit manually or ask an agent to do it.

Manual install:

1. Copy `scaffold/` into your project as `.agents/`.
2. If the project already has `.agents/`, merge instead of replacing; preserve repo-specific `rules/`, `playbooks/`, and `skills/`.
3. Edit `.agents/AGENTS.md` with real build, test, and project conventions.
4. Wire `.agents/skills/*/SKILL.md` and `.agents/agents/*.md` into your editor or agent product.

Agent-assisted install:

```text
Install the Agent Knowledge Starter Kit into this repo. Follow INSTALL.md from the starter kit. Preserve any existing repo-specific `.agents/rules/`, `.agents/playbooks/`, and `.agents/skills/`; merge missing kit pieces instead of replacing `.agents/` wholesale. After installing, summarize changed files and any manual tool-integration steps I still need to do.
```

### For agents

Follow [INSTALL.md](INSTALL.md). Treat `scaffold/` as the source tree that becomes `.agents/` in the target repo. If `.agents/` already exists, merge conservatively and preserve existing repo-specific knowledge.

## Adopting into an existing `.agents/`

Do not replace an existing `.agents/` tree wholesale unless it is already disposable template content. Preserve repo-specific knowledge first, especially existing `rules/`, `playbooks/`, and `skills/`, then merge in the missing starter-kit pieces.

Use this checklist:

1. Inventory existing `.agents/` content and mark domain-specific files to keep.
2. Add missing starter-kit directories from `scaffold/`: `docs/`, `agents/`, and `sessions/`.
3. Add the portable maintenance skills if they are not already present: `task-closeout`, `learning-distill`, and `knowledge-lint`.
4. Merge `.agents/AGENTS.md` by hand so stable repo guidance stays concise and temporary history stays out.
5. Confirm session ignore rules. Prefer the kit default in `.agents/.gitignore`: `sessions/*` and `!sessions/README.md`. Use repo-root `.gitignore` patterns only as an alternative: `.agents/sessions/*` and `!.agents/sessions/README.md`.
6. Record the adoption in `.agents/docs/log.md` and any durable rationale in `.agents/docs/repo-decisions.md`.
7. Update `.agents/docs/index.md` so pre-existing repo-specific `rules/`, `playbooks/`, and `skills/` are discoverable.

If both root `AGENTS.md` and `.agents/AGENTS.md` exist, treat root `AGENTS.md` as the agent entrypoint for that checkout and `.agents/AGENTS.md` as the portable knowledge-layer file. Keep one source of truth for each instruction: root `AGENTS.md` should point agents into `.agents/` or contain only bootstrap guidance, while durable repo conventions live in `.agents/AGENTS.md`.

## Tool integration

This kit ships **content** (markdown, layout, and conventions), not a single vendor-specific config. You still need to register `.agents/skills/*/SKILL.md` and `.agents/agents/*.md` (or equivalent) however your stack expects. Keep the on-disk layout under `.agents/` stable so the knowledge layer stays portable when you change tools.

## Integrations

Tool-specific integration guides live in [`docs/integrations/`](docs/integrations/).

Currently available:

- [Hermes](docs/integrations/hermes.md)
- [Cursor](docs/integrations/cursor.md)
- [Codex](docs/integrations/codex.md)

---

## Why this exists

Most coding agents can edit code well enough, but repo learning often degrades into one of two bad outcomes:

- useful lessons are lost after the session ends
- too much low-quality context gets stuffed into instruction files

This starter kit introduces a small maintenance system:

- a **coding agent** finishes work and emits a structured handoff packet
- a **learning agent** distills only the durable parts into `.agents/`
- an optional **lint agent** keeps the knowledge layer coherent over time

This is intentionally generic. It should work with any system that supports user-defined agents or personas, reusable skill or instruction files, full repo file access, and a **gitignored** `.agents/sessions/` area for temporary task artifacts.

---

## Design principles

### 1. Raw evidence is not the same as durable knowledge

Task packets are evidence. They capture what happened during one task.

The `.agents/` directory is a compiled knowledge layer. It should contain only information that is stable, reusable, and likely to help future agents.

### 2. `.agents/AGENTS.md` should stay small

`.agents/AGENTS.md` is for concise, repo-wide guidance.

It should not contain:

- session history
- long rationale
- failed experiments
- speculative notes
- one-off debugging details

Those belong in `.agents/sessions/` bundles, `.agents/docs/troubleshooting.md`, `.agents/playbooks/`, or `.agents/docs/repo-decisions.md`.

### 3. Distillation should be a separate role

The same agent that is busy implementing code is often not the best judge of what should become durable repo guidance.

A separate learning pass creates better boundaries:

- coding agent handles execution
- learning agent handles classification and compression
- lint agent handles cleanup and consistency

### 4. Knowledge should be maintained incrementally

Future agents should consult the compiled `.agents/` layer first, not rediscover lessons from raw task history every time.

---

## Repository layout

```text
starter repo
.
├── scaffold/
│   ├── AGENTS.md
│   ├── docs/
│   │   ├── MAINTENANCE.md
│   │   ├── index.md
│   │   ├── log.md
│   │   ├── repo-decisions.md
│   │   └── troubleshooting.md
│   ├── playbooks/
│   │   └── README.md
│   ├── agents/
│   │   ├── coding-agent.md
│   │   ├── learning-agent.md
│   │   └── lint-agent.md
│   ├── sessions/
│   │   └── README.md
│   └── skills/
│       ├── task-closeout/
│       │   ├── SKILL.md
│       │   └── example/
│       │       └── task-bundle/
│       │           ├── summary.json
│       │           ├── active-task.md
│       │           ├── learning-candidate.md
│       │           ├── changed-files.txt
│       │           └── validation.txt
│       ├── learning-distill/
│       │   └── SKILL.md
│       └── knowledge-lint/
│           └── SKILL.md

consumer repo after adoption
.
└── .agents/
    ├── AGENTS.md
    ├── docs/
    │   ├── MAINTENANCE.md
    │   ├── index.md
    │   ├── log.md
    │   ├── repo-decisions.md
    │   └── troubleshooting.md
    ├── playbooks/
    │   └── README.md
    ├── agents/
    │   ├── coding-agent.md
    │   ├── learning-agent.md
    │   └── lint-agent.md
    ├── sessions/
    │   └── README.md
    └── skills/
        ├── task-closeout/
        │   ├── SKILL.md
        │   └── example/
        │       └── task-bundle/
        │           ├── summary.json
        │           ├── active-task.md
        │           ├── learning-candidate.md
        │           ├── changed-files.txt
        │           └── validation.txt
        ├── learning-distill/
        │   └── SKILL.md
        └── knowledge-lint/
            └── SKILL.md
```

---

## Scaffold vs consumer layout

- `scaffold/` is the **published kit**: treat it as if it were already rooted at `.agents/` in a consumer project. It should not describe this GitHub repo’s layout or maintainer-only workflows.
- This starter repository may also keep an optional `.agents/` for dogfood; that tree **does not** have to stay identical to `scaffold/` (maintainer-specific notes may live only under `.agents/` here).
- After adoption elsewhere, the consumer’s `.agents/` is the contract; adjust only wiring in your tool, not the overall layout, when possible.

## In-repo session output location

Store temporary task and session outputs inside the repo under `.agents/sessions/`.

Recommended default:

```text
.agents/sessions/YYYYMMDD-HHMMSS-short-topic/
```

Each session folder contains one task-closeout bundle, including:

- `summary.json`
- `active-task.md`
- `learning-candidate.md`
- `changed-files.txt`
- `validation.txt`

These files are temporary working-memory artifacts that stay inside the repo so they are easy to inspect, reuse, and distill across editor sessions.

Keep `.agents/sessions/` gitignored so bundles stay local and do not become committed durable knowledge.

Recommended naming guidance:

- use one folder per task-closeout bundle
- use a deterministic, sortable format such as `YYYYMMDD-HHMMSS-short-topic`
- keep the trailing slug short, lowercase, and specific to the task
- if multiple bundles start in the same second, extend the slug rather than changing the timestamp format

Example:

```text
.agents/sessions/20260411-122921-auth-timeout-fix/
```

---

## Agent roles

### Coding agent

Responsibilities:

- implement code changes
- run tests and validation
- capture a session bundle at meaningful stopping points
- optionally delegate to the learning agent

### Learning agent

Responsibilities:

- read a completed session bundle from `.agents/sessions/`
- classify candidate lessons
- update the correct durable file under `.agents/`
- keep `.agents/AGENTS.md` concise
- record a maintenance log entry

### Lint agent

Responsibilities:

- find duplication and contradictions in `.agents/`
- identify stale or oversized guidance
- recommend or apply minimal cleanup

---

## Durable knowledge files

### `.agents/AGENTS.md`

Compact, high-signal instructions for future coding agents.

Put here:

- build and test commands
- coding conventions
- architecture constraints
- recurring high-confidence pitfalls
- short checklists

### `.agents/docs/repo-decisions.md`

Durable rationale and architectural choices.

Put here:

- why a convention exists
- tradeoffs and exceptions
- decisions that may need explanation later

### `.agents/docs/troubleshooting.md`

Recurring failure and recovery patterns.

Put here:

- symptoms
- likely causes
- known fixes
- validation steps

### `.agents/playbooks/`

Durable multi-step procedures (sibling of `.agents/docs/`, not inside `.agents/docs/`).

Put here:

- release flows
- special build or deploy steps
- recurring maintenance procedures
- workflows that require multiple ordered steps

### `.agents/docs/index.md`

Catalog of knowledge assets and when to consult them.

### `.agents/docs/log.md`

Append-only record of maintenance actions.

### `.agents/docs/MAINTENANCE.md`

The schema and policy document for the knowledge layer.

---

## Task lifecycle

1. A coding task begins.
2. The coding agent creates or adopts a `repo_id` and `task_id`.
3. At completion, blockage, or abandonment, the coding agent runs `task-closeout`.
4. A structured task-closeout bundle is written to `.agents/sessions/<session-folder>/`.
5. The learning agent runs `learning-distill` on that session bundle.
6. Durable lessons are written into `.agents/`.
7. The learning agent appends a summary to `.agents/docs/log.md`.
8. Periodically, the lint agent runs `knowledge-lint`.

---

## Distillation rules

A candidate lesson belongs in `.agents/AGENTS.md` only if it is:

- high confidence
- broadly useful in this repo
- concise
- actionable
- likely to recur

Otherwise it probably belongs in:

- `.agents/docs/repo-decisions.md`
- `.agents/docs/troubleshooting.md`
- `.agents/playbooks/`
- nowhere at all

---

## Sharing this starter kit

This kit is structured so it can live as a GitHub repository, a multi-file gist, a **Use this template** repo, or an internal docs tree.

When adapting for a specific tool, keep the `.agents/` layout stable and change only wiring or light packaging under `.agents/agents/` and `.agents/skills/` inside that tree.

## License

Released under the [MIT License](LICENSE).
