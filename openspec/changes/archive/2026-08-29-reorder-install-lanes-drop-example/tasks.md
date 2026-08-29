## 1. Delete example/ and generate-example

- [x] 1.1 Delete `example/` directory (38 tracked files) and `.agents/skills/generate-example/` (SKILL.md + run.sh, `internal:true`).
- [x] 1.2 Delete `.agents/playbooks/generate-example.md` and remove its references from `.agents/playbooks/README.md` if any.
- [x] 1.3 Remove `/example/` from `.openwikiignore` and verify `openwiki/.last-update.json` is not affected.

## 2. Update install docs to two lanes

- [x] 2.1 Rewrite `README.md` Quick start: ① Agent-assisted via `npx skills add --full-depth` preferred (with clone fallback; `bootstrap.mjs` as checkout alternative) and ② manual `npx skills add --full-depth` fallback (notes that `scripts/*.mjs` + `references/` are copied, `.claude-plugin/plugin.json` loaded by default; remote without ref fetches `main`).
- [x] 2.2 Update `INSTALL.md` Prerequisites / Skill-first install to reorder lanes, require `--full-depth` for this repo layout, and remove "Copy the example" section; update "Before Editing" / "New Install" / "Existing .agents/ Install" merge checklists.
- [x] 2.3 Update `.agents/AGENTS.md` or `docs/integrations/README.md` if they reference `example/` as an install path (search and prune).

## 3. Clean shell scripts and playbooks

- [x] 3.1 Edit `scripts/check-publish.sh`: remove `example/*) continue` markdown link-check bypass and any `example/`-specific leakage scans; keep `find .agents` published list and session hygiene checks.
- [x] 3.2 Update `.agents/playbooks/pre-publish.md` and `major-version-release.md`: remove `example/.agents` validation steps (`bash scripts/check-agents-structure.sh example/.agents`), keep single `bash scripts/check-agents-structure.sh .agents` gate.
- [x] 3.3 Verify `scripts/check-agents-structure.sh` still passes for `.agents` without an `example/` target (no code change needed, just doc usage).

## 4. Verification

- [x] 4.1 Run `bash scripts/check-publish.sh` and `bash scripts/check-agents-structure.sh .agents` — both must pass; confirm `git status --short` shows only intended deletions and doc edits.
- [x] 4.2 Run `openspec validate --strict` for the change (specs `install-lanes` + `aksk-bootstrap` delta present) and confirm no broken links in `README.md`/`INSTALL.md` (`npx markdown-link-check` if available).
- [x] 4.3 Close out task per `task-closeout` (bundle under `.agents/sessions/`) and plan `learning-distill` for decision on two-lane install if needed.
