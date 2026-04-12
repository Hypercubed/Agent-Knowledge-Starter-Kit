# Claude Code Integration Guide

Claude Code and this starter kit are a natural fit: Claude Code reads `CLAUDE.md` files for persistent instructions and supports repo-local skills under `.claude/skills/`. The kit adds a structured knowledge layer around those primitives, separating durable repo guidance from temporary task evidence.

* **Claude Code** is Anthropic's agentic coding tool, available in the terminal, VS Code, JetBrains, a desktop app, and the browser. It reads your codebase, edits files, runs commands, and connects to external tools via MCP.
* **This kit** is a **repo-scoped knowledge layer** under `.agents/`: durable guidance, docs, playbooks, skills, and gitignored session bundles for distillation.

This guide was checked against Claude Code documentation on April 12, 2026. Re-check [code.claude.com/docs](https://code.claude.com/docs) after updates, particularly around memory behavior and skill discovery.

## 1. Prerequisites

You should have:

* a repository that already contains (or you are about to add) the kit layout under `.agents/` — typically by copying `scaffold/` from this starter kit
* Claude Code installed (terminal, VS Code extension, JetBrains plugin, desktop app, or web)
* a `CLAUDE.md` at the project root if you want Claude Code to discover the kit during normal work outside `.agents/`
* permission to read and write `.agents/` for both implementation work and knowledge maintenance tasks

For normal local work, keep the repo under version control before delegating agentic tasks. Durable knowledge changes should be reviewable in Git the same way code changes are.

## 2. Discovery mechanism

### What Claude Code discovers natively

Claude Code has its own instruction and memory system:

| Mechanism | Where it lives | Role |
| --- | --- | --- |
| **`CLAUDE.md`** | Project root, `.claude/CLAUDE.md`, subdirectories, `~/.claude/CLAUDE.md` | Persistent instructions loaded at session start; hierarchy walks up from working directory |
| **`CLAUDE.local.md`** | Project root or subdirectory (add to `.gitignore`) | Personal per-project preferences not committed to version control |
| **`.claude/rules/*.md`** | Project-scoped rules directory | Modular instructions, optionally scoped to file paths via `paths:` frontmatter |
| **Auto memory** | `~/.claude/projects/<project>/memory/MEMORY.md` | Notes Claude writes itself; first 200 lines loaded each session |
| **Skills** | `.claude/skills/<name>/SKILL.md` | Reusable on-demand workflows; not loaded at session start |
| **MCP servers** | Configured in Claude Code settings | External tool integrations (Google Drive, Jira, Slack, etc.) |

Claude Code walks up the directory tree from your working directory and loads all `CLAUDE.md` and `CLAUDE.local.md` files it finds. More specific locations take precedence when instructions conflict. Files in subdirectories below the working directory are loaded lazily, when Claude reads files in those subdirectories.

### What the kit provides

The starter kit stores repo-specific knowledge in the repository itself:

* `.agents/AGENTS.md` — concise repo-wide durable guidance
* `.agents/docs/*` — index, decisions, troubleshooting, maintenance schema, log
* `.agents/playbooks/` — multi-step procedures
* `.agents/skills/<n>/SKILL.md` — portable repo-local skills
* `.agents/sessions/` — task-closeout bundles, usually gitignored except `README.md`

### Root `CLAUDE.md` vs `.agents/AGENTS.md` (important for Claude Code)

Claude Code reads `CLAUDE.md`, not `AGENTS.md`. If your repository already has an `AGENTS.md` used by other coding agents, create a `CLAUDE.md` that imports it so both tools stay in sync without duplicating content:

```markdown
@AGENTS.md

## Claude Code

Consult `.agents/AGENTS.md` for durable repo guidance.
Use `.agents/docs/index.md` to find playbooks and troubleshooting docs.
Keep temporary task evidence in `.agents/sessions/` (gitignored bundles).
```

The `@path` import syntax expands and injects the referenced file into Claude's context at session start. Use it to bridge the two systems rather than maintaining two separate instruction files.

`.agents/AGENTS.md` is a nested file — Claude Code will only load it lazily, when Claude reads files inside `.agents/`. A root `CLAUDE.md` with an explicit import or pointer ensures the kit's guidance is in context for work anywhere in the repo.

### Claude Code skills and kit `.agents/skills/`

Claude Code's native skills live under `.claude/skills/`, not `.agents/skills/`. These are different locations. The kit's `.agents/skills/<n>/SKILL.md` files are ordinary repo files that Claude Code can read on demand via bash or explicit instructions — they are not auto-discovered as native Claude Code skills.

Two practical approaches:

1. **Reference by path in `CLAUDE.md`**: instruct Claude to read `.agents/skills/task-closeout/SKILL.md` when closing a task. This keeps the kit portable without requiring a second skill location.
2. **Symlink into `.claude/skills/`**: if you want native skill invocation, symlink the relevant `.agents/skills/<n>/` directories into `.claude/skills/`. The skill name is taken from the directory name, and `SKILL.md` must be present inside. Keep symlinks explicit so the indirection is visible.

For most kit workflows, option 1 is simpler and avoids creating a second namespace to maintain.

## 3. Setup steps

### Recommended pattern: thin `CLAUDE.md` bootstrap, fat `.agents/` tree

1. **Install the kit** by copying or merging `scaffold/` into the target repo's `.agents/` directory (follow `INSTALL.md`).
2. **Add a root `CLAUDE.md`** if the repo does not already have one. Keep it short — its job is to route Claude into `.agents/`, not to duplicate long policy.
3. **Keep all durable repo knowledge in `.agents/`** — same as the kit docs.
4. **Use `@path` imports** in `CLAUDE.md` to pull in content Claude should always have, such as the `AGENTS.md` bridge above.
5. **Keep personal preferences** in `~/.claude/CLAUDE.md` or a gitignored `CLAUDE.local.md`, not in the committed `CLAUDE.md`.
6. **Do not move integration guides into `.agents/`** — user-facing tool setup belongs in root `docs/integrations/`.

### Example root `CLAUDE.md`

```markdown
# CLAUDE.md

This repo uses the Agent Knowledge Starter Kit.

- Read `.agents/AGENTS.md` for durable repo guidance and conventions.
- Use `.agents/docs/index.md` to find decisions, troubleshooting, and playbooks.
- For task boundaries, read `.agents/skills/task-closeout/SKILL.md` before closing work.
- Keep raw task evidence under `.agents/sessions/` (gitignored bundles); do not promote session notes into durable docs without a learning pass.

@AGENTS.md
```

### Example: optionally bridging to native skills

If you want kit maintenance workflows to be invokable as native Claude Code skills:

```bash
# One-time setup per repo
mkdir -p .claude/skills
ln -s ../../.agents/skills/task-closeout .claude/skills/task-closeout
ln -s ../../.agents/skills/learning-distill .claude/skills/learning-distill
ln -s ../../.agents/skills/knowledge-lint .claude/skills/knowledge-lint
```

After symlinking, Claude Code can discover these as named skills. Invoke them explicitly when they matter: "use the task-closeout skill" or `/task-closeout` if you've set up a matching slash command. Skill auto-detection is not always reliable, so explicit invocation is preferred for maintenance workflows.

### Using `.claude/rules/` for path-scoped guidance

For teams that want to enforce kit conventions only when editing certain files, add a rules file:

`.claude/rules/agent-knowledge-kit.md`:

```markdown
---
paths:
  - ".agents/**/*.md"
---

# Agent Knowledge Kit maintenance rules

When editing files under `.agents/`:
- Do not bloat `.agents/AGENTS.md` with temporary task history.
- Respect the maintenance schema in `.agents/docs/MAINTENANCE.md`.
- Keep session bundles under `.agents/sessions/` and out of commits.
- After a meaningful change, note it in `.agents/docs/log.md`.
```

Rules without a `paths` field load every session. Keep unconditional rules short; move scope-specific guidance into path-scoped rules.

## 4. Workflow

Suggested Claude Code workflow in a kit-enabled repo:

1. Launch Claude Code from the repository root so the root `CLAUDE.md` loads at startup.
2. For work that touches repo conventions, confirm Claude has read `.agents/AGENTS.md` and `.agents/docs/index.md` before proceeding.
3. At task completion, ask Claude to read `.agents/skills/task-closeout/SKILL.md` and follow it. The closeout bundle goes under `.agents/sessions/<folder>/`.
4. Run a separate learning pass: ask Claude to read `.agents/skills/learning-distill/SKILL.md` and promote only stable lessons into `.agents/docs/` or `.agents/AGENTS.md`.
5. Periodically run `knowledge-lint` to keep the durable layer coherent.
6. When you change durable guidance, edit `.agents/` first. Update `CLAUDE.md` only if the wiring changed — new paths, new mandatory steps.
7. Use `/memory` to check what auto memory has accumulated. If Claude has saved a useful project fact to auto memory that belongs in `CLAUDE.md` instead, move it manually; auto memory is machine-local and does not share across teammates.

## 5. CLAUDE.md vs auto memory vs `.agents/`

Claude Code has two built-in persistence mechanisms in addition to the kit's `.agents/` layer. Understanding which layer to use for what prevents duplication and drift:

| What | Where |
| --- | --- |
| Durable repo policy, conventions, architecture | `.agents/AGENTS.md` (kit) |
| Multi-step maintenance procedures | `.agents/playbooks/` (kit) |
| Routing pointer for Claude Code | root `CLAUDE.md` |
| Personal machine preferences (all projects) | `~/.claude/CLAUDE.md` |
| Personal per-project preferences (gitignored) | `CLAUDE.local.md` |
| Learnings Claude discovers automatically (machine-local) | auto memory (`~/.claude/projects/.../MEMORY.md`) |
| Temporary task evidence | `.agents/sessions/` (kit, gitignored) |

The key distinction: `.agents/` is the shared, committed source of truth for the team. Auto memory is machine-local and appropriate for personal patterns Claude discovers. `CLAUDE.md` is wiring — keep it short.

## 6. Two-tool example: Claude Code + Cursor sharing a repo

**Scenario:** A team uses Claude Code in the terminal for agentic tasks and Cursor in the IDE for day-to-day editing.

* **Claude Code** reads root `CLAUDE.md`, follows the `@AGENTS.md` import, and runs closeout or distillation workflows using `.agents/skills/`.
* **Cursor** uses a thin `.cursor/rules/` layer or root `AGENTS.md` to point its Agent at the same `.agents/` files (see [cursor.md](./cursor.md) for Cursor-specific setup).
* **Shared contract** is the repo's `.agents/` tree, committed to version control.

Example flow:

1. You implement a feature in Cursor with an always-on rule pointing to `.agents/AGENTS.md`.
2. You switch to Claude Code in the terminal to run a broader refactor. Root `CLAUDE.md` loads the same conventions.
3. Claude Code closes the task with a bundle under `.agents/sessions/`, following `task-closeout`.
4. You run a learning pass in Claude Code: `$learning-distill` (or explicit instruction) promotes stable lessons into `.agents/docs/`.
5. Both Cursor and Claude Code read the updated durable docs on the next session because the knowledge lives in Git, not in a vendor-specific chat history.

## 7. Troubleshooting

### Claude Code does not follow `.agents/AGENTS.md`

#### Symptom

Claude follows root instructions but ignores durable guidance under `.agents/`.

#### Likely causes

* There is no root `CLAUDE.md` or it does not import or reference `.agents/AGENTS.md`.
* Claude Code was launched from a subdirectory whose hierarchy does not include the root `CLAUDE.md`.
* The root `CLAUDE.md` is too long and the relevant instructions are deprioritized.

#### Fix

Add or tighten the root `CLAUDE.md` with an explicit `@AGENTS.md` import or a clear pointer. Keep `CLAUDE.md` short — target under 200 lines. Use `/memory` in a session to verify which files loaded.

#### Validation

Start a fresh Claude Code session, run `/memory`, and confirm both `CLAUDE.md` and the imported `AGENTS.md` appear in the loaded files list.

### Auto memory conflicts with `.agents/` guidance

#### Symptom

Claude follows auto memory that contradicts `.agents/AGENTS.md`.

#### Likely causes

Auto memory accumulated a stale or incorrect fact that now overrides intended behavior. Auto memory is delivered alongside `CLAUDE.md` at session start, so it carries similar weight.

#### Fix

Run `/memory`, open the auto memory folder, and delete or edit the conflicting entry. If a correction belongs to the whole team, move it from auto memory into `.agents/AGENTS.md` and commit it.

#### Validation

After editing auto memory, start a fresh session and confirm Claude follows the canonical `.agents/` guidance.

### Kit skills not recognized as native Claude Code skills

#### Symptom

Asking Claude to use "task-closeout" or invoking `$task-closeout` does not find the skill.

#### Likely causes

`.agents/skills/` is not in the `.claude/skills/` discovery path. Claude Code discovers native skills from `.claude/skills/` (project) and `~/.claude/skills/` (user), not from `.agents/skills/`.

#### Fix

Either (a) add explicit instructions in `CLAUDE.md` to read the skill file by path: "before closing a task, read `.agents/skills/task-closeout/SKILL.md` and follow it," or (b) symlink the relevant skill directories into `.claude/skills/` as described in Setup.

#### Validation

Ask Claude to read the skill file explicitly. Confirm it opens and reads `.agents/skills/task-closeout/SKILL.md` from disk.

### `CLAUDE.md` grows too large and adherence degrades

#### Symptom

Claude ignores some instructions or picks between conflicting rules arbitrarily.

#### Likely causes

`CLAUDE.md` exceeds ~200 lines, consuming excess context. Or instructions are vague and Claude deprioritizes them when they seem irrelevant to the current task.

#### Fix

Move detailed, scope-specific content to `.claude/rules/` with `paths:` frontmatter, or to `.agents/playbooks/`. Keep root `CLAUDE.md` to routing and universally applicable facts only.

#### Validation

Run `/memory` to inspect loaded files. Check that `CLAUDE.md` is short and the detailed guidance is reachable from playbooks or path-scoped rules.

### Guidance is duplicated between `CLAUDE.md` and `.agents/AGENTS.md`

#### Symptom

Editing a convention requires updating both `CLAUDE.md` and `.agents/AGENTS.md`. They drift apart over time.

#### Likely causes

Long policy was copied into `CLAUDE.md` rather than kept in `.agents/AGENTS.md` and imported.

#### Fix

Shrink `CLAUDE.md` to pointers and `@path` imports. Keep durable policy in `.agents/AGENTS.md`. One canonical file per concern.

#### Validation

A convention change should require editing one `.agents/` file, not hunting duplicate prose across `CLAUDE.md` and `.agents/`.

## 8. References

* [Claude Code overview](https://code.claude.com/docs/en/overview) — surfaces, installation, and capabilities
* [How Claude remembers your project](https://code.claude.com/docs/en/memory) — `CLAUDE.md`, `.claude/rules/`, auto memory, `AGENTS.md` import
* [Skills](https://code.claude.com/docs/en/skills) — native skill discovery, `SKILL.md` conventions, `.claude/skills/`
* [`README.md`](../../README.md) — kit overview and root vs `.agents/AGENTS.md` split
* [`INSTALL.md`](../../INSTALL.md) — adopting `scaffold/` into `.agents/`
* [`cursor.md`](./cursor.md) — Cursor integration (complementary tool, shared `.agents/` contract)
* [`codex.md`](./codex.md) — Codex integration (contrasting native skill namespace with path-based skill references)
* [`.agents/plans/add-integrations.md`](../../.agents/plans/add-integrations.md) — integration doc conventions for this repository
