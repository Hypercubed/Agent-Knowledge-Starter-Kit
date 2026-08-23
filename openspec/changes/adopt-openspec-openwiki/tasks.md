## 1. Phase 0 - Decision records

- [x] 1.1 Add decision entry: OpenSpec/OpenWiki/AKSK division of labor (process layer, descriptive layer, experiential/curation layer) with rationale and alternatives.
- [x] 1.2 Add decision entry: distribution-stack context for OpenWiki coding-agent integration (skills CLI + add-mcp + official lanes + headless ladder; registry installers excluded), recording the v0.3.3 reality that MCP lifecycle server and `integrations install` lanes are unreleased and only the headless CLI works today.
- [x] 1.3 Add decision entry: ownership-partition policy (receipt in target skill dir means official lane owns that agent; skip).
- [x] 1.4 Add decision entries superseding `repo-centric-wiki-tooling` and the extraction-based approach formerly in `integrate-openwiki-skills`; update both decisions indexes.
- [x] 1.6 Add decision entry `node-single-runtime-for-kit-scripts`: kit scripts are ESM `.mjs` on Node; supersedes `python-preference-for-consumer-scripts`; all four bootstrap scripts migrated.
- [x] 1.5 Add decision entry `knowledge-consolidation-into-openwiki`: KB moves to curated wiki trees, indexes/log dropped, portability retired (AKSK hard-requires openspec + openwiki); supersedes the location aspect of `single-tree-architecture-agents`.

## 2. Peer-dependency preconditions

- [x] 2.1 Implement `wiki-contract` attachment: append-only, idempotent merge of the AKSK curation section into an existing `openwiki/INSTRUCTIONS.md`, stub-aware (default OpenWiki content recognized as no-contract), fail-fast when the file is missing; ship the contract template.
- [x] 2.2 Add peer-tool verification to all skills/scripts invoking `openspec` or `openwiki`: binary check on PATH, fail with exact install/init commands, never attempt installation.
- [x] 2.3 Implement AKSK routing-note attachment in the `aksk-bootstrap` skill: marker-delimited (`AKSK:ROUTING`) append-only idempotent merge into root agent instruction files (default `AGENTS.md`), creating the file only when missing; template content matches the integration-guide routing blocks.
- [x] 2.4 Generalize attachment into `attach_section.mjs` (markers read from the chosen template) and add the `AKSK:LIFECYCLE` section carrying the self-improvement-loop mandate as its own managed block.

## 3. Skill rewrites

- [x] 3.1 Rewrite `learning-distill` for host-authored output per design D6: descriptive lessons -> OKF wiki pages written directly by the agent, with authoring guidance loaded at runtime from the installed package (`createSystemPrompt`) and pages validated via `okf/frontmatter`; deterministic index refresh via `okf/index-sync`'s `synchronizeWikiIndexes` driven by `OpenWikiLocalShellBackend` (rootDir = repo root, `virtualMode: true`, `docsOnly: true`) instead of invoking the CLI at distill time; decision and troubleshooting records -> curated pages under `openwiki/{decisions,troubleshooting}/` with `aksk_status` fields; prescriptive lessons -> `.agents/AGENTS.md`/playbooks; curated-page preservation from `INSTRUCTIONS.md`; fail closed on missing prerequisites before any wiki write.
- [x] 3.2 Repurpose `docs-lint`: remove index-coverage checks; add routing-block integrity check, archived-change/wiki coverage pairing (with recorded-deferral exemption), stale-decision detection.
- [x] 3.3 Slim `task-closeout`: add `openspec_change` field to `summary.json`; spec updates move to `/opsx:archive` time; closeout never modifies `openspec/` for in-flight changes.
- [x] 3.4 Update `.agents/docs/index.md`, section indexes, and affected playbooks to reflect new skill behaviors.

## 4. Retirements and docs

- [x] 4.1 Delete `docs-search` and `docs-compile` skills; grep the repo for references and update all call sites (per the replacement checklist now carried by `node-single-runtime-for-kit-scripts`).
- [x] 4.2 Delete forked `openspec-*` skills and `opsx-*` workflow copies; keep `openspec/config.yaml`.
- [x] 4.3 Update README, INSTALL.md, and `docs/architecture.md`: state peer-dependency prerequisites (Node >= 22, global installs, repo initialization) as manual steps; document fail-fast behavior.
- [x] 4.4 Update doc pointers superseded by closure of `integrate-openwiki-skills`, `aksk-install-tools`, and `aksk-openspec-bridge` (all archived 2026-08-23 as superseded).
- [x] 4.5 Migrate the knowledge base into the wiki: move every `decisions/` and `troubleshooting/` entry plus `plan-archive/` under `openwiki/` as OKF pages (`aksk_status` from frontmatter status, identity = filename stem); migrate `MAINTENANCE.md` schema content as a curated page; add a curated overview page replacing the grouped Quick Reference; then delete `.agents/docs/` including hand-built `index.md` files and `log.md`.
- [x] 4.6 Refresh attached AKSK marker blocks (root `AGENTS.md` routing note) after 4.5 completes, then update all remaining inbound references to `.agents/docs/` paths
- [x] 4.7 Replace the hand-written `Self-improvement loop` section in root `AGENTS.md` with the injected `AKSK:LIFECYCLE` block (`node aksk-bootstrap/scripts/attach_section.mjs . AGENTS.md lifecycle-template.md`); verify lint reports all three managed blocks intact. (skills, playbooks, bootstrap templates, JSON schemas for frontmatter validation, integration guides, `example/`, any `openspec/specs/` text) and rerun deterministic index sync so wiki indexes cover the migrated trees.

## 5. Dogfood on this repository

- [x] 5.1 Run the contract attachment against this repo's live `openwiki/INSTRUCTIONS.md` (currently the default stub); verify append-only merge, idempotent re-run, and stub recognition.
- [x] 5.2 Verify distill routing end-to-end: distill a session bundle; confirm OKF output lands in `openwiki/` with curated-page preservation and that fail-closed triggers correctly with tools absent.
- [x] 5.3 Run docs-lint cross-tool checks against the dogfooded state; confirm no false positives on hand-maintained indexes.
- [x] 5.4 Update every guide that instructs hand-adding a routing block (`docs/integrations/*.md`, `docs/integrations/patterns.md`, `INSTALL.md` where applicable): replace manual unmarked snippets with the `aksk-bootstrap` attachment (`attach_section.mjs` + `AKSK:ROUTING` markers), noting append-only idempotent behavior; run last so guides describe dogfood-verified behavior.

## 6. Reconcile affected open changes (post-validation)

- [ ] 6.1 Revise `escalate-quick-reference`: remove all `docs-compile` script dependencies; re-express auto-pinning against OpenWiki-generated indexes or close as superseded if no equivalent exists.
- [ ] 6.2 Revise `formalize-superseded-obsolete`: keep the triple-lock markdown convention minus its `.agents/docs/log.md` leg (the log is deleted; supersession state rides in `aksk_status` on curated wiki pages), delete the `docs-compile` automation requirement, fold triple-lock verification into the cross-tool-lint stale-decision check.
- [ ] 6.3 Revise `worked-lifecycle-example`: extend the end-to-end loop with the wiki leg (descriptive lessons distill to OKF pages under `openwiki/`); `.agents/docs/` destinations shown for prescriptive lessons only.
- [ ] 6.4 Revise `implement-operating-contract-and-triggers`: add an archive-time trigger consideration alongside the existing task-closeout trigger (spec updates move to `/opsx:archive`).
- [ ] 6.5 Coordinate `add-task-start` with the slimmed `task-closeout`: reconcile manifest consumption with the added `openspec_change` field; sequence applies to avoid conflicts.
