# Install Guide for Agents

Use this guide when installing the Agent Knowledge Starter Kit into a target repository.

## Goal

Create or update a target repo's `.agents/` knowledge layer from this starter kit while preserving any existing repo-specific knowledge.

## Source and Target

- Source: this starter kit's `scaffold/` directory.
- Target: the consuming repo's `.agents/` directory.

Treat files under `scaffold/` as if they are rooted at `.agents/` in the target repo.

Do not use this repository's root `.agents/` directory as install source. It contains maintainer-only knowledge for this starter-kit repo and may include files adopters should not copy.

## Before Editing

1. Inspect the target repo for an existing `.agents/` directory.
2. Inspect root `AGENTS.md`, if present.
3. Inspect `.gitignore` and `.agents/.gitignore`, if present.
4. Check `git status --short` and preserve unrelated user changes.

## New Install

If the target repo has no `.agents/` directory:

1. Copy everything under `scaffold/` into `.agents/`.
2. Keep `.agents/.gitignore` tracked; its `sessions/*` rules are sufficient for normal Git usage.
3. Edit `.agents/AGENTS.md` with the repo's build, test, architecture, and workflow guidance.
4. Register `.agents/skills/*/SKILL.md` and `.agents/agents/*.md` in the user's editor or agent product, if required.
5. Record the adoption in `.agents/docs/log.md`.

## Existing `.agents/` Install

If the target repo already has `.agents/`, do not replace it wholesale unless the user explicitly confirms it is disposable template content.

Use this merge checklist:

1. Preserve existing repo-specific `rules/`, `playbooks/`, and `skills/`.
2. Add missing starter-kit directories from `scaffold/`: `docs/`, `agents/`, and `sessions/`.
3. Add the portable maintenance skills if missing: `task-closeout`, `learning-distill`, and `knowledge-lint`.
4. Merge `.agents/AGENTS.md` by hand. Keep stable repo guidance concise; do not add session history or long rationale.
5. Prefer the kit default `.agents/.gitignore` patterns: `sessions/*` and `!sessions/README.md`.
6. Use repo-root `.gitignore` session patterns only if the repo intentionally does not track `.agents/.gitignore`: `.agents/sessions/*` and `!.agents/sessions/README.md`.
7. Record the adoption in `.agents/docs/log.md`.
8. Record durable rationale or local policy choices in `.agents/docs/repo-decisions.md`.
9. Update `.agents/docs/index.md` so pre-existing repo-specific `rules/`, `playbooks/`, and `skills/` are discoverable.

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
