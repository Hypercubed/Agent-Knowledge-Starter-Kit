# OpenSpec Integration Guide

This guide describes how to integrate OpenSpec into the Agent Knowledge Starter Kit (AKSK). OpenSpec agents can be used to monitor, validate, or document AKSK projects while adhering to established knowledge-capture constraints.

> **CAUTION:** OpenSpec agents do not execute scripts. They read and interpret SKILL.md files to understand workflows and policies. Ensure your skills are well-documented for agent consumption.

## Configuration

To integrate with OpenSpec, define a ruleset in your OpenSpec configuration that points agents to AKSK documentation.

### Example Configuration

Add the following to your openspec.yaml (or equivalent configuration):

```yaml
rules:
  - name: AKSK Documentation Awareness
    description: Ensure agents follow AKSK knowledge capture standards.
    patterns:
      - .agents/SKILL.md
      - .agents/skills/**/*.md
    action: read-and-reference
```

*Note: The paths above reflect a standard AKSK installation. If your project uses a custom directory structure for skills or agents, update these paths accordingly.*

## Workflow Integration

When using OpenSpec agents in an AKSK workflow, follow these operational phases to ensure knowledge is captured correctly:

### 1. Proposal Phase
The agent MUST generate a plan as a markdown file, typically saved to .hermes/plans/.

### 2. Implementation Phase
The agent MUST reference relevant SKILL.md documents to understand constraints before taking action.

### 3. Knowledge Distillation
Upon completion of a task, the agent MUST distill the final approach or discovery into a new SKILL.md or update an existing one if the findings are durable.

## Best Practices

- **Explicit Directions:** Use bolded **MUST** headers within your SKILL.md files to clearly convey imperative constraints to the agent.
- **Pathing Awareness:** Always reference files using paths relative to the project root to ensure they are discoverable regardless of where the AKSK project is nested.
- **Verification:** Always verify that an OpenSpec agent has "read" access to your skill directories before assigning tasks.
