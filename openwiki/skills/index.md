# Files

- [docs-compile Skill](docs-compile.md) - Two-script Python pipeline that regenerates section index.md files under .agents/docs/ from entry frontmatter while preserving human-curated content above the ## Index marker.
- [docs-lint Skill](docs-lint.md) - Checklist-driven periodic pass over the .agents/ knowledge layer for duplication, contradictions, staleness, oversized guidance, index gaps, and frontmatter contract violations.
- [docs-search Skill](docs-search.md) - Layered-fallback search over durable .agents/ markdown (ripgrep, git grep, grep, Python) with frontmatter-aware result metadata and override-first root resolution.
- [generate-example and Validation Scripts](generate-example-and-scripts.md) - The internal generate-example skill and run.sh that rebuilds the example/ consumer illustration, plus the check-agents-structure.sh validator and check-publish.sh release wrapper.
- [learning-distill Skill](learning-distill.md) - Converts a gitignored session bundle into durable .agents/ knowledge via classification, duplication checks, minimal edits, log.md append, and index refresh.
- [task-closeout Skill](task-closeout.md) - Captures a finished, blocked, or abandoned task into a five-file temporary session bundle under .agents/sessions/ with canonical task_id identity in summary.json.
