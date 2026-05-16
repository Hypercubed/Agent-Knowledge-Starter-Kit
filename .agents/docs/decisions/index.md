---
id: decisions-index
title: "Decisions index"
last_updated: 2026-05-16
---

# Decisions

One file per durable architectural or policy decision. New entries: follow [Entry shape](../MAINTENANCE.md#entry-shape) in `MAINTENANCE.md`, then add a row below.

## Quick Reference

**Core architecture:** [single-tree-architecture-agents.md](single-tree-architecture-agents.md), [sessions-directory-tracked-readme-with-ignored-bundles.md](sessions-directory-tracked-readme-with-ignored-bundles.md)
**Tool integration:** [docs-search-remains-canonical-over-host-native-search.md](docs-search-remains-canonical-over-host-native-search.md), [github-copilot-as-rules-based-ide-wiring-tool.md](github-copilot-as-rules-based-ide-wiring-tool.md), [use-the-routing-pattern-for-agentic-tool-bootstrap-files.md](use-the-routing-pattern-for-agentic-tool-bootstrap-files.md)
**Workflow policies:** [agents-do-not-stage-or-commit-changes.md](agents-do-not-stage-or-commit-changes.md), [regenerate-example-when-portable-kit-changes.md](regenerate-example-when-portable-kit-changes.md)

## Index

- **[`docs-search` stays canonical for `.agents/` knowledge; host-native search is not the default fallback policy](docs-search-remains-canonical-over-host-native-search.md)** — Kit skills should not instruct agents to prefer each host product’s native workspace index or search first, with the `docs-search` Python tools only as fallback. Native search may complement general exploration but does not replace the explicit, scoped index contract for durable `.agents/` markdown.
  - Tags: `docs`, `skills`, `agents`, `architecture`
- **[Agents do not stage or commit changes](agents-do-not-stage-or-commit-changes.md)** — Coding agents should leave git staging and commits to the maintainer so history and review boundaries stay human-controlled.
  - Tags: `git`, `agents`, `workflow`
- **[Docs tooling scripts resolve target from override, then nearest `.agents`](docs-tooling-scripts-resolve-target-from-override-then-nearest-agents.md)** — Docs-search and docs-compile scripts should not assume git-root coupling; they first honor explicit target overrides, then discover the nearest `.agents` from the current working directory.
  - Tags: `docs`, `skills`, `tooling`, `architecture`
- **[GitHub Copilot as Rules-Based IDE Wiring tool](github-copilot-as-rules-based-ide-wiring-tool.md)** — Treat GitHub Copilot as an IDE wiring layer that routes agents to repo-local rules and skills, not as a second knowledge store.
  - Tags: `tooling`, `integrations`, `agents`, `docs`
- **[Integration guides belong in `docs/integrations/`, not `.agents/`](integration-guides-belong-in-docs-integrations-not-agents.md)** — Product-specific install and wiring guides live under root `docs/integrations/` so `.agents/` stays portable kit knowledge rather than vendor how-tos.
  - Tags: `docs`, `integrations`, `architecture`
- **[Kit installation guidance lives in root docs](kit-installation-guidance-lives-in-root-docs.md)** — Consumer-facing install, layout, and integration instructions belong in repository root `docs/` rather than inside `.agents/docs/`.
  - Tags: `docs`, `installation`, `release`
- **[Maintainer plans live under `.agents/docs/plans/`, not `.agents/plans/`](plans-live-under-docs-plans-not-agents-plans.md)** — Canonical location for initiative and roadmap markdown is `.agents/docs/plans/` so plans are indexed by docs-search alongside decisions and troubleshooting.
  - Tags: `plans`, `docs-search`, `agents`, `layout`
- **[Maintainer-only skills use `metadata.internal: true`](maintainer-skills-mark-internal-in-frontmatter.md)** — Skills that are only for this repository’s maintenance must declare `metadata.internal: true` so portable installs do not surface them as kit skills.
  - Tags: `skills`, `maintenance`, `release`
- **[Optional `prior_session` in session `summary.json`](optional-prior-session-in-session-summary-json.md)** — Session bundles may record an optional `prior_session` pointer in `summary.json` to chain related closeouts without merging bundle folders.
  - Tags: `sessions`, `workflow`, `skills`
- **[Python preference for consumer-facing scripts](python-preference-for-consumer-scripts.md)** — Consumer-facing scripts and tooling in the repository should be implemented in Python to ensure cross-platform compatibility and consistent development experience.
  - Tags: `scripts`, `python`, `maintenance`, `conventions`
- **[Regenerate `example/` when the portable kit or bootstrap changes](regenerate-example-when-portable-kit-changes.md)** — When portable `.agents/` templates or bootstrap behavior change, refresh the generated `example/` tree so the illustrated consumer install stays accurate.
  - Tags: `example`, `maintenance`, `release`, `skills`
- **[Sessions directory: tracked README with ignored bundles](sessions-directory-tracked-readme-with-ignored-bundles.md)** — Track only `.agents/sessions/README.md` in git while per-task bundle folders stay ignored so temporary closeout evidence does not pollute history.
  - Tags: `sessions`, `git`, `workflow`
- **[Shared integration patterns belong in `docs/integrations/patterns.md`](shared-integration-patterns-belong-in-docs-integrations-patterns-md.md)** — Cross-vendor patterns that are not kit-specific belong in `docs/integrations/patterns.md` instead of duplicating them across agent trees.
  - Tags: `docs`, `integrations`, `architecture`
- **[Single-tree architecture (`.agents/`)](single-tree-architecture-agents.md)** — Canonical kit knowledge and portable skills live only under root `.agents/`; the `example/` tree is generated illustration, not a second source of truth.
  - Tags: `architecture`, `agents`, `installation`
- **[Use the Routing Pattern for agentic tool bootstrap files](use-the-routing-pattern-for-agentic-tool-bootstrap-files.md)** — Bootstrap files for agentic tools should route to `.agents/AGENTS.md` and portable skills rather than embedding long forked guidance.
  - Tags: `agents`, `integrations`, `docs`
