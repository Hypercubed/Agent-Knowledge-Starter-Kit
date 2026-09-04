# Proposal: Adopt Documentation Budget in This Repo (Phase 1)

## Why

OpenWiki has no explicit documentation budget, so the wiki (7898 lines vs 511 lines of spec) can drift into restating `openspec/specs/**` requirements, per-file summaries, and redundant API references. Adding the Keep / Do-not-generate / Update-threshold brief and a proper `.openwikiignore` makes OpenWiki an agent navigation aid that links to specs rather than duplicating them.

## What Changes

- Expand `openwiki/INSTRUCTIONS.md` with the Documentation brief (Keep / Do not generate / Update threshold) — Option A: inside the existing `AKSK:WIKI-CONTRACT` block so `attach_wiki_contract.mjs` refresh carries it.
- Update `wiki-contract-template.md` (`references/wiki-contract-template.md` → reflected in `openwiki/INSTRUCTIONS.md`) to include the brief verbatim.
- Replace/expand `.openwikiignore` with anchored, commented starter list (`node_modules/`, `dist/`, `build/`, `coverage/`, `.tmp/`, `.cache/`, `vendor/`, `.env*`, `*.pem`, `*.key`, etc.) while preserving root `/example/` and `.agents/sessions/` exceptions. Merge-not-clobber for existing files.
- No change to `openspec/changes/archive/` visibility — archive stays readable so evidence citations remain valid.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `wiki-contract`: add Documentation budget requirement — what OpenWiki must NOT generate, what it must keep (repo map, flows, invariants, links to specs), and when to update (public boundary / ownership / major flow / convention / invariant changes, batched after merges).

## Impact

- `openwiki/INSTRUCTIONS.md` — brief added
- `.openwikiignore` — expanded starter list
- `.agents/skills/aksk-init/references/wiki-contract-template.md` — brief added (source for attachment)
- `openspec/specs/wiki-contract/spec.md` — new requirement
- No runtime code; verification via `openwiki --help` and manual inspection of ignore/INSTRUCTIONS.
