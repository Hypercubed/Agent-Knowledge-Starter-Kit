## Why

`aksk-bootstrap` and `aksk-init` ship byte-identical copies of three scripts (`attach_section.mjs`, `attach_wiki_contract.mjs`, `init_agents_md.mjs`) and four reference templates (`agents-md-baseline-template.md`, `lifecycle-template.md`, `routing-note-template.md`, `wiki-contract-template.md`) — roughly 690 duplicated lines. Every fix to routing-block or wiki-contract wiring must be applied twice, and drift between the copies is silent until a consumer trips over it. The kit already codified the single-source principle for tool versions (`aksk-init` MUST NOT duplicate `versions.json`); the shared scripts and templates are the remaining un-mitigated case — the split-bootstrap design even flagged copy drift as a known risk.

## What Changes

- `aksk-bootstrap` becomes the canonical owner of the shared wiring scripts and reference templates. Its copies are unchanged; only edits there are valid going forward.
- The duplicated scripts under `aksk-init/scripts/` become thin resolver scripts (same file names, ~15 lines each) that locate the canonical sibling in `aksk-bootstrap/scripts/`, exec it with the same arguments, and propagate stdout/stderr/exit codes unchanged. If the sibling is missing they exit 2 with remediation naming both skills (fail-fast, per kit convention).
- The four template files under `aksk-init/references/` are deleted; the canonical templates live only under `aksk-bootstrap/references/`.
- Because the resolver file names are unchanged, every existing reference to `aksk-init/scripts/attach_*.mjs` / `init_agents_md.mjs` (SKILL.md commands, wiki pages, workflows) keeps working verbatim. References to `aksk-init/references/*` template paths are retargeted to `aksk-bootstrap/references/*` (identical content).
- Knowledge-layer docs (`openwiki/skills/aksk-init.md`, `agents-md-zoning`, `packaging-and-install`, etc.) update the "mirrored / shipped duplicate / backwards compat" notes to state the new single-source contract.
- `verify-install` gains a regression assertion: no `aksk-init/references/` directory and resolvers present, so re-duplication fails the install harness.
- New spec requirements on both capabilities pin the ownership and delegation contract.
- Not breaking: script CLI, output, and exit codes are unchanged; `versions.json` is untouched; `docs/integrations/*` and `INSTALL.md` already point at `aksk-bootstrap` paths and need no edits.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `aksk-init`: single-source contract for the shared wiring scripts and reference templates — repo lane must delegate to the canonical `aksk-bootstrap` copies instead of shipping duplicates, and must fail fast when the canonical sibling is missing.
- `aksk-bootstrap`: canonical ownership of the shared repo-wiring scripts and templates consumed by `aksk-init`, `docs-lint`, and `learning-distill`.

## Impact

- `.agents/skills/aksk-init/scripts/{attach_section,attach_wiki_contract,init_agents_md}.mjs` — replaced with thin resolvers (content removed, names kept).
- `.agents/skills/aksk-init/references/{agents-md-baseline-template,lifecycle-template,routing-note-template,wiki-contract-template}.md` — deleted.
- `.agents/skills/aksk-init/SKILL.md` — delegation note; commands unchanged.
- `.agents/skills/aksk-bootstrap/{scripts,references}/` — unchanged (canonical).
- `openwiki/` knowledge pages with `repo://` claims or commands pointing at `aksk-init/references/*` (retarget) and prose describing the mirror (rewrite): `concepts/agents-md-zoning.md`, `concepts/knowledge-curation-contract.md`, `distribution/packaging-and-install.md`, `distribution/distribution-and-tool-wiring.md`, `skills/aksk-init.md`, `workflows/bootstrap-and-attachment.md`, `inventory/repository-inventory.md`, `quickstart.md`, `architecture/overview.md`.
- `.agents/skills/verify-install/{SKILL.md,scripts/run.sh}` — regression assertion + prose update.
- New decision page under `openwiki/decisions/` recording the single-source ownership contract.
- Specs: `openspec/specs/aksk-init/spec.md`, `openspec/specs/aksk-bootstrap/spec.md` (ADDED requirements).
- Verification: `scripts/check-agents-structure.sh`, `scripts/check-publish.sh`, `verify-install` fresh scenario, idempotent double-run checks, `docs-lint` pass.