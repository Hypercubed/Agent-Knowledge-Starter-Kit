## Context

The AKSK is designed to manage a repository's durable knowledge layer (.agents/). Historically, deprecating a decision or troubleshooting entry involved either deleting the file (which harms historical discoverability) or relying solely on a frontmatter tag (`status: superseded`) that agents might miss when navigating via index files. This can lead to agents acting on obsolete information.

## Goals / Non-Goals

**Goals:**
- Provide a clear, unmistakable semantic convention for both humans and agents that a durable knowledge entry is deprecated.
- Ensure backwards compatibility with markdown parsing tools and indexers.
- Keep historical records discoverable without muddying active guidance.

**Non-Goals:**
- Creating automated cleanup scripts that proactively delete these files.
- Changing the folder structure (we will not create `archive/` folders for decisions and troubleshooting right now, as `plans/archive/` was the only place that previously used it).

## Decisions

1. **Triple-Lock Deprecation Strategy**: We decided to combine three forms of visual and semantic markers in the `index.md` files:
   - **Section Headers**: Moving entries to `## Superseded` or `## Obsolete` at the bottom of the index. This clearly partitions active vs. inactive guidance.
   - **Text Prefixes**: Prefixing the list item with `**[SUPERSEDED]**` or `**[OBSOLETE]**`. This provides an unambiguous textual token for LLMs.
   - **Strikethrough**: Striking out the markdown link (`~~[Text](file.md)~~`) to give an immediate visual cue to human developers.
2. **Vocabulary Distinction**: 
   - `Superseded` is used for decisions (since a decision is usually replaced by a new decision).
   - `Obsolete` is used for troubleshooting entries (since the tool, system, or pattern it describes simply no longer exists).

## Risks / Trade-offs

- **Manual Maintenance**: This convention requires developers (or the `learning-distill` / `docs-lint` agents) to accurately move items and apply formatting, which adds slightly more friction than simply flipping a YAML frontmatter switch.
- **Tool Parsability**: Some simplistic markdown link extractors might fail to extract a link if it is enclosed in `~~`, though standard parsers handle strikethrough just fine.
