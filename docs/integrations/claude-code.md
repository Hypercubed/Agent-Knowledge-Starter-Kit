# Claude Code Integration Guide

Claude Code and this starter kit complement each other naturally. Claude Code's `CLAUDE.md` provides session-start context; the kit adds the structured repo knowledge layer, session bundles, and distillation workflow that survive beyond a single conversation.

- **Claude Code** is Anthropic's CLI for Claude. It reads `CLAUDE.md` at the project root and in parent directories, exposes `.claude/commands/*.md` as custom slash commands, supports hooks via `.claude/settings.json`, and maintains an agent-private memory system across sessions.
- **This kit** is a **repo-scoped knowledge layer** under `.agents/`: durable guidance, docs, playbooks, skills, and gitignored session bundles for distillation.

This guide was written and verified against Claude Code's behavior in this repository on April 12, 2026. Re-check linked Anthropic documentation after Claude Code updates, especially around `CLAUDE.md` discovery and custom command formats.

## 1. Prerequisites

You should have:

- a repository that already contains (or you are about to add) the kit layout under `.agents/` — typically by copying `scaffold/` from this starter kit
- Claude Code CLI installed (`claude` on your PATH) or the Claude Code extension in your editor
- permission to add version-controlled project configuration (`CLAUDE.md`, optionally `.claude/commands/`)
- clarity on whether personal preferences belong in `~/.claude/CLAUDE.md` (global user) or in the project-level `CLAUDE.md` (repo-shared)

Optional:

- `.claude/commands/` if you want to expose kit skills as Claude Code slash commands
- `.claude/settings.json` hooks for inline automation tied to file-edit or session events
- MCP server configuration in settings for extended tool access

## 2. Discovery mechanism

### What Claude Code discovers natively

| Mechanism | Where it lives | Role |
| --- | --- | --- |
| `CLAUDE.md` | Project root, parent directories, `~/.claude/CLAUDE.md` | Primary instruction file; loaded hierarchically at session start |
| `AGENTS.md` | Project root | Also read as additional agent instructions |
| `.claude/commands/*.md` | `.claude/commands/` (project) or `~/.claude/commands/` (user) | Custom slash commands, invoked as `/command-name` in chat |
| `.claude/settings.json` | `.claude/settings.json` (project) or `~/.claude/settings.json` (user) | Hooks, MCP configuration, and behavioral settings |
| Auto-memory | `~/.claude/projects/<project>/memory/` | Agent-private persistent memory across sessions for the current user |
| MCP servers | Settings files | External tools and context providers |

Claude Code walks `CLAUDE.md` from the project root upward through parent directories, then to `~/.claude/CLAUDE.md`. Files closer to the working directory take precedence for conflicting guidance.

### What the kit provides

The starter kit stores repo-specific knowledge in the repository itself:

- `.agents/AGENTS.md` — concise repo-wide durable guidance
- `.agents/docs/*` — index, decisions, troubleshooting, maintenance schema, log
- `.agents/playbooks/` — multi-step procedures
- `.agents/skills/<name>/SKILL.md` — portable skills (files, not a separate runtime registry)
- `.agents/sessions/` — task-closeout bundles, usually gitignored except `README.md`

### Root `CLAUDE.md` vs `.agents/AGENTS.md` (important for Claude Code)

Claude Code natively loads `CLAUDE.md` from the project root; it does **not** automatically load `.agents/AGENTS.md` unless a root instruction tells it to. Use this split:

- **`CLAUDE.md`** at the project root — short bootstrap that points Claude Code at `.agents/AGENTS.md` and `.agents/docs/index.md`. Keep it concise.
- **`.agents/AGENTS.md`** — the portable, durable instructions file copied from `scaffold/` into consumer repos.

This mirrors the same root-vs-durable pattern used by Codex and Cursor: one thin wiring file in the project root, one authoritative source of truth under `.agents/`.

### Claude Code auto-memory vs kit `.agents/docs/` (critical distinction)

Claude Code maintains an auto-memory system at `~/.claude/projects/<project>/memory/`. These files are:

- **agent-private**: accessible only to the Claude Code instance running as the current user
- **not version-controlled**: they live outside the repo, in the user's home directory
- **cross-session**: they persist across multiple Claude Code sessions for that user

The kit's `.agents/docs/` is the opposite:

- **repo-shared**: committed to git, readable by any agent or team member
- **version-controlled**: changes appear in `git log` and can be reviewed and reverted
- **tool-agnostic**: Codex, Cursor, or a CI job can all read the same files

**Do not use Claude Code auto-memory as a substitute for kit durable docs.** Lessons that belong in `.agents/docs/`, `.agents/AGENTS.md`, or `.agents/playbooks/` should be promoted there — not kept in `~/.claude/` where other contributors and other tools cannot see them.

### `.claude/commands/` vs kit `.agents/skills/`

Claude Code does **not** automatically discover `.agents/skills/*/SKILL.md` as slash commands (contrast with Codex, which explicitly scans `.agents/skills/`). The two registries are separate:

| Layer | Where | Invocation |
| --- | --- | --- |
| Kit skills | `.agents/skills/<name>/SKILL.md` | Explicit prompt: "read and follow `.agents/skills/task-closeout/SKILL.md`" |
| Claude Code commands | `.claude/commands/<name>.md` | `/name` in chat |

You can optionally bridge them: create a `.claude/commands/task-closeout.md` that instructs Claude Code to open and follow `.agents/skills/task-closeout/SKILL.md`. This is thin wiring — one or two lines — not a copy of the skill content.

## 3. Setup steps

### Recommended pattern: thin `CLAUDE.md`, fat `.agents/` tree

1. Install the kit by copying or merging `scaffold/` into the target repo's `.agents/` directory.
2. Add a short `CLAUDE.md` at the project root if the repo does not already have one.
3. Keep all durable repo policy in `.agents/`; root `CLAUDE.md` should route Claude Code rather than duplicate long guidance.
4. Keep personal or cross-project preferences in `~/.claude/CLAUDE.md`, not in the repo's `CLAUDE.md`.
5. Keep `.claude/settings.json` for project-specific hooks and MCP config; do not commit `.claude/settings.local.json`, which typically holds personal credentials or local overrides.

### Example root `CLAUDE.md`

```markdown
# CLAUDE.md

This repo uses the Agent Knowledge Starter Kit.

- Read `.agents/AGENTS.md` for durable repo guidance (build, test, conventions, pitfalls).
- Use `.agents/docs/index.md` to find decisions, troubleshooting docs, and playbooks.
- For task closeout, follow `.agents/skills/task-closeout/SKILL.md` and write the bundle under `.agents/sessions/`.
- Keep temporary task evidence in `.agents/sessions/`; do not promote session notes into durable docs without a learning pass through `.agents/skills/learning-distill/SKILL.md`.
```

Keep this short. Claude Code loads `CLAUDE.md` at every session; a large file is expensive context that crowds out the work.

### Optional: expose kit skills as Claude Code commands

Create `.claude/commands/task-closeout.md`:

```markdown
Read and follow `.agents/skills/task-closeout/SKILL.md`. Write the output bundle to `.agents/sessions/<timestamp>-<slug>/`.
```

This lets you invoke the skill with `/task-closeout` in chat. Keep the command file as a pointer, not a copy of the skill text.

### Hooks in `.claude/settings.json`

Claude Code's hook system runs shell commands on events such as session start or tool use. You can use hooks for lightweight automation — for example, to remind yourself of closeout steps or to run a linter after edits land:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [{ "type": "command", "command": "echo 'Did you close out with task-closeout? Check .agents/skills/task-closeout/SKILL.md'" }]
      }
    ]
  }
}
```

Keep hooks minimal. They fire on every matching event; a hook that runs constantly adds noise. Use hooks only when there is a genuine automation benefit, not just to repeat instructions already in `CLAUDE.md`.

## 4. Workflow

Suggested flow for Claude Code in a kit-enabled repo:

1. At session start, `CLAUDE.md` is loaded automatically. Claude Code does not re-read `.agents/AGENTS.md` unless explicitly asked or pointed there by `CLAUDE.md`.
2. Read `.agents/AGENTS.md` and `.agents/docs/index.md` when the task needs repo-wide policy.
3. For maintenance tasks, invoke kit skills explicitly — "run task-closeout" or "follow `.agents/skills/task-closeout/SKILL.md`". This works with no prior setup; Claude Code will find and read the skill file from the repo. The `.claude/commands/` wrapper (section 3) is a convenience for the `/name` shorthand, not a requirement.
4. Write session bundles under `.agents/sessions/<folder>/` (gitignored); do not put task notes in `.agents/AGENTS.md` or durable docs. Claude Code can write to `.agents/sessions/` without sandbox restrictions, unlike some other tools.
5. Run a learning pass using `.agents/skills/learning-distill/SKILL.md` to promote stable lessons into `.agents/docs/` or `.agents/AGENTS.md`.
6. Use `git diff` to review durable knowledge changes before committing. Session bundles should remain gitignored; only promote what is genuinely reusable.
7. Keep personal or session-scoped observations in Claude Code auto-memory; promote repo-shared lessons into `.agents/` instead.

## 5. Two-tool example: Claude Code + Codex sharing a repo

**Scenario:** A team uses Claude Code for day-to-day implementation and knowledge maintenance; Codex runs broader agentic tasks — cross-file refactors, dependency upgrades, or automated PR review — via CI.

- **Claude Code** reads root `CLAUDE.md`, follows `.agents/AGENTS.md` for repo policy, and writes session bundles via the `task-closeout` skill.
- **Codex** reads root `AGENTS.md`, discovers `.agents/skills/` natively, and invokes `$task-closeout` or `$learning-distill` as Codex skills.
- **Shared contract** is the `.agents/` tree under git.

Example flow:

1. You implement a feature in Claude Code following `.agents/AGENTS.md` conventions. At completion you invoke "follow `.agents/skills/task-closeout/SKILL.md`"; Claude Code writes a bundle under `.agents/sessions/`.
2. A Codex run performs a broader migration. Codex discovers `.agents/skills/` natively and invokes `$task-closeout`; its bundle also lands in `.agents/sessions/`.
3. You run a learning pass in Claude Code ("follow `.agents/skills/learning-distill/SKILL.md`, source `.agents/sessions/<bundle>`"). Promoted lessons update `.agents/docs/` and are committed.
4. On the next Codex session, Codex reads the same updated `.agents/AGENTS.md` and `.agents/docs/` without any extra export, because the knowledge is version-controlled in the repo.

Neither tool needs to read the other's chat history or private memory. The repo is the shared source of truth.

## 6. Troubleshooting

### Claude Code does not consult `.agents/AGENTS.md`

#### Symptom

Claude Code follows root `CLAUDE.md` but ignores durable guidance under `.agents/`.

#### Likely causes

- Root `CLAUDE.md` does not point Claude Code at `.agents/AGENTS.md`.
- Claude Code was invoked from a subdirectory and the root `CLAUDE.md` was not found in the directory walk.

#### Fix

Add an explicit pointer to `.agents/AGENTS.md` in root `CLAUDE.md`. Verify by asking Claude Code to summarize active instructions at session start; it should mention `.agents/AGENTS.md` if the pointer is in place.

#### Validation

Open a fresh Claude Code session from the repo root and ask: "What durable repo guidance applies here?" It should cite `.agents/AGENTS.md` content.

### Durable lessons accumulate in auto-memory instead of `.agents/`

#### Symptom

Useful lessons from completed sessions exist in `~/.claude/projects/.../memory/` but are invisible to teammates and other tools.

#### Likely causes

Claude Code's auto-memory is automatic and convenient. Without a deliberate promotion step it is easy to leave reusable insights there instead of surfacing them through `learning-distill`.

#### Fix

After task closeout, run a learning pass: "follow `.agents/skills/learning-distill/SKILL.md`, source `<session-bundle>`." Promote stable, reusable guidance into `.agents/docs/` or `.agents/AGENTS.md` and commit it. Personal session-scoped notes can stay in auto-memory.

#### Validation

A teammate or CI job following `.agents/AGENTS.md` sees the promoted lesson without needing access to your `~/.claude/` directory.

### `.claude/commands/` duplicates `.agents/skills/` content

#### Symptom

Skill text is copied verbatim into a `.claude/commands/<name>.md` file, creating two diverging copies.

#### Likely causes

The command file was written to be self-contained rather than delegating to the skill file.

#### Fix

Replace the command body with a one-line pointer: "Read and follow `.agents/skills/<name>/SKILL.md`." The canonical skill text lives in the kit; the command is only an invocation shortcut.

#### Validation

A change to `.agents/skills/<name>/SKILL.md` takes effect immediately without touching `.claude/commands/`.

### `settings.local.json` committed to the repo

#### Symptom

Personal credentials or local API keys appear in git history.

#### Likely causes

`.claude/settings.local.json` was staged alongside other `.claude/` changes.

#### Fix

Add `.claude/settings.local.json` to `.gitignore` immediately. Rotate any exposed credentials. Only commit `.claude/settings.json` (project-level, non-sensitive settings) if needed; keep credential-bearing config local-only.

#### Validation

`git log --all -- .claude/settings.local.json` returns no commits.

## 7. References

- [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code) — `CLAUDE.md`, custom commands, hooks, memory, MCP configuration
- [`README.md`](../../README.md) — kit overview and root vs `.agents/AGENTS.md` split
- [`INSTALL.md`](../../INSTALL.md) — adopting `scaffold/` into `.agents/`
- [`codex.md`](./codex.md) — contrasting Codex's native `.agents/skills/` discovery with Claude Code's explicit-reference model
- [`cursor.md`](./cursor.md) — comparison point for IDE rules-based wiring
- [`.agents/plans/add-integrations.md`](../../.agents/plans/add-integrations.md) — integration doc conventions for this repository
