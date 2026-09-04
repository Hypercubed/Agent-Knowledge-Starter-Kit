## Context

This repo's `openwiki/INSTRUCTIONS.md` already has OpenSpec source-of-truth, generated demo output, and AKSK curation contract sections (`AKSK:WIKI-CONTRACT` markers via `attach_wiki_contract.mjs`). The curation contract preserves `decisions/` + `troubleshooting/` and `overview.md`/`maintenance-format.md` across update runs. Missing is the documentation budget that tells the agentic writer what NOT to write and when to update. `.openwikiignore` is currently minimal (2 lines). Option A expands the existing contract block; no new markers.

See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Add Documentation brief to `openwiki/INSTRUCTIONS.md` (and its template source) inside existing markers so refresh distributes it
- Expand `.openwikiignore` with anchored, commented starter list, preserving sessions and root example semantics
- Keep `openspec/changes/archive/**` citeable; keep `.agents/sessions/README.md` exception

**Non-Goals:**
- New attachment markers or installer scripts (Phase 2)
- Changing `AKSK:WIKI-CONTRACT` curation rules (preserve-and-link, frontmatter extensions, distill bypass)
- Auto-regenerating wiki pages — budget constrains future runs, not current content

## Decisions

**Decision: Option A — expand wiki-contract-template.md in place**
- Rationale: Single marker, single refresh path, reuses `attach_wiki_contract.mjs` idempotence. User requested Option A for Phase 1.
- Alternative: New `AKSK:DOC-BUDGET` markers (Option B) — deferred; can migrate later with a refresh that splits the block if separation becomes valuable. Migration is additive (split content, keep both markers for one release).

**Decision: .openwikiignore merge-not-clobber even in Phase 1**
- Rationale: Phase 2 will need installer logic; establishing merge semantics now avoids surprise overwrites for users who customized ignore.
- Alternative: Overwrite — rejected; would delete user additions.

**Decision: Keep archive visible**
- Rationale: `openwiki/decisions/root-anchored-openwikiignore...` evidence cites archive; ignoring it breaks existing Claims resolver (`Evidence path is excluded` at `dist/evidence/repository/resolver.js:55`). Budget already says "do not generate release notes from archive" — visibility ≠ generation.

## Risks / Trade-offs

- **Agentic drift persists** → Mitigation: Update threshold ("only when public boundary/ownership/flow/convention/invariant changes") plus scheduled batch updates; exact wording does not guarantee restraint but narrows target.
- **Ignore too broad hides real evidence** → Mitigation: Anchored `/example/` not bare `example/`; specs and archive explicitly not ignored; commented template lets consumers prune.
- **Contract template divergence** → Mitigation: Source is `references/wiki-contract-template.md`; `openwiki/INSTRUCTIONS.md` is the attached copy. Refresh must stay byte-identical to template inside markers.

## Migration Plan

1. Update `references/wiki-contract-template.md` with brief, run `attach_wiki_contract.mjs` to refresh `openwiki/INSTRUCTIONS.md`
2. Update `.openwikiignore` from template (merge if markers exist, else append/refresh)
3. Validate: `openspec validate --strict`, `openwiki` evidence resolver finds `openspec/specs/**` and skips `node_modules/`/`dist/`
4. No rollback beyond reverting the two files; wiki pages unchanged until next `openwiki --update`

## Open Questions

- None blocking; Phase 2 will decide installer script name and whether to reuse `attach_section.mjs` vs dedicated `init_openwikiignore.mjs`.
