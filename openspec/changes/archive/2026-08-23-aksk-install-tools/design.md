## Context

AKSK is moving from a passive template repository to an active "glue layer" that wires up OpenSpec and OpenWiki. To adopt this kit seamlessly, developers need a streamlined installation process that adds the required packages (`openspec`, `openwiki`) and scaffolds the initial `.agents/` structure, instead of having to manually copy files or clone a starter repo. 

## Goals / Non-Goals

**Goals:**
- Provide a single command (e.g. `npx @hypercubed/aksk init` or a setup script) to initialize AKSK in any repo.
- Automate the installation of `openspec` and `openwiki` (via `npm` or `npx`).
- Scaffold the `AGENTS.md` and basic `.agents/skills` directories automatically.
- Run the extraction script to pull `openwiki` prompts natively.

**Non-Goals:**
- Supporting package managers other than `npm`/`npx` out-of-the-box initially (though the script can be made generic).
- Completely refactoring how skills execute; this only changes how they are *installed*.

## Decisions

1. **CLI Wrapper vs Setup Script**:
   - *Alternative*: Instruct users to clone the `.agents` folder manually and then run `npm install`.
   - *Decision*: Build a standalone CLI / init script (e.g. `npx @hypercubed/aksk init`).
   - *Rationale*: A CLI wrapper provides the easiest developer experience. It can intelligently check if a package manager is present, install the required dependencies (`openspec`, `openwiki`), and copy over the starter kit files into `.agents/`.

2. **Skill Scaffolding**:
   - *Alternative*: Keep all skills in a global directory or the npm package.
   - *Decision*: Scaffold the core skills (like `learning-distill`, `task-closeout`, `openwiki-init`, `openwiki-sync`) directly into the user's `.agents/skills/` directory.
   - *Rationale*: This maintains the philosophy of the starter kit where users own and can customize their skills locally, while getting a solid baseline out of the box.

## Risks / Trade-offs

- **Risk: Conflicting dependencies** → *Mitigation*: The installer should check `package.json` for existing versions of `openwiki` or `openspec` before attempting to install them, preventing version conflicts.
- **Risk: Overwriting existing `.agents` configurations** → *Mitigation*: The init command should gracefully fail or prompt for confirmation if `.agents/` or `AGENTS.md` already exist in the target directory.
