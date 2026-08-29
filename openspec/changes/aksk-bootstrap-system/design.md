## Context

`adopt-openspec-openwiki` (applied before this change) rewired AKSK's skills onto OpenSpec and OpenWiki as peer dependencies with fail-fast preconditions and defined the curation-contract attachment for `openwiki/INSTRUCTIONS.md`. This change automates what that change requires doing by hand: installing the tools globally, initializing a repo, scaffolding `.agents/`, attaching the contract, and wiring agents.

Verified constraints that shape the design (openwiki v0.4.3, Node >=22):

- The OpenWiki skill bundle (`integrations/openwiki/`) requires MCP sequence tools (`openwiki_begin` / `openwiki_submit_plan` / `openwiki_next_page` / `openwiki_submit_page` / `openwiki_finish`); a skill install without MCP registration is inert. The MCP is delivered as `openwiki mcp --host <codex|claude|opencode>` via the installed config.
- Official install lanes are `openwiki integrations install <codex|claude|opencode>` (v0.4.3 registry: `HOST_TARGETS` with user/project scopes). Each install **atomically** copies the skill bundle to the host's skill directory and edits the host's MCP config: codex (`~/.agents/skills/openwiki` + `~/.codex/config.toml` TOML), claude (`~/.claude/skills/openwiki` + `~/.claude.json` or `.mcp.json`), opencode (`~/.config/opencode/skills/openwiki` + `~/.config/opencode/opencode.jsonc`). `openwiki integrations list` reports `installed|modified|not-installed`; `uninstall` is transactional with config rollback.
- `.openwiki-install.json` receipts record `package`, `version` (openwiki version), `target`, SHA-256 file hashes, and the exact `mcpServerCommand` (`openwiki` + `mcp --host <target>`); openwiki rejects symlinked skill dirs or parent components, rejects non-directory parents, hash-verifies receipts, and detects `modified` installs that require `--force` to overwrite. Installing two managers into one destination is prevented by this check.
- Known ecosystem path discrepancy: openwiki puts codex user-scope skills at `~/.agents/skills/`; vercel-labs/skills documents `~/.codex/skills/`. We must not maintain our own path matrix; derive paths from the registry and let `openwiki integrations install` own them.
- `openwiki integrations install` is transactional with staging, backup, and config-snapshot rollback; there is no separate `npx skills add` or `add-mcp` step. The installer copies from the installed npm package's `integrations/openwiki` directory, not a tag-pinned GitHub tree.
- Registry installers (Smithery, mcp-get) and `npx skills add` / `add-mcp` are remote-oriented or superseded and the wrong shape for a locally-run tool; they are excluded.

## Goals / Non-Goals

**Goals:**

- One idempotent bootstrap entry point (skill + deterministic JS script) that takes any repo from bare to fully wired, reusing the prerequisite change's finalized skill set and contract template.
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

### D3: Ownership partition enforced by receipt (installer-owned)

Before touching an agent's skill directory, inspect via `openwiki integrations list` / `inspectInstallation`. Receipt `.openwiki-install.json` present with matching `target` and intact hashes -> that host's official lane owns the destination; skip and report (or require `--force` to overwrite `modified`). The installer enforces symlink rejection, non-directory-parent checks, and `installed` vs `modified` vs `not-installed` status, so bootstrap never guesses install formats for supported hosts.

### D4: Lane ladder for integration spread (v0.4.3 registry)

Per detected agent, pick exactly one lane: (1) `openwiki integrations install <codex|claude|opencode>` for the three supported hosts (installer atomically installs skill + MCP config `openwiki mcp --host <target>` and writes the receipt; `list` verifies `installed`); (2) headless ladder for all other agents — the agent drives `openwiki --init -p` / `--update -p` directly. There is no intermediate `add-mcp` + `npx skills add` lane. Ordering still matters: globally install `openwiki@latest` first so the `openwiki` command registered in host configs resolves, then run `integrations install`, then verify via `openwiki integrations list`.

*Alternative considered:* always use a generic `add-mcp` + `npx skills add` for uniformity. Rejected: it would fight the installer's receipt/hash verification, transactional rollback, and symlink checks, and is superseded by the v0.4.3 `integrations` registry.

### D5: Bundle source is the installed npm package (no tag pin)

Spread installs copy the canonical skill from the locally installed `openwiki` package (`<npm-root>/openwiki/integrations/openwiki`), not a tag-pinned `langchain-ai/openwiki/tree/<tag>/integrations/openwiki` URL. The installed receipt records the `openwiki` version and file hashes, so a repo's bootstrapped state corresponds to a known bundle version via `npm ls openwiki`. Updating = `npm i -g openwiki@latest` then re-run `openwiki integrations install <target>` (or re-run bootstrap); idempotent when version/hashes/command already match. No `npx skills add` tag pin or `skills update` tracking.

### D6: Reuse, never redefine, the prerequisite change's artifacts

The contract template, skill set, and attach semantics come from `adopt-openspec-openwiki`. Bootstrap copies them; if it ever needs a variation, that is a bug in the reuse boundary, to be fixed in the source change.

## Risks / Trade-offs

- [Installer rejects symlinked or non-directory skill parents] -> Derived from registry at runtime (D3); user must fix filesystem before re-running.
- [`modified` skill/config (hash drift or hand-edits) refuses without `--force`] -> Reported as `modified` via `openwiki integrations list`; bootstrap reports and skips unless `--force` is explicit, preserving uninstall integrity and backup creation.
- [Codex TOML / Claude JSON / Opencode JSONC edits may conflict with concurrent hand-edits] -> Installer snapshots config and rolls back on commit failure; partial installs are cleaned up via staging directory removal.
- [Path matrices differ between upstream tools and will keep drifting] -> Never hardcode agent paths; derive targets from the registry and `openwiki integrations list` at runtime (D3), and prefer `integrations install` where supported.
- [Updating requires npm package bump] -> Documented: `npm i -g openwiki@latest` then re-run `openwiki integrations install <target>` (idempotent when already `installed`); D2 keeps re-runs no-op.
- [Bootstrap built against a skill set that later changes] -> D6 keeps one source of truth; skill changes reroute through the prerequisite change first.

## Migration Plan

1. Verify `adopt-openspec-openwiki` is applied and its dogfood validation passed.
2. Run the OQ experiments; record findings as troubleshooting entries.
3. Build the JS bootstrap script (`*.mjs`, Node >=22; preflight, global lane, per-repo scaffold with contract attachment, spread, INSTRUCT fallback) and the `aksk-bootstrap` skill wrapper.
4. Regenerate `example/`; revise integration guides around the bootstrap-first path.
5. Release timing (with or without the prerequisite change as 2.0) is a maintainer decision deferred outside planning; the major-version-release playbook executes whenever that decision lands.

Rollback: all phases land as reviewable commits; consumer repos that ran an earlier bootstrap are unaffected by rollback since bootstrap changes nothing outside their repo except the two global npm packages.

## Open Questions

- OQ1 (resolved in v0.4.3): `openwiki mcp --host <codex|claude|opencode>` serves the three supported hosts via `openwiki integrations install`. No generic bare `openwiki mcp` stdio lane for other agents; they use the headless `openwiki --init -p` / `--update -p` ladder. No spec impact beyond D4.
- OQ2 (obsolete in v0.4.3): Tag-pinned `npx skills add .../tree/<tag>/integrations/openwiki` removed. Bundle now comes from the installed npm package; `skills update` tracking is irrelevant. Updating = `npm i -g openwiki@latest` + re-run `integrations install`.
- OQ3 (resolved in v0.4.3): `openwiki integrations install` handles codex TOML idempotently via `installCodexMcpBlock` with `replaceableEntry` detection and config-snapshot rollback; re-run when `installed` returns `unchanged`.
