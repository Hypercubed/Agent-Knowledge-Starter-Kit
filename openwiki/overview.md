---
type: Reference
title: Knowledge overview
description: 'Entry point to AKSK-curated knowledge: decisions, troubleshooting patterns,
  and the maintenance format.'
tags:
- knowledge
- navigation
- overview
generated: { by: "openwiki/0.4.3", at: "2026-08-29T20:18:58.499Z" }
---
# Knowledge overview

Curated AKSK knowledge: decision records, troubleshooting patterns, and the maintenance schema. Generated wiki pages live elsewhere in this wiki; these trees are AKSK-curated and preserved across update runs.

## Decisions

- [Adopt upstream tools over reimplementation](decisions/adopt-upstream-tools-over-reimplementation.md) - Supersedes the repo-centric-wiki-tooling approach and the extraction-based integrate-openwiki-skills approach; AKSK routes onto shipped OpenWiki/OpenSpec surfaces instead of copying or reimplementing them.
- [Agent-tool ownership partition via receipts](decisions/agent-tool-ownership-partition.md) - When an installer receipt exists in a target agent's directory, that installing lane owns the directory and all other lanes skip it; AKSK never writes into another lane's owned directory.
- [Agents do not stage or commit changes](decisions/agents-do-not-stage-or-commit-changes.md) - Coding agents should leave git staging and commits to the maintainer so history and review boundaries stay human-controlled.

- [`docs-search` stays canonical for `.agents/` knowledge; host-native search is not the default fallback policy](decisions/docs-search-remains-canonical-over-host-native-search.md) - **[SUPERSEDED]** Kit skills should not instruct agents to prefer each host product’s native workspace index or search first, with the `docs-search` Python tools only as fallback. Superseded by `knowledge-consolidation-into-openwiki`: the tools are retired; knowledge lookup is plain grep over curated wiki pages.

- [Docs tooling scripts resolve target from override, then nearest `.agents`](decisions/docs-tooling-scripts-resolve-target-from-override-then-nearest-agents.md) - **[SUPERSEDED]** Docs-search and docs-compile scripts should not assume git-root coupling; they first honor explicit target overrides, then discover the nearest `.agents`. Superseded by `knowledge-consolidation-into-openwiki`: both scripts are retired.

- [GitHub Copilot as Rules-Based IDE Wiring tool](decisions/github-copilot-as-rules-based-ide-wiring-tool.md) - Treat GitHub Copilot as an IDE wiring layer that routes agents to repo-local rules and skills, not as a second knowledge store.

- [Integration guides belong in `docs/integrations/`, not `.agents/`](decisions/integration-guides-belong-in-docs-integrations-not-agents.md) - Product-specific install and wiring guides live under root `docs/integrations/` so `.agents/` stays portable kit knowledge rather than vendor how-tos.

- [Kit installation guidance lives in root docs](decisions/kit-installation-guidance-lives-in-root-docs.md) - Consumer-facing install, layout, and integration instructions belong in repository root `docs/` rather than inside `.agents/docs/`.

- [Knowledge consolidation into OpenWiki](decisions/knowledge-consolidation-into-openwiki.md) - The .agents/docs knowledge base (decisions, troubleshooting) consolidates into curated OpenWiki trees; hand-built indexes and log upkeep move to OpenWiki tooling; AKSK requires openspec and openwiki as hard peers.
- [Maintainer-only skills use `metadata.internal: true`](decisions/maintainer-skills-mark-internal-in-frontmatter.md) - Skills that are only for this repository’s maintenance must declare `metadata.internal: true` so portable installs do not surface them as kit skills.

- [Single runtime - Node for kit scripts](decisions/node-single-runtime-for-kit-scripts.md) - Kit consumer-facing scripts are plain ESM JavaScript (.mjs) running on Node; the former Python preference is superseded because openspec and openwiki already make Node a hard peer dependency.
- [OpenSpec Documentation Enforcement](decisions/openspec-documentation-enforcement.md) - Adopt OpenSpec to enforce documentation and SKILL.md constraints without executing scripts.
- [OpenSpec / OpenWiki / AKSK division of labor](decisions/openspec-openwiki-aksk-division-of-labor.md) - OpenSpec owns the intent/process layer, OpenWiki owns the descriptive knowledge layer, and AKSK owns the experiential and curation layer; AKSK stops reimplementing upstream tool responsibilities.
- [OpenWiki integration distribution stack (v0.3.x reality)](decisions/openwiki-integration-distribution-stack.md) - Records how OpenWiki reaches coding agents as of shipped v0.3.x: skills-CLI bundle plus headless CLI and runtime-importable helpers work; MCP lifecycle server and integrations lanes are unreleased upstream.
- [Optional `prior_session` in session `summary.json`](decisions/optional-prior-session-in-session-summary-json.md) - Session bundles may record an optional `prior_session` pointer in `summary.json` to chain related closeouts without merging bundle folders.

- [Maintainer plans live under `.agents/docs/plans/`, not `.agents/plans/`](decisions/plans-live-under-docs-plans-not-agents-plans.md) - **[SUPERSEDED]** Canonical location for initiative and roadmap markdown was `.agents/docs/plans/`; superseded because maintainer plan files were removed and OpenSpec changes replaced them.

- [Python preference for consumer-facing scripts](decisions/python-preference-for-consumer-scripts.md) - **[SUPERSEDED]** Consumer-facing scripts were to be implemented in Python; superseded by `node-single-runtime-for-kit-scripts` (plain ESM `.mjs` on Node).
- [Regenerate `example/` when the portable kit or bootstrap changes](decisions/regenerate-example-when-portable-kit-changes.md) - When portable `.agents/` templates or bootstrap behavior change, refresh the generated `example/` tree so the illustrated consumer install stays accurate.

- [Sessions directory: tracked README with ignored bundles](decisions/sessions-directory-tracked-readme-with-ignored-bundles.md) - Track only `.agents/sessions/README.md` in git while per-task bundle folders stay ignored so temporary closeout evidence does not pollute history.

- [Shared integration patterns belong in `docs/integrations/patterns.md`](decisions/shared-integration-patterns-belong-in-docs-integrations-patterns-md.md) - Cross-vendor patterns that are not kit-specific belong in `docs/integrations/patterns.md` instead of duplicating them across agent trees.

- [Single-tree architecture (`.agents/`)](decisions/single-tree-architecture-agents.md) - Canonical kit knowledge and portable skills live only under root `.agents/`; the `example/` tree is generated illustration, not a second source of truth.

- [Use docs-capture for ad-hoc durable docs](decisions/use-docs-capture-for-ad-hoc-durable-docs.md) - Direct ad-hoc documentation edits into the .agents/ layer should use the docs-capture skill to bypass full distillation.
- [Use the Routing Pattern for agentic tool bootstrap files](decisions/use-the-routing-pattern-for-agentic-tool-bootstrap-files.md) - Bootstrap files for agentic tools should route to `.agents/AGENTS.md` and portable skills rather than embedding long forked guidance.


## Troubleshooting

- [Agent stuck in explanation loop](troubleshooting/agent-stuck-in-explanation-loop.md) - Recover from agents repeatedly describing processes instead of executing them.
- [Antigravity: Lessons learned aren't visible to teammate's agents](troubleshooting/antigravity-lessons-learned-aren-t-visible-to-teammate-s-agents.md) - Local-only research in Antigravity does not automatically become durable repo knowledge teammates can load; distill lessons into tracked `.agents/` files.

- [Browser subagent fails with invalid_args on view_file](troubleshooting/browser-subagent-filesystem-access-error.md) - Browser-only subagents reject local filesystem tool calls; use the main agent's core tools for repository file operations.
<!-- openwiki: broken internal link [troubleshooting/check-publish-missing-files-while-generate-example-is-running.md] file "troubleshooting/check-publish-missing-files-while-generate-example-is-running.md" does not exist. Fix the href or restore the target, then delete this comment. -->
- [`check-publish.sh` reports missing files while `generate-example` is running](troubleshooting/check-publish-missing-files-while-generate-example-is-running.md) - Validation can fail with transient missing-file errors when checks run while `generate-example` is actively rebuilding `example/`.

- [Clean `git status` but you need touched paths for closeout](troubleshooting/clean-git-status-but-you-need-touched-paths-for-closeout.md) - After commits, the working tree is clean but **task-closeout** still needs an accurate list of paths touched in the session for the bundle record.

- [Codex cannot write under `.agents/` during closeout or distill](troubleshooting/codex-cannot-write-under-agents-during-closeout-or-distill.md) - Codex runs may treat `.agents/` as read-only or require extra approval when creating session bundles or updating durable knowledge during workflows.

<!-- openwiki: broken internal link [troubleshooting/comparing-example-agents-to-root-agents.md] file "troubleshooting/comparing-example-agents-to-root-agents.md" does not exist. Fix the href or restore the target, then delete this comment. -->
- [Comparing greenfield `example/.agents/` to this repo’s root `.agents/`](troubleshooting/comparing-example-agents-to-root-agents.md) - Consumers expect `example/.agents/` to mirror a portable install; diffs against root `.agents/` usually mean the example tree needs regeneration or a doc fix.

- [Docs tooling resolves wrong project root in nested `example/` or global installs](troubleshooting/docs-tooling-resolves-wrong-project-root-in-nested-example-or-global-installs.md) - **[OBSOLETE]** Docs tooling may target the wrong project when scripts infer only git root. Obsolete with the retired docs-search/docs-compile scripts; the entry is retained as historical reference.

<!-- openwiki: broken internal link [troubleshooting/example-agents-looks-like-full-dogfood-copy.md] file "troubleshooting/example-agents-looks-like-full-dogfood-copy.md" does not exist. Fix the href or restore the target, then delete this comment. -->
- [`example/.agents/` looks like a full mirror of root dogfood](troubleshooting/example-agents-looks-like-full-dogfood-copy.md) - The generated example tree contains large slices of this repository’s durable `.agents/docs/`, playbooks, or other maintainer paths instead of the minimal bootstrap-driven layout from generate-example.

- [Gemini CLI not following durable guidance](troubleshooting/gemini-cli-not-following-durable-guidance.md) - Gemini CLI sessions may skip playbooks and `.agents/docs/` entries unless bootstrap files and explicit pointers are wired the way the kit expects.

- [GitHub Copilot Chat context not in focus](troubleshooting/github-copilot-chat-context-not-in-focus.md) - Copilot Chat may ignore `.agents/` guidance when routing files or editor context are not aligned with the repo’s documented bootstrap pattern.

- [Hermes Agent–specific: Dual skill namespace (`skill_view` returns wrong file)](troubleshooting/hermes-agent-specific-dual-skill-namespace-skill-view-returns-wrong-file.md) - Hermes may resolve `skill_view` against a different skill namespace than the repo’s `.agents/skills/` tree, returning unexpected stub content.

- [Hermes Agent–specific: Suspected tool anomaly from a single weak run](troubleshooting/hermes-agent-specific-suspected-tool-anomaly-from-a-single-weak-run.md) - A single flaky tool invocation in Hermes should be validated against the real filesystem before promoting it as a durable repo-wide incident pattern.

- [Index compilation drops human edits](troubleshooting/index-compilation-drops-human-edits.md) - **[OBSOLETE]** Scripted auto-generation of indexes should preserve human-curated sections like Quick Reference. Obsolete: the docs-compile indexer is retired; OpenWiki's deterministic index sync preserves descriptions and never drops curated content outside reserved files.
- [Maintainer plan markdown landed under `learning-distill/bootstrap/`](troubleshooting/maintainer-plans-files-placed-under-skill-bootstrap.md) - Initiative or roadmap files (or stubs for `docs/plans/`) appear under `learning-distill/bootstrap/docs/` or another skill bootstrap tree; portable bootstrap must stay consumer-generic.

- [Maintainer-only skill appears as a portable kit skill](troubleshooting/maintainer-skill-lives-under-agents-skills-by-mistake.md) - Maintainer automation placed under `.agents/skills/` without `internal: true` can be picked up by consumer installs; mark it internal or relocate it.

- [npx skills add includes internal skills](troubleshooting/npx-skills-add-internal-skills.md) - The skills CLI installs maintainer-internal skills unless they are marked internal; gate them with metadata.internal so npx skills add skips them.
- [openwiki --update aborts when run from agent shells](troubleshooting/openwiki-update-aborts-in-agent-shells.md) - Headless OpenWiki update runs abort with a generic 'Request was aborted' when launched from agent shells with command timeouts; run interactively and confirm via `.last-update.json`.
- [Overlapping session bundles for one initiative](troubleshooting/overlapping-session-bundles-for-one-initiative.md) - Multiple `.agents/sessions/` folders may describe related work, complicating which bundle to distill or how `prior_session` links should be read.

- [Remark or bulk Markdown rewrite touched unwanted paths](troubleshooting/remark-or-bulk-markdown-rewrite-unwanted-paths.md) - Wide Markdown formatter runs can touch many files; this pattern explains how to restore only the intended paths without discarding unrelated work.

- [Session Discovery Fails During Distillation or Closeout](troubleshooting/session-discovery-fails-during-distillation-or-closeout.md) - Closeout or distillation workflows sometimes report no session bundles even when work exists; this entry covers common glob and layout causes.

- [Stalled maintenance scripts](troubleshooting/stalled-maintenance-scripts.md) - Long-running scripts (especially those using npx) may appear stuck  due to buffered output.

- [Unexpected files under `.agents/sessions/` in git status](troubleshooting/unexpected-files-under-agents-sessions-in-git-status.md) - Session bundles or stray files under `.agents/sessions/` can show up as tracked or modified when ignore rules and README expectations drift.

- [Windows ripgrep path separators](troubleshooting/windows-ripgrep-path-separators.md) - Normalize Windows ripgrep backslashes in cross-platform scripts.
- [Windows-to-WSL Tool Path Failures](troubleshooting/windows-to-wsl-tool-path-failures.md) - Agents running on Windows against a WSL workspace can fail file operations when paths cross the Windows/Linux boundary incorrectly.

- [Zo UI skill discovery does not auto-show repo-local skills](troubleshooting/zo-ui-skills-discovery-requires-manual-mirror.md) - Kit skills installed to canonical path are not visible in Zo's Skills UI without manual mirroring.

## Reference

- [Knowledge maintenance format](maintenance-format.md) - entry shape, frontmatter contracts, and graph-edge rules for the curated trees.
