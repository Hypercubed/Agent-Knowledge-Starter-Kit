# Proposal: Worked Lifecycle Example

## Problem
The Agent Knowledge Starter Kit demonstrates the structural layout through `example/.agents/` and the maintainer `.agents/` tree, but lacks a compact end-to-end example showing the knowledge loop from task completion through distillation.

## Proposed Change
Add a small worked example that demonstrates:
1. A coding task completes
2. `task-closeout` writes a session bundle
3. `learning-distill` classifies candidate lessons
4. Durable docs are updated
5. `.agents/docs/log.md` records the maintenance action

The example should connect to the existing `example/.agents/skills/task-closeout/example/task-bundle/` and show classification to destinations like `.agents/AGENTS.md`, troubleshooting, decisions, playbooks, and log.md.

## Impact
- **Adoption**: Helps users understand the full closeout-to-distillation loop without missing steps.
- **Clarity**: Reinforces that session bundles are temporary and durable lessons belong in reviewed `.agents/` files.
- **Distinction**: Does not blur the line between published kit and maintainer tree.

## Success Criteria
- A reader can understand the full closeout-to-distillation loop without inferring missing steps.
- The example reinforces that session bundles are temporary and durable lessons belong in reviewed `.agents/` files.
- The example does not blur the distinction between the published kit (`example/.agents/` after `generate-example`, or an adopter tree installed via skills) and this repository's maintainer `.agents/` tree.
- The example is compact enough to help adoption without becoming a tutorial.