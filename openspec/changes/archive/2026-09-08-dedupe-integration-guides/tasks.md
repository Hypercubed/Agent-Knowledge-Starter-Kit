## 1. Canonical block

- [x] 1.1 Align `docs/integrations/patterns.md`'s `## Adopting the kit` section so it carries the canonical sentence verbatim ("Install starter skills in the target repo with `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit`, then run each installed skill's initialization from its `SKILL.md` (see `INSTALL.md`)"); verify the sentence exists in `patterns.md` exactly once and the `#adopting-the-kit` anchor resolves.

## 2. Product page updates

- [x] 2.1 Replace Setup step 1 in `antigravity.md`, `claude-code.md`, `copilot.md`, `cursor.md`, `gemini-cli.md`, `hermes.md`, `kilo-code.md`, `openclaw.md`, `opencode.md`, `warp.md`, and `zo-computer.md` with a one-line link to `./patterns.md#adopting-the-kit`; verify `grep -c "Install starter skills in the target repo"` returns 0 for each of these files and each still opens with the shared-model link.
- [x] 2.2 Update `codex.md`'s Setup step 1 to the canonical link plus a retained tool-specific line documenting the `-g -a <self-reported>` install form, Codex's native `~/.agents/skills` discovery, and the "extra `-a <other>`/`--all` only when asked" clause; verify the Codex native-discovery sentence still exists in the file.
- [x] 2.3 Align `agentic-sandbox.md`'s Setup step 1 to the same canonical link (it currently paraphrases); verify it links `patterns.md#adopting-the-kit` and its sandbox-specific steps 2-3 are untouched.
- [x] 2.4 Leave `openspec.md` structurally untouched; verify only its Setup-step references change if at all, and its `## 0. Prerequisites` / `## 1. Setup and Configuration` shape is intact (the `openspec-integration` spec requires the guide to remain).

## 3. Index pointer

- [x] 3.1 Trim the "Preferred path" paragraph in `docs/integrations/README.md` to a short pointer at `INSTALL.md`'s "Agent-assisted via aksk-bootstrap (preferred)" lane ladder and the `aksk-bootstrap` SKILL.md, keeping the "per-tool guides are the manual fallback" framing; verify the README no longer inlines the `bootstrap.mjs [repo-root]` invocation or the receipt-partitioned spread command list, and that "Choose Your Pattern" and "Available guides" lists are unchanged.

## 4. Regression guard

- [x] 4.1 Extend the duplication content check in `.agents/skills/docs-lint/SKILL.md` to flag any `docs/integrations/` product page whose Setup step 1 inlines the canonical adopt-the-kit sentence instead of linking `patterns.md#adopting-the-kit`; verify the check description names the exact grep pattern and stays in the report/suggest (non-failing) scope.
- [x] 4.2 Update `.agents/playbooks/writing-integration-guides.md` step 5 and the "Don't repeat shared" pitfall to name `patterns.md#adopting-the-kit` as the canonical block product pages must link; verify the playbook reads consistently with the new rule.

## 5. Verification and closeout

- [x] 5.1 Verify single-source counts: `grep -rn "Install starter skills in the target repo with" docs/integrations/` returns exactly one hit (in `patterns.md`) and no product page contains the sentence; `grep -c "adopting-the-kit"` returns >= 1 per updated page.
- [x] 5.2 Verify `bash scripts/check-publish.sh` passes (remark formatting, markdown links including the new `#adopting-the-kit` anchors, leakage scans, doubled-path hygiene).
- [x] 5.3 Run a `docs-lint` pass; verify routing blocks and the wiki contract are intact and the new duplication check reports no inlined adopt-the-kit prose.
- [x] 5.4 Verify `openspec validate dedupe-integration-guides --type change` (or `openspec status --change dedupe-integration-guides` as the final check) reports all artifacts done, with the `specs` artifact correctly skipped via `skip_specs: true`.
- [x] 5.5 Run `task-closeout` to bundle the session and `learning-distill` to promote any durable lesson (this change implements the existing `shared-integration-patterns-belong-in-docs-integrations-patterns-md` decision, so no new decision page is expected unless the pass surfaces one); record `openspec_change: dedupe-integration-guides` in the bundle's `summary.json`.