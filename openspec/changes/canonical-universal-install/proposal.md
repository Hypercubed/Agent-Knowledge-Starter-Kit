## Why

Today `npx skills add` defaults to a repo-local `./.agents/skills` plus per-agent mirrors, and `openwiki integrations install` defaults are split between user and repo. Exploration proved the package manager's source of truth is `~/.agents/skills` for Codex (it reads it natively; `~/.codex/skills/openwiki` does not exist while `~/.agents/skills/openwiki` does, and `integrations list` without `--project` shows `codex installed` globally). Consumers asked for a single canonical store: user scope, universal agent (`~/.agents/skills`) plus the current self-reported agent as the second target, with `npx` required and no clone fallback. Without it, installs spray to `--all` (56 mirrors proved in verify-install) and docs teach four lanes that duplicate the same `aksk-bootstrap/scripts`.

## What Changes

- **BREAKING**: Canonical install store becomes `~/.agents/skills` (user scope, universal agent `codex` — the Codex default) installed via `npx skills add -g -a <self-reported>` where `<self-reported>` is the calling agent's own host id, using the versions in the install version list (`references/versions.json` / `versions.json`). Extra agents only if the user explicitly asked via `-a <other>` or `--all`; never wide by default. This applies to both the AKSK kit (`Hypercubed/Agent-Knowledge-Starter-Kit`) and the `langchain-ai/openwiki` lifecycle skill.
- **BREAKING**: Drop the clone fallback (`git clone --depth 1 && cp -r .agents/skills`) — `npx skills` becomes required. Manual fallback is now the human typing the same `npx skills add -g,<agent>` and then invoking `aksk-bootstrap`.
- Update bootstrap to two verbs: **(1)** verify CLIs (`openspec`/`openwiki` on PATH, `npm i -g` if missing, user scope, caret) then **(2)** verify skills (`~/.agents/skills/<name>/SKILL.md` presence; `npx skills add -g -a <self-reported>` if missing, `openwiki integrations install <self-reported>` when that host is in the 3-host registry, otherwise the same `npx` plus `openwiki mcp --host <that>` or the generic `npx add-mcp` chooser as backup). Universal+current is enforced by the bootstrap, not by the bare CLI default.
- Update fallback instructions to target `~/.agents/skills` and to choose `openwiki integrations install <self-reported>` when that host supports it, otherwise `npx skills add -g` (with `--full-depth` for openwiki) plus `npx add-mcp -g` for MCP; the choice is made by the bootstrapping agent based on whether the desired host is available.
- Document that `npx` and `openwiki integrations add` remain two ways to reach the same MCP-backed skill (`npx skills add -g langchain-ai/openwiki` + `openwiki mcp` vs atomic `openwiki integrations install <self>`); prefer `npx` + `add-mcp` as the unified default but allow `integrations add` when the host is available and document the `add-mcp` (neon-solutions/add-mcp) backup.

## Capabilities

### New Capabilities
- `canonical-user-skills-scope`: Canonical user store `~/.agents/skills` (universal + self-reported agent), `npx` required, `npx skills add -g -a <self-reported>` as the default for AKSK and for openwiki (`langchain-ai/openwiki`), openwiki as `openwiki integrations install <self-reported>` when that host is supported otherwise `npx` + `npx add-mcp` fallback for MCP, and removal of the clone fallback.

### Modified Capabilities
- `aksk-bootstrap`: Tighten to two verbs (verify CLIs, verify skills), make universal+current (`-g -a <self-reported>`) the default install shape, scope openwiki choice to `openwiki integrations add` when available otherwise `add-mcp`, and remove the clone fallback path.
- `agent-integration-spread`: Collapse the spread to universal+current by default (Codex is universal), `npx`/`openwiki`/`add-mcp` ladder per host, consent-gated extra agents, and removal of wide `--all`/clone spread.

## Impact

- Docs: `README.md` Quick start agent prompt and `For agents`, `INSTALL.md` Skill-first install + New/Existing Install checklists and Prerequisites, `docs/integrations/codex.md` setup, `.agents/skills/aksk-bootstrap/SKILL.md` lanes and INSTRUCT text.
- Repo: `reorder-install-lanes-drop-example`'s docs (already flipped to `~/.agents` in idea) now superseded by this change's file set; no new runtime dependency beyond `add-mcp` as optional backup.
- Verification: `verify-install` (internal) asserts `~/.agents/skills` not just `./.agents/skills`, adds `universal+current` scoping case, and covers `add-mcp` vs `integrations` host choice.
- No change to `openspec/` contract handling or `openwiki/INSTRUCTIONS.md` append-only merge semantics beyond the install-scope wording.
