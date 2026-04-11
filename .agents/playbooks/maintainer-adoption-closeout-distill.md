# Maintainer: adopt kit, close out, distill

Use when dogfooding or refreshing this repo’s `.agents/` from `scaffold/` and capturing evidence as session bundles.

## Steps

1. Copy or refresh kit paths from `scaffold/` into `.agents/` as needed; keep `scaffold/` edits consumer-generic. To merge **only** `scaffold/agents/` and `scaffold/skills/` into `.agents/` (no delete of extra files under `.agents/`), run `./.agents/skills/sync-scaffold-agents-skills/sync.sh` from the repository root; see [`.agents/skills/sync-scaffold-agents-skills/SKILL.md`](../skills/sync-scaffold-agents-skills/SKILL.md).
2. Verify diffs (`git diff`, `git status`) and any tree comparisons you rely on (for example `diff -rq` for intentional parity checks).
3. Run **task-closeout** for the coding or adoption work; produce one dated folder under `.agents/sessions/`.
4. If an orchestrator or meta step wraps the arc, run **task-closeout** again in a **new** session folder; set `prior_session` in `summary.json` to the earlier bundle path instead of editing the first folder.
5. Run **learning-distill** on the session bundle(s); update durable docs; set `distilled` in each bundle’s `summary.json` when done.

## Validation

- Each closeout folder keeps the standard artifact set from task-closeout.
- Linked bundles reference each other only via new metadata (such as `prior_session`), not by rewriting old files.
