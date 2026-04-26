# Pre-Publish Readiness

Use before publishing, tagging, or handing this starter kit to another repo.

## Steps

1. Run the deterministic publish checker from anywhere in the repository: `bash scripts/check-publish.sh`.
2. Treat a non-zero exit as blocking. Fix invalid structure, broken links, tracked session artifacts, or Markdown formatting before publishing.
3. Review warnings manually. Leakage scan hits are not automatic failures; the scan is intentionally narrow and is only a backstop for obvious starter-repo leakage, credentials, or local machine paths.
4. When only validating a copied knowledge layer, run the portable structure check directly: `bash scripts/check-agents-structure.sh .agents`. After regenerating or hand-editing the full kit snapshot, optionally run `bash scripts/check-agents-structure.sh example/.agents` and treat any session-tracking mismatch as a known gap until the script and `example/` layout agree.
5. Confirm ignored session bundles are local evidence only. For each validated tree, the only tracked file under `sessions/` should be `sessions/README.md`.
6. Review the printed `.agents/` file list. It should contain only the distributable kit for this layout: portable `skills/` and the task-closeout example bundle files (plus shared docs and playbooks as shipped).
7. If root `.agents/` changed, decide whether the same change belongs in the portable kit contract versus maintainer-only dogfood (for example `.agents/docs/plans/`). Consumer-generic behavior belongs in shared skills and docs; keep maintainer workflow notes in maintainer-facing paths unless you intend to promote them.
8. When `.agents/docs/` durable entries changed and the optional `docs-compile` skill is installed, run `python .agents/skills/docs-compile/scripts/docs-compile.py` (see [`.agents/skills/docs-compile/SKILL.md`](../skills/docs-compile/SKILL.md)) so optional durable indexes and docs-search cache stay aligned before lint or publish.
9. Run `docs-lint` periodically, and before publishing after several agent-assisted edits, to find duplicated, stale, contradictory, oversized, or misplaced durable knowledge.
10. Inspect `git status --short` and `git diff` before tagging or publishing.

## Expected output

- Structure checks pass for root `.agents/` (this is what `scripts/check-publish.sh` runs automatically).
- Session tracking reports only `sessions/README.md` inside the validated `.agents/` tree.
- Ignored session bundles may appear under `.agents/sessions/`; they should remain ignored.
- JSON structure validation, Remark, and Markdown link checks pass when their tools are installed.
- Leakage scans either produce no hits or only high-signal hits that are intentional after manual review.

## Optional tools

The script skips optional checks when local tools are unavailable:

- `jq` for JSON validation in the portable structure checker
- `npx` with locally available `remark` (`remark-cli` + `remark-frontmatter` + `remark-gfm`) for Markdown formatting and style checks
- `npx` with locally available `markdown-link-check` for link validation
- `rg` (ripgrep) for leakage scans

`jq` and `rg` are system CLIs, not npm tools in this repo's workflow. Keep them installed via your OS package manager (for example `apt`, `brew`, `choco`, `winget`) for predictable behavior in shell scripts.

If `jq` is unavailable, equivalent JSON validation can be done with `node -e "JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8'))" <file>`, but the publish scripts intentionally key off `jq`.

If `rg` is unavailable, `grep -R` is a partial fallback for leakage scans, but expect slower scans and less precise ignore/glob handling.

Install or otherwise make skipped tools available before a release-quality publish pass.

The publish script passes `--alive 200,0` to `markdown-link-check` so restricted or offline environments do not fail every external URL with status `0`. Local relative links still need to pass, and maintainers should manually review external documentation links before publishing integration-guide changes.

## Review guidance

Portable skills and shared docs under `.agents/` should read as if installed in a consumer repo's `.agents/` directory. Remove or rewrite references that only make sense in this starter repo, such as dogfood-only helper workflows or session bundle history, unless they stay strictly outside published surfaces.

Leakage scans are not a substitute for reviewing the diff. They intentionally avoid broad terms such as `secret`, `token`, `maintainer`, `localhost`, and example session paths because this repo documents those concepts directly.

Root `.agents/` may mix portable kit content with maintainer-only material (for example under `.agents/docs/plans/`). Do not copy maintainer-only content into published artifacts (skill packaging, generated `example/.agents/`) unless it is part of the portable kit contract.

`scripts/check-agents-structure.sh` is the portable validator. It accepts a target directory (for example `.agents` or `example/.agents`) and checks the knowledge-layer shape without running this repo's README, root `docs/`, or publish leakage checks.

`scripts/check-publish.sh` is the starter-repo publish wrapper. It runs the portable validator on **root `.agents/` only**, then performs this repo's release hygiene checks (Markdown, links, leakage scans, and the printed `.agents/` file list).
