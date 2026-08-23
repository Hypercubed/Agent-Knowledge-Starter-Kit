## 1. Phase 0 - Decision records

- [ ] 1.1 Add decision entry: OpenSpec/OpenWiki/AKSK division of labor (process layer, descriptive layer, experiential/curation layer) with rationale and alternatives.
- [ ] 1.2 Add decision entry: distribution-stack context for OpenWiki coding-agent integration (skills CLI + add-mcp + official lanes + headless ladder; registry installers excluded), recording the v0.3.3 reality that MCP lifecycle server and `integrations install` lanes are unreleased and only the headless CLI works today.
- [ ] 1.3 Add decision entry: ownership-partition policy (receipt in target skill dir means official lane owns that agent; skip).
- [ ] 1.4 Add decision entries superseding `repo-centric-wiki-tooling` and the extraction-based approach formerly in `integrate-openwiki-skills`; update both decisions indexes.

## 2. Peer-dependency preconditions and skill rewrites

- [ ] 2.1 Implement `wiki-contract` attachment: append-only, idempotent merge of the AKSK curation section into an existing `openwiki/INSTRUCTIONS.md`, stub-aware (default OpenWiki content recognized as no-contract), fail-fast when the file is missing; ship the contract template.
- [ ] 2.2 Add peer-tool verification to all skills/scripts invoking `openspec` or `openwiki`: binary check on PATH, fail with exact install/init commands, never attempt installation.
- [ ] 2.3 Rewrite `learning-distill` for host-authored output per design D6: descriptive lessons -> OKF wiki pages written directly by the agent, with authoring guidance loaded at runtime from the installed package (`createSystemPrompt`) and pages validated via `okf/frontmatter`; deterministic index refresh (`okf/index-sync`) instead of invoking the CLI at distill time; prescriptive lessons -> `.agents/AGENTS.md`/playbooks/decisions; curated-page preservation from `INSTRUCTIONS.md`; fail closed on missing prerequisites before any wiki write.
- [ ] 2.4 Repurpose `docs-lint`: remove index-coverage checks; add routing-block integrity check, archived-change/wiki coverage pairing (with recorded-deferral exemption), stale-decision detection.
- [ ] 2.5 Slim `task-closeout`: add `openspec_change` field to `summary.json`; spec updates move to `/opsx:archive` time; closeout never modifies `openspec/` for in-flight changes.
- [ ] 2.6 Update `.agents/docs/index.md`, section indexes, and affected playbooks to reflect new skill behaviors.

## 3. Retirements and docs

- [ ] 3.1 Delete `docs-search` and `docs-compile` skills; grep the repo for references and update all call sites (per the replacement checklist in `python-preference-for-consumer-scripts`).
- [ ] 3.2 Delete forked `openspec-*` skills and `opsx-*` workflow copies; keep `openspec/config.yaml`.
- [ ] 3.3 Update README, INSTALL.md, and `docs/architecture.md`: state peer-dependency prerequisites (Node >= 22, global installs, repo initialization) as manual steps; document fail-fast behavior.
- [ ] 3.4 Update doc pointers superseded by closure of `integrate-openwiki-skills`, `aksk-install-tools`, and `aksk-openspec-bridge` (all archived 2026-08-23 as superseded).

## 4. Dogfood on this repository

- [ ] 4.1 Run the contract attachment against this repo's live `openwiki/INSTRUCTIONS.md` (currently the default stub); verify append-only merge, idempotent re-run, and stub recognition.
- [ ] 4.2 Verify distill routing end-to-end: distill a session bundle; confirm OKF output lands in `openwiki/` with curated-page preservation and that fail-closed triggers correctly with tools absent.
- [ ] 4.3 Run docs-lint cross-tool checks against the dogfooded state; confirm no false positives on hand-maintained indexes.

## 5. Reconcile affected open changes (post-validation)

- [ ] 5.1 Revise `escalate-quick-reference`: remove all `docs-compile` script dependencies; re-express auto-pinning against OpenWiki-generated indexes or close as superseded if no equivalent exists.
- [ ] 5.2 Revise `formalize-superseded-obsolete`: keep the triple-lock markdown convention (KB migration is deferred), delete the `docs-compile` automation requirement, fold triple-lock verification into the cross-tool-lint stale-decision check.
- [ ] 5.3 Revise `worked-lifecycle-example`: extend the end-to-end loop with the wiki leg (descriptive lessons distill to OKF pages under `openwiki/`); `.agents/docs/` destinations shown for prescriptive lessons only.
- [ ] 5.4 Revise `implement-operating-contract-and-triggers`: add an archive-time trigger consideration alongside the existing task-closeout trigger (spec updates move to `/opsx:archive`).
- [ ] 5.5 Coordinate `add-task-start` with the slimmed `task-closeout`: reconcile manifest consumption with the added `openspec_change` field; sequence applies to avoid conflicts.
