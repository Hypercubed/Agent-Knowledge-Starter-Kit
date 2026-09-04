# aksk-init Specification — Delta

## MODIFIED Requirements

### Requirement: Per-repo init preflight

The system MUST verify global prerequisites before repo work: Node >=22 and `openspec`/`openwiki` on PATH. If missing, it MUST fail fast with a message directing to `aksk-bootstrap` (`node .agents/skills/aksk-bootstrap/scripts/bootstrap-global.mjs`) and MUST NOT attempt global installs. It MUST NOT be invocable transitively through `aksk-bootstrap`; the only entry point is `aksk-init/scripts/bootstrap-repo.mjs` directly or via the `aksk-init` skill.

#### Scenario: Happy path

- **WHEN** user runs the lane with defaults
- **THEN** the requirement is satisfied

#### Scenario: Shim no longer delegates

- **WHEN** documentation or automation refers to repo initialization
- **THEN** it references `aksk-init` / `bootstrap-repo.mjs` explicitly, never the deleted `bootstrap.mjs` shim

### Requirement: Repo lane execution model

The repo lane script MUST be non-interactive; the `aksk-init` skill (agent) prompts [Y/n/skip] before invoking it. The script MUST describe harness vs CLI paths for `openwiki --init` (harness needs no extra key; CLI needs OPENAI_API_KEY) and MUST NOT block on stdin. **The skill and script SHALL be documented as independent from `aksk-bootstrap`; ordering (global first, then per-repo) is stated in docs, not enforced by cross-skill spawning.**

#### Scenario: Happy path

- **WHEN** the agent invokes the repo lane
- **THEN** it completes without blocking, scaffolding .agents/ and baseline first
