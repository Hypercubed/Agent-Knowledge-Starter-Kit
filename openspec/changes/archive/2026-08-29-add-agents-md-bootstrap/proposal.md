## Why

When AKSK bootstraps a fresh repo today, `attach_section.mjs` creates a bare `AGENTS.md` containing only AKSK routing/lifecycle markers — consumer repos get no behavioral scaffold, so coding agents start with no operating discipline. [FerroxLabs/agents-md](https://github.com/FerroxLabs/agents-md) is a proven ~200-line drop-in baseline (anti-sycophancy, verification loops, surgical diffs) that would give adopters that day-one behavior while keeping AKSK sections attached below it.

**Dependency:** requires `aksk-bootstrap-system` to be applied first. The global tool lane (per-user `npm i -g`, not repo-local) and the `aksk-bootstrap` skill delegation to `bootstrap.mjs` already exist at this point; this change adds the AGENTS.md baseline seeding on top.

## What Changes

- Extend the already-updated `aksk-bootstrap` skill (now delegating to `bootstrap.mjs` per `aksk-bootstrap-system`, with global installs in user scope via `npm i -g`) with an AGENTS.md initializer: when the target repo has **no** `AGENTS.md`, seed it from a vendored copy of the FerroxLabs/agents-md baseline before the existing OpenWiki/AKSK attachments (baseline → OpenWiki → AKSK).
- When `AGENTS.md` **already exists**, do not touch it silently: exit with a prompt instructing the agent to ask the user whether to (a) replace it with the baseline or (b) combine both using the LLM; each choice maps to an explicit flag on a re-run.
- Vendor the FerroxLabs baseline under `.agents/skills/aksk-bootstrap/references/` wrapped in its own marker block (`AKSK:AGENTS-BASELINE`) with a provenance header (source URL, version/date) plus an opt-in refresh command; no network access at bootstrap time.
- Make the resulting `AGENTS.md` a fully zoned file: each content family is distinguishable by its own markers — upstream baseline (`AKSK:AGENTS-BASELINE`), OpenWiki (`OPENWIKI:START/END`), and AKSK sections (`AKSK:ROUTING`, `AKSK:LIFECYCLE`).
- Update `aksk-bootstrap/SKILL.md` to document the new flow, its flags, and the zone ordering (baseline → OpenWiki → AKSK).
- Extend `docs-lint` wiring checks so all three marker families are integrity-checked (markers intact, source URL present).

## Capabilities

### New Capabilities

- `agents-md-bootstrap`: Behavior of seeding, upgrading, or combining a target repo's root `AGENTS.md` from the vendored FerroxLabs baseline during AKSK bootstrap, including the conflict-resolution contract when a file already exists.

### Modified Capabilities

<!-- None: no existing spec under openspec/specs/ covers bootstrap attachment behavior. -->

## Impact

- **Code**: `.agents/skills/aksk-bootstrap/scripts/` (new initializer script or extension of `attach_section.mjs`), `.agents/skills/aksk-bootstrap/references/` (new vendored baseline), `SKILL.md`.
- **Downstream skills**: `docs-lint` gains a wiring check; `generate-example` output changes because the example repo's `AGENTS.md` will now include the baseline (per the regenerate-example decision).
- **Decisions/troubleshooting**: Touches the invariant recorded in `use-the-routing-pattern-for-agentic-tool-bootstrap-files` ("root router files have no upstream initializer") — requires a new recorded decision superseding or scoping that statement for `AGENTS.md`.
- **No new dependencies**: vendoring keeps bootstrap offline-safe and consistent with the kit's never-installs, fail-fast philosophy.
