# Maintainer Install Smoke Test

Use this playbook to verify the consumer install flow in a disposable local target repo.

This is maintainer-only workflow for this starter-kit repository.

## Goal

Confirm that `skills add` from this repo root discovers and installs only consumer skills, then verify skill bootstrap artifacts are consistent.

## Preconditions

- `_test-target-repo` is gitignored in this repo (`.gitignore` contains `_test-target-repo`).
- No process is holding files in `_test-target-repo` (delete/recreate should succeed cleanly).
- Run commands from this repository root unless noted.

## Steps

1. Recreate a clean target repo:
   - `rm -rf _test-target-repo`
   - `mkdir -p _test-target-repo && cd _test-target-repo`
   - `git init`
   - create a minimal `README.md`
2. Verify discovered skills (no install yet):
   - `npx skills add .. -l -y`
   - Expect exactly three skills: `knowledge-lint`, `learning-distill`, `task-closeout`.
3. Install skills without `--all`:
   - `npx skills add .. -y --copy --agent cursor`
   - Expect install summary shows exactly the same three skills.
4. Run skill initialization in recommended order:
   - `learning-distill` initialization
   - `task-closeout` initialization
   - `knowledge-lint` initialization
   Use each installed `SKILL.md` initialization section as source of truth.
5. Optional: append one concise adoption note in `_test-target-repo/.agents/docs/log.md` for traceability.
6. Validate artifacts:
   - `.agents/.gitignore` contains:
     - `sessions/*`
     - `!sessions/README.md`
   - `.agents/sessions/README.md` exists and is trackable
   - `.agents/AGENTS.md` exists
   - `.agents/docs/{index.md,MAINTENANCE.md,log.md,repo-decisions.md,troubleshooting.md}` exist
   - `.agents/playbooks/README.md` exists
   - No `sync-scaffold-agents-skills` appears in `_test-target-repo/.agents/skills/`
7. Capture results:
   - save command output snippets and final file list in task notes or session bundle
   - summarize any mismatch between expected and actual artifacts

## Known pitfalls

- `--all` can change CLI behavior by enabling internal-skill inclusion; do not use it for consumer-path validation.
- File-lock issues can make `_test-target-repo` undeletable; close handles and retry before concluding install issues.
- When running from inside `_test-target-repo`, use `..` as the skills source path to this repository root.
