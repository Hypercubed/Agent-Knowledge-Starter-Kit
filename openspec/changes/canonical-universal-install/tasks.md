## 1. Update install docs to user scope universal + self-reported

- [x] 1.1 Rewrite `README.md` Quick start's agent-assisted prompt to `npx skills add -g -a <self-reported> Hypercubed/Agent-Knowledge-Starter-Kit` (with `universal` = `~/.agents/skills`, Codex default) where `<self-reported>` is the calling agent's own host id, plus `If npx is unavailable` fallback removal (`npx` required) and target `~/.agents/skills` for openwiki when not via `openwiki` CLI; keep `For agents` section in sync.
- [x] 1.2 Update `INSTALL.md` Skill-first install (default) step 1 to `-g -a <self-reported>` targeting `~/.agents/skills` plus host mirror, note `npx` required and that extra `-a <other>`/`--all` only when user asked, and clarify repo-local `./.agents/skills` is override A and agent-other-loc is override B with consent.
- [x] 1.3 Update `docs/integrations/codex.md` setup to the new default (user scope universal, Codex reads `~/.agents/skills` natively) and trim duplication with `INSTALL.md` Prerequisites.

## 2. Narrow bootstrap to two verbs (and wire `versions.json` for skill installs)

- [x] 2.1 Edit `.agents/skills/aksk-bootstrap/SKILL.md` and `scripts/bootstrap.mjs` to the two verbs: (1) verify CLIs (`openspec`/`openwiki` on PATH, `npm i -g` if missing, caret from `references/versions.json`) then (2) verify skills (`~/.agents/skills/<name>/SKILL.md` plus current host, `npx skills add -g -a <self-reported>` if missing — using `references/versions.json` via `versionsFromPackageJson()` so `@latest` is only the fallback — `openwiki integrations install <self-reported>` when that host is supported otherwise `npx` + `openwiki mcp`/`add-mcp` chooser); remove clone lane text and target `~/.agents/skills` for fallbacks.
- [x] 2.2 Collapse integration spread section to universal+current by default (Codex is universal), `openwiki integrations add` when available otherwise the unified `npx`/`add-mcp` ladder per host, and document that extra hosts or `--all` are user-asked only.

## 3. Retarget verification to user store and drop clone lane

- [x] 3.1 Update `.agents/skills/verify-install/SKILL.md` and `scripts/run.sh` to assert `~/.agents/skills/<name>` (and `~/.<self>/skills`) as canonical for the default lane, keep `--all` wide as negative case (`-g` → only `~/.agents/skills`), and remove the `no-npx` / `cp -r .agents/skills` clone-fallback scenario and its target.
- [x] 3.2 Cover openwiki two-track in `verify-install`: fresh lane proves `openwiki integrations install <self-reported>` for supported host vs `npx skills add -g` + `npx add-mcp` fallback when not in `codex|claude|opencode`, and that `npx skills add -g -a <self-reported>` always writes both universal and host dirs.

## 4. Verification and closeout

- [ ] 4.1 Run `bash .agents/skills/verify-install/scripts/run.sh` (default user-scope lanes) and `bash scripts/check-agents-structure.sh ~/.agents/skills 2>&1 | head` (user target) plus `bash scripts/check-agents-structure.sh .agents` and `openspec validate canonical-universal-install --strict`.
- [ ] 4.2 Close out task per `task-closeout` (bundle under `.agents/sessions/`) and plan `learning-distill` for decision on canonical `~/.agents/skills` + Codex/universal.
