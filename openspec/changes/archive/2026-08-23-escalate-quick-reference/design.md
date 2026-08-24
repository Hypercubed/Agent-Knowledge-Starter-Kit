## Context

The kit stores durable rationale (`decisions/`) and frequent issues (`troubleshooting/`). As this dataset grows, raw alphabetical lists become overwhelming. Maintainers rely on a `## Quick Reference` pinboard at the top of these index boundaries. 

Currently, `docs-compile` is responsible for updating the alphabetical list beneath the pinboard. However, curating the Quick Reference itself requires manual effort. The goal is to programmatically surface critical articles to the pinboard via frontmatter evaluation during `docs-compile`.

## Goals / Non-Goals

**Goals:**
- Automatically compile and inject high-importance entries into `## Quick Reference` underneath the respective index blurbs.
- Use explicit markdown frontmatter (`featured: true`) as the gating mechanism.
- Ensure automated pinned lists do not overwrite or delete existing manually authored static blurbs within that section.

**Non-Goals:**
- Applying complex LLM semantic analysis scripts to "guess" importance. We will strictly use declarative YAML boolean frontmatter features.
- Deprecating the standard alphabetical list index generation.

## Decisions

- **Decision 1: Use `featured: true` Frontmatter Schema over Tags**
  - **Why?** Adding `featured: true` to `.agents/skills/learning-distill/references/troubleshooting-frontmatter.schema.json` and similar templates is declarative, binary, and requires no taxonomy parsing unlike inferring importance from an array of strings in `tags`.
- **Decision 2: Re-architecting `generate-durable-indexes.py` Injector Pattern**
  - **Why?** The blurb currently holds all markdown written before the `## Index` marker. To insert the auto-escalated references directly under `## Quick Reference`, we must parse the `blurb` and inject a dynamic list immediately after the heading, or reconstruct the Quick Reference block seamlessly.

## Risks / Trade-offs

- **Risk: Markdown Parsing Fragility** → If the user alters the casing or phrasing of `## Quick Reference`, injection logic relying on regex might fail. **Mitigation:** Fallback to standard append behavior if the precise header string is not found.
- **Risk: Overcrowding Quick Reference** → Over time, too many documents might be marked as featured, undermining the purpose. **Mitigation:** The `learning-distill` documentation should include a best-practices warning limiting featured articles.
