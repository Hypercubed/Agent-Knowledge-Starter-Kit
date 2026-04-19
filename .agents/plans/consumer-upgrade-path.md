---
description: >
  Provide a consumer-friendly upgrade path when refreshing kit skills or merging a new kit drop into an existing project that already adopted an earlier kit version.


created: 2026-04-11
status: partially implemented
writer: AI
prompter: Hypercubed
---

# Consumer-friendly upgrade path

## Goal

Reduce friction and fear when **upgrading** the agent knowledge starter in a real repo: clear steps for what to overwrite, what to merge by hand, and how to preserve local-only skills or maintainer extensions.

## Scope

- Add a dedicated doc (likely under `example/.agents/docs/` or top-level consumer section in README) covering v1 → vNext style upgrades, **or** keep the story README-first if that stays sufficient.
- Call out safe paths (e.g. re-run `npx skills add …` vs manually merging skill folders vs replacing disposable template trees only).
- Reference optional tooling already in this repo (e.g. selective sync skills) where relevant, without requiring it.
- Cover first-time adoption into a repo that already has `.agents/`: preserve existing domain-specific `rules/`, `playbooks/`, and `skills/`, then add missing `docs/`, `agents/`, `sessions/`, and the closeout/distill/lint skills.
- Explain that `.agents/.gitignore` is sufficient for session bundles when tracked, with repo-root `.gitignore` patterns only as an alternative for repos that do not track nested gitignore files.
- Explain how root `AGENTS.md` and `.agents/AGENTS.md` should relate when both exist.
- Recommend recording adoption in `.agents/docs/log.md` and `.agents/docs/repo-decisions.md`, then updating `.agents/docs/index.md` with pre-existing repo-specific knowledge assets.

## Implemented so far

- README now includes an adoption checklist for existing `.agents/` trees.
- README now clarifies that `.agents/.gitignore` is the normal session-ignore location and repo-root `.gitignore` patterns are only an alternative.
- README now documents the root `AGENTS.md` versus `.agents/AGENTS.md` relationship.
- README now separates human and agent quick starts.
- `INSTALL.md` gives agents a detailed install and merge checklist.

## Out of scope (for this plan)

- Version tagging policy or changelog automation (could be a follow-up).
- A dedicated kit doc under `example/.agents/docs/` remains a follow-up if this guidance should live inside the copied `.agents/` tree instead of only in README and `INSTALL.md`.

## Success criteria

- A new adopter and an existing adopter each have a short, ordered checklist.
- “What breaks if I wholesale replace `.agents/` or overwrite kit skills?” is answered explicitly.
- Existing repo-specific knowledge remains discoverable after adoption.

## Notes

- Consider a small compatibility matrix: AGENTS.md, skills paths, sessions gitignore, new folders (plans, rules) as they land (this repo validates `.agents/` via `scripts/check-publish.sh`, not a second `scaffold/` tree).
