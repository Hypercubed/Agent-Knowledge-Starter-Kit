## 1. Documentation Updates

- [ ] 1.1 Update `.agents/docs/MAINTENANCE.md` to document the Triple-Lock convention for deprecating durable knowledge in `index.md` files (Section Heading, Textual Prefix, Markdown Strikethrough).
- [ ] 1.2 Update the vocabulary rules in `.agents/docs/MAINTENANCE.md` to explicitly distinguish between `status: superseded` for decisions and the `Obsolete` pattern for troubleshooting entries.

## 2. Validation & Closeout

- [ ] 2.1 Run `npx skills run docs-lint` to ensure the manual changes we just made to the indexes and decisions conform to general markdown hygiene and that no broken links were introduced.
- [ ] 2.2 Run `task-closeout` to capture session artifacts for this documentation update.
- [ ] 2.3 Run `learning-distill` to promote any reusable patterns or durable rationale discovered during this formalization process.
