# Agent Knowledge Starter Kit

A shareable, tool-agnostic starter kit for maintaining a compiled repo knowledge layer for coding agents.

This pattern separates three concerns:

1. **Raw task evidence** lives outside the repo in temporary task bundles.
2. **Durable repo knowledge** lives inside the repo under `.agents/`.
3. **Agent roles and skills** define how coding, learning, and maintenance passes operate.

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
- access to an external temp or cache location

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

Those belong in task bundles, troubleshooting docs, playbooks, or repo decisions.

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
.
├── .agents/
│   ├── AGENTS.md
│   ├── MAINTENANCE.md
│   ├── index.md
│   ├── log.md
│   ├── repo-decisions.md
│   ├── troubleshooting.md
│   └── playbooks/
│       └── README.md
├── agents/
│   ├── coding-agent.md
│   ├── learning-agent.md
│   └── lint-agent.md
├── skills/
│   ├── task-closeout/
│   │   └── SKILL.md
│   ├── learning-distill/
│   │   └── SKILL.md
│   └── knowledge-lint/
│       └── SKILL.md
└── examples/
    └── task-bundle/
        ├── summary.json
        ├── active-task.md
        ├── learning-candidate.md
        ├── changed-files.txt
        └── validation.txt
```

---

## External task bundle location

Store temporary task bundles outside the workspace.

Recommended default:

```text
~/.cache/agent-memory/repos/<repo-id>/tasks/<task-id>/
```

Each task bundle contains:

- `summary.json`
- `active-task.md`
- `learning-candidate.md`
- `changed-files.txt`
- `validation.txt`

These files are temporary but should be durable enough to survive the end of one editor session.

Do **not** rely on `/tmp` unless immediate processing is acceptable and data loss is fine.

---

## Agent roles

### Coding agent

Responsibilities:

- implement code changes
- run tests and validation
- capture a task bundle at meaningful stopping points
- optionally delegate to the learning agent

### Learning agent

Responsibilities:

- read a completed task bundle
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

### `.agents/repo-decisions.md`

Durable rationale and architectural choices.

Put here:

- why a convention exists
- tradeoffs and exceptions
- decisions that may need explanation later

### `.agents/troubleshooting.md`

Recurring failure and recovery patterns.

Put here:

- symptoms
- likely causes
- known fixes
- validation steps

### `.agents/playbooks/`

Durable multi-step procedures.

Put here:

- release flows
- special build or deploy steps
- recurring maintenance procedures
- workflows that require multiple ordered steps

### `.agents/index.md`

Catalog of knowledge assets and when to consult them.

### `.agents/log.md`

Append-only record of maintenance actions.

### `.agents/MAINTENANCE.md`

The schema and policy document for the knowledge layer.

---

## Task lifecycle

1. A coding task begins.
2. The coding agent creates or adopts a `repo_id` and `task_id`.
3. At completion, blockage, or abandonment, the coding agent runs `task-closeout`.
4. A structured task bundle is written outside the workspace.
5. The learning agent runs `learning-distill` on the task bundle.
6. Durable lessons are written into `.agents/`.
7. The learning agent appends a summary to `.agents/log.md`.
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

- `.agents/repo-decisions.md`
- `.agents/troubleshooting.md`
- `.agents/playbooks/`
- nowhere at all

---

## Sharing this starter kit

This kit is structured so it can be uploaded directly to:

- a GitHub repository
- a GitHub gist (multi-file)
- a template repo
- an internal engineering docs repo

When adapting it for a specific tool, keep the `.agents/` contract stable and change only the agent/skill wiring.

That keeps the knowledge layer portable across editors and agent platforms.
