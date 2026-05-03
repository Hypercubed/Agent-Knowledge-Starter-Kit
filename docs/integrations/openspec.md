# OpenSpec Integration

Use this guide to connect OpenSpec with the Agent Knowledge Starter Kit (AKSK). For the shared integration model, read [Integration Patterns](./patterns.md).

OpenSpec is an AI-native system for spec-driven development. Since OpenSpec natively supports instructing its agents via a configuration file, we can orchestrate the handoff between OpenSpec's workflow and AKSK's processes purely through prompt instructions in the `rules` block.

## Setup

1. Install starter skills in the target repo with `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit`, then run each installed skill's initialization from its `SKILL.md` (see [`INSTALL.md`](../../INSTALL.md)).
2. Configure OpenSpec to trigger AKSK skills during its workflow phases. Add the following rules blocks to your `openspec/config.yaml` or `.openspec.yaml` file.

### Example Configuration

```yaml
rules:
  proposal: |
    - **Before drafting architectural changes:** You MUST search `.agents/docs/decisions/` or run `python3 .agents/skills/docs-search/scripts/search-docs.py` to ensure your proposed changes do not violate established design patterns.
    - Reference `.agents/AGENTS.md` to match existing patterns in the codebase.

  tasks: |
    - **Task Closeout:** After meaningful changes, debugging, or validation, you MUST capture the current task into a structured temporary session bundle under `.agents/sessions/` using the instructions in `.agents/skills/task-closeout/SKILL.md`.
    - **Learning Distill:** At the end of implementation phases, read the completed temporary session bundle and distill durable repo knowledge into `.agents/` files using the instructions in `.agents/skills/learning-distill/SKILL.md`.
    - Treat `.agents/AGENTS.md` as the primary durable instructions file. Keep changes minimal and focused as per the non-negotiables.
```

## Workflow Integration

- **Proposal/Design Phase (`rules: proposal`):** OpenSpec agents will use the `docs-search` skill to review existing architectural decisions and avoid violations before drafting specs.
- **Implementation Phase (`rules: tasks`):** As OpenSpec implements tasks, the agents will use `task-closeout` to bundle execution evidence and then use `learning-distill` to promote any reusable lessons to the durable knowledge base under `.agents/`.

## Caveats

- OpenSpec does not natively run bash scripts like `task-closeout.sh` automatically. Instead, the agents read the `SKILL.md` files (as specified in the rules) and perform the steps listed within them.
- Ensure that paths mentioned in your `openspec/config.yaml` rules are relative to the project root and match your AKSK installation structure.
- Depending on the specific OpenSpec agents, you might need to use strong directives like `MUST` to ensure they execute the documentation searches and closeout processes reliably.

## References

- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [Integration Patterns](./patterns.md)
