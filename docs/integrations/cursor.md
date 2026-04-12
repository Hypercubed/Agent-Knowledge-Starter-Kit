# Cursor Integration Guide

Cursor and this starter kit solve different problems, but they compose cleanly when you keep **one source of truth** under `.agents/` and use Cursor’s rules only as **wiring**, not as a second copy of the same prose.

- **Cursor** injects persistent instructions via **Project Rules** (`.cursor/rules/`), optional **root and nested `AGENTS.md`**, **User Rules**, and (on eligible plans) **Team Rules**. Rules apply to **Agent (Chat)** as documented by Cursor; they do not drive all AI surfaces in the product.
- **This kit** is a **repo-scoped knowledge layer** under `.agents/`: durable guidance, docs, playbooks, skills, and gitignored session bundles for distillation.

This guide is written to match Cursor’s documented rule behavior as of verification against [Cursor Rules documentation](https://cursor.com/docs/context/rules). Re-check that page after Cursor upgrades if something stops matching.

## 1. Prerequisites

You should have:

- a repository that already contains (or you are about to add) the kit layout under `.agents/` — typically by copying `scaffold/` from this starter kit
- Cursor with access to the project files
- permission to add **version-controlled** project configuration (`.cursor/rules/` and/or root `AGENTS.md`)
- clarity on whether you also use **nested `AGENTS.md`** files in subfolders (Cursor combines them with more specific paths taking precedence)

Optional:

- **Team Rules** (Team / Enterprise) if your org centralizes policy — they take precedence over Project and User rules when guidance conflicts

## 2. Discovery mechanism

### What Cursor discovers natively

Cursor’s documented rule stack includes:

| Mechanism | Where it lives | Role |
| --- | --- | --- |
| **Project Rules** | `.cursor/rules/` (`.md` or `.mdc`, optional subfolders) | Repo-scoped instructions; `.mdc` frontmatter controls description, globs, and `alwaysApply` |
| **`AGENTS.md`** | Project root and, optionally, nested directories | Plain markdown agent instructions; simpler than structured rules |
| **User Rules** | Cursor Settings → Rules | Global across projects |
| **Team Rules** | Cursor dashboard | Org-wide; merged with precedence **Team → Project → User** |

Rule application modes for project rules (from the docs) include **Always Apply**, **Apply Intelligently** (needs a useful `description`), **Apply to Specific Files** (globs), and **Apply Manually** (e.g. `@rule-name` in chat).

### What the kit provides

The kit’s durable contract remains on disk under `.agents/`:

- `.agents/AGENTS.md` — concise repo-wide agent guidance
- `.agents/docs/*` — index, decisions, troubleshooting, maintenance schema, log
- `.agents/playbooks/` — multi-step procedures
- `.agents/skills/<name>/SKILL.md` — portable skills (files, not a separate runtime registry)
- `.agents/sessions/` — task-closeout bundles (typically gitignored)

### Root `AGENTS.md` vs `.agents/AGENTS.md` (important for Cursor)

The kit already recommends:

- **Root `AGENTS.md`** — short bootstrap: point agents at `.agents/` and keep duplication out.
- **`.agents/AGENTS.md`** — the portable, durable instructions file.

That split matters for Cursor **nested `AGENTS.md`**: nested files are applied when you work with files **under that directory**. So `.agents/AGENTS.md` is **not** guaranteed to be in context for every chat if you only touch code outside `.agents/`. A minimal root `AGENTS.md` (or an **Always Apply** project rule that points into `.agents/`) keeps the kit visible during ordinary feature work.

### Cursor “skills” vs kit `.agents/skills/`

Unlike Hermes, Cursor does not treat `.agents/skills/*/SKILL.md` as a separate **named skill namespace** that can collide with another store. They are normal repo files. The integration risk here is different: **stale duplication** — past Hermes work showed why confusing two namespaces hurts; with Cursor the pitfall is copying long skill text into `.cursor/rules/` instead of **referencing** the skill file.

## 3. Setup steps

### Recommended pattern: thin Cursor layer, fat `.agents/` tree

1. **Keep all durable repo knowledge in `.agents/`** — same as the kit docs.
2. **Keep root `AGENTS.md` short** — e.g. “Consult `.agents/AGENTS.md` first; use `.agents/docs/index.md` to find playbooks and troubleshooting; keep task evidence in `.agents/sessions/`.”
3. **Add one or more focused project rules** under `.cursor/rules/` that **do not restate** long policy. Prefer:
   - a single **Always Apply** rule that states the workflow and points to canonical files, and/or
   - **glob-scoped** rules for areas that need extra enforcement (e.g. `**/*.ts`, `backend/**/*.py`).
4. **Use `@path/to/file` in rule bodies** where Cursor supports it, so the agent pulls current file contents instead of a frozen copy in the rule. Cursor’s own best practices recommend referencing files instead of pasting large guides.
5. **Register important skills explicitly in prose** — e.g. “Before closing a task, read `.agents/skills/task-closeout/SKILL.md` and follow it,” so the agent opens the real file from disk.
6. **Do not move integration guides into `.agents/`** — per repo decisions, user-facing tool setup belongs in root `docs/integrations/` (see `.agents/docs/repo-decisions.md` in a dogfood checkout).

### Example: minimal always-on project rule (`.mdc`)

Create `.cursor/rules/agent-knowledge-kit.mdc` (name is arbitrary):

```markdown
---
description: Route Agent to the repo knowledge layer under .agents/
alwaysApply: true
---

# Agent Knowledge Kit (Cursor wiring)

- Treat `.agents/AGENTS.md` as the primary durable instructions file for this repo.
- For navigation, read `.agents/docs/index.md` before inventing new conventions.
- For recurring failures, check `.agents/docs/troubleshooting.md`.
- For multi-step maintenance, follow playbooks under `.agents/playbooks/`.
- For task boundaries, follow `.agents/skills/task-closeout/SKILL.md` when closing work; keep raw evidence in `.agents/sessions/` (gitignored bundles).

Do not duplicate long policy here; open the referenced paths when needed.
```

Adjust filenames if your project renamed paths. Keep the rule **short** (Cursor documents a **500-line** practical ceiling for a single rule).

### Example: optional glob rule when editing the knowledge layer

When editing files under `.agents/`, you can add a second rule with `globs: .agents/**/*.md` (or stricter patterns) reminding the editor to respect `MAINTENANCE.md`, avoid bloating `AGENTS.md`, and not commit `sessions/` bundles.

### `AGENTS.md`-only wiring (small projects)

If you do not want `.cursor/rules/` yet, a **root `AGENTS.md`** alone can document the same pointers. You lose glob-based scoping and manual `@rule` invocation until you add project rules.

## 4. Workflow

Suggested flow for Cursor Agent in a kit-enabled repo:

1. At session start, assume root `AGENTS.md` and applicable **Always Apply** rules are already in play; if not, `@`‑mention your kit routing rule.
2. Read `.agents/AGENTS.md` when the task needs repo-wide policy (build, test, conventions).
3. Use `.agents/docs/index.md` to find the right doc or playbook instead of searching ad hoc.
4. For structured closeout, open `.agents/skills/task-closeout/SKILL.md` from disk and write the bundle under `.agents/sessions/<folder>/`.
5. Run **learning-distill** and **knowledge-lint** per your team’s process (often as separate passes or roles), updating `.agents/docs/*` or `.agents/AGENTS.md` as appropriate.
6. When you change durable guidance, **edit `.agents/` first**, then update thin Cursor rules only if the **wiring** changed (new paths, new mandatory steps).

## 5. Two-tool example: Cursor + another agent or automation sharing a repo

**Scenario:** A teammate uses a different assistant or you use CI; everyone shares the same Git repository.

- **Cursor** handles day-to-day implementation with Project Rules and chat.
- **Another tool** (CLI agent, review bot, Hermes, etc.) reads the same `.agents/` tree from disk.
- **Shared contract** is `.agents/` plus a minimal root `AGENTS.md` pointer.

Example flow:

1. You implement a feature in Cursor; the always-on rule reminded you to read `.agents/AGENTS.md`.
2. You close the task with a bundle under `.agents/sessions/` following `task-closeout`.
3. A maintainer runs a learning pass (any tool) and updates `.agents/docs/repo-decisions.md` and `.agents/docs/log.md`.
4. A collaborator using a non-Cursor agent reads the same updated files — no export step, because the knowledge is in Git under `.agents/`.

## 6. Troubleshooting

### “Cursor ignores our long `.agents/AGENTS.md` when I work outside `.agents/`”

#### Symptom

Nested `.agents/AGENTS.md` does not appear in context for chats that only touch `src/` or other trees.

#### Likely causes

Nested `AGENTS.md` files apply when working with files in that directory subtree, per Cursor’s nested `AGENTS.md` behavior.

#### Fix

Keep a **root** `AGENTS.md` bootstrap and/or an **Always Apply** project rule that points to `.agents/AGENTS.md` so routing survives where you edit.

#### Validation

Start a chat scoped to a file outside `.agents/` and confirm the agent still follows conventions after you add the bootstrap or rule.

### Duplicated guidance between `.cursor/rules/` and `.agents/`

#### Symptom

Policy diverges: rules say one thing, `.agents/` says another.

#### Likely causes

Large passages were copied from `.agents/` into rules; one side was updated later.

#### Fix

Shrink rules to **pointers and workflow**; use `@file` references or explicit “read this path” steps. Cursor’s documentation explicitly recommends referencing files instead of copying large guides.

#### Validation

A policy change requires editing **one** canonical `.agents/` file (or playbook), not hunting duplicate prose in multiple rules.

### Wrong mental model from other tools

#### Symptom

Treating `.agents/skills/` like a second global skill registry that could collide with another product-specific store.

#### Likely causes

Experience from tools such as Hermes where two skill namespaces can disagree (documented in this repo’s `.agents/docs/troubleshooting.md`).

#### Fix

For Cursor, **read skill files from the repo path** when a skill applies. Avoid copying their full text into rules unless you have a deliberate, maintained fork.

#### Validation

The opened file matches `.agents/skills/<name>/SKILL.md` on disk.

### Overstating where rules apply in Cursor

#### Symptom

Assuming Project Rules affect every AI feature (Tab, inline edit, etc.).

#### Likely causes

Cursor’s docs scope some behaviors to Agent (Chat) and User Rules; product surfaces evolve.

#### Fix

Treat this guide as accurate for **documented** Agent rule injection; verify in your Cursor version if you rely on a specific surface.

#### Validation

Cursor’s FAQ on your installed build matches your expectations before you encode hard process dependencies.

## 7. References

- [Cursor — Rules](https://cursor.com/docs/context/rules) — project rules, `AGENTS.md`, precedence, `@` references
- [`README.md`](../../README.md) — kit overview and root vs `.agents/AGENTS.md` split
- [`INSTALL.md`](../../INSTALL.md) — adopting `scaffold/` into `.agents/`
- [`hermes.md`](./hermes.md) — contrasting persistent-assistant patterns (memory / dual skill namespace) with repo-first wiring
- [`.agents/plans/add-integrations.md`](../../.agents/plans/add-integrations.md) — integration doc conventions for this repository
