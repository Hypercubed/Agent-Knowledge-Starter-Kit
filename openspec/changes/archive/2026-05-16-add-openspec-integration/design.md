## Context

AKSK is designed to be tool-agnostic. OpenSpec is an AI-native system for spec-driven development. While they handle different parts of the lifecycle, combining them is powerful. The challenge is connecting them without hardwiring AKSK scripts to expect OpenSpec artifacts. By utilizing OpenSpec's native `rules` block within `.openspec.yaml` or `openspec/config.yaml`, we can orchestrate the handoff between OpenSpec's workflow and AKSK's distillation processes purely via prompt instructions.

## Goals / Non-Goals

**Goals:**
- Provide clear, copy-pasteable instructions for consumers to bridge OpenSpec and AKSK.
- Keep AKSK skills (like `task-closeout`) completely agnostic to OpenSpec.

**Non-Goals:**
- Do not modify OpenSpec's core source code.
- Do not add explicit OpenSpec checks to `learning-distill` or `task-closeout`.

## Decisions

- **Use OpenSpec Rules Block for Integration:** Instead of complex bash hooks or shell wrappers, we will rely on OpenSpec's configuration schema (`rules: proposal` and `rules: tasks`) to instruct the LLM to trigger AKSK searches and distillations.
  - *Rationale:* OpenSpec is built for AI agents. Instructing the agent via the configuration is the native way to extend its behavior. It requires zero boilerplate scripts and is easily customizable by the user.

## Risks / Trade-offs

- **Risk:** Agents might ignore the rules in `openspec/config.yaml`.
  - *Mitigation:* We will clearly formulate the prompt snippet using strong directives like `MUST`.
- **Risk:** Path mismatches if consumers place `.agents/` somewhere else.
  - *Mitigation:* The integration guide will note that paths are relative to the project root and assume a standard AKSK installation.
