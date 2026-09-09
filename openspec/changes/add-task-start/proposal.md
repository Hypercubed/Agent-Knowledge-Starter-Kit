## Why

AKSK currently captures session history retroactively via `task-closeout`, which leaves work vulnerable to data loss if an agent is interrupted and prevents effective context anchoring at the start of a task. We need to formalize task state initialization proactively.

## What Changes

- Introduce a standardized `task-start` skill/capability.
- Define the initial session bundle state (seed `summary.json` inside a `YYYYMMDD-HHMMSS-short-topic` folder).
- Update `task-closeout` to finalize an existing bundle rather than generating new identity from scratch.

## Capabilities

### New Capabilities
- `task-start`: Proactive initialization of task metadata, `task_id` generation, and session folder structure.

### Modified Capabilities
- `task-closeout`: Modified to detect and finalize an existing seeded `summary.json` (created by `task-start`), preserving task identity. When invoked without a prior `task-start`, it retains its current generation fallback. It remains the sole owner of finalization (adding `completed_at`, `status`, `changed_files`, `validation`, `openspec_change`, and distillation flags). As slimmed by `adopt-openspec-openwiki`, `summary.json` carries `openspec_change` and distillation flags; `task-start` MUST seed these fields when known and preserve them for closeout rather than redefining them.

## Impact

This affects the lifecycle of all implementation tasks within AKSK-compliant repositories. It requires updating `.agents/AGENTS.md` (routing/lifecycle guidance) and `openspec/config.yaml` to include `task-start` as the mandatory trigger at the beginning of implementation workflows, alongside the existing `task-closeout` trigger at the end.

Durable knowledge remains in `openwiki/decisions/` and `openwiki/troubleshooting/` (curated via `learning-distill`); temporary session state lives under `.agents/sessions/` (gitignored except `README.md`). No durable `openwiki/` or `.agents/AGENTS.md` writes happen during start/closeout — those are deferred to `learning-distill`.

**Sequencing:** `task-start` creates the session folder and seeds `summary.json` with `task_id`, `created_at`, `status=in_progress`, and optional `openspec_change`; `task-closeout` finalizes the same `summary.json` (adding `completed_at`, final `status`, agent/branch metadata, and distillation flags) and writes the remaining bundle files (`active-task.md`, `learning-candidate.md`, `changed-files.txt`, `validation.txt`); `learning-distill` consumes the finalized bundle only after closeout marks it ready. Ownership is exclusive: task-start owns creation, task-closeout owns finalization, nothing else mutates the bundle.
