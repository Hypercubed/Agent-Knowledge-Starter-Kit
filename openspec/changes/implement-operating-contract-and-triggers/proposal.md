# Proposal: Implement Operating Contract and Triggers

## Problem
The Agent Knowledge Starter Kit (AKSK) lacks a structured workflow layer to ensure agents consistently consult repository knowledge and enable automatic execution of reusable workflows. Without an operating contract and trigger system, agents may miss critical knowledge or fail to execute necessary post-task processes.

## Proposed Change
Introduce a lightweight, repo-native workflow layer consisting of:
- An operating contract that defines mandatory phases for agent behavior
- A trigger system that automatically executes playbooks on specific events
- Playbooks as first-class artifacts for reusable workflows
- Optional rules for declarative guidance

## Impact
- **Consistency**: Agents will follow a standardized process for discovering and applying repository knowledge
- **Automation**: Triggers enable automatic execution of workflows without manual intervention
- **Maintainability**: Playbooks provide reusable, discoverable procedures for common tasks
- **Tool Agnostic**: The system remains file-based and doesn't introduce runtime dependencies

## Success Criteria
- Operating contract is defined and under 50 lines
- Trigger system fires on task-closeout event
- At least one playbook (update-docs) is created and executable
- Full workflow cycle (task → closeout → trigger → playbook) executes successfully
- All artifacts are discoverable via ripgrep search