## 1. Remove Shim

- [x] 1.1 Delete `.agents/skills/aksk-bootstrap/scripts/bootstrap.mjs` and verify `test ! -f .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs` and `ls .agents/skills/aksk-bootstrap/scripts/` shows only `bootstrap-global.mjs`, `check_peer_tools.mjs`, `attach_*.mjs`, `init_agents_md.mjs`, `refresh_agents_baseline.mjs`, `sync_wiki_indexes.mjs` — verify `git status --porcelain` shows the deletion
- [x] 1.2 Update `.agents/skills/aksk-bootstrap/SKILL.md` to remove shim row/table entries and keep only global lane description (global lane remains `bootstrap-global.mjs`) and update `.agents/skills/aksk-init/SKILL.md` to note explicit two-step ordering without shim delegation — verify each SKILL.md contains zero occurrences of `bootstrap.mjs` via `grep -c bootstrap.mjs`

## 2. Documentation Sweep

- [x] 2.1 Replace `bootstrap.mjs` references in `README.md` and `INSTALL.md` with the explicit two-command sequence (`node .agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs [repo-root]` then `node .agents/skills/aksk-init/scripts/bootstrap-repo.mjs [repo-root]`) and update any Quick-start EXECUTE/INSTRUCT blocks — verify `grep -R bootstrap.mjs README.md INSTALL.md` returns zero hits
- [x] 2.2 Update `openwiki/quickstart.md`, `openwiki/architecture/overview.md`, `openwiki/integrations/distribution-and-tool-wiring.md`, `openwiki/integrations/distribution-and-agent-spread.md`, `openwiki/workflows/bootstrap-and-attachment.md`, `openwiki/skills/aksk-bootstrap.md`, `openwiki/skills/aksk-init.md`, `openwiki/governance/agent-entrypoints.md` (and any other `openwiki/**/*.md` hit by `grep -R bootstrap.mjs openwiki/`) to remove shim tables/Mermaid shim arrows and show independent lanes — verify `grep -R bootstrap.mjs openwiki/` returns zero hits outside `openspec/changes/`
- [x] 2.3 Update `scripts/check-agents-structure.sh`, `scripts/check-publish.sh`, and `.agents/skills/verify-install/**` (`SKILL.md` + `scripts/run.sh`) that assert `bootstrap.mjs` existence to assert `bootstrap-global.mjs` and `bootstrap-repo.mjs` instead and, for `run.sh`, run both lanes sequentially — verify the scripts pass on a clean checkout via `bash scripts/check-agents-structure.sh .agents` and manual inspection of `run.sh` timeout lines

## 3. Cross-Cutting Validation

- [x] 3.1 Run `grep -R "bootstrap\\.mjs" --exclude-dir=.git --exclude-dir=openspec/changes/archive | grep -v "eliminate-bootstrap-shim" | grep -v ".openwiki"` to confirm no stale references remain and run `openspec validate --changes --strict` — verify `eliminate-bootstrap-shim` shows `✓` and no new failures are introduced
- [x] 3.2 Run docs/lint-style checks: `bash scripts/check-agents-structure.sh .agents` (exit 0), `npx --yes markdown-link-check` on touched docs if available, and `openspec status --change eliminate-bootstrap-shim` shows 4/4 artifacts done — verify all checks pass before closeout

## 4. Closeout

- [x] 4.1 Capture this session per `task-closeout` (bundle under `.agents/sessions/` with `summary.json`, `changed-files.txt`, `validation.txt`) and verify bundle exists — verify `ls .agents/sessions/<session-id>/` contains expected files
- [x] 4.2 If the shim removal surfaced reusable guidance (e.g., lane independence, anti-shim rule), propose a `learning-distill` follow-up to promote a decision or troubleshooting entry and verify the candidate note is recorded in the closeout bundle's `learning-candidate.md`
