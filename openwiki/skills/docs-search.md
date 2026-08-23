---
type: skill-reference
title: "docs-search Skill"
description: "Layered-fallback search over durable .agents/ markdown (ripgrep, git grep, grep, Python) with frontmatter-aware result metadata and override-first root resolution."
tags: [skills, docs-search, search, python]
timestamp: 2026-08-23T18:30:00Z
---

# docs-search

**Folder:** `.agents/skills/docs-search/` · **Script:** `scripts/search-docs.py` (single file, ~260 lines, Python 3.9+, stdlib only)

## Purpose and workflow

Searches `.agents/docs/`, `.agents/playbooks/`, and `.agents/AGENTS.md` so agents can find relevant knowledge without loading whole trees — the canonical lookup step inside [learning-distill](learning-distill.md) step 2a and the [docs-lint](docs-lint.md) duplicate checks. The agent workflow is two steps: **search** (`search-docs.py "<query>"` → ranked titles/descriptions/paths), then **read** the reported files. Use section indexes when browsing; use docs-search for specific keywords, error messages, or tool names.

## Layered fallback strategy

`main()` tries backends in order, moving on only when a tier is unavailable (returns `None`) rather than merely empty:

<!-- openwiki: mermaid parse failed and this diagram was converted to a text fence so it does not break rendering. Fix the diagram source and restore the mermaid fence. Parser error: Heuristic: an unescaped angle bracket inside a label breaks rendering; rephrase the label. -->
```text
flowchart TD
    Q["query + limit"] --> R1{"rg on PATH?<br/>DISABLE_RG != 1"}
    R1 -->|yes| F1["rg -l -i query paths"]
    R1 -->|no| R2{"git available?"}
    F1 --> O
    R2 -->|yes| F2["git grep -l -i query"]
    R2 -->|no| R3{"grep on PATH?"}
    F2 --> O
    R3 -->|yes| F3["grep -r -l -i"]
    R3 -->|no| F4["Python rglob *.md substring scan"]
    F3 --> O
    F4 --> O["print top matches with<br/>title / description / relative path"]
```

*Caption: `_search_with_rg` → `_search_with_git_grep` → `_search_with_grep` → `_search_native` fallback chain in `search-docs.py`; env vars `DISABLE_RG`, `DISABLE_GIT`, `DISABLE_GREP=1` force lower tiers (useful for testing fallback correctness).*

Search scope candidates: `.agents/docs`, `.agents/playbooks`, `.agents/AGENTS.md` — only those that exist. External tool output lines get backslash-to-forward-slash normalization for Windows (`troubleshooting/windows-ripgrep-path-separators`).

## Root resolution

Order per contract and code:

1. `--agents-root PATH` flag;
2. `AGENTS_ROOT` environment variable;
3. walk parents of cwd until a directory named `.agents` appears.

Flag/env values may point at repo root or at `.agents`; if the basename isn't `.agents`, it gets appended. Failure prints to stderr and exits 1. This implements decision `docs-tooling-scripts-resolve-target-from-override-then-nearest-agents`.

## Result metadata extraction

`_get_metadata()` derives display data per hit:

- frontmatter `title:`/`description:` via regex (quotes stripped);
- fallback title from first `# heading`, else prettified filename stem;
- fallback description from the first non-heading, non-code paragraph, truncated to 200 chars with ellipsis.

`_folder_display()` groups hits by section (`.agents/docs/<section>/`, `.agents/playbooks/`, `.agents/`) and output paths are printed relative to the skill folder (`../../../<path>`), keeping results readable regardless of install depth.

## CLI surface

| Argument | Notes |
| --- | --- |
| `query` | positional, required non-empty; empty → error + exit 1 |
| `-n`, `--limit` | max hits, default 5, minimum 1 |
| `--agents-root PATH` | root resolution override as above |
| `--enable-telemetry` | opt-in; appends `[timestamp] query` lines to `<agents-root>/logs/search-telemetry.log`, failures swallowed |

The npm script `npm run search` wraps the Python entrypoint (`package.json`). A design decision (`docs-search-remains-canonical-over-host-native-search`) keeps this scoped index-based search authoritative over host products' native search, which may complement but not replace it.

## History note

An earlier implementation prebuilt a JSON index plus separate searcher; session `t-replace-indexing-with-ripgrep-task` replaced both with this single live-search script, making freshness implicit (see plan-archive entry `replace-indexing-with-ripgrep.md`).

## Retirement horizon

Under the active 2.0 pipeline, docs-search is slated for deletion by `adopt-openspec-openwiki` (superseded by OpenWiki's wiki query tooling). Until that lands, it remains a shipped consumer skill — see [OpenSpec workflow](../governance/openspec-workflow.md).
