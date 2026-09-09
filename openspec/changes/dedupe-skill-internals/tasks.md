## 1. Resolver scripts

- [ ] 1.1 Replace `.agents/skills/aksk-init/scripts/attach_section.mjs` with a thin resolver that resolves `../../aksk-bootstrap/scripts/attach_section.mjs` and spawns it with `stdio: inherit`, propagating the exit code; verify against a temp repo: `node .agents/skills/aksk-init/scripts/attach_section.mjs <tmp> AGENTS.md routing-note-template.md` attaches the `AKSK:ROUTING` block and prints the same output as the canonical script, and a second run is a no-op.
- [ ] 1.2 Replace `.agents/skills/aksk-init/scripts/attach_wiki_contract.mjs` with the same resolver pattern; verify on a temp repo with an existing `openwiki/INSTRUCTIONS.md`: first run attaches the `AKSK:WIKI-CONTRACT` block, second run prints "already up to date" no-op, and output matches the canonical script.
- [ ] 1.3 Replace `.agents/skills/aksk-init/scripts/init_agents_md.mjs` with the same resolver pattern; verify the full contract through the resolver: missing `AGENTS.md` seeds the baseline (exit 0), matching baseline is a no-op (exit 0), non-matching file without flags exits 2 with the replace/combine prompt, `--replace` and `--combine` behave as documented.
- [ ] 1.4 Verify exit-code and output propagation through a resolver: run a failure path (e.g., `attach_section.mjs <tmp> AGENTS.md unknown-template.md`) and confirm exit code 2 and the canonical error text appear unchanged.
- [ ] 1.5 Verify missing-sibling fail-fast: invoke a resolver with `aksk-bootstrap` temporarily unavailable (e.g., renamed away in a scratch checkout) and confirm it exits 2, writes nothing, and prints remediation naming both skills.

## 2. Template removal and reference retargeting

- [ ] 2.1 Delete `.agents/skills/aksk-init/references/{agents-md-baseline-template,lifecycle-template,routing-note-template,wiki-contract-template}.md`; verify `git status --short` shows exactly these four deletions and that the canonical templates under `.agents/skills/aksk-bootstrap/references/` are untouched.
- [ ] 2.2 Update `.agents/skills/aksk-init/SKILL.md`: add a one-line delegation note to the Wiki Contract, Managed-section attachment, and AGENTS.md baseline sections ("these commands delegate to the canonical scripts under `aksk-bootstrap/scripts/`") and a prerequisites line that `aksk-bootstrap` must be installed for the repo lane; keep the existing command paths; verify every command still listed in the SKILL.md executes.
- [ ] 2.3 Retarget `repo://` evidence claims and template-path prose in the openwiki pages that reference `aksk-init/references/*` (`concepts/agents-md-zoning.md`, `concepts/knowledge-curation-contract.md`, `distribution/packaging-and-install.md`, `distribution/distribution-and-tool-wiring.md`, `skills/aksk-init.md`, `workflows/bootstrap-and-attachment.md`, `inventory/repository-inventory.md`, `quickstart.md`, `architecture/overview.md`) to the identical files under `aksk-bootstrap/references/`, and rewrite the "mirrored / shipped duplicate / backwards compat" prose to state the single-source contract; verify `grep -rn "aksk-init/references" .` returns no hits and each retargeted `repo://` resource resolves to an existing file.
- [ ] 2.4 Check remaining references to `aksk-init/scripts/{attach_section,attach_wiki_contract,init_agents_md}.mjs` across `.agents/` and `openwiki/`; verify they all still resolve (resolver file names unchanged) and no page still describes them as independent implementations.

## 3. Regression guard

- [ ] 3.1 Add assertions to the `fresh` scenario in `.agents/skills/verify-install/scripts/run.sh`: resolver files exist under `.agents/skills/aksk-init/scripts/` and `.agents/skills/aksk-init/references/` does not exist; verify `bash .agents/skills/verify-install/scripts/run.sh fresh` passes (the scenario already exercises the resolvers through `bootstrap-repo.mjs`).
- [ ] 3.2 Update `.agents/skills/verify-install/SKILL.md` prose ("each carries its `scripts/*.mjs` + `references/`") to state the single-source contract (scripts canonical in `aksk-bootstrap`, resolvers in `aksk-init`, no mirrored references); verify the SKILL.md table of proven invariants reflects the dedupe.

## 4. Knowledge-layer updates

- [ ] 4.1 Add a decision page under `openwiki/decisions/` (e.g., `shared-skill-scripts-single-source.md`) recording: `aksk-bootstrap` is the canonical owner of the shared wiring scripts and templates, `aksk-init` ships thin resolvers that delegate with identical behavior, resolvers fail fast with remediation when the sibling is missing; use OKF frontmatter with `aksk_status: accepted` per the learning-distill authoring guidance; verify the frontmatter validates against `learning-distill/references/*.schema.json`.
- [ ] 4.2 Run `node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs`; verify `openwiki/decisions/index.md` covers the new page and no index drift remains.

## 5. Verification and closeout

- [ ] 5.1 Verify `bash scripts/check-agents-structure.sh .agents` passes and `git diff HEAD -- .agents/skills/aksk-bootstrap/` is empty (canonical copies untouched).
- [ ] 5.2 Verify `bash scripts/check-publish.sh` passes (remark formatting, markdown links, leakage scans, doubled-path hygiene).
- [ ] 5.3 Verify the full install harness: `bash .agents/skills/verify-install/scripts/run.sh` (all scenarios) passes.
- [ ] 5.4 Run a `docs-lint` pass; verify routing blocks in root instruction files are intact, the wiki contract markers are present, and no stale or contradictory knowledge was introduced.
- [ ] 5.5 Verify the OpenSpec change validates: `openspec validate --change dedupe-skill-internals` (or `openspec status --change dedupe-skill-internals` as the final check) reports all artifacts done and no spec validation errors.
- [ ] 5.6 Run `task-closeout` to bundle the session, then `learning-distill` to promote the single-source decision page; record the associated OpenSpec change (`dedupe-skill-internals`) in the bundle's `summary.json` under `openspec_change`, with spec updates deferred to archive time.