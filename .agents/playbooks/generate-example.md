# Maintainer: Generate Example Folder

Use this playbook to generate a complete, bootstrapped `example/` directory demonstrating a consumer installation of the starter kit.

This is a maintainer-only workflow for this starter-kit repository.

## Goal

Produce a disposable `example/` folder containing a cleanly installed and initialized `.agents/` layout so users can see what the final structure looks like.

## Preconditions

- Run commands from this repository root.

## Steps

Do **not** populate `example/` by copying, rsyncing, or merging canonical root `.agents/docs/` (or the full dogfood `.agents/` tree) into `example/`. That bypasses the generator and produces a misleading mirror. Always use the script below.

1. Execute the generator script:
   ```bash
   .agents/skills/generate-example/run.sh
   ```
2. The script will:
   - Remove any existing `example/` directory.
   - Create a clean `example/` structure.
   - Run `skills add` locally to install **user-facing** skills only (maintainer-only skills such as `generate-example` are not installed into `example/`).
   - Simulate **learning-distill** initialization: copy `bootstrap/` templates into `example/.agents/` (top-level `docs/` files, `decisions/`, `troubleshooting/`, `playbooks/README.md`, `sessions/README.md`, `AGENTS.md` when missing). Then simulate **write-plan** initialization: copy missing files from `write-plan/bootstrap/docs/plans/` into `example/.agents/docs/plans/` (same non-destructive rules as other bootstrap subtrees). This is a **fresh** layout, not a mirror of this repository’s durable `decisions/` entries or maintainer plan files under root `.agents/docs/plans/`.
3. Validate the `example/` folder visually to ensure it accurately reflects the starter kit's intended layout.
4. The script rebuilds `example/.agents/skills/docs-search/docs-search-index.json` from `example/.agents` only so a maintainer’s local index is not copied in via `skills add --copy`.
