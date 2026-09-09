# aksk-bootstrap Specification — Delta

## MODIFIED Requirements

### Requirement: Bootstrap now global-only

The system MUST ensure previous bootstrap behavior that performed repo scaffolding and contract attachment is removed from `aksk-bootstrap`; that behavior is now specified under `aksk-init`. **The compat shim `aksk-bootstrap/scripts/bootstrap.mjs` that sequentially invoked both lanes MUST NOT exist.** `aksk-bootstrap` SHALL expose only `bootstrap-global.mjs` (and leaf helpers `check_peer_tools.mjs`, `attach_*` for host verification) and MUST NOT delegate to `aksk-init` under any condition.

#### Scenario: Happy path

- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

#### Scenario: Shim invocation after removal

- **WHEN** a consumer runs `node .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs`
- **THEN** it fails with file-not-found and the docs direct them to run `node .agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs [repo-root]` followed by `node .agents/skills/aksk-init/scripts/bootstrap-repo.mjs [repo-root]`

## REMOVED Requirements

### Requirement: Shim sequential execution via bootstrap.mjs

**Reason**: Shim hid the two-lane split and caused global invocations to silently mutate per-repo files (e.g., `AGENTS.md`). Keeping it violates the global-only invariant and obscures independent skill ownership.

**Migration**: Replace `node .agents/skills/aksk-bootstrap/scripts/bootstrap.mjs [repo-root]` with the two explicit commands: `node .agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs [repo-root]` then `node .agents/skills/aksk-init/scripts/bootstrap-repo.mjs [repo-root]`. Docs and scripts are updated accordingly.
