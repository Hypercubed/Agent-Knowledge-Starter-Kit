# Proposal: Add Integration Guides

## Problem
The Agent Knowledge Starter Kit (AKSK) explains *what* the knowledge layer does, but lacks specific instructions for users to wire it into their preferred AI agents or IDEs (e.g., Cursor, Claude Code, Hermes).

## Proposed Change
Create a comprehensive `docs/integrations/` directory containing verified, per-tool integration guides. These guides will provide step-by-step setup and workflow instructions for different tool categories (Agentic AI, Persistent Assistants, and IDEs).

## Impact
- **Durable Knowledge**: Guides will live in the repo's public documentation, ensuring long-term maintainability.
- **User Adoption**: Reduces friction for new users trying to adopt the kit.
- **Tool Agnostic**: Reinforces the kit's design as a tool-agnostic system by showing how it bridges various ecosystem tools.

## Success Criteria
- `docs/integrations/` directory exists with an index and verified guides.
- Every guide follows a standardized 7-section structure.
- Main README links to the integration index.
- At least two categories (Persistent Assistant and IDE) are fully verified and documented.
