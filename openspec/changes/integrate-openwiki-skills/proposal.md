## Why

AKSK currently uses its own custom logic for managing documentation (`docs-compile`, `docs-lint`, `docs-search`). OpenWiki provides a robust standard (Google Open Knowledge Format v0.1) and a more structured way to manage agent knowledge. Integrating OpenWiki natively as extracted skills (rather than wrapping its CLI) will give AKSK an official standard format for knowledge bases, reducing duplicated effort and ensuring we inherit OpenWiki's prompt improvements without relying on an opaque AI harness during runtime.

## What Changes

- Create a script (`scripts/extract-openwiki-skills.js`) that extracts the prompt instructions directly from the `openwiki` node package.
- Introduce `openwiki-init` and `openwiki-sync` skills that execute OpenWiki's internal logic natively within the agent.
- Replace the legacy `docs-compile` and `docs-lint` skills with these new native skills.
- Update `learning-distill` to trigger `openwiki-sync` after extracting new knowledge.
- Update the starter-kit initialization to run the extractor on `npx @hypercubed/aksk init` or equivalent.
- Provide a custom `docs-search` skill tailored to search Open Knowledge Format (OKF) markdown bundles since OpenWiki lacks a native search command.

## Capabilities

### New Capabilities
- `openwiki-extraction`: The ability to automatically extract OpenWiki's internal prompts and generate native `SKILL.md` files during kit initialization.
- `openwiki-sync`: The native agent skill that synchronizes and generates OKF v0.1 markdown bundles in `openwiki/` based on recent changes and `learning-distill` outputs.
- `okf-search`: A customized grep-based search skill specifically optimized for querying OKF YAML frontmatter and concept links in `openwiki/`.

### Modified Capabilities
- `learning-distill`: Modified to feed directly into the `openwiki-sync` loop rather than relying on legacy `docs-compile`.

## Impact

- **Affected Code**: `docs-compile` and `docs-lint` skills will be deprecated/removed.
- **Dependencies**: `openwiki` will be added as a dependency or `devDependencies` to allow extraction of its prompts.
- **Workflow**: The core maintenance loop will now officially output into the `openwiki/` directory following OKF v0.1 instead of the custom `.agents/docs/` structure.

## Superseded Proposals (OBE)

This proposal fundamentally standardizes the knowledge layer on Google OKF v0.1 via OpenWiki logic, replacing custom `.agents/docs/` structures. Therefore, it supersedes and covers the requirements of the following proposals, which should be archived as Overcome By Events (OBE):

- `repo-centric-wiki-tooling`: Proposed custom compile/query scripts for `.agents/docs/`. (Replaced by `openwiki-init`/`sync` and `okf-search`).
- `wiki-system`: Proposed a custom `.agents/wiki/` format with `code_refs`. (Replaced by OKF v0.1 and its native standard).
- `introduce-docs-manifest`: Proposed a `.agents/docs/manifest.yaml` to decouple hardcoded paths. (Replaced by adopting the standard `openwiki/` virtual filesystem natively).
- `living-architecture-intent-capture`: Proposed custom intent capture into `.agents/docs/decisions/`. (Replaced by standard OKF concepts/relationships updated via `openwiki-sync` during task closeout).
- `add-docs-capture-skill`: Proposed a fast-path direct write skill for `.agents/docs/`. (Replaced by the ability to directly invoke `openwiki-sync`).
