# Writing Integration Guides for Convergent Tools

## Trigger
When writing an integration guide for an agent tool that has its own memory, skills, or knowledge systems (e.g., Hermes, OpenClaw), or for **IDE-integrated / rules-based** tools (e.g., Cursor project rules, Copilot instructions files).

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

7. **Update repo routing docs together.** When a new guide lands under `docs/integrations/`, update the main `README.md`, `docs/integrations/README.md`, and any maintainer tracker such as `.agents/plans/add-integrations.md` in the same change so discovery and status stay aligned.

## Pitfalls
- Don't assume the tool adopted the kit — they may be convergent, not compatible.
- Don't oversell the kit. The tool's native systems may be better for some tasks.
- Don't skip the namespace collision problem. If the tool has its own `skills/` or `memory/` directories, explain how to avoid confusion with the kit's equivalents.
- Don't turn a single weak run into a product-wide claim without reproduction.
- Don't leave incidental references to whichever guide you used as a template. Keep cross-tool comparisons only when they explain a real integration risk for the target tool.

## IDE and rules-based tools (Cursor, Copilot-style)

Overlap is often **duplicated prose** in editor rules or instruction files versus canonical text under `.agents/`, not a second on-disk skill registry (contrast with Hermes system skills vs repo `.agents/skills/`).

1. Document the tool’s **discovery mechanism** (for example project rules paths, `AGENTS.md` placement, glob scoping) using vendor docs or reproduced behavior.
2. Keep **durable repo policy** in `.agents/`; use the tool’s config for **thin wiring** (pointers, `@file`-style references, short always-on bootstrap) so one source of truth does not fork.
3. When the tool supports **nested or scoped agent instructions**, state explicitly whether `.agents/AGENTS.md` is always in context or only when working under `.agents/` (adopters may otherwise assume global injection).
4. If full in-product verification is not done, label the guide accordingly and anchor behavioral claims to **official documentation** rather than analogy to other tools.
