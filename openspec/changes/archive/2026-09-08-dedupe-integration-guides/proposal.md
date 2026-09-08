## Why

The 14 product pages under `docs/integrations/` repeat the same install sentence ("Install starter skills in the target repo with `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit`, then run each installed skill's initialization from its `SKILL.md`") — 11 byte-identical copies plus one Codex variant — and the index's "Preferred path" paragraph inlines a long instruction string that duplicates the bootstrap SKILL's lane ladder. Every change to install or wiring commands must land in 13+ places; the last two commits (`74f83ee`, `6dd7755`) were exactly this. This violates the kit's own accepted decision `shared-integration-patterns-belong-in-docs-integrations-patterns-md` (2026-04-19), which requires shared concepts to live once in `patterns.md` with product pages linking back.

## What Changes

- `docs/integrations/patterns.md` becomes the single home for the shared adopt-the-kit block (its existing `## Adopting the kit` section). The canonical sentence moves there if it is not already exact.
- Every product page's Setup step 1 becomes a one-line link to `./patterns.md#adopting-the-kit` instead of inlining the sentence. `codex.md` keeps a short tool-specific install note (universal + `-g -a <self-reported>` is genuinely Codex-specific native discovery) as a second line after the link.
- `docs/integrations/README.md`'s "Preferred path" paragraph is reduced to a pointer at `INSTALL.md`'s "Agent-assisted via aksk-bootstrap (preferred)" lane ladder (where the full EXECUTE/INSTRUCT, peer-tool, and receipt-partitioned guidance already lives), keeping the "guides are the manual fallback" framing.
- Kept intentionally per-page (they are the page's job): Discovery/Config tables (tool-specific filenames), unique caveats, verification dates, and the small `## References` trailer (the accepted decision lists references as a product-page responsibility).
- `openspec.md` keeps its distinct guide shape — it is separately required by the `openspec-integration` spec. `agentic-sandbox.md` already paraphrases instead of duplicating; it is aligned to the same link for consistency.
- Docs-lint's duplication content check is extended to flag any product page that inlines the canonical adopt-the-kit sentence; the `writing-integration-guides` playbook is updated to name `patterns.md#adopting-the-kit` as the canonical block.
- Docs-only change, no behavior change: `.openspec.yaml` declares `skip_specs: true`.

## Capabilities

### New Capabilities

(none — docs-only; `skip_specs: true` set in `.openspec.yaml`)

### Modified Capabilities

(none)

## Impact

- `docs/integrations/patterns.md` — canonical `## Adopting the kit` block (edit to make exact, if needed).
- 14 product pages (`agentic-sandbox`, `antigravity`, `claude-code`, `codex`, `copilot`, `cursor`, `gemini-cli`, `hermes`, `kilo-code`, `openclaw`, `opencode`, `openspec`, `warp`, `zo-computer`) — Setup step 1 replaced with the patterns.md link; per-tool content untouched.
- `docs/integrations/README.md` — "Preferred path" paragraph trimmed to a pointer; index lists unchanged.
- `.agents/skills/docs-lint/SKILL.md` — duplication content check extended to `docs/integrations/`.
- `.agents/playbooks/writing-integration-guides.md` — step 5 and pitfall reference the canonical block name.
- Root `README.md` — no changes (it already links `patterns.md` and `INSTALL.md` without inlining).
- Verification: grep-based counts (the inline sentence appears once in `patterns.md`, not in product pages), `scripts/check-publish.sh`, a `docs-lint` pass, `task-closeout`/`learning-distill`.