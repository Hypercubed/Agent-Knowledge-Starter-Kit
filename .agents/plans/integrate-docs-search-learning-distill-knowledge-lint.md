# Plan: Integrate docs-search into learning-distill and knowledge-lint

**Status:** implemented **Date:** 2026-04-21 **Priority:** Medium **Blocked by:** none

---

## Guiding principle

docs-search should be a **first-class lookup tool**, not just a post-write cache refresher. Both skills currently treat it as a side effect of docs-compile. The goal is to make it an active input to the reasoning steps where it adds the most value.

---

## learning-distill changes

### 1. Add a pre-write search step to the Procedure

Insert between current steps 2 and 3:

> **2a. Search for related existing knowledge.**
> If docs-search is available, refresh the index and search for each candidate lesson topic before comparing files manually:
> ```bash
> python3 .agents/skills/docs-search/scripts/index-docs.py
> python3 .agents/skills/docs-search/scripts/search-docs.py "<lesson topic>"
> ```
> Open any returned file paths and treat them as the primary input to step 3 (Compare) and step 4 (Remove duplication). This avoids loading the entire `.agents/` tree into context.

This makes docs-search the **default deduplication mechanism** rather than a manual file scan. It also means the index is refreshed once at the start of distillation, so the later docs-compile/index-docs step at the end becomes a post-write refresh only (no redundant double-index).

### 2. Clarify the post-write index step

The existing note about running `index-docs.py` if docs-compile is absent is correct but currently reads as the *only* use of docs-search. Add a note making clear it is a second, separate invocation — one at the start (search), one at the end (refresh after writes).

---

## knowledge-lint changes

### 1. Add a search-assisted check for duplicate guidance

In the **Checks** section, replace the bare bullet "duplicate guidance" with:

> **Duplicate guidance** — If docs-search is available, run `search-docs.py` for key terms from each major guidance block in `AGENTS.md`, `decisions/`, and `troubleshooting/`. Treat results with multiple high-ranked hits on the same topic as candidates for deduplication. Do not rely solely on manual reading.

### 2. Add a search step to the pre-lint procedure

After the docs-compile step and before running checks, add:

> If docs-search is available and docs-compile was not run, refresh the index manually:
> ```bash
> python3 .agents/skills/docs-search/scripts/index-docs.py
> ```
> Use `search-docs.py "<topic>"` as a discovery tool during the checks below, particularly for duplicates, contradictions, and uncategorized knowledge.

### 3. Call out search explicitly for uncategorized knowledge

The current "uncategorized knowledge" bullet gives no method. Change to:

> **Uncategorized knowledge** — For content with no clear home, run `search-docs.py "<content topic>"` to find semantically related existing entries. If a related entry exists, propose merging. If none exists, propose a new category.

---

## What NOT to change

- The docs-search SKILL.md itself doesn't need changes — it's already well-specified.
- Don't add docs-search calls to the task-closeout skill; the session bundle is raw evidence, not durable knowledge, so search has no role there.
- Don't make docs-search a hard dependency — both skills already handle its absence gracefully and that should be preserved.

---

## Suggested edit order

1. `learning-distill/SKILL.md` — Procedure step 2a (highest value, lowest risk)
2. `knowledge-lint/SKILL.md` — pre-lint index step
3. `knowledge-lint/SKILL.md` — duplicate guidance bullet
4. `knowledge-lint/SKILL.md` — uncategorized knowledge bullet
5. Review both files together to confirm the index-docs invocation pattern is consistent (once before reads, once after writes)
