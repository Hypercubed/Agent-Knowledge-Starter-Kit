## Context

The current AKSK structure relies heavily on `AGENTS.md` for normative instructions. As repositories grow, `AGENTS.md` can become bloated or overly generic. There is a need for a dedicated place for more specific rules (e.g., "all React components must use functional patterns") that are still portable across agents.

## Goals / Non-Goals

**Goals:**
- Establish `.agents/rules/` as the standard home for specific normative agent instructions.
- Provide clear guidance on the hierarchy of instructions (`AGENTS.md` vs `rules/`).
- Enable automated tools (like `learning-distill`) to target the rules directory.

**Non-Goals:**
- Enforcing specific agent-vendor formats (like `.cursorrules`) as the primary format, though the pattern should be compatible.
- Automating the application of these rules beyond providing them to the agent.

## Decisions

### 1. Directory Structure: `.agents/rules/`
We will use `.agents/rules/` for rule storage. This keeps them isolated from documentation (`docs/`) and sessions (`sessions/`).
- **Rationale:** Clear separation of concerns between *instructions* (rules) and *rationale* (decisions).
- **Alternatives:** 
    - Putting them in `.agents/docs/rules/`: Rejected because rules are instructions, not just documentation.
    - Keeping everything in `AGENTS.md`: Rejected due to scalability issues.

### 2. Decision Boundary Definition
- **AGENTS.md**: High-level, repo-wide non-negotiables and essential routing directives.
- **.agents/rules/**: Domain-specific or file-scoped normative instructions.
- **.agents/docs/decisions/**: The "Why" behind the rules. Rules should link to decisions if the rationale is non-trivial.
- **.agents/docs/playbooks/**: Procedural guides (how-to) rather than normative constraints (must/shall).

### 3. Integration with `learning-distill`
`learning-distill` will be updated (via its prompt/skill definition) to recognize the `rules/` directory as a valid target for new normative findings.

## Risks / Trade-offs

- **[Risk]** Fragmentation of instructions between `AGENTS.md` and `rules/`. 
  - **Mitigation** Use `AGENTS.md` for the most critical rules and have it point to the `rules/` directory for specifics.
- **[Risk]** Incompatibility with tool-specific rules files (e.g., `.cursorrules`).
  - **Mitigation** Document how `.agents/rules/` can be used to generate or sync with these tool-specific files if needed.
