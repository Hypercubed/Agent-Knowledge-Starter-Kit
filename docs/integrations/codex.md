# Codex Integration Guide

Codex and this starter kit are intentionally aligned: Codex can read `AGENTS.md` files for project instructions and can discover repo-local skills under `.agents/skills/`. The kit adds the repo knowledge structure around those primitives.

- **Codex** is OpenAI's coding agent across the CLI, IDE extension, app, web, and cloud workflows. It can read, edit, run commands, use approvals, and invoke skills.
- **This kit** is a **repo-scoped knowledge layer** under `.agents/`: durable guidance, docs, playbooks, skills, and gitignored session bundles for distillation.

This guide was checked against OpenAI Codex documentation on April 12, 2026. Re-check the linked docs after Codex updates, especially around sandbox defaults and skill discovery.

## 1. Prerequisites

You should have:

- a repo that uses this starter kit or an equivalent `.agents/` layout
- Codex CLI, the Codex IDE extension, or Codex app/cloud with file access to the repository
- a root `AGENTS.md` file if you want Codex to discover the kit during normal work outside `.agents/`
- permission to read `.agents/AGENTS.md`, `.agents/docs/`, `.agents/playbooks/`, and `.agents/skills/`
- an approval/sandbox mode that matches the task: read-only for inspection, workspace write for implementation, and explicit approval for network or out-of-workspace actions

For normal local work, keep the repo under version control before delegating. Codex recommends version-controlled folders for autonomous workspace-write operation, and this kit assumes knowledge changes can be reviewed in Git.

## 2. Discovery mechanism

### What Codex discovers natively

Codex has native systems that overlap with the kit:

| Mechanism | Where it lives | Role |
| --- | --- | --- |
| `AGENTS.md` / `AGENTS.override.md` | Codex home and project directories | Persistent instructions loaded at session start |
| Skills | `.agents/skills`, `$HOME/.agents/skills`, admin, and system locations | Reusable workflows loaded by explicit or implicit invocation |
| Config | usually `~/.codex/config.toml` | Sandbox, approvals, fallback instruction filenames, profiles, telemetry, and related settings |
| Rules | `~/.codex/rules/*.rules` | Experimental command-approval rules for running commands outside the sandbox |
| App / connector tools | configured through Codex or installed plugins | GitHub, Slack, Linear, MCP, and other integrations |

Codex builds an instruction chain once per run/session. It reads global instructions from Codex home, then project instructions from the project root down to the current working directory. Later files override earlier guidance because they appear later in the combined prompt.

### What the kit provides

The starter kit stores repo-specific knowledge in the repository itself:

- `.agents/AGENTS.md` — concise repo-wide durable guidance
- `.agents/docs/*` — index, decisions, troubleshooting, maintenance schema, log
- `.agents/playbooks/` — multi-step procedures
- `.agents/skills/<name>/SKILL.md` — portable repo-local skills
- `.agents/sessions/` — task-closeout bundles, usually gitignored except `README.md`

### Root `AGENTS.md` vs `.agents/AGENTS.md` (important for Codex)

Codex does **not** automatically treat `.agents/AGENTS.md` as the repo-wide project instruction file when you launch from the repository root. It discovers `AGENTS.md` files along the path from the project root to the current working directory.

Use this split:

- **Root `AGENTS.md`** — short bootstrap that tells Codex to read `.agents/AGENTS.md` and `.agents/docs/index.md`.
- **`.agents/AGENTS.md`** — the portable durable instructions file copied from `scaffold/` into consumer repos.

If you launch Codex from inside `.agents/`, the nested `.agents/AGENTS.md` can be discovered as a path-local instruction file. Do not rely on that for ordinary feature work in `src/`, `app/`, or other project folders.

### Codex skills and kit `.agents/skills/`

Codex intentionally scans repo-local `.agents/skills`. That means the kit's skills can be real Codex skills without extra conversion.

Codex also scans user, admin, and system skill locations. If two skills share the same `name`, Codex does not merge them; both can appear in skill selectors. Keep kit skill names clear and prefer explicit prompts such as `$task-closeout` or "read `.agents/skills/task-closeout/SKILL.md`" when a workflow matters.

## 3. Setup steps

### Recommended pattern: Codex-native discovery plus thin bootstrap

1. Install the kit by copying or merging `scaffold/` into the target repo's `.agents/` directory.
2. Add a short root `AGENTS.md` if the repo does not already have one.
3. Keep durable repo policy in `.agents/`; root `AGENTS.md` should route Codex rather than duplicate long guidance.
4. Leave portable kit skills under `.agents/skills/<name>/SKILL.md` so Codex can discover them.
5. Keep Codex user-wide preferences in Codex home (`~/.codex/AGENTS.md` or config), not in the repo.
6. Use Codex config for local sandbox, approval, and profile settings; do not commit personal `~/.codex/config.toml` into a consumer repo.

### Example root `AGENTS.md`

```markdown
# AGENTS.md

This repo uses the Agent Knowledge Starter Kit.

- Read `.agents/AGENTS.md` for durable repo guidance.
- Use `.agents/docs/index.md` to find decisions, troubleshooting, and playbooks.
- Treat `.agents/skills/*/SKILL.md` as repo-local Codex skills.
- Keep temporary task evidence in `.agents/sessions/`; do not promote session notes into durable docs without a learning pass.
```

### Optional Codex config

Codex already discovers `AGENTS.md` and `.agents/skills/` without custom config. Use config only when you need local behavior changes, for example:

```toml
# ~/.codex/config.toml
sandbox_mode = "workspace-write"
approval_policy = "on-request"
project_doc_max_bytes = 65536
```

If your team intentionally uses a different project instruction filename, add it with `project_doc_fallback_filenames`. Prefer keeping this kit on the standard `AGENTS.md` path unless the repo already has a strong reason not to.

### Protected `.agents/` paths

Codex security docs note that default `workspace-write` protected paths can include `.agents` as read-only. If your local Codex run cannot edit `.agents/`, that is likely a sandbox policy issue, not a kit layout issue.

For normal feature work, read-only `.agents/` is fine. For knowledge maintenance tasks, switch to an approval mode or writable-root configuration that explicitly allows the intended `.agents/` edits, then review the diff.

## 4. Workflow

Suggested Codex workflow in a kit-enabled repo:

1. Launch Codex from the repository root or the folder you intend to work in.
2. Confirm root `AGENTS.md` routes Codex into `.agents/` when the task depends on repo knowledge.
3. Read `.agents/AGENTS.md` and `.agents/docs/index.md` before changing conventions or recurring workflows.
4. Invoke repo-local skills explicitly for maintenance tasks: `$task-closeout`, `$learning-distill`, or `$knowledge-lint` when those skills are available.
5. Keep raw task evidence under `.agents/sessions/`; keep durable guidance in `.agents/AGENTS.md`, `.agents/docs/`, or `.agents/playbooks/`.
6. When changing knowledge files, respect the starter-repo boundary: update `scaffold/` only for consumer-generic kit content, and update this repo's `.agents/` only for maintainer dogfood.
7. Verify with `git status --short` and targeted file reads before finishing. Session bundles under `.agents/sessions/` are usually ignored, so confirm closeout files directly rather than expecting them in Git status.

### Task closeout and session IDs

When closing out a task with the `task-closeout` skill, capture the Codex session ID when the local Codex environment exposes one. This is optional metadata; omit it when the session ID is not available.

- In a Codex-run shell, check `CODEX_THREAD_ID`:

```bash
printenv CODEX_THREAD_ID
```

- If that variable is unavailable, local Codex installs may also record recent sessions in `~/.codex/session_index.jsonl`; match the current task name and updated timestamp, then use the `id` value.
- Local rollout transcripts may live under `~/.codex/sessions/<year>/<month>/<day>/` with the same ID in the filename and in the `session_meta` payload.
- To resume a session from the CLI, run `codex resume <session-id>`. The current CLI also accepts a thread name in place of the ID, and `codex resume --last` continues the most recent recorded session.
- Record `agent` as `codex` and record the ID as `agent_session_id` in `summary.json`; add matching Agent and Agent Session ID sections to `active-task.md`.

Treat the home-directory files as local implementation details for traceability, not as portable repo data. Do not commit Codex transcript files or rely on this metadata for agents/tools that cannot retrieve a stable session ID.

## 5. Two-tool example: Codex + Cursor sharing a repo

**Scenario:** A team uses Codex for deeper agentic tasks and Cursor for day-to-day IDE chat.

- **Codex** reads root `AGENTS.md`, discovers `.agents/skills/`, and can run closeout or learning workflows.
- **Cursor** uses a thin `.cursor/rules/` layer or root `AGENTS.md` to point Agent at the same `.agents/` files.
- **Shared contract** is the repo's `.agents/` tree.

Example flow:

1. Cursor implements a small change while following an always-on rule that points to `.agents/AGENTS.md`.
2. Codex later performs a broader refactor, invokes `$task-closeout`, and writes a session bundle under `.agents/sessions/`.
3. A maintainer runs Codex with `$learning-distill`, promotes stable lessons into `.agents/docs/`, and leaves temporary task evidence gitignored.
4. Cursor and Codex both see the updated durable docs on the next session because the knowledge lives in the repo, not in a vendor-specific chat history.

## 6. Troubleshooting

### Codex does not read `.agents/AGENTS.md`

#### Symptom

Codex follows root instructions but ignores the durable guidance under `.agents/`.

#### Likely causes

- There is no root `AGENTS.md` bootstrap.
- Codex was launched outside the repository root you expected.
- `.agents/AGENTS.md` is nested outside the current path Codex is walking.

#### Fix

Add or tighten root `AGENTS.md` so it explicitly points to `.agents/AGENTS.md` and `.agents/docs/index.md`. Run `codex status` or ask Codex to list loaded instruction sources when debugging.

#### Validation

Start a fresh Codex session from the repo root and ask it to summarize the active instructions. It should mention the root bootstrap and then consult the `.agents/` files when relevant.

### Repo-local skills are missing or duplicated

#### Symptom

`$task-closeout`, `$learning-distill`, or `$knowledge-lint` does not appear, or multiple skills with the same name appear.

#### Likely causes

- Codex was launched from a directory whose path does not include the intended repo root.
- A user, admin, or system skill has the same `name` as a repo-local skill.
- The skill file is malformed or missing required metadata expected by current Codex skill handling.

#### Fix

Launch from the repo root or target subfolder, inspect `.agents/skills/<name>/SKILL.md`, and invoke the skill explicitly by name. If duplicates are confusing, rename the local or user-level skill so each workflow has an unambiguous `name`.

#### Validation

Run `/skills` or type `$` in CLI/IDE and confirm the repo-local skill path is the one you intend.

### Codex cannot edit `.agents/`

#### Symptom

Codex can read `.agents/` but fails or asks for approval when writing docs, sessions, or skills there.

#### Likely causes

Codex sandbox settings protect `.agents` under writable roots, or the current mode is read-only.

#### Fix

For maintenance work, use a mode/configuration that permits the specific `.agents/` edits with approval. Do not disable protections broadly just to avoid a one-time prompt.

#### Validation

After approval or config change, edit a small intended file, then run `git status --short` and inspect the diff.

### Guidance is duplicated between Codex home and the repo

#### Symptom

Codex home instructions say one thing while `.agents/` says another.

#### Likely causes

Repo-specific build, test, or architecture guidance was copied into `~/.codex/AGENTS.md` instead of living in the repo.

#### Fix

Keep cross-repo preferences in Codex home. Keep repo-specific durable policy in `.agents/` with a root `AGENTS.md` pointer.

#### Validation

A repo policy update should require changing one repo file, not editing both `.agents/` and `~/.codex/`.

## 7. References

- [Codex overview](https://developers.openai.com/codex)
- [Custom instructions with `AGENTS.md`](https://developers.openai.com/codex/guides/agents-md)
- [Codex skills](https://developers.openai.com/codex/skills)
- [Codex IDE extension](https://developers.openai.com/codex/ide)
- [Codex sandboxing](https://developers.openai.com/codex/concepts/sandboxing)
- [Codex agent approvals and security](https://developers.openai.com/codex/agent-approvals-security)
- [Codex configuration reference](https://developers.openai.com/codex/config-reference)
- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [`cursor.md`](./cursor.md)
