## 1. Convention documentation

- [ ] 1.1 Reconcile the lifecycle section of `openwiki/maintenance-format.md` to the `aksk_status` / `aksk_superseded_by` vocabulary and document the description-prefix + body-banner convention, and verify `grep -n "status: superseded" openwiki/maintenance-format.md` returns no hits while the frontmatter schemas still validate
- [ ] 1.2 Apply the convention to one real deprecated entry end-to-end (frontmatter keys, description prefix, body banner) and verify the page renders its state in the generated index after `node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs` without hand edits to any `index.md`

## 2. Lint enforcement

- [ ] 2.1 Extend the `docs-lint` stale-decision check so `aksk_status: superseded` requires the description prefix and body banner (and `aksk_superseded_by` where a successor exists), and verify a `docs-lint` pass flags a deliberately partial marking and passes once completed

## 3. Verification and closeout

- [ ] 3.1 Verify regeneration safety: run `node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs` twice and confirm the deprecation markers persist with `git diff --stat openwiki/*/index.md` showing only generator-normalized churn
- [ ] 3.2 Run a `docs-lint` pass and verify routing blocks, wiki-contract markers, and the new deprecation markings report no stale or contradictory knowledge
- [ ] 3.3 Run `bash scripts/check-publish.sh` and verify it passes (formatting, links, leakage scans)
- [ ] 3.4 Run `openspec validate --change formalize-superseded-obsolete` and verify all artifacts report done with no spec validation errors (note: `####` scenario headers and SHALL/MUST normative language required)
- [ ] 3.5 Run `task-closeout` to bundle the session, recording `formalize-superseded-obsolete` in the bundle's `summary.json` under `openspec_change`
- [ ] 3.6 Run `learning-distill` to promote the reconciled lifecycle vocabulary, and verify the decision index covers any new page with no index drift
