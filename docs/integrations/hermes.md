# Hermes Integration Guide

Hermes and this starter kit overlap, but they are not substitutes for each other.

- **Hermes** is an agent runtime: conversation state, persistent memory, session recall, reusable skills, and tool access.
- **This kit** is a **repo-scoped knowledge layer** under `.agents/`: durable repo guidance, playbooks, troubleshooting notes, and temporary session bundles for later distillation.

This guide is based on what was verified while working in this repo, including the failure modes captured in `.agents/docs/` and `.agents/sessions/`.

## 1. Prerequisites

You should have:

- a repo that uses this starter kit or an equivalent `.agents/` layout
- Hermes with normal file access to the repo
- permission to read root `AGENTS.md`, `.agents/AGENTS.md`, `.agents/docs/`, `.agents/playbooks/`, and `.agents/skills/`
- enough tool access to verify important writes (`read_file`, `git status`, or terminal checks)

## 2. Discovery mechanism

### What Hermes discovers natively

Hermes has its own native systems:

- persistent memory / user profile
- reusable Hermes skills
- session recall (`session_search`)
- live tools (`read_file`, `write_file`, `patch`, `terminal`, etc.)

### What the kit provides

The starter kit stores repo-specific knowledge in the repository itself:

- `.agents/AGENTS.md`
- `.agents/docs/repo-decisions.md`
- `.agents/docs/troubleshooting.md`
- `.agents/docs/index.md`
- `.agents/playbooks/`
- `.agents/skills/<name>/SKILL.md`
- `.agents/sessions/` task bundles

### Verified repo-entrypoint rule

For this starter kit, if both files exist:

1. read root `AGENTS.md` first
2. follow its pointer into `.agents/`
3. treat `.agents/AGENTS.md` as the durable repo knowledge file

That nuance matters. Earlier drafts overstated that Hermes only understands repo knowledge when manually pointed to it. In practice, the root `AGENTS.md` entrypoint is the intended bootstrap.

## 3. Setup steps

### Recommended operating model

Use Hermes and the kit at different layers:

| Layer | Best use |
| --- | --- |
| Hermes memory / user profile | cross-project user and environment facts |
| Hermes system skills | reusable Hermes procedures |
| Hermes session recall | prior conversation history |
| Repo `.agents/` tree | repo-specific durable knowledge and task evidence |

### Concrete setup guidance

1. Keep the repo knowledge under `.agents/`.
2. Keep any bootstrap instructions in root `AGENTS.md` short and pointed at `.agents/`.
3. When Hermes needs repo-specific instructions, read the repo files directly.
4. Do not try to mirror all repo knowledge into Hermes memory.
5. Use Hermes memory only for facts that should survive across repos.

## 4. Workflow

Recommended workflow for Hermes in a kit-enabled repo:

1. Read root `AGENTS.md` if present.
2. Read `.agents/AGENTS.md` plus the relevant `.agents/docs/*` and `.agents/playbooks/*` files.
3. If the task depends on a repo-local skill, read `.agents/skills/<name>/SKILL.md` from the filesystem.
4. Perform the work.
5. Verify important file changes with a second check.
6. Use `.agents/sessions/` only as task evidence and closeout packets, not as durable truth.
7. Distill stable lessons later into `.agents/docs/`, `.agents/playbooks/`, or `.agents/AGENTS.md`.

## 5. Two-tool example: Hermes + another agent sharing a repo

A practical split:

- **Hermes** handles cross-session continuity, environment/tool access, and repo maintenance workflows.
- **A second coding tool** handles implementation work in the same repository.
- **The shared contract** is the repo’s `.agents/` tree.

Example flow:

1. Hermes reads `.agents/docs/repo-decisions.md` and `.agents/playbooks/` before making repo-maintenance changes.
2. Another coding agent implements a feature and leaves a session bundle under `.agents/sessions/`.
3. Hermes later reads that bundle, runs the repo’s `learning-distill` process, and updates durable docs.
4. Both tools keep using the same `.agents/` knowledge base even though their native memory systems differ.

This is where the kit adds value: it creates a portable repo knowledge layer that survives tool changes.

## 6. Troubleshooting

### Dual skill namespace: Hermes skills vs repo-local `.agents/skills/`

This is the most important verified Hermes-specific gotcha from the earlier sessions.

#### Symptom

A Hermes agent calls `skill_view(name="task-closeout")` and gets content that does not match `.agents/skills/task-closeout/SKILL.md` in the repo.

#### Cause

These are two different namespaces:

- Hermes system skills live in Hermes' skill store.
- Repo-local skills live in the repository filesystem.

The names may collide even when the contents differ.

#### Fix

Read repo-local skill files directly from the repo:

- `.agents/skills/task-closeout/SKILL.md`
- `.agents/skills/learning-distill/SKILL.md`
- `.agents/skills/knowledge-lint/SKILL.md`

Do not assume `skill_view()` returns the repo version.

### Earlier write-tool failures were not reliable product-wide guidance

Earlier sessions claimed that only terminal writes persist and that `write_file`, `patch`, or `read_file` are untrustworthy.

That conclusion was too broad.

In this verification pass, Hermes file tools worked normally against the real repo. The safer conclusion is:

- verify important writes with a follow-up check
- if a delegated or sandboxed context behaves strangely, treat it as an environment-specific anomaly until reproduced
- do not document a broad Hermes limitation from a single weak or poorly verified run

### Root-cause assessment of the earlier failures

The earlier problems were a mix of:

1. **Underpowered / unreliable model behavior** — a major factor in the captured sessions
2. **A real integration gotcha** — Hermes system skills vs repo-local `.agents/skills/`
3. **Documentation errors** — earlier drafts overstated or misstated several claims
4. **Possible execution-context anomalies** — plausible, but not strong enough to blame the whole setup

The evidence does **not** support calling this primarily a repo-setup problem.

## 7. References

- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [`../../.agents/AGENTS.md`](../../.agents/AGENTS.md)
- [`../../.agents/docs/index.md`](../../.agents/docs/index.md)
- [`../../.agents/docs/repo-decisions.md`](../../.agents/docs/repo-decisions.md)
- [`../../.agents/docs/troubleshooting.md`](../../.agents/docs/troubleshooting.md)
- [`../../.agents/plans/add-integrations.md`](../../.agents/plans/add-integrations.md)
