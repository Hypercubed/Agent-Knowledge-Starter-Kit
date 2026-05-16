## Context

AKSK provides a set of procedural knowledge-capture skills (`task-closeout`, `learning-distill`), while OpenSpec provides artifact governance. Currently, integrating them requires manual CLI calls or ad-hoc prompt engineering.

## Goals / Non-Goals

**Goals:**
- Provide a set of OpenSpec-compliant schemas (`aksk-bridge`) to make AKSK's workflow capabilities discoverable by any OpenSpec agent.
- Map OpenSpec artifact phases (e.g., `apply`) to standardized AKSK skill triggers.

**Non-Goals:**
- Making AKSK dependent on the `openspec` CLI for core functionality (AKSK remains purely file-system based).

## Decisions

- **Bridge Format**: The bridge will use the OpenSpec schema architecture (following the model of `superpowers-bridge`).
- **Discovery Mechanism**: Standardize the `.agents/skills/` detection so that the schema registration doesn't require hard-coded host paths.

## Risks / Trade-offs

- **Risk:** Schema configuration complexity for users.
- **Mitigation:** Provide a comprehensive template directory (`templates/`) that can be pulled down by an automated installer.
- **Risk:** Tool naming collision between `npx openspec` and Hermes' own skill runner.
- **Mitigation:** Use strict namespacing for bridged skills (`aksk:<skill-name>`).
