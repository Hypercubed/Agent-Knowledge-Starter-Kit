# Agent Knowledge Starter Kit

A shareable, tool-agnostic starter kit for maintaining a compiled repo knowledge layer for coding agents.

This pattern separates three concerns:

1. **Temporary session outputs** live inside the repo under `.agents/sessions/`, with one folder per task-closeout bundle.
2. **Durable repo knowledge** lives under `.agents/`.
3. **Agent roles and skills** live inside that same `.agents/` folder and define how coding, learning, and maintenance passes operate.

In this starter repository, `scaffold/` represents the full contents of `.agents/`. When adopting the kit, copy everything under `scaffold/` into the real `.agents/` directory.

The goal is to avoid bloating a single `AGENTS.md` file with temporary notes, while still preserving useful lessons from completed work.

---

## Why this exists

Most coding agents can edit code well enough, but repo learning often degrades into one of two bad outcomes:

- useful lessons are lost after the session ends
- too much low-quality context gets stuffed into instructions files

This starter kit introduces a small maintenance system:

- a **coding agent** finishes work and emits a structured handoff packet
- a **learning agent** distills only the durable parts into `.agents/`
- an optional **lint agent** keeps the knowledge layer coherent over time

This is intentionally generic. It should work with any system that supports:

- user-defined agents, modes, or personas
- reusable skill/instruction files
- access to repo files
- access to repo files, including a gitignored `.agents/sessions/` area for temporary task artifacts

---

## Design principles

### 1. Raw evidence is not the same as durable knowledge

Task packets are evidence. They capture what happened during one task.

The `.agents/` directory is a compiled knowledge layer. It should contain only information that is stable, reusable, and likely to help future agents.

### 2. `AGENTS.md` should stay small

`AGENTS.md` is for concise, repo-wide guidance.

It should not contain:

- session history
- long rationale
- failed experiments
- speculative notes
- one-off debugging details

Those belong in session bundles, troubleshooting docs, playbooks, or repo decisions.

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
│   │   └── .gitkeep
│   └── skills/
│       ├── task-closeout/
│       │   └── SKILL.md
│       ├── learning-distill/
│       │   └── SKILL.md
│       └── knowledge-lint/
│           └── SKILL.md
└── examples/
    └── task-bundle/
        ├── summary.json
        ├── active-task.md
        ├── learning-candidate.md
        ├── changed-files.txt
        └── validation.txt

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
    │   └── .gitkeep
    └── skills/
        ├── task-closeout/
        │   └── SKILL.md
        ├── learning-distill/
        │   └── SKILL.md
        └── knowledge-lint/
            └── SKILL.md
```

---

## Scaffold vs consumer layout

- `scaffold/` is this starter repo's representation of the full contents of `.agents/`.
- `scaffold/AGENTS.md`, `scaffold/docs/`, `scaffold/playbooks/`, `scaffold/agents/`, and `scaffold/skills/` should be treated as template paths in the starter repo.
- `scaffold/sessions/` maps to `.agents/sessions/`.
- `.agents/` is still the contract for a real repository using this pattern.
- Treat `scaffold/` as copyable template content, not as this starter repo's active durable knowledge layer.
- Update agent wiring for your tool as needed, but keep the durable knowledge destination as `.agents/`.

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

### `.agents/docs/playbooks/`

Durable multi-step procedures.

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
- `.agents/docs/playbooks/`
- nowhere at all

---

## Sharing this starter kit

This kit is structured so it can be uploaded directly to:

- a GitHub repository
- a GitHub gist (multi-file)
- a template repo
- an internal engineering docs repo

When adapting it for a specific tool, keep the `.agents/` contract stable and change only the wiring or packaging inside `scaffold/agents/` and `scaffold/skills/`.

That keeps the knowledge layer portable across editors and agent platforms.
