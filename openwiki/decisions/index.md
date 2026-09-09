# Files

- [Adopt upstream tools over reimplementation](adopt-upstream-tools-over-reimplementation.md) - Supersedes the repo-centric-wiki-tooling approach and the extraction-based integrate-openwiki-skills approach; AKSK routes onto shipped OpenWiki/OpenSpec surfaces instead of copying or reimplementing them.
- [Agent-tool ownership partition via receipts](agent-tool-ownership-partition.md) - When an installer receipt exists in a target agent's directory, that installing lane owns the directory and all other lanes skip it; AKSK never writes into another lane's owned directory.
- [Agents do not stage or commit changes](agents-do-not-stage-or-commit-changes.md) - Coding agents should leave git staging and commits to the maintainer so history and review boundaries stay human-controlled.

- [`docs-search` stays canonical for `.agents/` knowledge; host-native search is not the default fallback policy](docs-search-remains-canonical-over-host-native-search.md) - Kit skills should not instruct agents to prefer each host product’s native workspace index or search first, with the `docs-search` Python tools only as fallback. Native search may complement general exploration but does not replace the explicit, scoped index contract for durable `.agents/` markdown.

- [Docs tooling scripts resolve target from override, then nearest `.agents`](docs-tooling-scripts-resolve-target-from-override-then-nearest-agents.md) - Docs-search and docs-compile scripts should not assume git-root coupling; they first honor explicit target overrides, then discover the nearest `.agents` from the current working directory.

- [GitHub Copilot as Rules-Based IDE Wiring tool](github-copilot-as-rules-based-ide-wiring-tool.md) - Treat GitHub Copilot as an IDE wiring layer that routes agents to repo-local rules and skills, not as a second knowledge store.

- [Integration guides belong in `docs/integrations/`, not `.agents/`](integration-guides-belong-in-docs-integrations-not-agents.md) - Product-specific install and wiring guides live under root `docs/integrations/` so `.agents/` stays portable kit knowledge rather than vendor how-tos.

- [Kit installation guidance lives in root docs](kit-installation-guidance-lives-in-root-docs.md) - Consumer-facing install, layout, and integration instructions belong in repository root `docs/` rather than inside `.agents/docs/`.

- [Knowledge consolidation into OpenWiki](knowledge-consolidation-into-openwiki.md) - The .agents/docs knowledge base (decisions, troubleshooting) consolidates into curated OpenWiki trees; hand-built indexes and log upkeep move to OpenWiki tooling; AKSK requires openspec and openwiki as hard peers.
- [Maintainer-only skills use `metadata.internal: true`](maintainer-skills-mark-internal-in-frontmatter.md) - Skills that are only for this repository’s maintenance must declare `metadata.internal: true` so portable installs do not surface them as kit skills.

- [Single runtime - Node for kit scripts](node-single-runtime-for-kit-scripts.md) - Kit consumer-facing scripts are plain ESM JavaScript (.mjs) running on Node; the former Python preference is superseded because openspec and openwiki already make Node a hard peer dependency.
- [OpenSpec Documentation Enforcement](openspec-documentation-enforcement.md) - Adopt OpenSpec to enforce documentation and SKILL.md constraints without executing scripts.
- [OpenSpec / OpenWiki / AKSK division of labor](openspec-openwiki-aksk-division-of-labor.md) - OpenSpec owns the intent/process layer, OpenWiki owns the descriptive knowledge layer, and AKSK owns the experiential and curation layer; AKSK stops reimplementing upstream tool responsibilities.
- [OpenWiki integration distribution stack (v0.3.x reality)](openwiki-integration-distribution-stack.md) - Records how OpenWiki reaches coding agents as of shipped v0.3.x: skills-CLI bundle plus headless CLI and runtime-importable helpers work; MCP lifecycle server and integrations lanes are unreleased upstream.
- [Optional `prior_session` in session `summary.json`](optional-prior-session-in-session-summary-json.md) - Session bundles may record an optional `prior_session` pointer in `summary.json` to chain related closeouts without merging bundle folders.

- [Pin global tool versions via caret in package.json and bundled versions.json](pin-global-tool-versions-via-caret-and-bundled-versions-json.md) - Global installs use caret ranges from package.json copied to bundled references/versions.json for consumer delivery; non-npm GitHub sources pin by commit SHA with vendored fallback.
- [Maintainer plans live under `.agents/docs/plans/`, not `.agents/plans/`](plans-live-under-docs-plans-not-agents-plans.md) - Canonical location for initiative and roadmap markdown is `.agents/docs/plans/` so plans are indexed by docs-search alongside decisions and troubleshooting.

- [Python preference for consumer-facing scripts](python-preference-for-consumer-scripts.md) - Consumer-facing scripts and tooling in the repository should be implemented in Python to ensure cross-platform compatibility and consistent development experience.
- [Regenerate `example/` when the portable kit or bootstrap changes](regenerate-example-when-portable-kit-changes.md) - When portable `.agents/` templates or bootstrap behavior change, refresh the generated `example/` tree so the illustrated consumer install stays accurate.

- [Root-anchored .openwikiignore for generated trees](root-anchored-openwikiignore-for-generated-trees.md) - Use anchored /example/ and explicit .agents/sessions/ withREADME re-include in .openwikiignore to keep generated demo and ephemeral session bundles out of wiki evidence.
- [Sessions directory: tracked README with ignored bundles](sessions-directory-tracked-readme-with-ignored-bundles.md) - Track only `.agents/sessions/README.md` in git while per-task bundle folders stay ignored so temporary closeout evidence does not pollute history.

- [Shared integration patterns belong in `docs/integrations/patterns.md`](shared-integration-patterns-belong-in-docs-integrations-patterns-md.md) - Cross-vendor patterns that are not kit-specific belong in `docs/integrations/patterns.md` instead of duplicating them across agent trees.

- [Single-tree architecture (`.agents/`)](single-tree-architecture-agents.md) - Canonical kit knowledge and portable skills live only under root `.agents/`; the `example/` tree is generated illustration, not a second source of truth.

- [Use docs-capture for ad-hoc durable docs](use-docs-capture-for-ad-hoc-durable-docs.md) - Direct ad-hoc documentation edits into the .agents/ layer should use the docs-capture skill to bypass full distillation.
- [Use the Routing Pattern for agentic tool bootstrap files](use-the-routing-pattern-for-agentic-tool-bootstrap-files.md) - Bootstrap files for agentic tools should route to `.agents/AGENTS.md` and portable skills rather than embedding long forked guidance.

