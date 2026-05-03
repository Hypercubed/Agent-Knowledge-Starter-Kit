# Tasks for Shipping Structure Check Script

## Implementation Steps

1. Refactor `scripts/check-agents-structure.sh` target detection (if not complete):
   - Add `SCRIPT_DIR` detection.
   - Add a helper that detects whether a directory looks like an agent knowledge tree.
   - Choose the default target by explicit CLI argument, then parent of script dir if it looks like `.agents`, then `./.agents` if present, then `.`.

2. Copy the improved script into the **published kit snapshot** (for example `example/.agents/scripts/check-agents-structure.sh`) when `generate-example` should carry it, **or** add `/.agents/scripts/` to skill bootstrap — pick one contract and document it.

3. Make tracked copies executable as needed: `chmod +x scripts/check-agents-structure.sh` (and the published-kit copy when added).

4. Optionally add `.agents/scripts/check-agents-structure.sh` under this repo's root `.agents/` so dogfood matches consumer layout (today: not present).

5. Decide whether `scripts/check-agents-structure.sh` should be a required file in the validator:
   - For fresh installs, it should exist.
   - For partial upgrades, a warning may be safer than a hard failure in the first release that introduces it.

6. Update `INSTALL.md` so adopters know how to run the checker after skill install (path may stay `bash scripts/check-agents-structure.sh .agents` when they cloned the starter, or a future `.agents/scripts/` relative path).

7. Update `README.md` with a short validation note in the quick start or maintenance flow.

8. Update `docs/architecture.md` kit layout to mention where the portable validator lives and how publish uses it.

9. Update `.agents/playbooks/pre-publish.md` expected output: structure checks pass for **`.agents/`** (and `example/.agents` only if you add a second `run_structure_check` or validate manually); remove stale `scaffold` wording.

10. Decide whether `generate-example` should bundle `scripts/` alongside skills and agents.

## Validation Plan

Run:

```bash
bash scripts/check-agents-structure.sh .agents
bash scripts/check-agents-structure.sh example/.agents
# optional future:
# bash .agents/scripts/check-agents-structure.sh .agents
cd .agents && bash ../scripts/check-agents-structure.sh .
```

Expected results:

- Structure checks pass for `.agents` (and for `example/.agents` once session-tracking expectations align or the script learns example-mode).
- Git session tracking runs when inside this repo.
- JSON validation is skipped with a warning if `jq` is unavailable.
- No publish-only checks run from the portable script.

Then run:

```bash
bash scripts/check-publish.sh
```

Expected result:

- The publish wrapper uses the portable validator.
- It may still fail on existing Prettier drift, which remains publish hygiene rather than structure validation.