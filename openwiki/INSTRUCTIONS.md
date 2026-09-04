A code wiki for this repository.

## OpenSpec source of truth

- `openspec/specs/**` is the current contract. Cite it as evidence for shipped behavior. Each `spec.md` under `openspec/specs/<capability>/` is the authoritative requirement set for that capability.
- `openspec/changes/**` are pending proposals — not current behavior. When a wiki page cites evidence from `openspec/changes/<name>/`, label it **Proposal-only (not yet in `openspec/specs/**`)** and do not present delta requirements (`ADDED`/`MODIFIED`/`REMOVED`) as shipped behavior.
- `openspec/changes/archive/**` is historical. Only cite an archived change as source of truth after `openspec archive <name>` has graduated its specs to `openspec/specs/**`.

## Generated demo output

Treat `example/` at the repository root as a generated consumer-install illustration — not source truth. Do not cite files under `example/` as evidence for shipped behavior, and do not present its contents as canonical implementation. OpenWiki ignores only the root `example/` via `.openwikiignore` (`/example/`); nested `example/` folders are not ignored.

## Temporary session evidence

Treat `.agents/sessions/` as temporary closeout bundles — not source truth. Do not cite files under `.agents/sessions/` (except `.agents/sessions/README.md`) as evidence for shipped behavior, and do not present bundle contents as canonical implementation. Bundles are local working memory until distilled; OpenWiki ignores them via `.openwikiignore`.

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

### Documentation budget

OpenWiki is an agent navigation aid, not a comprehensive reference.
Prefer a small number of high-signal pages over broad coverage.

Keep:

- Repository map and package ownership.
- Top-level architecture and major runtime/data flows.
- Cross-cutting conventions and extension points.
- Non-obvious invariants evidenced in source/tests.
- Links to source locations and canonical `openspec/specs/**` specs.

Do not generate:

- Restatements of `openspec/specs/**` requirements or scenarios.
- Per-function/per-class/per-file summaries.
- Detailed API references already generated elsewhere.
- Release notes, task lists, or change-history narratives.
- Documentation for generated/vendor/build-output directories.
- Pages whose sole purpose is to paraphrase source code.

Update threshold:

- Update a page only when a change alters a public integration boundary,
  a module ownership boundary, a major data/control flow, a durable
  codebase convention, or a non-obvious architectural invariant.
- For feature behavior, link to the canonical OpenSpec spec rather than
  duplicating its requirements.
<!-- AKSK:WIKI-CONTRACT:END -->
