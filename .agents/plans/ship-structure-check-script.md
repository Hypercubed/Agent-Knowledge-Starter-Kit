# Ship Structure Check Script In Scaffold

## Goal

Make `check-agents-structure.sh` part of the published starter kit so consumers can validate their installed `.agents/` tree. Keep `check-publish.sh` maintainer-only for this starter repo's release hygiene.

## Key decisions

- Add the consumer-facing script under `scaffold/scripts/check-agents-structure.sh`.
- When copied into a consuming repo, it will live at `.agents/scripts/check-agents-structure.sh`.
- Keep this repo's root copy at `scripts/check-agents-structure.sh`, but treat the scaffold copy as the portable product copy.
- Do not add `check-publish.sh` to `scaffold/`; it is specific to this repo.

## Portability improvements

Before copying into `scaffold/`, adjust `check-agents-structure.sh` so it is location-aware:

- If a target path is passed, validate that path.
- If no target is passed and the script is running from inside `.agents/scripts/`, default to the parent `.agents/` tree.
- If no target is passed and `.agents/` exists in the current directory, default to `.agents`.
- If neither applies, default to the current directory and validate it as an agent knowledge tree.

Useful invocation forms should include:

```bash
bash .agents/scripts/check-agents-structure.sh
bash .agents/scripts/check-agents-structure.sh .agents
cd .agents && bash scripts/check-agents-structure.sh
bash scripts/check-agents-structure.sh scaffold
```

Keep the portable script dependency-light:

- Keep `git` optional. If unavailable or outside a git repo, skip tracked/ignored session checks with a warning.
- Keep `jq` optional. If unavailable, skip JSON validation with a warning.
- Continue using common shell tools for core checks: `bash`, `sed`, `grep`, and `find`.
- Avoid `rg`, `npx`, Prettier, link checkers, and repo-specific paths in the portable script.

## Implementation steps

1. Refactor `scripts/check-agents-structure.sh` target detection:
   - Add `SCRIPT_DIR` detection.
   - Add a helper that detects whether a directory looks like an agent knowledge tree.
   - Choose the default target by explicit CLI argument, then parent of script dir if it looks like `.agents`, then `./.agents` if present, then `.`.
2. Copy the improved script to `scaffold/scripts/check-agents-structure.sh`.
3. Make both copies executable: `chmod +x scripts/check-agents-structure.sh scaffold/scripts/check-agents-structure.sh`.
4. Add the script to root `.agents/` at `.agents/scripts/check-agents-structure.sh` so the dogfood tree matches the consumer layout.
5. Decide whether `scripts/check-agents-structure.sh` should be a required file in the validator:
   - For fresh installs, it should exist.
   - For partial upgrades, a warning may be safer than a hard failure in the first release that introduces it.
6. Update `INSTALL.md` so adopters can run `bash .agents/scripts/check-agents-structure.sh` after copying or merging `scaffold/` into `.agents/`.
7. Update `README.md` with a short validation note in the quick start or maintenance flow.
8. Update `docs/architecture.md` scaffold layout to include `scripts/check-agents-structure.sh`.
9. Update `.agents/playbooks/pre-publish.md` to mention that the portable validator ships in `scaffold/`.
10. Decide whether the maintainer sync skill should later include `scaffold/scripts/` in addition to `scaffold/agents/` and `scaffold/skills/`.

## Validation plan

Run:

```bash
bash scripts/check-agents-structure.sh scaffold
bash scripts/check-agents-structure.sh .agents
bash scaffold/scripts/check-agents-structure.sh scaffold
bash .agents/scripts/check-agents-structure.sh .agents
cd .agents && bash scripts/check-agents-structure.sh
```

Expected results:

- Structure checks pass for `scaffold`.
- Structure checks pass for `.agents`.
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
