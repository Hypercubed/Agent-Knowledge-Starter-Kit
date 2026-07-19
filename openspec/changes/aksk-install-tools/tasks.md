## 1. Setup CLI / Init Script

- [ ] 1.1 Create `bin/aksk-init.js` (or similar entry point) for the initialization CLI
- [ ] 1.2 Update `package.json` to expose the `aksk` bin command
- [ ] 1.3 Add logic to check if `package.json` exists in the target directory, and run `npm init -y` if not

## 2. Dependency Management

- [ ] 2.1 Add logic to install `openspec` as a devDependency in the target repo
- [ ] 2.2 Add logic to install `openwiki` as a devDependency in the target repo
- [ ] 2.3 Verify successful installation of external tools

## 3. Scaffolding

- [ ] 3.1 Create `.agents/` and `.agents/skills/` directories in the target repo
- [ ] 3.2 Copy `AGENTS.md` template into the target `.agents/` directory
- [ ] 3.3 Copy core kit skills (`learning-distill`, `task-closeout`) into the target `.agents/skills/` directory

## 4. Extraction & Finalization

- [ ] 4.1 Invoke the `extract-openwiki-skills` script (from previous change) to generate `openwiki-init` and `openwiki-sync` natively
- [ ] 4.2 Run a smoke test (e.g. `npx aksk init` in a temp directory) to verify the full flow
- [ ] 4.3 Run `task-closeout` and `learning-distill` to capture the session and update the kit's architecture documentation
