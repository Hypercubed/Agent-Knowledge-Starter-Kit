# Docs compile contract

Machine-oriented rules for **docs-compile** when only this skill folder is available.

Durable entry frontmatter and section index prose remain normative in [`.agents/docs/MAINTENANCE.md`](../../docs/MAINTENANCE.md). For precedence, see [Portable skill contracts](../../docs/MAINTENANCE.md#portable-skill-contracts).

## Entry command

From repo root (or any subdirectory under it):

```bash
bash .agents/skills/docs-compile/scripts/docs-compile.sh
```

The shell script `cd`s to the repository root (parent of `.agents/`) before invoking helpers.

## `.agents` resolution (`docs-compile.sh`)

1. If `AGENTS_ROOT` is set: normalize to a directory whose basename is `.agents` (append `/.agents` when needed), verify it exists, then use it.
2. Else: walk parents of `PWD` until a directory containing `.agents/` is found.

On failure the script prints to stderr and exits **1**.

## Subprocess order

After `cd` to `repo_root`:

1. If `.agents/skills/docs-compile/scripts/generate-durable-indexes.py` exists, run it with **no extra arguments** (default `--agents-root` inside that script is `./.agents` relative to cwd, i.e. this repo’s `.agents`).

If a helper is missing, the shell prints a skip message and continues. Successful completion prints `docs-compile: done.`

## `generate-durable-indexes.py` (direct invocation)

| Flag                  | Behavior                                                     |
| --------------------- | ------------------------------------------------------------ |
| `--agents-root PATH`  | Base `.agents` dir for default targets (default `./.agents`) |
| `--target` / `-t DIR` | Repeatable; regenerate only `DIR/index.md`                   |
| `--dry-run`           | Print actions only; exit **2** if any index would change     |

Default behavior (no `--target`): every **immediate subdirectory** of `<agents-root>/docs/` that exists gets an `index.md` regenerated from sibling `*.md` entry files (see script docstring). Requires **Python 3.9+** and **PyYAML**.

## Outputs

| Artifact                                             | Writer                                                                        |
| ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| `<section>/index.md` under `.agents/docs/<section>/` | `generate-durable-indexes.py`                                                 |
