## 1. Prerequisites and experiments

- [x] 1.1 Verify `adopt-openspec-openwiki` is applied and its dogfood validation (contract attached, distill/lint validated in-repo) passed before starting implementation.
- [x] 1.2 Run open question experiments for v0.4.3 (verify `openwiki mcp --host <codex|claude|opencode>` stdio, `openwiki integrations install` idempotency/`modified` detection/`--force` backup, and `openwiki integrations list` status reporting) and record findings as troubleshooting entries — OQ1-OQ3 resolved/obsolete per design.md.

## 2. Bootstrap script and skill

- [x] 2.1 Create deterministic JS bootstrap script per `js-preference-for-consumer-scripts` (Node >=22, `*.mjs`): preflight detection (Node >= 22, tools on PATH, `.agents/`, `openspec/`, `openwiki/`, receipts) with state report.
- [x] 2.2 Implement global lane in user scope (per-user global via `npm i -g`, not repo-local): once-per-user `npm i -g @fission-ai/openspec@latest openwiki@latest` (Node >=22, `npm i -g` not `npx` or repo-local `node_modules`), skipping installed tools; verify via `openwiki integrations list` that the `openwiki` command resolves before registering MCP.
- [x] 2.3 Implement per-repo lane: `openspec init` when missing, minimal `.agents/` scaffold copying the finalized kit templates, curation-contract attachment via the `adopt-openspec-openwiki` merge semantics, idempotent routing-block merge into root `AGENTS.md` preserving any OpenWiki-managed block.
- [x] 2.4 Implement never-half-install guard: failed step prints exact remaining commands and exits clean without partial state.
- [x] 2.5 Implement integration spread: agent detection, lane ladder selection (`openwiki integrations install <codex|claude|opencode>` -> headless `openwiki --init -p`/`--update -p`), receipt-based ownership partition skips (`.openwiki-install.json` `installed`/`modified` via `openwiki integrations list`), post-registration verification, per-agent result report (lane, outcome, backup path).
- [x] 2.6 Add idempotency tests: re-run on fully bootstrapped fixture changes nothing; re-run on partially bootstrapped fixture completes only missing steps.
- [x] 2.7 Update `.agents/skills/aksk-bootstrap/SKILL.md` (skill already exists as precondition provider; extend to delegate to the JS script — EXECUTE lane: `node .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs` — and to fall back to printed commands (INSTRUCT lane) without replacing the existing contract-attachment/verification behavior).

## 3. Docs and example

- [x] 3.1 Update README and INSTALL.md: bootstrap-first happy path with manual peer-dependency steps retained as fallback.
- [x] 3.2 Revise `add-integrations` guides: name `aksk-bootstrap` as the primary wiring path; position guides as INSTRUCT-lane/manual fallback; remove hardcoded agent skill paths (`~/.agents/skills/`, `~/.codex/skills/`).
- [x] 3.3 Regenerate `example/` per `regenerate-example-when-portable-kit-changes` so the consumer-path example includes `aksk-bootstrap`.

## 4. Release (timing deferred to maintainer decision)

- [ ] 4.1 Execute `.agents/playbooks/major-version-release.md` checklist when the maintainer decides whether 2.0 ships with or without bootstrap.
