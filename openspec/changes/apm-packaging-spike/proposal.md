## Why

`npx skills add` ships only SKILL.md trees, so playbooks, rules, and AGENTS.md attachments are generated locally by init scripts instead of installed declaratively. There is no manifest or lockfile for skill content, which hurts reproducible installs. Microsoft APM (`apm.yml` + lockfile, multi-primitive distribution) may close that gap by shipping skills, workflows, and rules together. Content dedupe without a dependency manager also pushes complexity onto the consumer: `dedupe-skill-internals` replaces duplicated scripts with runtime sibling resolvers that fail closed when `aksk-bootstrap` is absent, so standalone-`init` installs break; APM would express that coupling as a declared dependency with transitive resolution instead of a runtime surprise.

## What Changes

- Spike only: evaluate packaging the kit as an APM package (manifest + primitive mapping).
- Map kit content to APM primitives: skills -> skills, playbooks -> prompts/skills, `rules/` + AGENTS.md baseline/attachments -> instructions, closeout/distill/lint roles -> agents (candidate).
- Test `apm install` equivalence against `npx skills add` + init in a sandbox; report on the `.mjs` script-execution gap (`scripts: {}` semantics).
- No change to the default install lanes in this change; APM would be an opt-in lane if the spike succeeds.

## Capabilities

### New Capabilities

- `apm-distribution`: packaging the kit as an APM-delivered bundle (manifest, primitive mapping, lockfile reproducibility, opt-in install lane).

### Modified Capabilities

- `install-lanes`: present APM as an opt-in lane alongside the existing agent-assisted and fallback lanes, without changing the default.

## Impact

- Spike touches no lane scripts or docs; follow-up work would affect `INSTALL.md`, `verify-install`, `aksk-bootstrap`/`aksk-init` docs, and `docs/integrations/`.
- Durable knowledge: expect a new decision page on APM-vs-skills distribution and, if the lane lands, troubleshooting entries for `apm install` drift/audit.
- Temporary spike notes stay in this change and `.agents/sessions/`; only stable outcomes promote to `openwiki/` or `.agents/`.
