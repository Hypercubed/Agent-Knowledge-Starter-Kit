## 0. Prerequisites

- [x] 0.1 Verify `aksk-bootstrap-system` is applied (global lane in user scope via `npm i -g`, `SKILL.md` delegates to `bootstrap.mjs`, bootstrap ordering verified) before starting.

## 1. Vendored baseline

- [x] 1.1 Fetch `https://raw.githubusercontent.com/FerroxLabs/agents-md/main/AGENTS.md` and vendor it as `.agents/skills/aksk-bootstrap/references/agents-md-baseline-template.md`
- [x] 1.2 Wrap the body in `<!-- AKSK:AGENTS-BASELINE:BEGIN/END -->` markers and add the provenance header inside the block: upstream source URL, capture date, MIT license notice, and refresh command pointer

## 2. Seed initializer (`init_agents_md.mjs`)

- [x] 2.1 Create `.agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs`: attach the marked baseline section (markers read from template) to root `AGENTS.md` when absent; exit 0
- [x] 2.2 Implement idempotency: if the marked baseline section matches the template (trailing-whitespace-normalized compare), report no-op success without rewriting
- [x] 2.3 Implement conflict path: existing non-matching `AGENTS.md` exits 2 with no writes, printing the replace-vs-combine question and the `--replace` / `--combine` flags
- [x] 2.4 Implement `--replace`: overwrite root `AGENTS.md` with the marked baseline section including header
- [x] 2.5 Implement `--combine`: stage current content, baseline, and a generated `COMBINE.md` merge brief under `.agents/sessions/agents-md-combine/<timestamp>/`; print agent instructions; never modify the original

## 3. Baseline refresh (`refresh_agents_baseline.mjs`)

- [x] 3.1 Create `.agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs`: fetch upstream to temp, validate response (non-empty, expected section anchors present), swap only the content between `AKSK:AGENTS-BASELINE` markers, update provenance header date; other zones byte-identical
- [x] 3.2 Verify offline/failure behavior: exits non-zero with remediation and leaves the previously vendored baseline byte-identical

## 4. Skill and knowledge wiring

- [x] 4.1 Update `.agents/skills/aksk-bootstrap/SKILL.md` (already extended by `aksk-bootstrap-system` to delegate to `bootstrap.mjs` with user-scope global installs): add seeding flow, flags, zone ordering (baseline → OpenWiki → AKSK), combine brief location, refresh command, and full bootstrap ordering (`npm i -g` global lane → `init_agents_md` → OpenWiki → `attach_section`)
- [x] 4.2 Extend `.agents/skills/docs-lint/SKILL.md`: integrity-check all three marker families in `AGENTS.md` — `AKSK:AGENTS-BASELINE` (with provenance header), `OPENWIKI`, `AKSK:ROUTING`/`AKSK:LIFECYCLE`; flag missing or damaged blocks
- [x] 4.3 Amend `openwiki/decisions/use-the-routing-pattern-for-agentic-tool-bootstrap-files.md` with the scoped exception note (behavioral contract vs repo knowledge) per design D5

## 5. Downstream regeneration

- [x] 5.1 Regenerate `example/` so its root `AGENTS.md` reflects the new seed-then-attach flow (per regenerate-example decision)

## 6. Verification

- [x] 6.1 In a temp dir with no `AGENTS.md`: run init → file created with marked baseline section and header; run again → no-op; run OpenWiki attach then attach_section after → all three zones present, distinct, in order (baseline → OpenWiki → AKSK)
- [x] 6.2 In a temp dir with a pre-existing custom `AGENTS.md`: run init → exit 2, file untouched; run with `--replace` → replaced with marked baseline; restore original, run with `--combine` → staged bundle exists, original untouched
- [x] 6.3 Zone isolation: modify content outside the baseline markers, re-run init → only baseline zone considered; damage one zone's markers → docs-lint reports that family
- [x] 6.4 Run `bash scripts/check-agents-structure.sh .agents` and the docs-lint skill pass; confirm no regressions in ROUTING/LIFECYCLE wiring checks
- [x] 6.5 Confirm spec scenarios in `specs/agents-md-bootstrap/spec.md` each map to an executed check above

## 7. Closeout

- [ ] 7.1 Run task-closeout: bundle session evidence under `.agents/sessions/`
- [ ] 7.2 If implementation surfaced durable lessons (e.g., vendoring pattern), run learning-distill to promote them
