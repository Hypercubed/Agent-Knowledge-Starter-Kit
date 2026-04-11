# Repository Decisions

This template belongs in `.agents/docs/repo-decisions.md`.

Use this file for durable rationale and architectural choices.

### Scaffold content stays consumer-generic

### Status
Accepted (supersedes prior “dual tree sync” policy)

### Context
The published template must be copy-pasteable as `.agents/` without carrying starter-repository concepts.

### Rationale
Consumers should not inherit maintainer-only workflows, paths like `scaffold/`, or “keep trees aligned” rules. Those belong in this repo’s `.agents/` (or root `README.md`), not in the kit files under `scaffold/`.

### Consequences
- `scaffold/` is edited only for improvements that belong in **any** adopter’s `.agents/` layout.
- This repository’s optional `.agents/` may accumulate dogfood-specific notes and **does not** need to match `scaffold/` byte-for-byte.

### Dual `scaffold/` path vs `.agents/` dogfood (historical)

### Status
Superseded

### Context
An earlier approach treated `.agents/` as a refreshed copy of `scaffold/`.

### Consequences
That policy is retracted; see “Scaffold content stays consumer-generic” above.

### Optional `prior_session` in session `summary.json`

### Status
Accepted (optional convention)

### Context
Multi-step maintainer work can produce more than one task-closeout folder for a single initiative (for example adoption work plus a later orchestrator meta-closeout).

### Rationale
Adding `prior_session` (path to the earlier bundle directory) records linkage and ordering without reopening or editing earlier packets, which should stay append-only after closeout.

### Consequences
- Distillation across linked bundles relies on `task_id`, timestamps, and `prior_session`; see `.agents/docs/troubleshooting.md` for overlap symptoms and fixes (avoid rewriting closed session trees).
- Agents reconstructing history may follow `prior_session` when present.

### Sessions directory: tracked README with ignored bundles

### Status
Accepted

### Context
Consumers need a `.agents/sessions/` directory with guidance while keeping per-task bundle folders local.

### Rationale
A short `.agents/sessions/README.md` gives human-facing context; in `.agents/.gitignore`, pairing `sessions/*` with `!sessions/README.md` (paths relative to `.agents/`) tracks exactly one file there while bundle subfolders stay ignored.

### Consequences
- After copying or merging the kit, confirm `.gitignore` exceptions match the tracked filename exactly (path segments and case).

### Maintainer-only skills and scripts never live under `scaffold/`

### Status
Accepted

### Context
Skills under `scaffold/skills/` are what adopters copy into their `.agents/skills/` tree. Maintainer workflows for this repository (for example selective sync from `scaffold/` into dogfood `.agents/`) are not portable kit content.

### Rationale
Putting a maintainer skill in `scaffold/` ships it to consumers, who often have no `scaffold/` directory, and erases the boundary between generic template and starter-repo dogfood.

### Consequences
- Maintainer-only skills and any helper scripts stay under this repo’s `.agents/skills/<skill-name>/` beside `SKILL.md`.
- Portable skills and agent role files remain under `scaffold/skills/` and `scaffold/agents/` and are merged into `.agents/` when maintainers run the documented sync.

## Entry template

### Decision
Describe the decision.

### Status
Accepted | superseded | provisional

### Context
Why this decision was needed.

### Rationale
Why this approach was chosen.

### Consequences
What future agents should keep in mind.
