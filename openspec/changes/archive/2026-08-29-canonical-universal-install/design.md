## Context

After `reorder-install-lanes-drop-example` the kit's lanes are `agent-assisted` vs `manual npx` but still repo-local `./.agents/skills` by default with wide per-agent spreading (`--all` reaches 56 mirrors in verify-install). `~/.agents/skills` already exists as the shared store (Codex reads it natively; `~/.codex/skills/openwiki` does not exist while `~/.agents/skills/openwiki` does; `openwiki integrations list` without `--project` is global/user, `--project` is repo). `openwiki integrations install <host>` without `--project` already writes user scope, and `npx skills add -g` was verified to write only `~/.agents/skills` (while bare `-g` fans out). The desired END state is one user scope plus the self-reported host: `~/.agents/skills` + `~/.<self>/skills` for every skill (AKSK and openwiki), `npx` required, no clone fallback. `langchain-ai/openwiki` via `npx skills add -g` yields three skills (`openwiki`, `mermaid-diagrams`, `write-connector`); the lifecycle `openwiki` skill and MCP must both be made available. See proposal for why now.

## Goals / Non-Goals

**Goals:**
- Make `~/.agents/skills` universal the canonical store for AKSK and `langchain-ai/openwiki`; second target is the self-reported current host, not wide `--all`.
- Teach two paths: prompt-agent and human-direct `npx`, both defaulting to `npx skills add -g -a <self-reported>`; extra `-a <other>` or `--all` only on explicit user ask.
- Collapse openwiki to `openwiki integrations install <self-reported>` when that host is supported, otherwise `npx skills add -g` + `npx add-mcp` chooser.

**Non-Goals:**
- Changing `npm i -g @fission-ai/openspec` / `openwiki` CLIs (still user-global, caret) or the append-only contract/routing merge semantics.
- Adding a devcontainer or a third lane beyond the two (`--project` repo-local is documented override, not default).

## Decisions

**Decision: `-g -a <self-reported>` as the atomic install shape.**
- *Why:* One command gives both targets Codex (and any host that reads `~/.agents/skills`) sees: universal plus the caller's own host dir. Verified: `-g` alone → only `~/.agents/skills`; `-g -a codex` → only Codex; `-g` alone → `~/.agents` + `~/.claude` + `~/.kilocode` ... wide. Self-report wins over env sniffing (`CODEX_HOME` vs `CLAUDE_CONFIG_DIR` is brittle).
- *Alternative:* keep repo-local default and use `-g` as override — rejected per install-time choice requirement.

**Decision: drop the clone fallback (`git clone --depth 1 && cp -r`) and make `npx` required.**
- *Why:* `node:24` already includes `npx`; the fallback was a manual copy to `./.agents/skills` (repo-local) which conflicts with the new `~/.agents/skills` canonical. Bootstrap's INSTRUCT lane already prints `npm i -g` as remaining steps, so the truly blocked case is `Node missing` not `npx missing`. Simpler docs and one fewer scenario in verify-install.
- *Alternative:* keep clone targeting `~/.agents/skills` — rejected as second primitive that duplicates `npx`.

**Decision: openwiki two-track with `integrations add` preferred, `npx` + `add-mcp` as backup.**
- *Why:* `openwiki integrations install <host>` is atomic (skill+MCP+receipt `.openwiki-install.json`, ownership via `integrations list`), proven via bootstrap. `npx skills add -g -a <self-reported> langchain-ai/openwiki --full-depth` + `npx --yes add-mcp -g -a <self-reported> "openwiki"` is the decoupled equivalent that covers hosts outside `codex|claude|opencode` and the 18-host `add-mcp` registry. The choice is made by whether the self-reported host is available in the integrations registry.
- *Alternative:* bypass `integrations add` entirely and always use `npx` + `add-mcp` — rejected because receipt partition is useful when available.

****Decision: skill installs read `references/versions.json` via `versionsFromPackageJson()` (same path the global `npm i -g` lane uses).**
- *Why:* One version source for both the npm global lane and the `npx skills add -g` skill lane. Fresh containers proved `npx skills add /kit -l → Found 4` via the plugin-sourced list; pinning via that file keeps `~/.agents/skills` and `./.agents/skills` in sync with the repo's `package.json` caret without hardcoding `@latest`.
- *Alternative:* leave `npx skills add` without a version qualifier (implicit `latest`) — rejected per install-version-list requirement.

Decision: universal is not a separate alias for codex, but they coincide.**
- *Why:* Codex already reads `~/.agents/skills` natively, its own `~/.codex/skills/openwiki` does not exist on this host, yet `integrations list` without `--project` shows `codex installed` globally (the universal store is the Codex default). Treating `universal` as Codex is documentation shorthand, not a new alias to code in the registry.

**Decision: no consent artifact.**
- *Why:* per explore, the user choice (`-a <other>` or `--all`) happens at install time; no `docs-lint` or `task-closeout` record needed beyond the `npx` command they typed (or the agent self-report's host id).

## Risks / Trade-offs

- **[Risk] Consumers expecting repo-local `./.agents/skills`** → Mitigation: **BREAKING** noted; docs label repo-local as override A (`npx skills add` without `-g`) and agent-other-loc as override B (with consent).
- **[Risk] Fresh machine `npm i -g` transient ECONNRESET** → Mitigation: verify-install retains single retry; bootstrap does not add its own retry (INSTRUCT fallback is to re-run `npm i -g`).
- **[Risk] Host self-report could be spoofed or stale** → Mitigation: per explore, agent's fault; `verify-install` proves host-specific receipt and `check-agents-structure.sh` with explicit `~/.agents` vs `~/.<host>` target keeps it auditable.
- **[Trade-off] One fewer air-gapped lane** — clone fallback gone, but `npx` required simplifies to one install primitive and matches `node:24` reality.

## Migration Plan

1. Update `README.md` prompt and `INSTALL.md` Skill-first prerequisites to `-g -a <self-reported>` (examples: universal,codex etc) and target `~/.agents/skills`.
2. Reword `aksk-bootstrap` lanes to the two verbs (verify CLIs via `check_peer_tools.mjs` then verify skills via `-g -a <self-reported>`) and collapse integration spread to registry-vs-add-mcp ladder.
3. Retire the clone lane from `verify-install` (drop `no-npx` scenario and `cp -r` fallback target in specs).
4. Retarget `verify-install` scoping assertions to `~/.agents/skills` (+ host mirror) and keep the `--all` wide proof as the negative case.
5. Rollback: `git revert` to previous `~/.agents` was only an idea — `~/.agents/skills` vs `./.agents/skills` is repo-vs-home, easily reverted commit-wise; no data loss.

## Open Questions

- None blocking. The choice `npx` vs `openwiki integrations add` for openwiki when the host is available is resolved as policy (prefer integrations when available, `add-mcp` otherwise) not as runtime auto-selection beyond `integrations list` availability.
