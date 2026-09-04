## 1. Templates

- [ ] 1.1 Expand `.agents/skills/aksk-init/references/wiki-contract-template.md` with Documentation brief inside `AKSK:WIKI-CONTRACT` markers (Option A, same content as Phase 1 brief) and verify `cat references/wiki-contract-template.md` contains Keep / Do not generate / Update threshold
- [ ] 1.2 Create `.agents/skills/aksk-init/references/openwikiignore-template.md` with anchored, commented starter list and AKSK markers (`# AKSK:OPENWIKIIGNORE:BEGIN/END`), preserving `/example/` and `.agents/sessions/` semantics, and verify file exists

## 2. Installer and wiring

- [ ] 2.1 Create `.agents/skills/aksk-init/scripts/init_openwikiignore.mjs` implementing merge-not-clobber (missing → write, no markers → append, markers → refresh, outside content preserved, idempotent) and verify with manual runs: fresh repo, existing custom ignore, re-run no-op
- [ ] 2.2 Wire installer into `.agents/skills/aksk-init/scripts/bootstrap-repo.mjs` after `openwiki --init` and `attach_wiki_contract.mjs`, ensuring non-interactive (`--yes`/`AKSK_YES`) does not block and re-run is no-op, and verify `node bootstrap-repo.mjs --help` or dry-run completes
- [ ] 2.3 Ensure `attach_wiki_contract.mjs` refresh carries the brief (template is source of truth) and verify re-running attachment updates only marked section

## 3. Validation

- [ ] 3.1 Run `openspec validate --strict` and verify both spec deltas pass
- [ ] 3.2 Run `node scripts/init_openwikiignore.mjs` scenarios (missing, custom, re-run) and verify OpenWiki resolver finds `openspec/specs/**` and skips `node_modules/`/`dist/`
- [ ] 3.3 Run docs-lint/validation scripts as applicable and verify no regressions

## 4. Closeout

- [ ] 4.1 Run task-closeout and verify bundle captures touched paths; run learning-distill if durable rationale emerges and verify no orphaned session data
