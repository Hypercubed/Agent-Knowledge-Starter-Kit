# Repository Decisions

This template belongs in `.agents/docs/repo-decisions.md`.

Use this file for durable rationale and architectural choices.

### Scaffold content stays consumer-generic

### Status

Accepted (supersedes prior “dual tree sync” policy)

### Context

The published template must be copy-pasteable as `.agents/` without carrying starter-repository concepts.

### Rationale

Consumers should not inherit maintainer-only workflows, paths like `scaffold/`, or “keep trees aligned” rules. Those belong in this repo’s `.agents/` (or root `README.md`), not in the kit files under `scaffold/`.

### Consequences

- `scaffold/` is edited only for improvements that belong in **any** adopter’s `.agents/` layout.
- This repository’s optional `.agents/` may accumulate dogfood-specific notes and **does not** need to match `scaffold/` byte-for-byte.

### Dual `scaffold/` path vs `.agents/` dogfood (historical)

### Status

Superseded

### Context

An earlier approach treated `.agents/` as a refreshed copy of `scaffold/`.

### Consequences

That policy is retracted; see “Scaffold content stays consumer-generic” above.

### Optional `prior_session` in session `summary.json`

### Status

Accepted (optional convention)

### Context

Multi-step maintainer work can produce more than one task-closeout folder for a single initiative (for example adoption work plus a later orchestrator meta-closeout).

### Rationale

Adding `prior_session` (path to the earlier bundle directory) records linkage and ordering without reopening or editing earlier packets, which should stay append-only after closeout.

### Consequences

- Distillation across linked bundles relies on `task_id`, timestamps, and `prior_session`; see `.agents/docs/troubleshooting.md` for overlap symptoms and fixes (avoid rewriting closed session trees).
- Agents reconstructing history may follow `prior_session` when present.

### Sessions directory: tracked README with ignored bundles

### Status

Accepted

### Context

Consumers need a `.agents/sessions/` directory with guidance while keeping per-task bundle folders local.

### Rationale

A short `.agents/sessions/README.md` gives human-facing context; in `.agents/.gitignore`, pairing `sessions/*` with `!sessions/README.md` (paths relative to `.agents/`) tracks exactly one file there while bundle subfolders stay ignored.

### Consequences

- After copying or merging the kit, confirm `.gitignore` exceptions match the tracked filename exactly (path segments and case).

### Maintainer-only skills and scripts never live under `scaffold/`

### Status

Accepted

### Context

Skills under `scaffold/skills/` are what adopters copy into their `.agents/skills/` tree. Maintainer workflows for this repository (for example selective sync from `scaffold/` into dogfood `.agents/`) are not portable kit content.

### Rationale

Putting a maintainer skill in `scaffold/` ships it to consumers, who often have no `scaffold/` directory, and erases the boundary between generic template and starter-repo dogfood.

### Consequences

- Maintainer-only skills and any helper scripts stay under this repo’s `.agents/skills/<skill-name>/` beside `SKILL.md`.
- Portable skills and agent role files remain under `scaffold/skills/` and `scaffold/agents/` and are merged into `.agents/` when maintainers run the documented sync.

### Sync root `.agents` after scaffold agent or skill edits

### Status

Accepted

### Context

This repo dogfoods the starter kit through a root `.agents/` tree while publishing portable agent and skill definitions under `scaffold/`.

### Rationale

When `scaffold/agents/` or `scaffold/skills/` changes, the root dogfood `.agents/agents/` and `.agents/skills/` copies should receive those portable updates in the same maintenance pass. That keeps local agent behavior aligned with the kit without copying maintainer-only files into `scaffold/`.

### Consequences

- After portable edits under `scaffold/agents/` or `scaffold/skills/`, run `./.agents/skills/sync-scaffold-agents-skills/sync.sh` from the repository root.
- Review the resulting diff under `.agents/agents/` and `.agents/skills/`.
- Do not use this sync for `scaffold/docs/`, `scaffold/playbooks/`, `scaffold/AGENTS.md`, or other paths unless a separate task explicitly changes the sync scope.

### Kit-contract policy changes must update `scaffold/` too

### Status

Accepted

### Context

This repository intentionally allows maintainer dogfood under root `.agents/` to diverge from `scaffold/`, but some changes are not maintainer-local. When a change alters the portable kit contract, updating only root `.agents/` leaves adopters without the intended behavior.

### Rationale

Safety hardening and other policy-bearing changes that belong to the published starter kit must land in `scaffold/` as well as any local dogfood copy. The repo may keep dual trees, but portable policy cannot live only in the maintainer tree.

### Consequences

- For changes to docs, playbooks, or other policy-bearing files that exist in both trees, decide explicitly whether the scope is maintainer-only or kit-wide.
- If the change is kit-wide, update both root `.agents/` and `scaffold/` in the same task.
- Do not assume exact text parity between the two trees when patching; verify each target file against its real current contents.

### Kit installation guidance lives in root docs

### Status

Accepted

### Context

Adopter-facing setup instructions need to explain how to copy or merge the starter kit into a target repository, including cases where `.agents/` already exists.

### Rationale

Installation guidance is about consuming this starter repository, not durable knowledge that every consumer should inherit inside its copied `.agents/` tree. Keeping setup guidance in root docs such as `README.md` and `INSTALL.md` lets `scaffold/` remain a clean consumer `.agents/` template.

### Consequences

- Put human quick-start guidance, agent install prompts, and detailed install checklists in root docs.
- Add content to `scaffold/` only when every adopter should receive it inside their `.agents/` tree.
- If installation guidance creates a durable local policy, record the rationale here rather than duplicating the full checklist.

## Entry template

### Decision

Describe the decision.

### Status

Accepted | superseded | provisional

### Context

Why this decision was needed.

### Rationale

Why this approach was chosen.

### Consequences

What future agents should keep in mind.

### Integration guides belong in `docs/integrations/`, not `.agents/`

#### Status

Accepted

#### Context

The starter kit needs guides explaining how different agent tools (Hermes, Claude Code, Cursor, etc.) work with the `.agents/` knowledge system.

#### Rationale

Integration guides are user-facing setup documentation for humans configuring their tools. They are not agent-consumable structured knowledge, so they do not belong inside `.agents/`. The `docs/` directory at the repo root is the natural home.

#### Consequences

- `docs/integrations/` contains per-tool guides and any shared template.
- `.agents/` stays focused on what agents actually consume at runtime.
- Published integration guides should be grounded in verified tool behavior, not just analogy or one-off runs.

### Use the Routing Pattern for agentic tool bootstrap files

#### Status
Accepted

#### Context
Multiple agentic tools (Claude Code, Cursor, Gemini CLI) use root-level instruction files (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`) that take precedence.

#### Rationale
To maintain a single source of truth, these root files should not contain full policy. Instead, they should "route" the agent to the durable knowledge under `.agents/`.

#### Consequences
- Root files stay "thin" (bootstrap only).
- `.agents/` remains the authoritative location for durable repo knowledge.
- Cross-tool consistency is improved across different AI toolchains.
