# Design: Worked Lifecycle Example

## Location Decision
The example should be placed in one of:
- `README.md` (high visibility but may clutter)
- `docs/architecture.md` (architectural context)
- `example/.agents/docs/` (close to the structural example)

Prefer `docs/architecture.md` to provide architectural context while keeping README focused.

## Example Structure
- Use the canonical identity model with `task_id` field in `summary.json`
- Show classification destinations:
  - `.agents/AGENTS.md` (agent rules)
  - `.agents/docs/troubleshooting/` (issue patterns)
  - `.agents/docs/decisions/` (design rationale)
  - `.agents/playbooks/` (procedures)
  - `.agents/docs/log.md` (maintenance record)
- Connect to existing `example/.agents/skills/task-closeout/example/task-bundle/`
- Keep compact: focus on the loop, not tutorial details

## Scope
- Decide location for the example
- Prefer connecting to existing task-bundle instead of inventing scenario
- Show canonical identity model using task_id
- Show classification to at least the five destinations listed
- Keep example compact for adoption help

## Out of Scope
- Adding multiple examples
- Adding automation or schema validation
- Changing the existing sample bundle unless needed for consistency