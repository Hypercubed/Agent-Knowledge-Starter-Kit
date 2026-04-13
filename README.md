# Agent Knowledge Starter Kit v1.4

A shareable, tool-agnostic starter kit for maintaining a compiled repo knowledge layer for coding agents.

This pattern separates three concerns:

1. **Temporary session outputs** live inside the repo under `.agents/sessions/`, with one folder per task-closeout bundle.
2. **Durable repo knowledge** lives under `.agents/`.
3. **Agent roles and skills** live in that same `.agents/` tree and describe how coding, learning, and maintenance workflows run.

Important: in this repository, `scaffold/` is the published starter kit. Copy everything under `scaffold/` into `.agents/` at the root of a project that adopts the kit.

The root `.agents/` directory in this repository is for maintaining this starter kit itself. Do not blindly copy it into another repo.

The goal is to avoid bloating a single `.agents/AGENTS.md` with temporary notes, while still preserving useful lessons from completed work.

## Disclaimer

This repository and the kit under `scaffold/` were produced with the help of AI tools. Everything here is **as-is**; **use at your own risk**. Validate instructions, commands, and policies for your environment before relying on them.

## Why this exists

Most coding agents can edit code well enough, but repo learning often degrades into one of two bad outcomes:

- useful lessons are lost after the session ends
- too much low-quality context gets stuffed into instruction files

This starter kit introduces a small maintenance system:

- a **coding agent** finishes work and emits a structured handoff packet
- a **learning agent** distills only the durable parts into `.agents/`
- an optional **lint agent** keeps the knowledge layer coherent over time

This is intentionally generic. It should work with any system that supports user-defined agents or personas, reusable skill or instruction files, full repo file access, and a **gitignored** `.agents/sessions/` area for temporary task artifacts.

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

## How to use this kit

Use the kit as a lightweight maintenance loop around normal agent work:

1. **Start with the repo knowledge layer.** Keep a short root `AGENTS.md` or tool rule that points agents to `.agents/AGENTS.md` and `.agents/docs/index.md`. Put durable repo policy in `.agents/`, not in each tool's native config.
2. **Do the implementation work normally.** Have the coding agent read the relevant durable guidance, use playbooks or troubleshooting docs when needed, and keep tool-specific prompts as thin wiring.
3. **Close meaningful tasks with `task-closeout`.** At completion, blockage, or abandonment, invoke the repo-local `task-closeout` skill. It should write raw evidence and a structured bundle under `.agents/sessions/<folder>/`, which is usually gitignored. The canonical task/session identifier is the `task_id` field inside that bundle's `summary.json`; the folder name is only a sortable storage label.
4. **Promote durable lessons with `learning-distill`.** After closeout, run a separate learning pass with `learning-distill`. Pass the session bundle path and use the `task_id` field in `summary.json` when referring to the task. Promote only stable, reusable lessons into `.agents/AGENTS.md`, `.agents/docs/`, or `.agents/playbooks/`; leave one-off task history in `.agents/sessions/`.
5. **Keep the knowledge layer clean with `knowledge-lint`.** Periodically invoke `knowledge-lint` to find duplicate, stale, contradictory, oversized, or uncategorized guidance before the layer becomes noisy.
6. **Review the diff.** Treat durable knowledge changes like code: inspect what changed, make sure session bundles stayed temporary, and commit only the files that should become shared repo knowledge.

```mermaid
flowchart LR
    A[Code task] --> B[task-closeout]
    B --> C[Session bundle<br/>.agents/sessions/&lt;folder&gt;<br/>summary.json<br/>active-task.md<br/>learning-candidate.md]

    C --> D[learning-distill]
    D --> E{Classify lesson}

    E -->|ephemeral| F[Keep in session bundle]
    E -->|agent guidance| G[.agents/AGENTS.md]
    E -->|troubleshooting| H[.agents/docs/troubleshooting.md]
    E -->|repo decision| I[.agents/docs/repo-decisions.md]
    E -->|playbook| J[.agents/playbooks/*]

    G --> K[index.md + log.md]
    H --> K
    I --> K
    J --> K

    K --> L[Mark distilled]
    L --> M[knowledge-lint]
    M --> N[Clean duplicates, contradictions,<br/>stale guidance, missing index coverage]
```

Tool-specific guides in [`docs/integrations/`](docs/integrations/) show how to wire this same workflow into individual products.

Repo-local session storage is the default because bundles stay close to the code, diffs, commands, and durable docs they describe. In cloud, ephemeral, or shared-agent environments, adapt the storage location if local `.agents/sessions/` data may disappear or cross machine boundaries. Keep per-task session artifacts out of commits, either with the kit's `.agents/.gitignore` or equivalent repo-root ignore rules.

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

## Architecture

Design principles, repository layout, agent roles, durable knowledge files, task lifecycle, and distillation rules live in [docs/architecture.md](docs/architecture.md).

## Tool integration

This kit ships **content** (markdown, layout, and conventions), not a single vendor-specific config. You still need to register `.agents/skills/*/SKILL.md` and `.agents/agents/*.md` (or equivalent) however your stack expects. Keep the on-disk layout under `.agents/` stable so the knowledge layer stays portable when you change tools.

## Integrations

Tool-specific integration guides live in [`docs/integrations/`](docs/integrations/).

Currently available:

- [Antigravity](docs/integrations/antigravity.md)
- [Claude Code](docs/integrations/claude-code.md)
- [Codex](docs/integrations/codex.md)
- [Cursor](docs/integrations/cursor.md)
- [Hermes](docs/integrations/hermes.md)
- [Kilo Code](docs/integrations/kilo-code.md)
- [OpenClaw](docs/integrations/openclaw.md)
- [OpenCode](docs/integrations/opencode.md)
- [Warp](docs/integrations/warp.md)

---

## License

Released under the [MIT License](LICENSE).
