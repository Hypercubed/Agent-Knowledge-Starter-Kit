# OpenClaw Integration Guide

OpenClaw and this starter kit overlap heavily, but they still solve different layers of the problem.

- **OpenClaw** is a persistent assistant runtime with native `AGENTS.md` startup behavior, repo-local and installed skills, memory search, session tools, sub-agents, and automation such as cron and heartbeat.
- **This kit** is a **repo-scoped knowledge layer** under `.agents/`: durable repo guidance, docs, playbooks, portable skills, and gitignored session bundles for distillation.

This guide is grounded in the current OpenClaw CLI/docs and a live local OpenClaw install verified on April 12, 2026. Re-check OpenClaw docs after upgrades, especially around startup files, session tools, and automation behavior.

## 1. Prerequisites

You should have:

- a repository that already contains, or is about to adopt, the kit layout under `.agents/` by copying `scaffold/`
- OpenClaw with file access to the repository workspace
- permission to add or keep a short root `AGENTS.md` bootstrap in the repo
- permission to read and update `.agents/AGENTS.md`, `.agents/docs/`, `.agents/playbooks/`, `.agents/skills/`, and `.agents/sessions/`
- clarity about the split in this starter-kit repo itself:
  - `scaffold/` is what adopters copy into their own repo as `.agents/`
  - this repo's root `.agents/` is maintainer dogfood for the starter kit repo itself

For OpenClaw-specific features, it also helps to have:

- a working Gateway (`openclaw status` should succeed)
- memory indexing enabled if you want memory-backed recall
- whatever channel, Control UI, or local session path you use for normal OpenClaw conversations

## 2. Discovery mechanism

### What OpenClaw discovers natively

OpenClaw already has several native structures that overlap with the kit:

| Mechanism | Where it lives | Role |
| --- | --- | --- |
| Startup instruction files | root `AGENTS.md`, `SOUL.md`, `USER.md`, recent memory notes, and sometimes `MEMORY.md` depending on session context | Session bootstrap and standing instructions |
| Workspace memory files | `MEMORY.md`, `memory/*.md` | Long-term and daily memory, searchable via `memory_search` / `memory_get` |
| Skills | installed workspace `skills/`, built-in skills, and repo-local skill files the agent is instructed to read | Reusable workflows |
| Session tools | runtime tools such as `sessions_list`, `sessions_history`, `sessions_send`, `sessions_spawn`, `subagents`, `session_status` | Cross-session recall, orchestration, and status |
| Automation | heartbeat, cron jobs, hooks, Task Flow, background tasks | Periodic or event-driven work |
| CLI and Gateway | `openclaw status`, `openclaw agent`, `openclaw sessions`, etc. | Inspection, routing, and operations |

### What the kit provides

The starter kit stores repo-specific durable knowledge on disk under `.agents/`:

- `.agents/AGENTS.md` — concise durable repo guidance
- `.agents/docs/*` — decisions, troubleshooting, maintenance notes, index, log
- `.agents/playbooks/*` — repeatable multi-step procedures
- `.agents/skills/<name>/SKILL.md` — portable repo-local maintenance skills
- `.agents/sessions/*` — task-closeout bundles and raw evidence, usually gitignored

### Root `AGENTS.md` vs `.agents/AGENTS.md` (important for OpenClaw)

This split matters in OpenClaw just like it does in other tools:

- **Root `AGENTS.md`** is the repo entrypoint for a checkout. In an OpenClaw workspace, it is part of the startup/bootstrap path.
- **`.agents/AGENTS.md`** is the durable, portable repo knowledge file copied from `scaffold/` into consumer repos.

Do not collapse them into one giant file.

The safest pattern is:

- keep root `AGENTS.md` short and routing-focused
- keep durable repo conventions in `.agents/AGENTS.md`
- use `.agents/docs/index.md` as the map to the rest of the knowledge layer

That keeps OpenClaw startup light while preserving the portable `.agents/` contract shared with other tools.

### OpenClaw memory vs repo `.agents/` knowledge

This is the biggest conceptual overlap.

OpenClaw already has native memory files and memory search. The kit also stores durable knowledge in-repo. They are not the same thing.

Recommended boundary:

| Store | Best use |
| --- | --- |
| OpenClaw `MEMORY.md` and `memory/*.md` | user-specific continuity, assistant identity, local operating context, reminders, daily notes |
| Repo `.agents/AGENTS.md`, `.agents/docs/`, `.agents/playbooks/` | repo-specific architecture, build/test rules, troubleshooting, maintenance workflows, durable lessons for anyone working in the repo |
| `.agents/sessions/` | temporary task evidence and closeout bundles, not durable truth |

Do **not** move repo architecture guidance into OpenClaw personal memory files just because OpenClaw can search them. That would make the repo knowledge less portable and more tied to one assistant's private workspace.

### OpenClaw skills vs kit `.agents/skills/`

OpenClaw has its own skill system, including installed workspace skills and built-in skills. The starter kit also ships portable skill files under `.agents/skills/`.

Treat these as **different layers**, even when the content looks similar:

- OpenClaw-native skills are runtime-integrated workspace capabilities.
- `.agents/skills/<name>/SKILL.md` files are repo-local portable procedures that should survive tool changes.

The safe pattern is:

- keep cross-tool repo workflows canonical under `.agents/skills/`
- use OpenClaw-native skills only when you need OpenClaw-specific behavior or distribution
- avoid maintaining two divergent copies of `task-closeout`, `learning-distill`, or `knowledge-lint`

## 3. Setup steps

### Recommended pattern: OpenClaw as runtime, `.agents/` as canonical repo knowledge

1. Install or merge the starter kit so the target repo has a real `.agents/` tree.
2. Keep or add a short root `AGENTS.md` that routes OpenClaw into `.agents/`.
3. Keep durable repo policy in `.agents/`, not in OpenClaw personal memory files.
4. Keep repo-closeout and distillation workflows under `.agents/skills/` and `.agents/playbooks/`.
5. Use OpenClaw memory for user or operator continuity, not as the primary store of repo policy.
6. Use OpenClaw automation only for orchestration around the repo knowledge layer, not as a replacement for it.

### Example root `AGENTS.md`

```markdown
# AGENTS.md

This repo uses the Agent Knowledge Starter Kit.

- Read `.agents/AGENTS.md` for durable repo guidance.
- Use `.agents/docs/index.md` to find decisions, troubleshooting, and playbooks.
- Treat `.agents/skills/*/SKILL.md` as canonical repo-local maintenance workflows.
- Keep temporary task evidence in `.agents/sessions/` and promote only durable lessons back into `.agents/`.
```

### OpenClaw workspace notes

If the repo itself is your OpenClaw workspace, keep the split clear:

- OpenClaw startup files (`AGENTS.md`, `SOUL.md`, `USER.md`, `MEMORY.md`, `memory/*.md`) serve the assistant and human relationship in that workspace.
- The starter kit's `.agents/` tree serves repo-level knowledge sharing.

If the repo is **not** the OpenClaw workspace root, the same guidance still applies: use a short bootstrap at the repo root and keep durable project policy in `.agents/`.

### When to use OpenClaw automation around the kit

OpenClaw adds useful automation around the kit, but the automation should point back to canonical repo files.

A good mental model is:

- OpenClaw is the **orchestration layer**
- `.agents/` is the **canonical repo knowledge layer**
- `.agents/sessions/` is the **temporary evidence layer**

Good examples:

- a cron reminder to run `knowledge-lint` weekly
- a heartbeat checklist that reminds the assistant to review recent session bundles and distill durable lessons
- a sub-agent pass that reads `.agents/playbooks/` before doing maintenance work
- running `task-closeout` and `learning-distill` directly from an OpenClaw chat session after meaningful repo work

Poor examples:

- storing the only copy of repo maintenance procedure text inside a cron payload
- encoding repo architecture rules only in OpenClaw memory files
- replacing `.agents/sessions/` task evidence with ad hoc session transcript archaeology

## 4. Workflow

Suggested OpenClaw workflow in a kit-enabled repo:

1. Start from the repo root so root `AGENTS.md` can route the agent into the knowledge layer.
2. Read `.agents/AGENTS.md` and `.agents/docs/index.md` before changing repo conventions, recurring workflows, or durable guidance.
3. Use `.agents/playbooks/` and `.agents/docs/troubleshooting.md` for repo-specific procedures.
4. Perform the implementation or maintenance work normally.
5. For meaningful task boundaries, follow `.agents/skills/task-closeout/SKILL.md` and write the evidence bundle under `.agents/sessions/<folder>/`.
6. Run a separate learning pass to promote only stable lessons into `.agents/AGENTS.md`, `.agents/docs/`, or `.agents/playbooks/`.
7. Use OpenClaw session tools, sub-agents, and automation as helpers around that process, not as a substitute for the repo knowledge layer.

### OpenClaw-native maintenance loop example

A strong OpenClaw-only workflow looks like this:

1. Do the implementation or documentation task in a normal OpenClaw session.
2. At task completion, run the repo-local `task-closeout` skill and write a bundle under `.agents/sessions/<folder>/`.
3. Run `learning-distill` against that bundle and promote only stable lessons into `.agents/` durable files.
4. Optionally use cron or heartbeat to revisit maintenance tasks later, for example a weekly `knowledge-lint` pass.

This is where OpenClaw is especially strong: it can drive the maintenance loop conversationally, keep durable repo knowledge in Git, and still use native memory, sessions, and automation for continuity.

### Three integration patterns

#### 1. Kit as bridge

Use `.agents/` as the shared contract across OpenClaw and other tools.

Best when:
- multiple tools touch the same repo
- you want portable repo knowledge in Git
- OpenClaw is one participant, not the only runtime

Trade-off:
- requires discipline to keep policy out of OpenClaw-only memory or automation text

#### 2. Replicate into OpenClaw-native structures

Mirror some repo guidance into OpenClaw memory, skills, or standing instructions.

Best when:
- the repo is effectively private to one OpenClaw operator
- convenience matters more than cross-tool portability

Trade-off:
- easy to create drift and duplicate sources of truth
- weaker fit for a shareable repo knowledge layer

#### 3. Hybrid (recommended)

Use OpenClaw-native memory and automation for assistant continuity and orchestration, while keeping repo policy canonical under `.agents/`.

Best when:
- you want OpenClaw's persistent-assistant strengths without losing the portable repo contract
- the same repo may also be touched by Cursor, Codex, CI, or future tools

Trade-off:
- requires a clear boundary between personal memory and repo knowledge

## 5. Two-tool example: OpenClaw + Codex sharing a repo

This is a strong fit for the kit.

- **OpenClaw** handles persistent operator continuity, reminders, sub-agent orchestration, and background maintenance work.
- **Codex** handles interactive coding work, repo-local skill discovery, and implementation sessions.
- **Shared contract** is the repo's `.agents/` tree.

Example flow:

1. OpenClaw starts from root `AGENTS.md`, reads `.agents/docs/index.md`, and schedules a weekly reminder to run the repo's `knowledge-lint` workflow.
2. Codex implements a feature and closes it out using the repo-local `task-closeout` instructions under `.agents/skills/task-closeout/SKILL.md`.
3. OpenClaw later reads the resulting `.agents/sessions/<folder>/summary.json` bundle, runs a learning/distillation pass, and updates `.agents/docs/repo-decisions.md`.
4. On the next session, both OpenClaw and Codex benefit from the updated durable repo docs because the knowledge lives in Git under `.agents/`, not only in one tool's memory store.

The same pattern also works with Cursor: keep OpenClaw memory and automation thinly routed to `.agents/`, and keep Cursor rules thinly routed to `.agents/` too.

## 6. Troubleshooting

### Repo knowledge drifted into OpenClaw memory files

#### Symptom

Build rules, architecture notes, or troubleshooting steps only exist in `MEMORY.md` or daily memory notes.

#### Likely causes

OpenClaw memory search is convenient, so repo-specific durable guidance got stored in personal assistant memory instead of the repo.

#### Fix

Move repo policy into `.agents/AGENTS.md`, `.agents/docs/`, or `.agents/playbooks/`. Keep memory files for user/operator continuity and local assistant state.

#### Validation

A collaborator or second tool can recover the repo guidance from Git without needing your personal OpenClaw workspace memory.

### Duplicate workflow text exists in both OpenClaw skills and `.agents/skills/`

#### Symptom

There are two versions of `task-closeout` or `knowledge-lint`, and they no longer match.

#### Likely causes

A repo-local portable workflow was copied into an OpenClaw-native skill and maintained separately.

#### Fix

Pick one canonical source. For cross-tool repo workflows, prefer `.agents/skills/<name>/SKILL.md`. Keep OpenClaw-native skills only as wrappers or for OpenClaw-specific capabilities.

#### Validation

A workflow change requires editing one canonical repo file, not hunting through both OpenClaw skill config and `.agents/skills/`.

### Automation bypasses the knowledge layer

#### Symptom

Cron jobs, heartbeat tasks, or helper sessions act on stale assumptions because they never read `.agents/`.

#### Likely causes

Automation prompts were written as standalone instructions instead of routing through the repo knowledge files.

#### Fix

Update automation prompts to read root `AGENTS.md`, `.agents/AGENTS.md`, or the relevant `.agents/docs/` and `.agents/playbooks/` files before acting.

#### Validation

A durable repo-policy update affects future automated runs without rewriting every cron payload.

### Confusion between OpenClaw workspace startup files and the starter kit

#### Symptom

People treat `SOUL.md`, `USER.md`, `MEMORY.md`, or heartbeat files as the published starter kit layout for consumer repos.

#### Likely causes

OpenClaw workspace conventions and the starter-kit `.agents/` tree were mentally merged.

#### Fix

Keep the scopes explicit:

- workspace startup/memory files are for OpenClaw's assistant runtime
- `scaffold/` is the published starter kit that becomes `.agents/` in consumer repos
- this repo's root `.agents/` is only for maintaining the starter kit itself

#### Validation

A consumer install copies `scaffold/` into `.agents/` and does not accidentally import the maintainer workspace files.

## 7. References

- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [`docs/integrations/README.md`](./README.md)
- [OpenClaw `status` CLI docs](https://docs.openclaw.ai/cli/status)
- [OpenClaw `skills` CLI docs](https://docs.openclaw.ai/cli/skills)
- [OpenClaw `sessions` CLI docs](https://docs.openclaw.ai/cli/sessions)
- [OpenClaw Session Tools](https://docs.openclaw.ai/concepts/session-tool)
- [OpenClaw Memory Search](https://docs.openclaw.ai/concepts/memory-search)
- [OpenClaw Active Memory](https://docs.openclaw.ai/concepts/active-memory)
- [OpenClaw Automation & Tasks](https://docs.openclaw.ai/automation)
- [`codex.md`](./codex.md)
- [`hermes.md`](./hermes.md)
