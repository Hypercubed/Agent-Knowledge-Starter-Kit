## Context

See proposal.md - Why. Two facts constrain the approach. First, the pre-consolidation machinery this change originally targeted (`generate-durable-indexes.py`, `docs-compile`, `.agents/docs/MAINTENANCE.md`) was removed by `adopt-openspec-openwiki`: indexes under `openwiki/` are now generated deterministically by OpenWiki's `okf/index-sync` (via `aksk-bootstrap/scripts/sync_wiki_indexes.mjs`), rendering only Files/Directories sections from page descriptions. Second, the installed generator has no lifecycle support (no `superseded`, `aksk_*`, or strikethrough handling in the shipped `dist/okf/index-sync.js`), so any hand-written `## Superseded` section or strikethrough in an index is wiped on the next sync. The `learning-distill` frontmatter schemas already carry `aksk_status` / `aksk_superseded_by` (`aksk_status` required on decisions, optional on troubleshooting), while `openwiki/maintenance-format.md` still documents the older `status` vocabulary - that drift is reconciled here.

## Goals / Non-Goals

**Goals:**
- A deprecation convention that survives index regeneration with no generator change.
- One vocabulary shared by pages, generated indexes, and the `docs-lint` stale check.
- Historical pages stay reachable; active guidance stays unmuddied.

**Non-Goals:**
- Lifecycle rendering inside OpenWiki's generator (upstream option, not this change).
- Automated sweeps that proactively deprecate pages.
- New folders, new index files, or archive directories.

## Decisions

### D1: Frontmatter is the source of truth (`aksk_status` + `aksk_superseded_by`)
Deprecation state lives in the page frontmatter using the exact keys the `learning-distill` schemas already enforce. `openwiki/maintenance-format.md` is updated from the legacy `status` vocabulary to `aksk_status` so the reference doc and the schemas agree.
- **Alternative - keep `status`:** rejected; the schemas (the enforced contract) use `aksk_status`, and two vocabularies is how entries get missed.
- **Alternative - `aksk_superseded_note` free text:** the shipped schemas have no such key; the successor link (`aksk_superseded_by`) plus the body banner carry the explanation. Not adding a schema key in this change.

### D2: Description prefix is the index lock (not sections or strikethrough)
The frontmatter `description` carries a `[SUPERSEDED]` / `[OBSOLETE]` prefix, which the generator copies into `index.md` verbatim. This is the only index-visible marker that survives regeneration without upstream work.
- **Alternative - hand-written `## Superseded` sections:** rejected; verified wiped by `sync_wiki_indexes.mjs`.
- **Alternative - strikethrough in indexes:** rejected for the same reason; strikethrough remains allowed only in hand-authored prose links, which no generator touches.

### D3: Body banner is the human lock
Each deprecated page carries a short status banner at the top of its body naming the state and linking the successor. Covers the reader who lands on the page directly (deep link, grep) instead of via an index.

### D4: `docs-lint` enforces, nothing generates
The existing stale-decision check is extended to the full convention: `aksk_status` set implies `aksk_superseded_by` where a successor exists, description prefix present, banner present. No new script; the check already walks curated pages.
- **Cross-tool note:** the convention is plain frontmatter plus Markdown, so it renders identically for every agent host (Claude, Codex, Copilot, Cursor, OpenCode) with no per-tool wiring.

## Risks / Trade-offs

- **[Risk]** Upstream OpenWiki later adds its own lifecycle rendering that conflicts with the prefix style. **Mitigation:** the frontmatter keys are the contract; the prefix is presentation and can be migrated mechanically by grep.
- **[Risk]** Authors set `aksk_status` but forget the description prefix or banner. **Mitigation:** `docs-lint` flags the partial marking; the three locks are checked as a unit.
- **[Risk]** `maintenance-format.md` retains pre-consolidation `.agents/docs/` path language elsewhere on the page. **Mitigation:** out of scope here except the lifecycle section; the page already carries a layout note acknowledging it.
