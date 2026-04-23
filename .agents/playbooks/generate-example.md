# Maintainer: Generate Example Folder

Use this playbook to generate a complete, bootstrapped `example/` directory demonstrating a consumer installation of the starter kit.

This is a maintainer-only workflow for this starter-kit repository.

## Goal

Produce a disposable `example/` folder containing a cleanly installed and initialized `.agents/` layout so users can see what the final structure looks like.

## Preconditions

- Run commands from this repository root.

## Steps

1. Execute the generator script:
   ```bash
   .agents/skills/generate-example/run.sh
   ```
2. The script will:
   - Remove any existing `example/` directory.
   - Create a clean `example/` structure.
   - Run `skills add` locally to install **user-facing** skills only (maintainer-only skills such as `generate-example` are not installed into `example/`).
   - Simulate **learning-distill** initialization: copy `bootstrap/` templates into `example/.agents/` (top-level `docs/` files, `decisions/`, `troubleshooting/`, `playbooks/README.md`, `sessions/README.md`, `AGENTS.md` when missing). The bootstrap does **not** ship `docs/plans/`; maintainer plan narrative and indexes live only in this kit’s `.agents/docs/plans/`. This is a **fresh** layout, not a mirror of this repository’s durable `decisions/` entries.
   - Copy `.agents/agents/*.md` from this repository so the illustrated tree shows optional agent personas (same filenames as the kit; not part of the portable bootstrap minimum).
3. Validate the `example/` folder visually to ensure it accurately reflects the starter kit's intended layout.
