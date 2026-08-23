## Context

Currently, AKSK implements a custom knowledge layer structured around `.agents/docs/` with skills like `docs-compile`, `docs-lint`, and `docs-search`. Meanwhile, the `openwiki` project implements an opinionated CLI for managing Google Open Knowledge Format (OKF) v0.1 bundles. We want to align AKSK's knowledge layer with the OKF standard and OpenWiki's internal logic, but we do not want to rely on the opaque `openwiki` CLI AI harness during agent runtime. We want agents to act natively via skills. 

## Goals / Non-Goals

**Goals:**
- Shift AKSK's documentation structure to follow OKF v0.1 (`openwiki/` dir).
- Replace `docs-compile` and `docs-lint` with extracted native skills `openwiki-init` and `openwiki-sync`.
- Build an extractor script that pulls system prompts directly from the `openwiki` npm package during kit initialization.
- Provide an optimized `okf-search` skill.

**Non-Goals:**
- Forking `openwiki` or manually maintaining our own version of its complex system prompts.
- Running the `openwiki` CLI internally during the standard agent workflow.
- Supporting OpenWiki's "Personal Mode" (Notion/Slack/X integrations) within AKSK; we focus strictly on repository documentation ("Code mode").

## Decisions

1. **Extraction Script vs. CLI execution**:
   - *Alternative*: Just run `npx openwiki --update`.
   - *Decision*: Build `scripts/extract-openwiki-skills.js`. This script imports `createSystemPrompt` from the `openwiki` package, generates the markdown instructions for `init` and `update` commands, and writes them into `.agents/skills/openwiki-init/SKILL.md` and `.agents/skills/openwiki-sync/SKILL.md`.
   - *Rationale*: Agent performance and transparency are better when the agent reads native `.agents/skills` instructions and performs the work itself, rather than trying to spawn a sub-agent CLI harness that could hang, prompt for interactive input, or fail silently.

2. **File Structure Migration**:
   - *Alternative*: Keep `.agents/docs/` and just use OKF inside it.
   - *Decision*: Fully adopt the `openwiki/` directory at the root, as mandated by the `openwiki` tool and OKF specifications. The starter kit will no longer scaffold `.agents/docs/`.
   - *Rationale*: Maximum compatibility with the OpenWiki ecosystem and standardizing where developers expect to find agent knowledge.

3. **OKF Search Strategy**:
   - *Alternative*: Rely solely on IDE retrieval.
   - *Decision*: Replace `docs-search` with `okf-search` that is specifically tuned to read `openwiki/` YAML frontmatter (searching for `title`, `description`, `type`, and `tags`).
   - *Rationale*: OpenWiki currently lacks a native search command. An OKF-tuned `ripgrep` skill bridges this gap efficiently.

## Risks / Trade-offs

- **Risk: Upstream Prompt Changes** → *Mitigation*: The extraction script runs only during initial setup or when explicitly updated (e.g., `npm update openwiki && npm run extract-skills`). This pins the skill behavior to the installed package version, preventing unexpected breakage.
- **Risk: OpenWiki Internal API changes** → *Mitigation*: We are relying on `createSystemPrompt` which might be internal/unexported. If it is unexported, we may need to parse the compiled JS or use a patch, but ideally, we can import it.
- **Risk: Duplicate functionality** → *Mitigation*: Remove `docs-lint` and `docs-compile` entirely to prevent confusion.
