# Maintainer: Generate Example Folder

Use this playbook to generate a complete, bootstrapped `example/` directory demonstrating a consumer installation of the starter kit.

This is a maintainer-only workflow for this starter-kit repository.

## Goal

Produce a disposable `example/` folder containing a cleanly installed and initialized `.agents/` layout so users can see what the final structure looks like.

## Preconditions

- Run commands from this repository root.

## Steps

Do **not** populate `example/` by copying, rsyncing, or merging the full dogfood `.agents/` tree or curated wiki content into `example/`. That bypasses the generator and produces a misleading mirror. Always use the script below.

1. Execute the generator script:
   ```bash
   .agents/skills/generate-example/run.sh
   ```
2. The script will:
   - Remove any existing `example/` directory.
   - Create a clean `example/` structure.
   - Run `skills add` locally to install **user-facing** skills only (maintainer-only skills such as `generate-example` are not installed into `example/`).
   - Simulate **learning-distill** initialization: copy `bootstrap/` templates into `example/.agents/` (`playbooks/README.md`, `sessions/README.md`, `AGENTS.md` when missing; the durable knowledge base lives in the wiki, so no `.agents/docs/` scaffold is seeded). This is a **fresh** layout, not a mirror of this repository’s curated wiki knowledge or maintainer plan files.
3. Validate the `example/` folder visually to ensure it accurately reflects the starter kit's intended layout.
