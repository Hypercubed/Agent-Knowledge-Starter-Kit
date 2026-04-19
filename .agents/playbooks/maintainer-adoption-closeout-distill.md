# Maintainer: adopt kit, close out, distill

Use when dogfooding or refreshing this repo’s `.agents/` from `scaffold/` and capturing evidence as session bundles.

## Steps

1. Copy or refresh kit paths from `scaffold/` into `.agents/` as needed; keep `scaffold/` edits consumer-generic.
2. If you changed `scaffold/skills/`, sync those shared skills into root `.agents/` in the same maintenance pass. Run `npx skills add . -y` (or `npm run bootstrap`) from the repository root, then review the diff under `.agents/skills/`; see [`.agents/skills/sync-scaffold-agents-skills/SKILL.md`](../skills/sync-scaffold-agents-skills/SKILL.md).
3. Verify diffs (`git diff`, `git status`) and any tree comparisons you rely on (for example `diff -rq` for intentional parity checks).
4. Run **task-closeout** for the coding or adoption work; produce one dated folder under `.agents/sessions/`.
5. If an orchestrator or meta step wraps the arc, run **task-closeout** again in a **new** session folder; set `prior_session` in `summary.json` to the earlier bundle path instead of editing the first folder.
6. Before closing the task, decide whether each policy-bearing change is maintainer-only or part of the published kit contract. If it affects the kit contract, update `scaffold/` as well as root `.agents/` in the same task.
7. Run **learning-distill** on the session bundle(s); update durable docs; set `distilled` in each bundle’s `summary.json` when done.

## Validation

- Each closeout folder keeps the standard artifact set from task-closeout.
- Linked bundles reference each other only via new metadata (such as `prior_session`), not by rewriting old files.
- If `scaffold/skills/` changed, `git diff` shows matching synced root `.agents/skills/` updates.
- For kit-wide policy changes, `git status` or `git diff` shows both the `scaffold/` and root `.agents/` copies updated where applicable.
