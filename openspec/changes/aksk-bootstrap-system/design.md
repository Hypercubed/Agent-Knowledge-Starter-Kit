## Context

`adopt-openspec-openwiki` (applied before this change) rewired AKSK's skills onto OpenSpec and OpenWiki as peer dependencies with fail-fast preconditions and defined the curation-contract attachment for `openwiki/INSTRUCTIONS.md`. This change automates what that change requires doing by hand: installing the tools globally, initializing a repo, scaffolding `.agents/`, attaching the contract, and wiring agents.

Verified constraints that shape the design:

- The OpenWiki skill bundle (`integrations/openwiki/`) requires MCP sequence tools (`openwiki_begin/finish/inspect_claims/resolve_claims`); a skill install without MCP registration is inert.
- Official install lanes exist only for claude (`~/.claude/skills/openwiki` + `~/.claude.json` or `.mcp.json`) and codex (`~/.agents/skills/openwiki` + `~/.codex/config.toml`). Other agents go through generic vehicles.
- `.openwiki-install.json` receipts record version, target, SHA-256 hashes, and the MCP command; openwiki rejects symlinked targets and hash-verifies receipts. The skills CLI symlinks skill dirs - installing both into one destination breaks one of them.
- Known ecosystem path discrepancy: openwiki puts codex user-scope skills at `~/.agents/skills/`; vercel-labs/skills documents `~/.codex/skills/`. We must not maintain our own path matrix.
- `add-mcp` writes agent configs without checking that the binary exists, and silently drops capability-gated fields per agent with warnings.
- Registry installers (Smithery, mcp-get) are remote-oriented and the wrong shape for a locally-run tool; they are excluded.

## Goals / Non-Goals

**Goals:**

- One idempotent bootstrap entry point (skill + deterministic Python script) that takes any repo from bare to fully wired, reusing the prerequisite change's finalized skill set and contract template.
- Clean separation of ownership: global installs once per user; per-repo work is scaffolding and wiring only.
- Agent integration spread that respects official lanes and never lets two managers own the same destination.

**Non-Goals:**

- Defining skill behavior or the curation contract (`adopt-openspec-openwiki` owns both; this change distributes them).
- Migrating the existing `.agents/docs/` knowledge base into `openwiki/`.
- Building the Kody thin-adapter package now (the two-lane design keeps it possible).
- Any new installer or extractor code for per-agent path matrices - upstream tools own those.

## Decisions

### D1: Two-lane execution model (EXECUTE / INSTRUCT)

The bootstrap script detects whether it can execute steps locally (direct run or a local MCP bridge). If yes (EXECUTE), it runs them. If no (INSTRUCT), it prints the exact remaining commands and exits clean. This costs little (the command list exists either way) and makes the skill usable inside sandboxed workers today.

*Alternative considered:* skill-only prose instructions. Rejected: non-deterministic ordering and drift between skill text and reality; the deterministic script is the single source of the step sequence.

### D2: Idempotency by detection, not by log file

Every bootstrap step derives "done?" from observable state: tools on PATH, `openspec/` present, routing block markers present in `AGENTS.md`, contract section present in `INSTRUCTIONS.md`, receipts in skill dirs. No separate bootstrap journal. Re-runs converge to the same end state without replaying history.

*Alternative considered:* a state file recording completed steps. Rejected: it drifts from reality when users change things manually, which is exactly the failure mode docs-lint then has to catch.

### D3: Ownership partition enforced by receipt

Before touching an agent's skill directory, check for `.openwiki-install.json`. Receipt present -> official lane owns that agent; skip and report. This prevents the symlink-vs-receipt collision documented above and means we never guess install formats for officially supported agents.

### D4: Lane ladder for integration spread

Per detected agent, pick exactly one lane: (1) official `openwiki integrations install claude|codex`; (2) `add-mcp` + `npx skills add <repo>/tree/<tag>/integrations/openwiki` for MCP-capable agents; (3) headless ladder - the agent drives `openwiki --init -p` / `--update -p` directly. Ordering matters because `add-mcp` does not verify binary existence: globally install `openwiki` first, register MCP second, and verify the registered command resolves afterwards.

*Alternative considered:* always use add-mcp for uniformity. Rejected: it would fight the official lanes' receipt/hash verification and break uninstall integrity.

### D5: Pin the skill bundle by tag

Spread installs reference `langchain-ai/openwiki/tree/<tag>/integrations/openwiki` rather than the moving default branch, so a repo's bootstrapped state corresponds to a known bundle version. Whether `skills update` tracks tag-pinned sources correctly is open question OQ2; if not, document update = re-run bootstrap with a new tag.

### D6: Reuse, never redefine, the prerequisite change's artifacts

The contract template, skill set, and attach semantics come from `adopt-openspec-openwiki`. Bootstrap copies them; if it ever needs a variation, that is a bug in the reuse boundary, to be fixed in the source change.

## Risks / Trade-offs

- [`add-mcp` writes configs even when the binary is missing] -> Global install precedes registration (D4); post-registration verification step reports unresolved commands.
- [`add-mcp` drops capability-gated fields per agent with warnings] -> Warnings are captured verbatim into the per-agent spread report instead of being swallowed.
- [Codex TOML config may not survive add-mcp re-runs idempotently (OQ3)] -> Until verified, the spread treats an existing codex MCP entry as done and skips rewriting it.
- [Path matrices differ between upstream tools and will keep drifting] -> Never hardcode agent paths; derive targets from detected receipts/configs at runtime (D3), and prefer official lanes where they exist.
- [Tag-pinned skills CLI source may not update cleanly (OQ2)] -> Fallback documented: updating = re-running bootstrap with a bumped tag; idempotent by D2.
- [Bootstrap built against a skill set that later changes] -> D6 keeps one source of truth; skill changes reroute through the prerequisite change first.

## Migration Plan

1. Verify `adopt-openspec-openwiki` is applied and its dogfood validation passed.
2. Run the OQ experiments; record findings as troubleshooting entries.
3. Build the Python bootstrap script (preflight, global lane, per-repo scaffold with contract attachment, spread, INSTRUCT fallback) and the `aksk-bootstrap` skill wrapper.
4. Regenerate `example/`; revise integration guides around the bootstrap-first path.
5. Release timing (with or without the prerequisite change as 2.0) is a maintainer decision deferred outside planning; the major-version-release playbook executes whenever that decision lands.

Rollback: all phases land as reviewable commits; consumer repos that ran an earlier bootstrap are unaffected by rollback since bootstrap changes nothing outside their repo except the two global npm packages.

## Open Questions

- OQ1: Does bare `openwiki mcp` (generic stdio mode) serve the ~17 non-claude/codex agents, or does `--host` accept other values? Determines the exact `add-mcp` invocation string; no spec impact.
- OQ2: Does `npx skills add .../tree/<tag>/integrations/openwiki` pin correctly, and does `skills update` track the pinned tag? Affects D5 documentation, not behavior contracts.
- OQ3: Is `add-mcp` safe to re-run against codex TOML config (idempotent merge)? Until answered, spread skips existing entries (see Risks).
