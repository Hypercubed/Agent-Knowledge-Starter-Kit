## 1. Prerequisites and experiments

- [ ] 1.1 Verify `adopt-openspec-openwiki` is applied and its dogfood validation (contract attached, distill/lint validated in-repo) passed before starting implementation.
- [ ] 1.2 Run open question experiments OQ1-OQ3 (bare `openwiki mcp` stdio mode; tag-pinned `npx skills add` + `skills update` behavior; add-mcp codex TOML idempotency) and record findings as troubleshooting entries.

## 2. Bootstrap script and skill

- [ ] 2.1 Create deterministic Python bootstrap script per `python-preference-for-consumer-scripts`: preflight detection (Node >= 22, tools on PATH, `.agents/`, `openspec/`, `openwiki/`, receipts) with state report.
- [ ] 2.2 Implement global lane: once-per-user `npm i -g @fission-ai/openspec@latest openwiki`, skipping installed tools.
- [ ] 2.3 Implement per-repo lane: `openspec init` when missing, minimal `.agents/` scaffold copying the finalized kit templates, curation-contract attachment via the `adopt-openspec-openwiki` merge semantics, idempotent routing-block merge into root `AGENTS.md` preserving any OpenWiki-managed block.
- [ ] 2.4 Implement never-half-install guard: failed step prints exact remaining commands and exits clean without partial state.
- [ ] 2.5 Implement integration spread: agent detection, lane ladder selection (official claude/codex -> add-mcp/skills CLI -> headless), receipt-based ownership partition skips, post-registration verification, per-agent result report including tool warnings verbatim.
- [ ] 2.6 Add idempotency tests: re-run on fully bootstrapped fixture changes nothing; re-run on partially bootstrapped fixture completes only missing steps.
- [ ] 2.7 Write `.agents/skills/aksk-bootstrap/SKILL.md` delegating to the script (EXECUTE lane) and falling back to printed commands (INSTRUCT lane).

## 3. Docs and example

- [ ] 3.1 Update README and INSTALL.md: bootstrap-first happy path with manual peer-dependency steps retained as fallback.
- [ ] 3.2 Revise `add-integrations` guides: name `aksk-bootstrap` as the primary wiring path; position guides as INSTRUCT-lane/manual fallback; remove hardcoded agent skill paths (`~/.agents/skills/`, `~/.codex/skills/`).
- [ ] 3.3 Regenerate `example/` per `regenerate-example-when-portable-kit-changes` so the consumer-path example includes `aksk-bootstrap`.

## 4. Release (timing deferred to maintainer decision)

- [ ] 4.1 Execute `.agents/playbooks/major-version-release.md` checklist when the maintainer decides whether 2.0 ships with or without bootstrap.
