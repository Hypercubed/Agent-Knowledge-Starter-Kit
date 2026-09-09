# Design: Operating Contract and Trigger System Architecture

## Operating Contract Structure
The operating contract (`OPERATING_CONTRACT.md`) defines mandatory phases that agents must follow:

1. **Discover**: Search repository knowledge before task execution
2. **Align**: Respect established decisions and patterns
3. **Execute**: Use available playbooks for implementation
4. **Closeout**: Run triggers and update documentation

The contract will be concise (<50 lines), directive, and focused on pre-task and post-task behavior.

## Trigger System Schema
Triggers are defined in `.agents/triggers.yaml` with a fixed event set:

- `task-start`: Fired when beginning a task
- `pre-execution`: Fired before code execution
- `post-execution`: Fired after code execution
- `task-closeout`: Fired during task completion
- `error`: Fired on execution errors

Each trigger specifies:
- `event`: The triggering event
- `run`: List of playbook IDs to execute

Initial trigger:
```yaml
triggers:
  - event: task-closeout
    run: [update-docs]
```

## Playbooks as First-Class Artifacts
Playbooks reside in `docs/playbooks/` and follow a standardized structure:

- **Frontmatter**: `type: playbook`, `id`, `when_to_use`, `outputs`
- **Content Sections**: Goal, Steps (ordered), Verification checklist

Initial playbooks:
- `update-docs.md`: Updates documentation during closeout
- `create-plan.md`: Creates structured plans for tasks

## Rules Directory (Optional)
Declarative rules in `docs/rules/` provide guidance without procedural steps:
- Plans must be updated before task completion
- Decisions must be respected

## Discovery and Integration
- All artifacts include searchable IDs
- Triggers reference valid playbook IDs
- Agent instructions updated to read contract and execute triggers
- Full cycle validation: task → closeout → trigger → playbook execution

## Implementation Strategy
- Keep system declarative and file-based
- Avoid runtime dependencies
- Favor clarity over completeness
- Enable ripgrep-based discovery for all components