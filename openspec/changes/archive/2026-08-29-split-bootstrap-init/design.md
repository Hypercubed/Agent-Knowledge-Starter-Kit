## Context

Current bootstrap is a single deterministic script with EXECUTE/INSTRUCT lanes. Splitting must preserve idempotency, fail-fast-with-remediation contracts, and INSTRUCT fallback while clarifying ownership of each step.

## Decisions

- **Interactive by default**: both lanes prompt before each mutating step (install, init, scaffold, attach, integrations). Prompts show detected state ("already present — skip"), default choice, and allow y/n/skip. `--yes` / `--non-interactive` / env `AKSK_YES=1` bypasses prompts using idempotent defaults (same as today's EXECUTE lane). When no TTY / sandboxed worker, fall back to INSTRUCT lane (print commands, no writes) — identical to current fallback.

- **Two skills, shared references**: `aksk-bootstrap` (global) and `aksk-init` (repo). Keep `references/versions.json` as single source; second skill reads it from sibling skill dir or bundled copy with docs-lint guard against drift.
- **Boundary**: `openwiki integrations install <host>` stays in bootstrap (host-global, receipt-partitioned). `openwiki --init` / `attach_wiki_contract` moves to init (repo-local, requires `openwiki/` tree).
- **Skill installs**: default global in bootstrap (`npx skills add -g -a`). Init offers opt-in repo-local flag (`--local-skills` / `--with-skills`) that runs `npx skills add -a` without `-g` and/or `openwiki integrations install` repo receipt.
- **Init preflight**: `check_peer_tools.mjs` semantics — verify Node >=22 and openspec/openwiki on PATH; if missing, exit 2 with "run aksk-bootstrap first" and partitioned INSTRUCT. Never attempts `npm i -g` from repo lane.
- **INSTRUCT partitioning**: each lane prints only its own remaining commands. Wrapper (if kept) concatenates but labels lanes.
- **Wrapper/compat**: keep `bootstrap.mjs` as delegating shim (global check then repo) for one release, or remove and update docs to `aksk-bootstrap && aksk-init`. Prefer shim to avoid breaking external docs.

## Alternatives Considered

- Single skill with `--global`/`--repo` flags: fewer skill installs but blurs discovery; skill description can't convey both modes precisely.
- Three skills (env + init + bootstrap wrapper): ergonomic but third entry is pure delegation; adds manifest churn. Deferred — can be added non-breakingly later if one-command UX proves needed.

## Risks

- Drift between two copies of `versions.json` — mitigate via symlink or lint rule.
- Existing automation calling `node .../bootstrap.mjs` — shim preserves path.
- Host integrations needing repo cwd — document that bootstrap's integration step may be re-run from repo context or after init.

## Components

- `aksk-bootstrap/scripts/bootstrap-global.mjs` (extracted global lane)
- `aksk-init/scripts/bootstrap-repo.mjs` (extracted repo lane) + skill scaffolding
- `aksk-init/references/` (versions.json shared)
- Updates to `aksk-bootstrap/SKILL.md` and new `aksk-init/SKILL.md`
