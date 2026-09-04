## 1. Spec & Design Alignment

- [ ] 1.1 Confirm OpenSpec skills package id (is it `@fission-ai/openspec` or a separate id?) via registry lookup and record the choice in `references/versions.json` key — verify with `npx skills add --help` and a dry-run `npx skills list -g | grep openspec` showing zero before change
- [ ] 1.2 Pin the resolved OpenSpec skills package in `references/versions.json` (and `package.json` devDependencies if single-source lookup requires it) with a caret range mirroring kit pins — verify `node -e "require('./.agents/skills/aksk-bootstrap/references/versions.json')"` shows the new key

## 2. Global Lane — OpenSpec Skills Spread

- [ ] 2.1 Extend `.agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs` to add an OpenSpec skills step after kit skill spread: detect via `~/.agents/skills/openspec-*/SKILL.md` / host mirror and `npx skills list -g` output, then run `npx skills add <source> -g -a <agent>` (or `-g --all`) reusing existing host detection and `instructRemaining()` for `npx` failure — verify idempotent file probes and partitioned INSTRUCT (global failures print only global `npx skills add` commands)
- [ ] 2.2 Update `.agents/skills/aksk-bootstrap/SKILL.md` global lane description to include the second skill-spread verb (kit + OpenSpec skills) with positional-first arg order note and fallback `@latest` — verify markdown renders and `scripts/check_peer_tools.mjs` still exits 2 with exact `npm i -g` for missing CLIs

## 3. Per-Repo Lane — Keep Inherit-by-Default

- [ ] 3.1 Confirm `.agents/skills/aksk-init/scripts/bootstrap-repo.mjs` still runs `openspec init --tools none` by default (no skill generation) and only runs `npx skills add` without `-g` when `--local-skills` is passed — verify with `--help` text and a dry-run on a temp repo showing no `openspec-*` in repo-local `.agents/skills/`
- [ ] 3.2 Update `.agents/skills/aksk-init/SKILL.md` and `references/*` notes to state repo lane inherits global `openspec-*` skills by default — verify docs mention `--local-skills` as opt-in only

## 4. Documentation & Contract

- [ ] 4.1 Update `INSTALL.md`, `README.md`, `openwiki/skills/aksk-bootstrap.md`, `openwiki/distribution/packaging-and-install.md`, `openwiki/integrations/distribution-and-tool-wiring.md`, `openwiki/integrations/distribution-and-agent-spread.md`, `openwiki/quickstart.md`, and `openwiki/architecture/overview.md` to note canonical store now holds `openspec-*` via global lane — verify `markdown-link-check` and `remark` pass on edited files
- [ ] 4.2 Ensure shim `aksk-bootstrap/scripts/bootstrap.mjs` still delegates unchanged (global then repo lane, no new logic) — verify `node .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs --help` exits 0 and prints shim banner

## 5. Verification & Closeout

- [ ] 5.1 Run fresh-path verification in a temp dir: `node .agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs /tmp/target-probe --json` then `npx skills list -g | grep openspec` shows skills, second run is no-op; sandboxed fallback prints INSTRUCT with exact `npx skills add` line — verify exit codes 0 and no partial state
- [ ] 5.2 Run existing validators: `node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki` (exit 0), `bash scripts/check-agents-structure.sh .agents` (exit 0), `openspec validate --strict` for the new change, and `openspec status --change install-openspec-skills-global` shows proposal+specs+design+tasks done — verify no regressions
- [ ] 5.3 Capture the session per `task-closeout` (bundle under `.agents/sessions/`) and, if reusable patterns emerged, follow with `learning-distill` to promote decisions/troubleshooting vs `.agents/AGENTS.md` updates — verify bundle exists with `summary.json` and changed-files list
