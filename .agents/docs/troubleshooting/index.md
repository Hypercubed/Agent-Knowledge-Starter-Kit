---
id: troubleshooting-index
title: "Troubleshooting index"
last_updated: 2026-05-16
---

# Troubleshooting

One file per recurring issue pattern. New entries: follow [Entry shape](../MAINTENANCE.md#entry-shape) in `MAINTENANCE.md`, then add a row below.

## Index

- **[`check-publish.sh` reports missing files while `generate-example` is running](check-publish-missing-files-while-generate-example-is-running.md)** — Validation can fail with transient missing-file errors when checks run while `generate-example` is actively rebuilding `example/`.
  - Tags: `validation`, `scripts`, `example`, `maintenance`
- **[`example/.agents/` looks like a full mirror of root dogfood](example-agents-looks-like-full-dogfood-copy.md)** — The generated example tree contains large slices of this repository’s durable `.agents/docs/`, playbooks, or other maintainer paths instead of the minimal bootstrap-driven layout from generate-example.
  - Tags: `example`, `maintenance`, `skills`, `docs`
- **[Agent stuck in explanation loop](agent-stuck-in-explanation-loop.md)** — Recover from agents repeatedly describing processes instead of executing them.
  - Tags: `agent-behavior`, `prompt-engineering`
- **[Antigravity: Lessons learned aren't visible to teammate's agents](antigravity-lessons-learned-aren-t-visible-to-teammate-s-agents.md)** — Local-only research in Antigravity does not automatically become durable repo knowledge teammates can load; distill lessons into tracked `.agents/` files.
  - Tags: `agents`, `workflow`, `docs`
- **[Browser subagent fails with invalid_args on view_file](browser-subagent-filesystem-access-error.md)**
- **[Clean `git status` but you need touched paths for closeout](clean-git-status-but-you-need-touched-paths-for-closeout.md)** — After commits, the working tree is clean but **task-closeout** still needs an accurate list of paths touched in the session for the bundle record.
  - Tags: `git`, `sessions`, `skills`, `workflow`
- **[Codex cannot write under `.agents/` during closeout or distill](codex-cannot-write-under-agents-during-closeout-or-distill.md)** — Codex runs may treat `.agents/` as read-only or require extra approval when creating session bundles or updating durable knowledge during workflows.
  - Tags: `codex`, `sessions`, `skills`, `agents`
- **[Comparing greenfield `example/.agents/` to this repo’s root `.agents/`](comparing-example-agents-to-root-agents.md)** — Consumers expect `example/.agents/` to mirror a portable install; diffs against root `.agents/` usually mean the example tree needs regeneration or a doc fix.
  - Tags: `example`, `maintenance`, `agents`
- **[Docs tooling resolves wrong project root in nested `example/` or global installs](docs-tooling-resolves-wrong-project-root-in-nested-example-or-global-installs.md)** — Docs tooling may target the wrong project when scripts infer only git root; this entry describes override-first plus nearest-`.agents` resolution and checks.
  - Tags: `docs`, `skills`, `tooling`, `troubleshooting`
- **[Gemini CLI not following durable guidance](gemini-cli-not-following-durable-guidance.md)** — Gemini CLI sessions may skip playbooks and `.agents/docs/` entries unless bootstrap files and explicit pointers are wired the way the kit expects.
  - Tags: `gemini`, `agents`, `integrations`
- **[GitHub Copilot Chat context not in focus](github-copilot-chat-context-not-in-focus.md)** — Copilot Chat may ignore `.agents/` guidance when routing files or editor context are not aligned with the repo’s documented bootstrap pattern.
  - Tags: `github-copilot`, `agents`, `integrations`
- **[Hermes Agent–specific: Dual skill namespace (`skill_view` returns wrong file)](hermes-agent-specific-dual-skill-namespace-skill-view-returns-wrong-file.md)** — Hermes may resolve `skill_view` against a different skill namespace than the repo’s `.agents/skills/` tree, returning unexpected stub content.
  - Tags: `hermes`, `skills`, `tooling`
- **[Hermes Agent–specific: Suspected tool anomaly from a single weak run](hermes-agent-specific-suspected-tool-anomaly-from-a-single-weak-run.md)** — A single flaky tool invocation in Hermes should be validated against the real filesystem before promoting it as a durable repo-wide incident pattern.
  - Tags: `hermes`, `tooling`, `debugging`
- **[Maintainer plan markdown landed under `learning-distill/bootstrap/`](maintainer-plans-files-placed-under-skill-bootstrap.md)** — Initiative or roadmap files (or stubs for `docs/plans/`) appear under `learning-distill/bootstrap/docs/` or another skill bootstrap tree; portable bootstrap must stay consumer-generic.
  - Tags: `plans`, `skills`, `docs`, `maintenance`
- **[Maintainer-only skill appears as a portable kit skill](maintainer-skill-lives-under-agents-skills-by-mistake.md)** — Maintainer automation placed under `.agents/skills/` without `internal: true` can be picked up by consumer installs; mark it internal or relocate it.
  - Tags: `skills`, `maintenance`, `release`
- **[npx skills add includes internal skills](npx-skills-add-internal-skills.md)**
- **[Overlapping session bundles for one initiative](overlapping-session-bundles-for-one-initiative.md)** — Multiple `.agents/sessions/` folders may describe related work, complicating which bundle to distill or how `prior_session` links should be read.
  - Tags: `sessions`, `workflow`, `skills`
- **[Remark or bulk Markdown rewrite touched unwanted paths](remark-or-bulk-markdown-rewrite-unwanted-paths.md)** — Wide Markdown formatter runs can touch many files; this pattern explains how to restore only the intended paths without discarding unrelated work.
  - Tags: `markdown`, `git`, `tooling`
- **[Session Discovery Fails During Distillation or Closeout](session-discovery-fails-during-distillation-or-closeout.md)** — Closeout or distillation workflows sometimes report no session bundles even when work exists; this entry covers common glob and layout causes.
  - Tags: `sessions`, `skills`, `workflow`
- **[Stalled maintenance scripts](stalled-maintenance-scripts.md)** — Long-running scripts (especially those using npx) may appear stuck due to buffered output.
  - Tags: `tooling`, `scripts`, `npx`
- **[Unexpected files under `.agents/sessions/` in git status](unexpected-files-under-agents-sessions-in-git-status.md)** — Session bundles or stray files under `.agents/sessions/` can show up as tracked or modified when ignore rules and README expectations drift.
  - Tags: `sessions`, `git`, `workflow`
- **[Windows ripgrep path separators](windows-ripgrep-path-separators.md)** — Normalize Windows ripgrep backslashes in cross-platform scripts.
  - Tags: `python`, `ripgrep`, `cross-platform`
- **[Windows-to-WSL Tool Path Failures](windows-to-wsl-tool-path-failures.md)** — Agents running on Windows against a WSL workspace can fail file operations when paths cross the Windows/Linux boundary incorrectly.
  - Tags: `windows`, `wsl`, `tooling`
- **[Zo UI skill discovery does not auto-show repo-local skills](zo-ui-skills-discovery-requires-manual-mirror.md)** — Kit skills installed to canonical path are not visible in Zo's Skills UI without manual mirroring.
  - Tags: `environment-zo`, `skills`, `discovery`
