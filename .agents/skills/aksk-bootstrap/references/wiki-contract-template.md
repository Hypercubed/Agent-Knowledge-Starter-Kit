<!-- AKSK:WIKI-CONTRACT:BEGIN -->
## AKSK curation contract

This section is owned by the Agent Knowledge Starter Kit (AKSK). OpenWiki-owned
content outside these markers takes precedence on conflict. Do not edit between
the markers by hand; rerun the kit's contract attachment after kit upgrades.

### Curated page trees

- `decisions/` - durable decision records with `aksk_status` lifecycle fields.
- `troubleshooting/` - recurring failure patterns and fixes.
- Root pages `overview.md` and `maintenance-format.md` - curated entry point
  and schema reference.

All pages under these trees are authored directly by the distilling agent or
maintainer in OKF format following upstream OpenWiki guidance.

### Curation rules

1. **Preserve-and-link:** when a wiki update run would regenerate a page under
   a curated tree, keep the AKSK-authored page and link generated material to
   it instead of replacing its content.
2. **Frontmatter extensions survive round-trips:** AKSK-specific extension
   fields on curated pages (prefixed `aksk_`) are meaningful and must be
   preserved by update runs.
3. **Distill-authored pages bypass the CLI:** descriptive lessons distilled
   from session bundles are written by the host agent with deterministic index
   refresh; `openwiki --update` remains the scheduled reconciliation path.
<!-- AKSK:WIKI-CONTRACT:END -->
