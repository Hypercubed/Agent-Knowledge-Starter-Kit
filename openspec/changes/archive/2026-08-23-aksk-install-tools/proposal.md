## Why

Currently, AKSK is a template repository. As we transition AKSK to act as the "agentic glue" between OpenSpec and OpenWiki, we need a formalized installation mechanism. Relying on manual setup or merely cloning a template repository is insufficient when depending on external tools like `openspec` and `openwiki`. A dedicated installation capability (either via an initial setup skill or a CLI tool) will ensure both dependencies are correctly installed, and that AKSK's skills and extraction logic are scaffolded cleanly into the user's project.

## What Changes

- Create a mechanism to automatically install `openspec` and `openwiki` into a target repository.
- Introduce an initialization flow that scaffolds the `.agents/` folder, including `AGENTS.md` and the initial core skills.
- The installation flow will trigger the `extract-openwiki-skills` script (introduced in a prior change) to ensure the native agent skills for OpenWiki are correctly populated based on the installed version.
- Provide a standardized entry point for users, such as an `aksk-install` skill or a standalone `npx @hypercubed/aksk init` CLI command.

## Capabilities

### New Capabilities
- `aksk-installer`: A CLI or skill responsible for orchestrating the setup of a new AKSK environment, installing `openspec` and `openwiki`, and scaffolding necessary directories.
- `aksk-scaffolding`: The ability to generate the baseline `.agents/` structure and core kit configuration files on demand.

### Modified Capabilities


## Impact

- **Affected Code**: Introduces new initialization scripts or CLI entry points.
- **Dependencies**: The installer will explicitly manage `openspec` and `openwiki` as project dependencies (e.g., adding them to `package.json` or installing them globally).
- **Workflow**: Modifies how users first interact with AKSK, moving from "clone a template" to "run an init command/skill".
