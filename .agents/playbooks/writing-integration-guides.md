# Writing Integration Guides for Convergent Tools

## Trigger
When writing an integration guide for an agent tool that has its own memory, skills, or knowledge systems (e.g., Hermes, OpenClaw).

## Steps

1. **Inventory the tool's native structures.** What memory systems, skill formats, config files, and context mechanisms does the tool already have? List them explicitly.

2. **Map overlaps.** Where do the tool's native structures and the kit's conventions cover the same ground? (e.g., Hermes `memory` tool ≈ kit durable docs, Hermes `skills` ≈ kit `.agents/skills/`)

3. **Map gaps.** What does the kit provide that the tool lacks, and vice versa? (e.g., the kit has session bundles and distillation protocols; the tool has persistent cross-session memory that the kit doesn't track)

4. **Describe integration options.** Present three patterns with trade-offs:
   - **Kit as bridge:** Shared `.agents/` tree lets multiple tools coordinate
   - **Replicate:** Mirror the tool's native structures into the kit's format
   - **Hybrid:** Use the tool's native systems for daily work, the kit for cross-tool coordination

5. **Include a concrete two-tool workflow.** Show a real scenario where the agent tool works alongside another tool (e.g., Hermes + Claude Code, OpenClaw + GitHub Actions). This is where the guide becomes genuinely useful vs. just describing features.

6. **Verify claims against real behavior.** Before documenting a limitation, reproduce it in the current tool or current repo context. Distinguish a repo bootstrap file (such as root `AGENTS.md`) from the durable `.agents/` knowledge layer when both exist.

## Pitfalls
- Don't assume the tool adopted the kit — they may be convergent, not compatible.
- Don't oversell the kit. The tool's native systems may be better for some tasks.
- Don't skip the namespace collision problem. If the tool has its own `skills/` or `memory/` directories, explain how to avoid confusion with the kit's equivalents.
- Don't turn a single weak run into a product-wide claim without reproduction.
