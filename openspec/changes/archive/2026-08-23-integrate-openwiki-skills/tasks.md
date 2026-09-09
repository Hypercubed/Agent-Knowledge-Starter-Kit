## 1. Environment and Extraction Setup

- [ ] 1.1 Add `openwiki` to `devDependencies` in `package.json`
- [ ] 1.2 Create `scripts/extract-openwiki-skills.js` to extract `init` and `update` prompt strings from `openwiki/dist/agent/prompt.js` (or similar)
- [ ] 1.3 Add an `npm run extract-skills` task to `package.json`
- [ ] 1.4 Update AKSK's initialization logic (e.g. `generate-example` or `init` script) to run the extraction

## 2. Implement Native OpenWiki Skills

- [ ] 2.1 Scaffold `.agents/skills/openwiki-init/SKILL.md` (metadata) and configure the extraction script to append the extracted `init` prompt
- [ ] 2.2 Scaffold `.agents/skills/openwiki-sync/SKILL.md` (metadata) and configure the extraction script to append the extracted `update` prompt
- [ ] 2.3 Verify extraction works by running `npm run extract-skills` locally and inspecting the generated `.agents/skills` files

## 3. Replace Legacy Knowledge Skills

- [ ] 3.1 Create `.agents/skills/okf-search/SKILL.md` configured to query `openwiki/` frontmatter (replacing `docs-search`)
- [ ] 3.2 Update `learning-distill` to trigger `openwiki-sync` instead of `docs-compile`
- [ ] 3.3 Deprecate and remove `.agents/skills/docs-compile`
- [ ] 3.4 Deprecate and remove `.agents/skills/docs-lint`
- [ ] 3.5 Remove legacy `.agents/docs/` skeleton and `docs-compile` references from documentation and scripts

## 4. Final Review & Documentation

- [ ] 4.1 Run `okf-search` and `openwiki-sync` to verify the new workflow functions correctly
- [ ] 4.2 Update `AGENTS.md` and repository README to document the new `openwiki/` standard
- [ ] 4.3 Run `task-closeout` to capture session artifacts
- [ ] 4.4 Run `learning-distill` to promote the architectural change into the new OKF structure
