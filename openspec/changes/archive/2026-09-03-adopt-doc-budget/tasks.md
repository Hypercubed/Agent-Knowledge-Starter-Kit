## 1. Templates and ignore source

- [x] 1.1 Expand `.agents/skills/aksk-init/references/wiki-contract-template.md` with Documentation brief (Keep / Do not generate / Update threshold - inside `AKSK:WIKI-CONTRACT` markers, Option A) and verify `cat references/wiki-contract-template.md` contains the brief
- [x] 1.2 Update `.openwikiignore` to anchored, commented starter list (dependencies/build/caches, generated/vendor, machine-local/secrets), preserving `/example/` anchored and `.agents/sessions/` with `!.agents/sessions/README.md`, and verify `cat .openwikiignore` matches template intent

## 2. Attach and validate

- [x] 2.1 Run `node .agents/skills/aksk-init/scripts/attach_wiki_contract.mjs` to refresh `openwiki/INSTRUCTIONS.md` and verify brief appears inside `AKSK:WIKI-CONTRACT` markers without touching OpenWiki-owned sections
- [x] 2.2 Validate OpenWiki ignore boundary: verify `openspec/specs/**` and `openspec/changes/archive/**` are not excluded and `node_modules/` + `dist/` are excluded (evidence resolver check)
- [x] 2.3 Run `openspec validate --strict` and `npm run lint`/`docs-lint` as applicable and verify no regressions

## 3. Closeout

- [x] 3.1 Run task-closeout and verify bundle under `.agents/sessions/` captures touched paths
