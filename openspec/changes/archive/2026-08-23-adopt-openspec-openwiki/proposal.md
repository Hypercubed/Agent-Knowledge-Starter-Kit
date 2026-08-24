## Why

AKSK 2.0 repositions the kit as glue over two maintained upstream tools: OpenSpec (`@fission-ai/openspec`) owns the intent/process layer and OpenWiki (`openwiki`) owns the descriptive knowledge layer (OKF v0.2 wiki in `openwiki/`). AKSK should stop duplicating them with `docs-search`, `docs-compile`, and hand-rolled index logic, and instead route its experiential layer - session capture, distillation judgment, lint guardrails - onto the adopted tools.

This change treats OpenSpec and OpenWiki as **peer dependencies**: globally installed tools that are assumed to exist. It does not install, bootstrap, or provision anything. Repositories (and maintainers) adopting this change must have both tools initialized in the target repo first; where a precondition is missing, AKSK fails fast with the exact remediation step instead of improvising. Automated installation and provisioning is a separate follow-on change (`aksk-bootstrap-system`).

## What Changes

- Rewrite `learning-distill` so descriptive durable lessons become OpenWiki pages authored directly by the distilling agent in OKF format (following upstream guidance, with deterministic index refresh), while prescriptive agent-behavior lessons stay in `.agents/AGENTS.md`, playbooks, or decisions.
- Add an AKSK curation contract to `openwiki/INSTRUCTIONS.md`: which page trees are AKSK-curated, preserve-and-link semantics under `--update`, and meaningful AKSK frontmatter extensions. The contract section is appended to the existing instructions file - OpenWiki-owned content is never replaced. A missing file means OpenWiki was never initialized: fail fast.
- Verify peer-tool availability before use: skills and scripts that invoke `openspec` or `openwiki` check for the binary first and fail with the exact install/init commands when absent.
- Add the `aksk-bootstrap` skill owning these preconditions (contract attachment, routing-note attachment, peer-tool verification), seeded to absorb tool installation and integration spreading in the follow-on bootstrap change.
- Repurpose `docs-lint` into cross-tool lint: routing-block integrity, archived-change/wiki coverage pairing, stale-decision detection. Index-coverage checking moves out of scope (the wiki tooling owns indexes).
- Slim `task-closeout`: add an `openspec_change` field to `summary.json`; spec updates move to `/opsx:archive` time instead of closeout time.
- **BREAKING** Retire `docs-search` and `docs-compile` (superseded by OpenWiki index/query tooling); delete forked `openspec-*` skills and `opsx-*` workflow copies (native skills from `openspec init/update` replace them). Keep `openspec/config.yaml`.
- Record decision entries: division of labor, distribution-stack context, ownership-partition policy, supersession of `repo-centric-wiki-tooling` and the extraction-based approach formerly proposed in `integrate-openwiki-skills`.
- Consolidate the `.agents/docs/` knowledge base into curated OpenWiki trees (`openwiki/{decisions,troubleshooting}/`), delete hand-built indexes and `.agents/docs/log.md` (OpenWiki tooling owns indexing and run metadata), and remove the `.agents/docs/` tree. Playbooks, sessions, skills, and root guidance stay in `.agents/`. Consumer breakage is accepted: usage is personal-scale, hand-migration fine.
- Explicitly deferred (non-goals): any installation/bootstrap automation.

## Capabilities

### New Capabilities
- `distill-routing`: Output routing rules for `learning-distill` - descriptive knowledge goes to OpenWiki pages in OKF format with curated-page preservation semantics, including decision and troubleshooting records under curated `openwiki/{decisions,troubleshooting}/` trees; prescriptive agent-behavior guidance stays in `.agents/`; missing prerequisites fail fast without writing.
- `cross-tool-lint`: The repurposed `docs-lint` checks spanning AKSK and OpenWiki artifacts - routing-block integrity, archived-change/wiki coverage pairing, stale-decision detection - replacing index-coverage checks.
- `closeout-change-linking`: `task-closeout` links session bundles to OpenSpec changes via an `openspec_change` field, and defers spec updates to archive time.
- `wiki-contract`: Attachment of the AKSK curation contract into an existing `openwiki/INSTRUCTIONS.md` (append-only merge, stub-aware), plus peer-dependency preconditions for all AKSK skill invocations of `openspec`/`openwiki`. The change also adds the marker-delimited AKSK routing-note attachment for root agent instruction files, owned by the new `aksk-bootstrap` skill.

### Modified Capabilities

(None - no requirements under `openspec/specs/` change; retired skills were never spec'd.)

## Impact

- **Skills:** `.agents/skills/` - rewrites of `learning-distill/`, `docs-lint/`, `task-closeout/`; deletion of `docs-search/`, `docs-compile/`, and forked `openspec-*` skills / `opsx-*` workflow copies.
- **Docs:** README/INSTALL/architecture updates stating the peer-dependency prerequisite (Node >= 22, `npm i -g @fission-ai/openspec@latest openwiki`, `openspec init`, `openwiki --init`); new decisions under `.agents/docs/decisions/`.
- **Dependencies:** runtime dependency on globally installed `@fission-ai/openspec` (Node >= 20.19) and `openwiki` (Node >= 22); no package installs performed by AKSK itself.
- **OpenWiki release surface:** this change depends only on shipped `openwiki@0.3.x` behavior: exported agent prompts (`createSystemPrompt`), deterministic OKF helpers (`okf/frontmatter`, `okf/index-sync`), the headless CLI, and the default `INSTRUCTIONS.md` stub content. It deliberately does NOT depend on unreleased main-branch features (MCP lifecycle server, `integrations install` lanes) tracked separately for `aksk-bootstrap-system`.
- **Dogfood:** this repository is the first adopter; its existing `openwiki/` (initialized out-of-band) receives the contract attachment during implementation.
- **Related changes:** supersedes `integrate-openwiki-skills` (archived 2026-08-23) and overlaps retired installer scope in `aksk-install-tools` (archived 2026-08-23). Follow-on: `aksk-bootstrap-system` automates what this change requires doing by hand.
