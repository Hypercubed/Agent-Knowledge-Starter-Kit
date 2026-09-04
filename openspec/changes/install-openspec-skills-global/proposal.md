## Why

`openspec init --tools none` currently suppresses all tool skill generation, and `aksk-bootstrap` (global lane) only installs the `openspec` CLI via `npm i -g`. As a result a fresh user has the `openspec` CLI but no `openspec-*` agent skills (`openspec-explore`, `openspec-propose`, `openspec-apply-change`, etc.) available globally. Every new repo then requires a per-repo decision about which tools get skills, creating drift and extra prompts. Installing the OpenSpec skills once per user via the existing `npx skills` global path eliminates that gap and aligns with the canonical `~/.agents/skills` + host-mirror store.

## What Changes

- Extend the `aksk-bootstrap` global lane (`bootstrap-global.mjs` + `SKILL.md`) to install OpenSpec agent skills globally after CLI verification, using `npx skills add` with the same `-g -a <agent>` / `--all` semantics already used for the kit and for `openwiki` when the host is outside `codex|claude|opencode`.
- Resolve the OpenSpec skill source from `@fission-ai/openspec` (or its published skills package) via `references/versions.json` where possible; fallback to the canonical registry id when unpinned — mirror `versionsFromPackageJson()` caret behavior already used for `npm i -g`.
- Make the install idempotent and detection-driven: check `hasGlobalSkillTarget`-equivalent probes (e.g., `~/.agents/skills/openspec-*/SKILL.md` existence) before installing; re-run is a no-op when already present.
- Keep `aksk-init` unchanged for the default path: it continues to run `openspec init --tools none` (no repo-local skill duplication). Repo-local install remains opt-in via `--local-skills` if a user explicitly wants a vendored copy.
- Preserve `Never half-install` and partitioned INSTRUCT semantics: global lane failure prints exact `npx skills add` commands and exits clean without partial writes; repo lane still fails fast to bootstrap when globals are missing.
- Update install documentation and `openwiki` pages that describe bootstrap scope to reflect global skill spread ownership.

## Capabilities

### New Capabilities
- `global-openspec-skills`: Global, once-per-user installation of OpenSpec agent skills via `npx skills` as part of the bootstrap global lane (idempotent detection, partitioned INSTRUCT fallback, host-aware spread).

### Modified Capabilities
- `aksk-bootstrap`: Extend the global lane scope to include global skill spread for OpenSpec skills (currently covers Node check, `npm i -g` for `openspec`/`openwiki`, PATH verification, and kit/global skill spread). Requirements around skill-spread ownership and never-half-install partitioning need delta updates.
- `canonical-user-skills-scope`: Clarify that the canonical store (`~/.agents/skills` + current host mirror) now also holds `openspec-*` skills installed by the bootstrap global lane, not just kit skills — storage invariant stays intact but examples/coverage expand.

## Impact

- Code: ` .agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs`, `SKILL.md`, `references/versions.json` (if a pin for the OpenSpec skills source is added), and `aksk-init` docs referencing `--tools none` (clarification only).
- Docs: `INSTALL.md`, `README.md`, `openwiki/skills/aksk-bootstrap.md`, `openwiki/distribution/*`, `openwiki/quickstart.md`, `openwiki/integrations/*`.
- Dependencies: Requires `npx` (already required) and the published OpenSpec skills package id; no new runtime beyond `skills` CLI `^1.5.1`.
- Behavior: Fresh `aksk-bootstrap` installs gain `openspec-*` skills globally; existing fully-bootstrapped users see a one-time additive install on next run; no per-repo file writes during global lane — change is additive and idempotent.
