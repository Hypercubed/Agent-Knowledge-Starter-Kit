## ADDED Requirements

### Requirement: Documentation budget in wiki contract
The AKSK curation contract appended to `openwiki/INSTRUCTIONS.md` SHALL include a Documentation brief that constrains OpenWiki to an agent navigation aid. The brief MUST define: (a) Keep — repository map and package ownership, top-level architecture and major runtime/data flows, cross-cutting conventions and extension points, non-obvious invariants evidenced in source/tests, links to source locations and canonical OpenSpec specs; (b) Do not generate — restatements of `openspec/specs/**` requirements or scenarios, per-function/per-class/per-file summaries, detailed API references already generated elsewhere, release notes/task lists/change-history narratives, documentation for generated/vendor/build-output directories, pages whose sole purpose is to paraphrase source code; (c) Update threshold — update a page only when a change alters a public integration boundary, a module ownership boundary, a major data/control flow, a durable codebase convention, or a non-obvious architectural invariant; for feature behavior, link to the canonical OpenSpec spec rather than duplicating its requirements, preferring a small number of high-signal pages over comprehensive coverage. The attachment SHALL remain idempotent and SHALL be inside the existing `AKSK:WIKI-CONTRACT` markers (Option A). Re-running the attachment when the brief is already present SHALL be a no-op; when the template changed, only the marked section is refreshed and nothing outside the markers is touched.

#### Scenario: Wiki references feature behavior
- **WHEN** an agent needs to describe feature behavior in the wiki
- **THEN** the wiki page links to the appropriate `openspec/specs/<capability>/spec.md` rather than restating its requirements

#### Scenario: Wiki update with no boundary change
- **WHEN** a change modifies only internal implementation without altering a public boundary, ownership, flow, convention, or invariant
- **THEN** no wiki page is updated

### Requirement: Root-anchored openwikiignore for generated trees
The repository SHALL provide a `.openwikiignore` at the repo root with anchored, commented rules that exclude generated, vendor, and machine-local paths from OpenWiki discovery. The ignore file SHALL use anchored `/example/` (root only, not bare `example/`) and SHALL preserve `.agents/sessions/` exclusion with `!.agents/sessions/README.md` exception. It SHALL include commented categories for dependencies/build products/caches (`node_modules/`, `dist/`, `build/`, `coverage/`, `.tmp/`, `.cache/`, `.next/`, `.vite/` as applicable), generated/vendor artifacts (`**/*.generated.*`, `vendor/`, `third_party/`), and machine-local/secrets (`.env*`, `secrets/`, `*.pem`, `*.key`). It SHALL NOT exclude `openspec/specs/**` or `openspec/changes/archive/**` (archive remains citeable as historical after graduation). The file SHALL be merge-not-clobber: if `.openwikiignore` is missing, create it from the template; if it exists without AKSK markers, append tagged section; if markers exist, refresh tagged section only; user content outside markers is never removed.

#### Scenario: Evidence path cited from specs
- **WHEN** OpenWiki validates a Claim citing `openspec/specs/wiki-contract/spec.md`
- **THEN** validation succeeds — the path is not excluded by `.openwikiignore`

#### Scenario: Generated file excluded
- **WHEN** OpenWiki scans `dist/bundle.js` or `node_modules/foo/index.js`
- **THEN** the path is excluded and not cited as evidence

#### Scenario: Root example excluded but nested example preserved
- **WHEN** OpenWiki scans `/example/.agents/` (root) vs `packages/foo/example/demo.js` (nested)
- **THEN** the root example is excluded via `/example/` and the nested example is not excluded

### Requirement: OpenWikiignore template and installer ownership
The `aksk-init` kit SHALL own the `.openwikiignore` template at `.agents/skills/aksk-init/references/openwikiignore-template.md` and an installer script that implements merge-not-clobber semantics. The template SHALL carry its own AKSK markers. The installer SHALL be idempotent: re-running on a repo where the ignore already matches the template is a no-op; updating the template refreshes only the marked section.

#### Scenario: First init on fresh repo
- **WHEN** `aksk-init` runs in a repo with no `.openwikiignore`
- **THEN** the installer creates `.openwikiignore` from the template

#### Scenario: Re-running init with customized ignore
- **WHEN** `aksk-init` re-runs in a repo where the user added custom rules outside the AKSK markers
- **THEN** the user's rules are preserved and only the marked section is refreshed if the template changed
