# OpenCode Integration Guide

OpenCode and this starter kit align well: OpenCode already uses `AGENTS.md`, supports project-local skills, and lets teams add repo-scoped commands and agents. The kit adds a stricter durable knowledge layer under `.agents/` so project guidance, troubleshooting, closeout bundles, and distillation stay portable across tools.

- **OpenCode** is an open source coding agent with terminal, desktop, web, and IDE surfaces. It uses `AGENTS.md` for project rules, `opencode.json` for config, `.opencode/agents/` and `.opencode/commands/` for runtime customization, and a native skill system.
- **This kit** is a **repo-scoped knowledge layer** under `.agents/`: durable repo guidance, docs, playbooks, portable skills, and gitignored session bundles for distillation.

This guide is based on current OpenCode documentation reviewed on April 12, 2026. Re-check OpenCode docs after upgrades, especially around rule precedence, skill discovery, and project-local config loading.

## 1. Prerequisites

You should have:

- a repository that already contains, or is about to adopt, the kit layout under `.agents/` by copying `scaffold/`
- OpenCode installed and configured with at least one working model provider
- permission to add or keep a short root `AGENTS.md` bootstrap in the repo
- permission to read and update `.agents/AGENTS.md`, `.agents/docs/`, `.agents/playbooks/`, `.agents/skills/`, and `.agents/sessions/`
- clarity about the split in this starter-kit repo itself:
  - `scaffold/` is what adopters copy into their own repo as `.agents/`
  - this repo's root `.agents/` is maintainer dogfood for the starter kit repo itself

Optional:

- `opencode.json` if you want to load extra instruction files explicitly
- `.opencode/commands/` if you want short command wrappers for kit workflows
- `.opencode/agents/` if you want OpenCode-specific runtime agents beyond the built-in `build`, `plan`, `general`, and `explore`

## 2. Discovery mechanism

### What OpenCode discovers natively

OpenCode already has several native structures that overlap with the kit:

| Mechanism | Where it lives | Role |
| --- | --- | --- |
| Project rules | root `AGENTS.md` | Primary project instruction file for the repo |
| Global rules | `~/.config/opencode/AGENTS.md` | User-wide instructions across OpenCode sessions |
| Claude compatibility rules | root `CLAUDE.md`, `~/.claude/CLAUDE.md` | Fallback instruction files if no OpenCode `AGENTS.md` is present |
| Config | `opencode.json` / `opencode.jsonc`, `~/.config/opencode/opencode.json` | Project and user runtime configuration |
| Extra instructions | `instructions` in `opencode.json` | Adds instruction files or globs to the prompt |
| Agents | `.opencode/agents/`, `~/.config/opencode/agents/` | OpenCode-specific primary or subagent definitions |
| Commands | `.opencode/commands/`, `~/.config/opencode/commands/` | Reusable slash-style command prompts |
| Skills | `.opencode/skills/`, `.agents/skills/`, `.claude/skills/`, and matching global paths | Reusable workflows loaded via OpenCode's native `skill` tool |

### What the kit provides

The starter kit stores repo-specific durable knowledge on disk under `.agents/`:

- `.agents/AGENTS.md` — concise durable repo guidance
- `.agents/docs/*` — decisions, troubleshooting, maintenance notes, index, log
- `.agents/playbooks/*` — repeatable multi-step procedures
- `.agents/skills/<name>/SKILL.md` — portable repo-local maintenance skills
- `.agents/sessions/*` — task-closeout bundles and raw evidence, usually gitignored

### Root `AGENTS.md` vs `.agents/AGENTS.md` (important for OpenCode)

OpenCode already understands root `AGENTS.md`, so use the Routing Pattern:

- **Root `AGENTS.md`** is the repo entrypoint for OpenCode in a checkout.
- **`.agents/AGENTS.md`** is the durable, portable repo knowledge file copied from `scaffold/` into consumer repos.

Do not collapse them into one large file. Keep root `AGENTS.md` short and routing-focused; keep durable repo conventions in `.agents/AGENTS.md`.

### OpenCode `instructions` vs kit durable docs

OpenCode's `opencode.json` can load additional instruction files with the `instructions` array. Use that as thin wiring, not as a second canonical storage layer.

Recommended boundary:

| Store | Best use |
| --- | --- |
| root `AGENTS.md` | short bootstrap for project entry |
| `opencode.json` `instructions` | explicit inclusion of existing repo docs when the team wants more automatic loading |
| `.agents/AGENTS.md`, `.agents/docs/`, `.agents/playbooks/` | durable repo policy, rationale, troubleshooting, and repeatable workflows |
| `.agents/sessions/` | temporary task evidence and closeout bundles, not durable truth |

If the same rule text lives in both `opencode.json` instruction files and `.agents/`, drift becomes likely. Keep `.agents/` canonical.

### OpenCode agents, commands, and skills vs kit structures

OpenCode and the kit use some similar names, but they are not all the same layer:

| OpenCode-native | Kit equivalent | Recommended boundary |
| --- | --- | --- |
| `.opencode/agents/` | `.agents/agents/` | Use `.opencode/agents/` for OpenCode runtime behavior; keep portable repo role definitions in `.agents/agents/` |
| `.opencode/commands/` | `.agents/skills/` / playbooks | Use commands only as thin convenience aliases that point to canonical kit skills or playbooks |
| native `skill` tool loading `.agents/skills/` | `.agents/skills/` | This is a strong fit: the kit's skill files can be real OpenCode skills without conversion |

The most important distinction is commands vs skills: `.opencode/commands/` are prompt shortcuts, while `.agents/skills/<name>/SKILL.md` are the durable, portable workflow definitions.

## 3. Setup steps

### Recommended pattern: OpenCode-native routing, `.agents/` as canonical repo knowledge

1. Install or merge the starter kit so the target repo has a real `.agents/` tree.
2. Keep or add a short root `AGENTS.md` that routes OpenCode into `.agents/`.
3. Keep durable repo policy in `.agents/`, not duplicated across `AGENTS.md`, `opencode.json`, and command files.
4. Let OpenCode discover `.agents/skills/` natively instead of copying those workflows into `.opencode/skills/` or `.opencode/commands/` unless you need an OpenCode-only variant or a thin convenience alias.
5. Use `opencode.json` only for project-specific runtime config and optional instruction loading.
6. Use `.opencode/commands/` and `.opencode/agents/` only when they add OpenCode-specific convenience.

### Example root `AGENTS.md`

```markdown
# AGENTS.md

This repo uses the Agent Knowledge Starter Kit.

- Read `.agents/AGENTS.md` for durable repo guidance.
- Use `.agents/docs/index.md` to find decisions, troubleshooting, and playbooks.
- Treat `.agents/skills/*/SKILL.md` as canonical repo-local maintenance workflows.
- Keep temporary task evidence in `.agents/sessions/` and promote only durable lessons back into `.agents/`.
```

### Optional `opencode.json`

If your team wants more explicit file loading, keep it minimal:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    ".agents/AGENTS.md",
    ".agents/docs/index.md"
  ]
}
```

Do not use this to fork or restate repo policy already stored under `.agents/`.

### Optional command wrapper for task closeout

Create `.opencode/commands/task-closeout.md`:

```markdown
---
description: Close out the current task with the repo-local skill
agent: build
---
Read and follow `.agents/skills/task-closeout/SKILL.md`. Write the output bundle to `.agents/sessions/<timestamp>-<slug>/`.
```

This gives OpenCode a convenient `/task-closeout` command as a thin alias without creating a second copy of the workflow.

## 4. Workflow

Suggested OpenCode workflow in a kit-enabled repo:

1. Start from the repo root so root `AGENTS.md` can route OpenCode into the knowledge layer.
2. Use **Plan** mode for investigation, architecture questions, or implementation design when you want analysis without edits.
3. Use **Build** mode for implementation work.
4. Read `.agents/AGENTS.md` and `.agents/docs/index.md` before changing repo conventions, recurring workflows, or durable guidance.
5. Use `.agents/playbooks/` and `.agents/docs/troubleshooting.md` for repo-specific procedures.
6. For meaningful task boundaries, load or follow `.agents/skills/task-closeout/SKILL.md` and write the evidence bundle under `.agents/sessions/<folder>/`.
7. Run a separate learning pass with `.agents/skills/learning-distill/SKILL.md` to promote only stable lessons into `.agents/AGENTS.md`, `.agents/docs/`, or `.agents/playbooks/`.

### OpenCode built-in agents vs the kit's role model

OpenCode's built-ins and the kit's role files are compatible, but they describe different layers:

- OpenCode `build` and `plan` are runtime execution modes inside the product.
- OpenCode `general` and `explore` are native subagents for parallel work and read-only exploration.
- The kit's `.agents/agents/*.md` files are portable role definitions that should survive tool changes.

Treat OpenCode agents as runtime orchestration and the kit files as durable repo knowledge.

### Three integration patterns

#### 1. Kit as bridge

Use `.agents/` as the shared contract across OpenCode and other tools.

Best when:

- multiple tools touch the same repo
- you want durable repo knowledge in Git
- OpenCode is one participant, not the only runtime

Trade-off:

- requires discipline to avoid duplicating instructions into `.opencode/*`

#### 2. Replicate into OpenCode-native structures

Mirror some repo guidance into OpenCode rules, commands, and custom agents.

Best when:

- one team uses only OpenCode
- convenience matters more than cross-tool portability

Trade-off:

- easy to create drift between `.opencode/*`, root `AGENTS.md`, and `.agents/`

#### 3. Hybrid (recommended)

Use OpenCode-native rules, commands, and agents for convenience, while keeping repo policy canonical under `.agents/`.

Best when:

- you want OpenCode to feel first-class in the repo
- the same repo may also be touched by Codex, Claude Code, Cursor, CI, or future tools

Trade-off:

- requires a clear rule that `.opencode/*` is wiring and ergonomics, not the source of truth

## 5. Two-tool example: OpenCode + Codex sharing a repo

**Scenario:** A team uses OpenCode for day-to-day plan/build iteration in the terminal, then uses Codex for broader agentic refactors or maintenance passes. Both should follow the same durable repo guidance.

- **OpenCode** reads root `AGENTS.md`, can optionally load `.agents/` files through `opencode.json`, and can use repo-local `.agents/skills/` through its native skill system.
- **Codex** reads root `AGENTS.md` and discovers `.agents/skills/` natively.
- **Shared contract** is the repo's `.agents/` tree under Git.

Example flow:

1. A developer uses OpenCode **Plan** mode to explore a change and **Build** mode to implement it while following `.agents/AGENTS.md` and relevant playbooks.
2. At completion, OpenCode follows `.agents/skills/task-closeout/SKILL.md` and writes a bundle under `.agents/sessions/`.
3. Later, Codex performs a broader migration and reads the same root bootstrap plus the same durable `.agents/` guidance.
4. A maintainer runs `learning-distill` against one or more session bundles and commits only the promoted durable lessons.

Neither tool needs the other's private runtime state. The repo remains the shared source of truth.

## 6. Troubleshooting

### OpenCode follows root `AGENTS.md` but not `.agents/AGENTS.md`

#### Symptom

OpenCode follows a short root rule file but seems to ignore the durable guidance under `.agents/`.

#### Likely causes

- Root `AGENTS.md` does not explicitly route OpenCode into `.agents/`
- Root `AGENTS.md` contains too much duplicated policy, so the durable file is never consulted
- The repo is launched from an unexpected subdirectory and the wrong project rules are winning

#### Fix

Keep root `AGENTS.md` short and explicit: point OpenCode to `.agents/AGENTS.md` and `.agents/docs/index.md`. Remove duplicated policy from the bootstrap file.

#### Validation

Start a fresh OpenCode session from the repo root and ask it to summarize the project guidance it is using. It should mention the root bootstrap and then consult the `.agents/` files when relevant.

### `opencode.json` instructions duplicate `.agents/` content

#### Symptom

Instruction text exists in both `opencode.json`-loaded files and `.agents/`, and the two versions drift.

#### Likely causes

- `instructions` was used to copy policy instead of point to canonical files
- a team added one-off docs to `instructions` but never promoted stable guidance into `.agents/`

#### Fix

Keep `instructions` minimal and reference canonical files already in the repo. Move durable guidance into `.agents/` and delete duplicated instruction prose elsewhere.

#### Validation

Search the repo for repeated guidance and confirm there is one authoritative copy under `.agents/`.

### `.opencode/commands/` drift from kit skills

#### Symptom

The `/task-closeout` command says one thing, but `.agents/skills/task-closeout/SKILL.md` says another.

#### Likely causes

- command files copied the workflow instead of pointing to it
- kit skills evolved but OpenCode wrappers were not updated

#### Fix

Keep command files as one- or two-line wrappers that tell OpenCode to read the canonical skill file. Do not duplicate the workflow body.

#### Validation

Open the command file and verify it points to the skill file instead of restating the steps.

### Global OpenCode rules conflict with repo policy

#### Symptom

OpenCode behaves differently in this repo than the committed project guidance expects.

#### Likely causes

- `~/.config/opencode/AGENTS.md` contains repo-specific rules that should live in the project
- global config or managed settings override intended local behavior

#### Fix

Move repo-specific guidance into the repo's root `AGENTS.md` or `.agents/` files. Keep global OpenCode rules limited to personal preferences or cross-project defaults.

#### Validation

Compare the repo's checked-in guidance with your global OpenCode config and remove repo-local policy from the latter.

## 7. References

- [OpenCode Intro](https://opencode.ai/docs/)
- [OpenCode Rules](https://opencode.ai/docs/rules/)
- [OpenCode Agents](https://opencode.ai/docs/agents/)
- [OpenCode Commands](https://opencode.ai/docs/commands/)
- [OpenCode Agent Skills](https://opencode.ai/docs/skills/)
- [OpenCode Config](https://opencode.ai/docs/config/)
- [OpenCode Share](https://opencode.ai/docs/share/)
- [Starter kit README](../../README.md)
- [Starter kit architecture](../architecture.md)

## 8. Verification statement

This guide was written while operating in this repository as OpenCode on April 12, 2026. That writing session serves as the required dogfood pass for the guide's repo-integration framing. Behavioral claims are otherwise limited to current OpenCode documentation, especially for rule precedence, config merging, and native skill discovery.
