# Design for Shipping Structure Check Script

## Key Decisions

- **Current:** single portable script at `scripts/check-agents-structure.sh`; document invocation from `INSTALL.md` / README for adopters who clone the starter.
- **Still desired:** ship the same script beside a generated full kit (for example `example/.agents/scripts/check-agents-structure.sh`) and/or document copying it into `.agents/scripts/` after install, so paths match the original "consumer tree" ergonomics.
- Do not add `check-publish.sh` to the published kit; it is specific to this repository.

## Portability Improvements

Finish adjusting `check-agents-structure.sh` so it is location-aware:

- If a target path is passed, validate that path.
- If no target is passed and the script is running from inside `.agents/scripts/`, default to the parent `.agents/` tree.
- If no target is passed and `.agents/` exists in the current directory, default to `.agents`.
- If neither applies, default to the current directory and validate it as an agent knowledge tree.

Useful invocation forms:

```bash
bash scripts/check-agents-structure.sh .agents
bash scripts/check-agents-structure.sh example/.agents
cd .agents && bash ../scripts/check-agents-structure.sh .
# future: bash .agents/scripts/check-agents-structure.sh
```

Keep the portable script dependency-light:

- Keep `git` optional. If unavailable or outside a git repo, skip tracked/ignored session checks with a warning.
- Keep `jq` optional. If unavailable, skip JSON validation with a warning.
- Continue using common shell tools for core checks: `bash`, `sed`, `grep`, and `find`.
- Avoid `rg`, `npx`, Prettier, link checkers, and repo-specific paths in the portable script.

## Architecture

The script will be included in the published kit snapshot, allowing consumers to run it directly from their `.agents/scripts/` directory.