# Install Guide for Agents

Use this guide when installing the Agent Knowledge Starter Kit into a target repository.

## Goal

Create or update a target repo's `.agents/` knowledge layer from this starter kit while preserving any existing repo-specific knowledge.

## Source and Target

- Source: this starter kit.
- Target: the consuming repo's `.agents/` directory.

## Skill-first install (default)

Install from `.agents/skills/` and use each skill's `bootstrap/` templates via that skill's initialization steps. A skill-first workflow is:

1. Run `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit` in the target repo to place shared skills under `.agents/skills/`. Alternative: copy from `.agents/skills/<skill-name>/` manually. Preserve each skill folder layout, including any `bootstrap/` subdirectory shipped beside `SKILL.md`.

   The Skills CLI flag **`--all`** installs every skill in the package into **every agent integration it knows about** (many product-specific directories under the repo root), not only `.agents/skills/`. That behavior comes from the upstream `skills` package. Prefer narrower installs (for example `-s <skill>` and `-a <agent>`) when you want a minimal tree; use `--all` only when you intend that wide layout.

2. Open each installed skill's `SKILL.md` and run its **Skill initialization** section once before relying on that skill. Initialization is idempotent. Agents should use `cp` to copy missing directories and template files from the skill's `bootstrap/` folder rather than attempting to generate or recreate them from scratch. Do not overwrite existing repo-specific content.
3. Register `SKILL.md` paths in the user's editor or agent product if required.

Skill **definitions** may live wherever your Skills CLI installs them (including user or global locations). This kit still expects **initialization and ongoing output** (sessions, durable docs, `AGENTS.md` updates from these flows) under the **target repository’s** `.agents/` when work runs in that repo. Register the paths your product resolves; you do not need extra kit-specific steps for a global install unless a product ignores the repo working directory.

**Suggested order when installing multiple skills**

- **Closeout only:** run `task-closeout` initialization. It creates `.agents/sessions/` and session ignore rules; it does not create durable `docs/` or `AGENTS.md` scaffolding.
- **Distillation or linting:** run `learning-distill` initialization first when you need the durable `.agents/docs/` and `.agents/playbooks/` scaffold (and a template `.agents/AGENTS.md` when missing). It also ensures `.agents/sessions/` and `.agents/.gitignore` session rules exist.
- **Lint only (no distill):** run `knowledge-lint` initialization when you added lint without distill; it creates the same durable doc scaffold from its `bootstrap/` copy without touching session storage.

When in doubt after installing all three kit skills, run `learning-distill` initialization once, then proceed. The other skills' initialization steps remain safe no-ops or small merges (for example missing `.gitignore` lines).

## Before Editing

1. Inspect the target repo for an existing `.agents/` directory.
2. Inspect root `AGENTS.md`, if present.
3. Inspect `.gitignore` and `.agents/.gitignore`, if present.
4. Check `git status --short` and preserve unrelated user changes.

## New Install

If the target repo has no `.agents/` directory:

1. Run `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit` to install shared skills into `.agents/skills/`. Alternative: copy `.agents/skills/` manually.
2. Run **Skill initialization** from each installed skill's `SKILL.md` (see [Skill-first install](#skill-first-install-default)).
3. Keep `.agents/.gitignore` tracked when the repo uses it; its `sessions/*` rules are sufficient for normal Git usage. If `.agents/` is not tracked, add equivalent session ignore rules at the repo root (see [Skill-first install](#skill-first-install-default)).
4. Edit `.agents/AGENTS.md` with the repo's build, test, architecture, and workflow guidance (or start from the template created by skill initialization).
5. Register `.agents/skills/*/SKILL.md` in the user's editor or agent product, if required.
6. Optional audit trail: append a minimal adoption note to `.agents/docs/log.md` only if your team uses that file as a maintenance log (see `.agents/docs/MAINTENANCE.md`, Logging policy). Agents should not add `log.md` rows by default after a routine install.

## Existing `.agents/` Install

If the target repo already has `.agents/`, do not replace it wholesale unless the user explicitly confirms it is disposable template content.

Use this merge checklist:

1. Preserve existing repo-specific `rules/`, `playbooks/`, and `skills/`.
2. Add missing starter-kit skills with `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit` (or from `.agents/skills/`) and run each installed skill's initialization.
3. Merge `.agents/AGENTS.md` by hand. Keep stable repo guidance concise; do not add session history or long rationale.
4. Prefer the kit default `.agents/.gitignore` patterns: `sessions/*` and `!sessions/README.md`.
5. Use repo-root `.gitignore` session patterns only if the repo intentionally does not track `.agents/.gitignore`: `.agents/sessions/*` and `!.agents/sessions/README.md`.
6. Optional audit trail: append a minimal adoption note to `.agents/docs/log.md` only if your team uses that file as a maintenance log (see `.agents/docs/MAINTENANCE.md`, Logging policy). Agents should not add `log.md` rows by default after a routine merge.
7. Record durable rationale or local policy choices in a new or existing file under `.agents/docs/decisions/` (update `decisions/index.md` when adding a decision).
8. Update `.agents/docs/index.md` so pre-existing repo-specific `rules/`, `playbooks/`, and `skills/` are discoverable.

## Root `AGENTS.md` Relationship

If both root `AGENTS.md` and `.agents/AGENTS.md` exist:

- Treat root `AGENTS.md` as the entrypoint for agents in that checkout.
- Treat `.agents/AGENTS.md` as the portable knowledge-layer file.
- Keep one source of truth for each instruction.
- Prefer root `AGENTS.md` for bootstrap guidance that points agents into `.agents/`.
- Prefer `.agents/AGENTS.md` for durable repo conventions, commands, constraints, and recurring pitfalls.

## Validation

Before finishing:

1. Run `git status --short`.
2. Confirm `.agents/sessions/README.md` is trackable and per-task session folders are ignored.
3. Confirm existing repo-specific files were preserved.
4. Confirm `.agents/docs/index.md` links to any preserved repo-specific knowledge assets.
5. Summarize changed files and any manual product-specific registration steps the user still needs to do.
