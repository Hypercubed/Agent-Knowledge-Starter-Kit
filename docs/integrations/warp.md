# Warp Integration Guide

Warp and this starter kit compose cleanly when you keep one canonical knowledge layer in the repository.

- **Warp** is the product surface (terminal, local agents, rules, slash commands, and cloud-agent entry points).
- **Oz** is Warp's agent/runtime layer used in Warp local agent conversations and the cloud-agent platform.
- **This kit** is the **repo-scoped knowledge layer** under `.agents/`: durable guidance, docs, playbooks, skills, and session bundles for distillation.

This guide is based on current Warp documentation reviewed on April 13, 2026. Re-check linked docs after major Warp or Oz updates.

## 1. Prerequisites

You should have:

- a repository using this starter kit layout (or equivalent) under `.agents/`
- Warp with Agent Mode enabled
- permission to keep a root `AGENTS.md` bootstrap in the repository
- permission to read and update `.agents/AGENTS.md`, `.agents/docs/`, `.agents/playbooks/`, `.agents/skills/`, and `.agents/sessions/`
- clarity on this starter-kit repo split:
  - `scaffold/` is the distributable kit copied into consumer repos as `.agents/`
  - root `.agents/` in this repository is maintainer dogfood for the starter-kit project

Optional:

- Oz CLI (`oz`) if you want cloud-agent runs from terminal workflows
- Warp Drive rules/prompts if your team uses global context in addition to repo-scoped rules

## 2. Discovery mechanism

### What Warp discovers natively

Warp has native mechanisms that overlap with the kit:

- **Project Rules** via `AGENTS.md` (or backward-compatible `WARP.md`) in your repo
- **Global Rules** in Warp Drive
- **Project and global skills** discovered from supported skill directories, including `.agents/skills/`
- **Slash commands** like `/init`, `/plan`, `/skills`, `/open-project-rules`, and `/create-environment`
- **Codebase indexing/context** for git repositories

Important Warp rule details:

- project rules filename must be uppercase (`AGENTS.md`)
- if both `WARP.md` and `AGENTS.md` exist in the same directory, `WARP.md` takes priority
- Warp applies root and current-directory project rules, with subdirectory rules taking precedence over root and then global rules

### What the kit provides

The starter kit stores durable repo knowledge on disk:

- `.agents/AGENTS.md` — concise durable repo guidance
- `.agents/docs/*` — index, decisions, troubleshooting, log, maintenance schema
- `.agents/playbooks/` — multi-step procedures
- `.agents/skills/<name>/SKILL.md` — portable repo-local workflows
- `.agents/sessions/` — temporary task-closeout bundles (usually gitignored)

### Root `AGENTS.md` vs `.agents/AGENTS.md` (important for Warp)

Use the same routing split used across other tools:

- **Root `AGENTS.md`**: thin Warp-facing bootstrap and entrypoint
- **`.agents/AGENTS.md`**: durable, portable repo guidance

Keep policy canonical under `.agents/`; keep root `AGENTS.md` short and routing-focused.

## 3. Setup steps

### Recommended pattern: thin root rules, canonical `.agents/`

1. Install or merge this kit so the target repo has a real `.agents/` tree.
2. Add a short root `AGENTS.md` if missing.
3. Keep durable repo policy in `.agents/`, not duplicated across global rules or root bootstrap files.
4. Keep repo-local reusable workflows in `.agents/skills/` so Warp can discover them as project skills.
5. Use Warp global rules only for cross-repo preferences; keep repo-specific conventions in `.agents/`.

### Example root `AGENTS.md`

```markdown
# AGENTS.md

This repo uses the Agent Knowledge Starter Kit.

- Read `.agents/AGENTS.md` for durable repo guidance.
- Use `.agents/docs/index.md` to find decisions, troubleshooting, and playbooks.
- Treat `.agents/skills/*/SKILL.md` as canonical repo-local workflows.
- Keep temporary task evidence in `.agents/sessions/`; promote only durable lessons into `.agents/`.
```

### Using `/init` with existing instruction files

Warp `/init` can generate `AGENTS.md` and can also link supported existing rule files. If your repo already uses one of those files, keep the routing pattern: ensure the resulting project rule still points to `.agents/AGENTS.md` and `.agents/docs/index.md` instead of duplicating long policy.

## 4. Workflow

Suggested Warp workflow in a kit-enabled repository:

1. Start local work in Warp Agent Mode from the repo root.
2. Confirm root `AGENTS.md` routes into `.agents/` before changing conventions.
3. Read `.agents/AGENTS.md` and `.agents/docs/index.md` for durable guidance.
4. Use repo-local skills from `.agents/skills/` for closeout, distillation, and maintenance workflows.
5. Keep temporary evidence in `.agents/sessions/`; keep durable lessons in `.agents/docs/`, `.agents/playbooks/`, or `.agents/AGENTS.md`.
6. For larger background or parallel jobs, use cloud agents (for example via `/cloud-agent`, `/create-environment`, or `oz agent run-cloud`) while keeping `.agents/` as the source of truth for repo policy.
7. Review diffs and commit only durable knowledge updates; session bundles should usually remain uncommitted.

## 5. Two-tool example: Warp + Codex sharing a repo

**Scenario:** Developers use Warp for daily terminal workflows and cloud orchestration, while Codex is also used for refactors in the same repository.

- **Warp** reads root `AGENTS.md`, can discover `.agents/skills/`, and can run local or cloud Oz agents.
- **Codex** reads root `AGENTS.md` and discovers `.agents/skills/` natively.
- **Shared contract** is `.agents/` under version control.

Example flow:

1. A task is implemented from Warp Agent Mode following `.agents/AGENTS.md`.
2. The maintainer runs the repo's closeout workflow and writes a bundle under `.agents/sessions/`.
3. Later, Codex performs a related migration and reads the same durable guidance.
4. A learning pass promotes stable lessons into `.agents/docs/`; both tools see updates automatically from Git.

## 6. Troubleshooting

### Warp follows root rules but misses `.agents/` guidance

#### Symptom

Responses follow generic project rules but omit repo-specific guidance from `.agents/`.

#### Likely causes

- root `AGENTS.md` does not explicitly route to `.agents/AGENTS.md` and `.agents/docs/index.md`
- root file became a long policy document and drifted from `.agents/`

#### Fix

Reduce root `AGENTS.md` to a short bootstrap and keep durable guidance in `.agents/`.

#### Validation

Start a fresh conversation and ask the agent to summarize active repo guidance; it should reference `.agents/` files.

### Conflicting guidance between global Warp rules and repo policy

#### Symptom

Agent behavior differs between repositories or ignores project-specific conventions.

#### Likely causes

- global rules include repo-specific instructions that should live in `.agents/`

#### Fix

Move repo-specific policy into `.agents/`; keep global Warp rules for cross-repo defaults only.

#### Validation

Changing one repo policy should require editing repo files, not Warp-global rules.

### Skill ambiguity or unexpected skill selection

#### Symptom

A similarly named skill is invoked from an unexpected path.

#### Likely causes

- multiple skills with the same name exist in scope (project and/or global)

#### Fix

Use distinct skill names when possible and verify the selected skill path/description from the skills menu.

#### Validation

Invoke the intended skill and confirm it resolves to the repository path under `.agents/skills/`.

## 7. References

- [Warp Rules](https://docs.warp.dev/agent-platform/capabilities/rules)
- [Warp Skills](https://docs.warp.dev/agent-platform/capabilities/skills)
- [Warp Slash Commands](https://docs.warp.dev/agent-platform/capabilities/slash-commands)
- [Warp Local Agents Overview](https://docs.warp.dev/agent-platform/local-agents/overview)
- [Warp Coding in Warp quickstart](https://docs.warp.dev/warp/getting-started/quickstart/coding-in-warp)
- [Oz Platform overview](https://docs.warp.dev/agent-platform/cloud-agents/platform)
- [Skills as Agents](https://docs.warp.dev/agent-platform/cloud-agents/skills-as-agents)
- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [`codex.md`](./codex.md)
