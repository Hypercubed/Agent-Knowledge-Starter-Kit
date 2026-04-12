# Kilo Code Integration Guide

Kilo Code and this starter kit overlap in useful ways, but they should not both become the place where repo policy lives.

- **Kilo Code** has native project configuration: `kilo.json` / `.kilo/kilo.json`, project and global commands, project and global agents, repo instruction files, and Kilo-native skills.
- **This kit** is a **repo-scoped knowledge layer** under `.agents/`: durable guidance, docs, playbooks, skills, and gitignored session bundles for distillation.

This guide is based on Kilo's documented configuration and discovery model plus the repo-local config locations used by this starter repository. The recommendations below are intentionally conservative where behavior was not reproduced hands-on inside Kilo. In this repository, recent task-closeout and learning-distill runs also completed against `.agents/` without observed read/write friction, but that remains a repo-local verification point rather than a broad product claim.

## 1. Prerequisites

You should have:

- a repository that already contains, or is about to adopt, the starter kit under `.agents/` by copying `scaffold/`
- Kilo Code with access to the repository files
- permission to add version-controlled project config such as `kilo.json`, `.kilo/command/*.md`, `.kilo/agent/*.md`, and root `AGENTS.md`
- clarity on the split between consumer kit content and maintainer dogfood in this repo:
  - `scaffold/` is what consumers copy into their own repo as `.agents/`
  - this repo's own `.agents/` is maintainer dogfood and may diverge

For shared-team setups, keep user-specific Kilo preferences in global config and commit only repo-specific wiring.

## 2. Discovery mechanism

### What Kilo discovers natively

Based on Kilo's documented model, Kilo can discover repo behavior from:

| Mechanism | Where it lives | Role |
| --- | --- | --- |
| Project config | `kilo.json`, `.kilo/kilo.json` | Repo-scoped Kilo settings with project precedence over lower scopes |
| Commands | `.kilo/command/*.md` | Slash commands and thin task routing |
| Agents | `.kilo/agent/*.md` | Kilo-native agent personas and permissions |
| Skills | `.kilo/skill/*/SKILL.md`, `.kilo/skills/*/SKILL.md`, plus configured paths/URLs | Kilo-native skill registry |
| Instructions | root `AGENTS.md`, `.kilo/instructions.md`, optional `instructions` globs in config | Always-on or scoped instruction files |

Kilo also supports global config in `~/.config/kilo/kilo.json`, with deep-merge precedence. Repo-local config should override global defaults only where the repository needs it.

### What the kit provides

The starter kit stores durable repo knowledge in the repository itself:

- `.agents/AGENTS.md` - concise durable repo guidance
- `.agents/docs/*` - index, decisions, troubleshooting, maintenance schema, log
- `.agents/playbooks/*` - multi-step procedures
- `.agents/skills/<name>/SKILL.md` - portable repo-local skills for adopters after copying `scaffold/`
- `.agents/sessions/*` - gitignored task-closeout bundles and raw evidence

### Root `AGENTS.md` vs `.agents/AGENTS.md` (important for Kilo)

Do not assume `.agents/AGENTS.md` is automatically repo-wide in Kilo.

Kilo's documented instruction sources include root `AGENTS.md`, `.kilo/instructions.md`, and configured instruction globs. That means the safest split is:

- **Root `AGENTS.md`** - short bootstrap that routes Kilo into the knowledge layer
- **`.agents/AGENTS.md`** - the durable, portable repo instructions file copied from `scaffold/`

In other words, root `AGENTS.md` is the entrypoint and `.agents/AGENTS.md` is the source of truth. The same distinction matters in this starter repo itself: the repo's own `.agents/` is maintainer dogfood, while `scaffold/` is the distributable template consumers copy into their own repos.

### Kilo-native structures vs `.agents/`

Kilo already has native commands, agents, skills, and instructions. The integration risk is not missing capability; it is **duplicated policy**.

Avoid putting durable repo guidance in all of these places at once:

- `.kilo/agent/*.md`
- `.kilo/command/*.md`
- `.kilo/instructions.md`
- `.agents/AGENTS.md` and `.agents/docs/*`

Keep one source of truth under `.agents/`. Use `.kilo/` for thin wiring only.

## 3. Setup steps

### Recommended pattern: `.agents/` as canonical knowledge, `.kilo/` as wiring

1. Install or merge the kit so the target repo has a real `.agents/` tree.
2. Add a short root `AGENTS.md` that tells Kilo to read `.agents/AGENTS.md` and `.agents/docs/index.md`.
3. Keep durable repo policy in `.agents/`, not in `.kilo/instructions.md` or agent prompts.
4. Add only thin Kilo wiring under `.kilo/` when you need Kilo-native ergonomics such as slash commands or agent selection.
5. Keep personal defaults in global Kilo config; commit only repo-specific project config.

### Example root `AGENTS.md`

```markdown
# AGENTS.md

This repo uses the Agent Knowledge Starter Kit.

- Read `.agents/AGENTS.md` for durable repo guidance.
- Use `.agents/docs/index.md` to find decisions, troubleshooting, and playbooks.
- Keep raw task evidence in `.agents/sessions/`.
- Do not duplicate long-lived policy into `.kilo/` files; keep Kilo config as thin wiring.
```

### Example thin Kilo project config

If the repo needs explicit instruction routing, keep it small:

```json
{
  "instructions": [
    "AGENTS.md"
  ]
}
```

Only add more Kilo config when the repo needs it. Kilo supports project and global scopes with deep-merge precedence, so a committed project file should express shared repo behavior, not personal defaults.

### Example thin Kilo command

If you want a Kilo slash command for knowledge maintenance, point it back at the canonical files instead of pasting the whole procedure into the command body:

```markdown
---
description: Close a task using the repo knowledge workflow
---

Read `.agents/skills/task-closeout/SKILL.md` and follow it exactly.
Keep temporary evidence under `.agents/sessions/`.
```

The same rule applies to `.kilo/agent/*.md`: keep the agent prompt short and route it to `.agents/` docs instead of forking the guidance.

## 4. Workflow

Suggested Kilo workflow in a kit-enabled repo:

1. Start from the repository root so project Kilo config and root `AGENTS.md` are both in scope.
2. Read root `AGENTS.md`, then open `.agents/AGENTS.md` and `.agents/docs/index.md`.
3. Use `.agents/playbooks/` and `.agents/docs/troubleshooting.md` for repo-specific procedures instead of encoding them into `.kilo/agent/*.md`.
4. Use `.kilo/command/*.md` and `.kilo/agent/*.md` only as convenience wrappers that reference canonical `.agents/` files.
5. Keep raw session evidence in `.agents/sessions/`, then distill stable lessons back into `.agents/docs/*` or `.agents/AGENTS.md`.
6. When Kilo-native skills are helpful, keep them clearly separate from repo knowledge and document why they exist outside `.agents/`.

### When to use Kilo-native skills at all

Use Kilo-native skills only when you need Kilo-specific behavior that should not be part of the cross-tool repo contract.

Good examples:

- Kilo-only task routing or UI workflow
- Kilo-specific MCP usage patterns
- personal or org-wide skills delivered through extra Kilo skill paths

Poor examples:

- copying `.agents/docs/troubleshooting.md` into `.kilo/skills/.../SKILL.md`
- rewriting `task-closeout` in Kilo format when the repo already has `.agents/skills/task-closeout/SKILL.md`
- duplicating repo architecture rules into `.kilo/instructions.md`

## 5. Two-tool example: Kilo Code + Codex sharing a repo

This is the cleanest shared setup for teams using Kilo alongside another agent that already understands `AGENTS.md` well.

- **Kilo Code** uses root `AGENTS.md` plus thin `.kilo/` wiring for commands or agent selection.
- **Codex** uses the same root `AGENTS.md` and reads repo knowledge from `.agents/`.
- **Shared contract** is the repo's `.agents/` tree, not duplicated prose in each tool's native config.

Example flow:

1. A repo has a short root `AGENTS.md` that points both tools to `.agents/AGENTS.md` and `.agents/docs/index.md`.
2. Kilo runs a repo-local slash command from `.kilo/command/closeout.md`, but that command simply tells the agent to read `.agents/skills/task-closeout/SKILL.md`.
3. Codex later reads the same `.agents/` files directly and updates durable docs after a learning pass.
4. Both tools stay aligned because the knowledge lives in Git under `.agents/`, while `.kilo/` remains thin, replaceable wiring.

The same pattern works with Cursor: keep Cursor rules and Kilo config as small routers, and keep policy in `.agents/`.

## 6. Troubleshooting

### Kilo does not seem to follow the repo knowledge layer

#### Symptom

Kilo follows project-local prompts or defaults, but ignores the durable guidance under `.agents/`.

#### Likely causes

- There is no root `AGENTS.md` bootstrap.
- Repo guidance was placed only in `.agents/AGENTS.md`, which Kilo may not load repo-wide unless routed there.
- Project config points to other instruction files and never mentions the `.agents/` layer.

#### Fix

Add or tighten root `AGENTS.md`, then keep any `.kilo/instructions.md` content short and explicitly routed to `.agents/`. If you use the `instructions` config field, point it at the bootstrap or canonical files rather than inventing a parallel policy stack.

#### Validation

Start a fresh Kilo session from the repo root and confirm it reads root `AGENTS.md` first, then the referenced `.agents/` files.

### Guidance diverges between `.kilo/` and `.agents/`

#### Symptom

The Kilo agent prompt says one thing, but `.agents/AGENTS.md` or `.agents/docs/*` says another.

#### Likely causes

Durable repo rules were copied into `.kilo/agent/*.md`, `.kilo/command/*.md`, or `.kilo/instructions.md` instead of referenced.

#### Fix

Shrink `.kilo/` files down to pointers, routing, and Kilo-only behavior. Update the canonical prose in `.agents/`.

#### Validation

A repo policy change should require editing one canonical `.agents/` file, plus optional `.kilo/` wiring only if the path or trigger changed.

### Confusion between `.kilo/skills` and `.agents/skills`

#### Symptom

Team members are unsure which skill directory to edit, or the same workflow exists in both places with different wording.

#### Likely causes

- `.kilo/skills` was treated as the place for repo knowledge instead of Kilo-native skills.
- A cross-tool workflow such as closeout or distillation was duplicated in Kilo's native skill format.

#### Fix

Use `.agents/skills/` for the starter kit's portable repo workflows. Use `.kilo/skill/` or `.kilo/skills/` only for Kilo-specific skills that should stay outside the cross-tool knowledge contract.

#### Validation

For a shared workflow like task closeout, there is one canonical file under `.agents/skills/<name>/SKILL.md`, and any Kilo command or agent simply points to it.

### Project and global Kilo config behave differently than expected

#### Symptom

Two users open the same repo but Kilo behaves differently, or a committed project config does not seem to win.

#### Likely causes

- A global Kilo config in `~/.config/kilo/kilo.json` adds or overrides behavior.
- The project uses both `kilo.json` and `.kilo/kilo.json`, and later-precedence values are winning through deep merge.
- Personal global skills or instruction paths are affecting one machine only.

#### Fix

Debug with the documented precedence model in mind: remote/global settings first, then project-level config, then higher-precedence project or managed overrides. Keep committed repo config minimal and explicit so it is obvious which behavior is shared and which is local.

#### Validation

After removing or accounting for the higher-precedence override, a fresh Kilo session from the repo root follows the committed bootstrap and reads the intended `.agents/` files.

## 7. References

- `README.md` - starter kit overview, `scaffold/` vs `.agents/`, and integration index
- `docs/integrations/README.md` - integration guide index
- `docs/integrations/codex.md` - shared-repo pattern for Kilo plus another agent
- `.agents/plans/add-integrations.md` - integration guide conventions and tracking
- `.agents/playbooks/writing-integration-guides.md` - convergence and anti-duplication guidance
- `.agents/docs/repo-decisions.md` - why integration guides live under `docs/integrations/`
- `.agents/docs/troubleshooting.md` - repo-level recurring integration pitfalls
