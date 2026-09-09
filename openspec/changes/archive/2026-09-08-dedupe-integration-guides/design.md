## Context

See proposal.md — Why. The single-source rule for integration guides is not a new idea: `openwiki/decisions/shared-integration-patterns-belong-in-docs-integrations-patterns-md` (accepted 2026-04-19) already requires shared concepts to live in `patterns.md` with product pages linking back, and `openwiki/distribution/tool-integrations.md` restates it. The current pages predate or drifted from that rule. Relevant current state:

- `patterns.md` already has an `## Adopting the kit` section carrying the exact install sentence — the canonical home exists; the product pages just do not link to it.
- `INSTALL.md` already has the full lane ladder ("Agent-assisted via aksk-bootstrap (preferred)" → EXECUTE/INSTRUCT, peer tools, receipts), so the index's "Preferred path" paragraph is a duplicate of content that lives at a stable URL.
- 11 product pages carry the byte-identical sentence; `codex.md` carries a longer `-g -a <self-reported>` variant (genuinely Codex-specific native discovery of `~/.agents/skills`); `agentic-sandbox.md` paraphrases; `openspec.md` has a different guide shape required by the `openspec-integration` spec.
- Root `README.md` already links `patterns.md` and `INSTALL.md` without inlining — it is compliant and needs no edits.
- The `writing-integration-guides` playbook (step 5, pitfall) already forbids repeating the thin-wiring explanation; it just never named the canonical block.

## Goals / Non-Goals

**Goals:**
- The install/wiring sentence exists exactly once (in `patterns.md#adopting-the-kit`); product pages link to it.
- Zero information loss: Codex's native-discovery nuance, per-tool caveats, Discovery/Config tables, verification dates, and references stay on the pages.
- The README index stops duplicating the bootstrap lane ladder.
- A regression guard in docs-lint and the playbook so re-duplication is a visible lint finding.

**Non-Goals:**
- Rebuilding the guides as generated/templated output (no new tooling; 14 static pages do not justify a generator).
- Restructuring `openspec.md` or the Discovery/Config table format.
- Touching root `README.md` (already compliant), `patterns.md`'s pattern groups, or the Quick Matrix.
- Updating `openwiki/` pages (they already state the single-source rule and stay true after the change).

## Decisions

### D1: `patterns.md#adopting-the-kit` is the canonical block

Product pages replace Setup step 1 with one line: "Install the kit per [Adopting the kit](./patterns.md#adopting-the-kit)." `patterns.md`'s `## Adopting the kit` section is edited to carry the exact sentence verbatim (it already does; align wording if the pages had drifted).

**Rationale:** the canonical home already exists and is sanctioned by the accepted decision; a new `_setup.md` partial would add a hop to a file no index lists, and generated pages are overkill for 14 files.

**Alternatives considered:** (a) a `_setup.md` include — rejected, markdown has no include and the file would be undiscoverable; (b) moving the block to `INSTALL.md` — rejected, patterns.md is the page the opener already links ("For the shared integration model, read Integration Patterns"), keeping the wiring fact next to the model.

### D2: Codex keeps a tool-specific install note

`codex.md`'s step 1 becomes the canonical link plus one retained line: the `-g -a <self-reported>` form and why (Codex reads `~/.agents/skills` natively; universal + self-reported host). The "Extra `-a <other>`/`--all` only when the user asked" clause moves into that retained line rather than the canonical block, since it is install-scope guidance, not wiring.

### D3: README "Preferred path" → pointer

Replace the ~4-line inline paragraph in `docs/integrations/README.md` with a short pointer: the two install lanes (agent-assisted `bootstrap.mjs` EXECUTE lane and manual fallback) are documented in `INSTALL.md` and the `aksk-bootstrap` SKILL.md; the per-tool guides are the manual-fallback quick references. The "Do not hardcode agent skill paths — derive from `openwiki integrations install` / `list`" rule is preserved by the pointer (it lives in the `aksk-bootstrap` skill and the `agent-integration-spread` spec) — drop only the inline restatement.

**Rationale:** `INSTALL.md` is the linked target of every product page already and carries the full ladder; duplicating it in the index creates the same drift this change removes.

### D4: Kept per-page, deliberately

Discovery/Config tables (tool filenames), caveats, verification dates, and the `## References` trailer stay on every page. The accepted decision explicitly lists "exact filenames, minimal snippets, discovery/config table, unique caveats, verification date, and references" as product-page responsibilities. Only the *shared explanation* is centralized.

### D5: Regression guard

- `docs-lint` content checks gain: flag any page under `docs/integrations/` whose Setup step 1 inlines the canonical adopt-the-kit sentence instead of linking `patterns.md#adopting-the-kit` (grep-able pattern, reported not auto-fixed, consistent with docs-lint's report/suggest scope).
- `writing-integration-guides.md` step 5 + pitfall name `patterns.md#adopting-the-kit` as the canonical block to link.

**Rationale:** the guard lives where the rule already lives (the playbook) plus the periodic lint pass; no new script is warranted for a two-pattern check.

## Risks / Trade-offs

- [A reader lands on a product page without context of the shared model] → Mitigation: every page already opens with "For the shared integration model, read [Integration Patterns](./patterns.md)"; the canonical link sits under the same heading it replaced.
- [The Codex variant gets lost in dedupe] → Mitigation: D2 retains it explicitly; verification task asserts Codex's native-discovery sentence still exists.
- [Install command changes again and someone edits only patterns.md] → That is the desired end state; the docs-lint check keeps pages honest if someone re-inlines instead.
- [Anchor drift: `#adopting-the-kit` heading renamed later] → Mitigation: verification grep asserts the anchor target exists in `patterns.md`; check-publish's link checker validates the relative link.

## Migration Plan

1. Edit `patterns.md` `## Adopting the kit` to carry the exact canonical sentence (align wording if needed).
2. Replace Setup step 1 in the 13 product pages with the link (Codex per D2; agentic-sandbox aligned to the link).
3. Trim the README "Preferred path" paragraph to the pointer.
4. Extend the docs-lint duplication check and the playbook.
5. Verify: grep the canonical sentence → 1 hit in `patterns.md` (+0 in product pages); codex note present; `#adopting-the-kit` anchor exists; `bash scripts/check-publish.sh` passes; `docs-lint` pass.
6. Rollback: revert the doc edits from git; nothing structural changes.

## Open Questions

None. The canonical-home choice is settled by the existing accepted decision; `skip_specs: true` is the schema's prescribed handling for a docs-only change.