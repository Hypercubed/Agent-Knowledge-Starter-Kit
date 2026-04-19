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
   - Run `skills add` locally to install the consumer skills.
   - Run bootstrap simulation (copying the templates that the `SKILL.md` initialization steps normally copy).
   - Copy the agent roles to `.agents/agents/`.
3. Validate the `example/` folder visually to ensure it accurately reflects the starter kit's intended layout.