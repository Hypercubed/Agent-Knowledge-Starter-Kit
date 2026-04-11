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
