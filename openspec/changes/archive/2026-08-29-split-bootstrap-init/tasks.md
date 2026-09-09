## Tasks

- [x] Extract lane scripts — create `aksk-bootstrap/scripts/bootstrap-global.mjs` (global lane) and scaffold new skill `.agents/skills/aksk-init` with `aksk-init/scripts/bootstrap-repo.mjs` (repo lane with preflight check); keep `bootstrap.mjs` as delegating shim
- [x] Create `aksk-init` skill — scaffold `.agents/skills/aksk-init/` with `SKILL.md`, `references/` (shared versions.json + templates), `scripts/`; have repo lane delegate to bootstrap scripts or copy needed helpers; add docs-lint guard for versions.json drift
- [x] Narrow `aksk-bootstrap` skill — update `SKILL.md` to global-only scope, extract global lane from `bootstrap.mjs`, update `check_peer_tools.mjs` / INSTRUCT messages
- [x] Interactive prompts — both lanes: TTY-aware readline prompts with --yes/--non-interactive/AKSK_YES=1 bypass and no-TTY fallback to INSTRUCT; each step prints detected state, default, prompt y/n/skip before mutating
- [x] Validation — `openspec validate --strict` passes; lane scripts report correct state, fail-fast when tools missing, idempotent re-runs no-op, existing repo still docs-lint clean
