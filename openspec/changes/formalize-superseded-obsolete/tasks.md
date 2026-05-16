## 1. Documentation Updates

- [ ] 1.1 Update `.agents/docs/MAINTENANCE.md` to document the Triple-Lock convention for deprecating durable knowledge in `index.md` files (Section Heading, Textual Prefix, Markdown Strikethrough).
- [ ] 1.2 Update the vocabulary rules in `.agents/docs/MAINTENANCE.md` to explicitly distinguish between `status: superseded` for decisions and the `Obsolete` pattern for troubleshooting entries.
- [ ] 1.3 Update `.agents/skills/docs-compile/scripts/generate-durable-indexes.py` to natively support the Triple-Lock convention, ensuring it retains `## Superseded` and `## Obsolete` sections and applies the correct textual prefixes and strikethroughs based on file metadata.

## 2. Validation & Closeout

- [x] 2.1 Run `npx skills run docs-lint` to ensure the manual changes we just made to the indexes and decisions conform to general markdown hygiene and that no broken links were introduced.
- [x] 2.2 Run `task-closeout` to capture session artifacts for this documentation update.
- [x] 2.3 Run `learning-distill` to promote any reusable patterns or durable rationale discovered during this formalization process.
