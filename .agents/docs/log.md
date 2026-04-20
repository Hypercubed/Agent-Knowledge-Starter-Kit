# Knowledge Maintenance Log

### \[2026-04-19] learning-distill | t-20260419-knowledge-layer-metadata-plans-decisions, t-20260419-204841-plan-scaffold-closeout

Outcome: updated Files: `.agents/AGENTS.md`; `.agents/docs/troubleshooting/session-discovery-fails-during-distillation-or-closeout.md`; `.agents/docs/log.md`; `.agents/sessions/20260419-190500-knowledge-layer-layout/summary.json`; `.agents/sessions/20260419-204841-plan-scaffold-closeout/summary.json` Accepted: 2 (troubleshooting: gitignored `.agents/sessions/` can make ignore-aware search look empty; AGENTS: plan-only `.agents/plans/` must not drive skill or shipped-behavior edits until implementation is requested) Rejected: 3 (extra consumer-kit decision for excluding `plans/` — already covered in `.agents/docs/index.md`; knowledge-layer bootstrap/rename playbook and git-diff closeout path hints already covered elsewhere or embodied in skills) Notes: Re-checked sessions with gitignored paths visible; two previously undistilled bundles processed.

### \[2026-04-19] learning-distill | t-20260419-172217-remark-md-fix

Outcome: updated Files: `.agents/AGENTS.md`; `.agents/docs/troubleshooting/remark-or-bulk-markdown-rewrite-unwanted-paths.md`; `.agents/docs/troubleshooting/index.md`; `.agents/docs/log.md`; `.agents/sessions/20260419-172217-remark-md-fix/summary.json` Accepted: 2 (AGENTS pitfall for scoped `git restore` after mass Markdown format; troubleshooting pattern for wide remark runs and accidental unrelated restores) Rejected: 0 Notes: Session evidence medium-confidence on narrative details; durable guidance kept mechanical and path-scoped.

### \[2026-04-19] learning-distill | t-20260419-230724-v2-kit-closeout

Outcome: no net durable edits Files: `.agents/docs/log.md`; `.agents/sessions/20260419-230724-v2-kit-closeout/summary.json` Accepted: 0 Rejected: 4 (AGENTS already updated in task; link-check-after-delete operational; optional triple-`MAINTENANCE` playbook line and “bootstrap copies track root policy” decision deferred as low urgency) Notes: v2 kit polish closeout; reusable git-index hygiene before `git ls-files`-based checks remains ephemeral unless adopters hit it repeatedly.

### \[2026-04-19] learning-distill | t-20260419-164303-knowledge-layer-hygiene

Outcome: no net durable edits Files: `.agents/docs/log.md`; `.agents/sessions/20260419-164303-knowledge-layer-hygiene/summary.json` Accepted: 0 Rejected: 0 Notes: Closeout already promoted hygiene (sample `decisions/` / `troubleshooting/`, `check-publish.sh`, scoped replace) into MAINTENANCE and pitfalls into AGENTS; same-day log rows cover substantive edits.

### \[2026-04-19] maintenance | remove-layout-v2-labeling

Outcome: updated Files: `.agents/docs/index.md`; `.agents/docs/MAINTENANCE.md`; `.agents/docs/troubleshooting/github-copilot-chat-context-not-in-focus.md`; `README.md`; `.agents/skills/learning-distill/bootstrap/docs/index.md`; `.agents/skills/knowledge-lint/bootstrap/docs/index.md`; `example/.agents/docs/index.md`; `example/.agents/skills/learning-distill/bootstrap/docs/index.md`; `example/.agents/skills/knowledge-lint/bootstrap/docs/index.md`; `.agents/plans/wiki-system.md`; `.agents/docs/log.md` Classification: drop “layout v2” framing and monolith migration narrative from normative docs; describe current directory layout only Disposition: accepted Notes: Older `log.md` rows may still mention layout v2 by name.

### \[2026-04-19] maintenance | bulk-replace-prevention

Outcome: updated Files: `.agents/AGENTS.md`; `.agents/docs/MAINTENANCE.md`; `.agents/skills/knowledge-lint/SKILL.md`; `scripts/check-publish.sh`; `.agents/docs/log.md` Classification: document why knowledge-lint does not catch naive token replace; add mechanical doubled-path check and editing hygiene Disposition: accepted Notes: `check-publish.sh` now fails when `rg` finds the literal doubled kit path segment under README, INSTALL, docs, and `.agents/` (AGENTS and MAINTENANCE describe the hazard without embedding that substring so the scan stays clean).

### \[2026-04-19] maintenance | rename-troubleshooting-example-vs-root

Outcome: updated Files: `.agents/docs/troubleshooting/comparing-example-agents-to-root-agents.md` (renamed from `comparing-agents-to-agents-in-this-starter-repo.md`); `.agents/docs/troubleshooting/index.md`; `.agents/docs/log.md` Classification: slug and `id` now match the topic (`example/.agents/` vs root `.agents/`) Disposition: accepted Notes: Historical log lines may still cite the old filename.

### \[2026-04-19] maintenance | troubleshooting-layout-v2-pass

Outcome: updated Files: `.agents/docs/troubleshooting/antigravity-lessons-learned-aren-t-visible-to-teammate-s-agents.md`; `.agents/docs/troubleshooting/gemini-cli-not-following-durable-guidance.md`; `.agents/docs/troubleshooting/github-copilot-chat-context-not-in-focus.md`; `.agents/docs/troubleshooting/hermes-agent-specific-dual-skill-namespace-skill-view-returns-wrong-file.md`; `.agents/docs/troubleshooting/comparing-agents-to-agents-in-this-starter-repo.md`; `.agents/docs/log.md` Classification: align guidance with knowledge layout v2 and current repo decisions; disambiguate Hermes skill namespaces from single-tree kit Disposition: accepted Notes: No index row changes; no entries removed as obsolete.

### \[2026-04-19] maintenance | decisions-prune

Outcome: updated Files: `.agents/docs/decisions/index.md`; `.agents/docs/decisions/single-tree-architecture-agents.md`; `.agents/docs/troubleshooting/maintainer-skill-lives-under-agents-skills-by-mistake.md`; `.agents/docs/decisions/maintainer-skills-mark-internal-in-frontmatter.md` (new); `.agents/docs/decisions/regenerate-example-when-portable-kit-changes.md` (new); `.agents/docs/log.md` Classification: removed superseded or obsolete decisions (dual-tree historical, kit-contract/scaffold-era, maintainer-only-outside-agents, portable-content scaffold framing, sync-after-scaffold); added decisions for `internal` maintainer skills and regenerating `example/` Disposition: accepted Notes: Deleted prior markdown files for removed decisions from `.agents/docs/decisions/`; single-tree entry now points at the two replacement decisions.

### \[2026-04-19] maintenance | docs-index-and-single-tree-audit

Outcome: updated Files: `.agents/docs/index.md`; `.agents/docs/decisions/index.md`; `.agents/docs/troubleshooting/index.md`; `.agents/docs/decisions/scaffold-content-stays-consumer-generic.md`; `.agents/docs/decisions/sync-root-agents-skills-after-scaffold-skill-edits.md`; `.agents/docs/decisions/maintainer-only-skills-and-scripts-never-live-under-agents.md`; `.agents/docs/decisions/dual-agents-path-vs-agents-dogfood-historical.md`; `.agents/docs/decisions/single-tree-architecture-agents.md`; `.agents/docs/decisions/kit-contract-policy-changes-must-update-agents-too.md`; `.agents/docs/troubleshooting/comparing-agents-to-agents-in-this-starter-repo.md`; `.agents/docs/troubleshooting/maintainer-skill-lives-under-agents-skills-by-mistake.md`; `.agents/skills/learning-distill/bootstrap/docs/index.md`; `.agents/skills/knowledge-lint/bootstrap/docs/index.md`; `.agents/skills/knowledge-lint/SKILL.md`; `.agents/docs/log.md` Classification: index coverage (layout v2, playbooks, skills, agents, root docs, integrations); stale dual-tree and `scaffold/` guidance removed from durable decisions and troubleshooting Disposition: accepted Notes: Historical `scaffold/` references remain only where explicitly historical; `example/.agents/` described as generated illustration, not a second canonical tree. Regenerated `example/` via `generate-example/run.sh`.

### \[2026-04-19] knowledge-lint | periodic-pass

Outcome: cleanup Files: `.agents/docs/index.md`; `.agents/docs/log.md` Classification: index coverage (playbooks README + portable kit skills listed); no AGENTS or playbook edits Disposition: accepted Notes: knowledge-lint pass after layout v2; indexes and `id`/filename slugs verified; no broken links in decisions or troubleshooting indexes.

### \[2026-04-19] maintenance | knowledge-layout-v2-phase0

Outcome: migrated Files: `.agents/docs/decisions/` (new directory, per-decision markdown + indexes); `.agents/docs/troubleshooting/` (new directory, per-pattern markdown + indexes); removed `.agents/docs/repo-decisions.md` and `.agents/docs/troubleshooting.md`; `.agents/docs/index.md`; `.agents/docs/MAINTENANCE.md`; `README.md`; `INSTALL.md`; `docs/architecture.md`; `.agents/AGENTS.md`; `.agents/skills/learning-distill/` (SKILL + bootstrap); `.agents/skills/knowledge-lint/` (SKILL + bootstrap); `.agents/skills/generate-example/run.sh`; selected `.agents/plans/*.md`; regenerated `example/` Accepted: — Rejected: — Notes: Knowledge layout v2 — minimal frontmatter (`id`, `title`, `last_updated`) on each entry file; historical log lines above unchanged.

### \[2026-04-19] learning-distill | t-20260419-151439-learning-distill-discovery-failure

Outcome: updated Files: `.agents/docs/troubleshooting.md`; `.agents/docs/log.md`; `.agents/sessions/20260419-151439-learning-distill-discovery-failure/summary.json` Accepted: 1 (added troubleshooting note for structure-aware session discovery to avoid missing undistilled bundles) Rejected: 3 (no AGENTS.md rule, repo decision, or playbook change warranted for what is essentially operational tool usage failure) Notes: Distilled learning-distill discovery failure session; added a troubleshooting entry on how to correctly enumerate session bundles before concluding the directory is empty.

### \[2026-04-19] learning-distill | t-20260419-150446-remove-scaffold-tree

Outcome: updated Files: `.agents/docs/repo-decisions.md`; `.agents/docs/log.md`; `.agents/sessions/20260419-150446-remove-scaffold-tree/summary.json` Accepted: 2 (single-tree architecture repo decision; replace smoke test with generate-example playbook) Rejected: 0 Notes: Distilled the session removing the dual-tree scaffold. Playbook and index were already updated in the task itself; recorded the decision formally in repo-decisions.md.

### \[2026-04-19] learning-distill | t-20260419-134800-task-closeout

Outcome: updated Files: `.agents/docs/troubleshooting.md`; `.agents/docs/log.md`; `.agents/sessions/20260419-134800-task-closeout/summary.json` Accepted: 1 (use `git log` / `git diff --name-only` to enumerate paths when the tree is clean before closeout) Rejected: 3 (adopter vs maintainer `skills`/`-y` audience labeling already in root install docs and sync skill; shell/yargs noise ephemeral; no AGENTS, repo-decision, or playbook change warranted) Notes: Distilled wip-v2 maintainer closeout after install/publish/tooling work.

### \[2026-04-13] learning-distill | t-20260413-140000-copilot-integration-guide

Outcome: updated Files: `.agents/docs/troubleshooting.md`; `.agents/docs/repo-decisions.md`; `.agents/docs/log.md`; `.agents/sessions/20260413-140000-copilot-integration-guide/summary.json` Accepted: 2 (Copilot Chat context troubleshooting entry; GitHub Copilot as Rules-Based IDE Wiring architectural decision) Rejected: 2 (`.agents/AGENTS.md` update absent — integration guides are tool-specific, not repo-wide guidance; nested `.agents/` visibility caveat already present in patterns.md) Notes: Distilled Copilot integration guide closeout; promoted Copilot-specific troubleshooting entry and architectural classification decision; kept guide-specific details and two-tool workflow examples in `docs/integrations/copilot.md`.

### \[2026-04-13] learning-distill | t-20260412-232119-integration-consolidation

Outcome: updated Files: `.agents/playbooks/writing-integration-guides.md`; `.agents/playbooks/pre-publish.md`; `.agents/docs/repo-decisions.md`; `.agents/docs/log.md`; `.agents/sessions/20260412-232119-integration-consolidation/summary.json` Accepted: 3 (shared integration patterns page decision; integration-guide playbook quick-reference guidance; manual Prettier command should match `--prose-wrap never`) Rejected: 2 (`.agents/AGENTS.md` update absent; closeout folder sandbox escalation treated as existing Codex `.agents/` write troubleshooting) Notes: Distilled integration consolidation closeout; kept durable updates focused on future integration-guide maintenance.

### \[2026-04-13] learning-distill | t-20260413-045938-warp-integration-guide

Outcome: updated Files: `.agents/docs/index.md`; `.agents/docs/log.md`; `.agents/sessions/20260413-045938-warp-integration-guide/summary.json` Accepted: 1 (maintainer knowledge index should keep root integration-guide coverage current as new guides are added) Rejected: 4 (no `.agents/AGENTS.md`, troubleshooting, repo decision, or playbook changes warranted) Notes: Distilled Warp integration guide closeout; durable update was limited to the index pointer and distillation metadata.

### \[2026-04-13] learning-distill | t-20260413-044145-opencode-guide

Outcome: updated Files: `.agents/playbooks/writing-integration-guides.md`; `.agents/docs/log.md`; `.agents/sessions/20260413-044145-opencode-integration/summary.json` Accepted: 1 (if a tool already discovers `.agents/skills/` natively, integration guides should keep those skills canonical and use tool-local command wrappers only as thin convenience aliases) Rejected: 3 (no `.agents/AGENTS.md` update; no troubleshooting entry; no repo decision beyond existing routing/canonical-source rules) Notes: Distilled the OpenCode integration guide closeout; promoted one small playbook clarification and kept product-specific OpenCode behavior in `docs/integrations/opencode.md`.

### \[2026-04-12] learning-distill | t-20260412-193758-kilo-session-guide, t-20260412-215500-add-agent-ids

Outcome: updated Files: `.agents/playbooks/writing-integration-guides.md`; `.agents/docs/log.md`; `.agents/sessions/20260412-193758-kilo-session-guide/summary.json`; `.agents/sessions/20260412-215500-add-agent-ids/summary.json` Accepted: 2 (session metadata guidance must stay optional and source-supported; integration guides may document resume commands only when the tool exposes a stable supported workflow) Rejected: 2 (`.agents/AGENTS.md` broad rule not needed because task-closeout skill now carries the contract; separate repo decision duplicated existing verification/routing decisions) Notes: Distilled Kilo and Gemini/Codex session metadata closeouts; kept durable guidance in the integration-guide playbook and task-closeout skill.

### \[2026-04-12] learning-distill | t-20260412-190052-gemini-cli-integration

Outcome: updated Files: `.agents/playbooks/writing-integration-guides.md`; `.agents/docs/repo-decisions.md`; `.agents/docs/troubleshooting.md`; `.agents/docs/log.md`; `.agents/sessions/20260412-190052-gemini-cli-integration/summary.json` Accepted: 3 (formalized "Routing Pattern" for root bootstrap files; added repo decision for root routing files; added Gemini CLI-specific troubleshooting) Rejected: 1 (`.agents/AGENTS.md` update absent; preferred keeping guidance in playbook and decisions) Notes: Distilled Gemini CLI integration closeout. Formalized the "Routing Pattern" common to multiple agentic tools.

### \[2026-04-12] learning-distill | t-20260412-170915-publish-check-link-handling

Outcome: updated Files: `.agents/playbooks/pre-publish.md`; `.agents/docs/log.md`; `.agents/sessions/20260412-170915-publish-check-link-handling/summary.json` Accepted: 1 (pre-publish link checks should tolerate external status `0` in restricted environments while keeping local links blocking) Rejected: 2 (`.agents/AGENTS.md` and troubleshooting updates not warranted for a narrow publish-workflow lesson) Notes: Distilled publish checker closeout; durable guidance was kept in the pre-publish playbook.

### \[2026-04-12] learning-distill | knowledge-lint-20260412

Outcome: updated Files: `.agents/docs/troubleshooting.md`; `.agents/docs/log.md`; `.agents/sessions/20260412-162300-knowledge-lint-pass/summary.json` Accepted: 1 (Added troubleshooting entry for Windows-to-WSL Tool Path Failures) Rejected: 0 Notes: Distilled knowledge-lint session. Added a troubleshooting note to prevent agents struggling with Windows-WSL cross-environment file paths.

### \[2026-04-12] knowledge-lint

Outcome: cleanup Files: `.agents/docs/log.md`; `.agents/docs/index.md`; `.agents/docs/MAINTENANCE.md` Notes: Removed duplicate learning-distill entry for `log-safety-hardening` and a stray closing bracket. Documented the `.agents/plans/` directory in `index.md` and `MAINTENANCE.md` to address uncategorized knowledge and missing index coverage.

### \[2026-04-12] learning-distill | create-antigravity-integration

Outcome: updated Files: `.agents/docs/troubleshooting.md`; `.agents/docs/log.md`; `.agents/sessions/20260412-160900-antigravity-integration/summary.json` Accepted: 1 (added Antigravity KI troubleshooting to clarify local memory vs repo memory) Rejected: 0 Notes: Distilled Antigravity integration guide closeout. Added a troubleshooting entry explaining how Antigravity KIs differ from the exported session bundle memory.

### \[2026-04-12] learning-distill | t-20260412-214827-review-fixes

Outcome: no durable changes Files: `.agents/docs/log.md`; `.agents/sessions/20260412-214827-review-fixes/summary.json` Accepted: 0 Rejected: 2 (memory-workflow pattern is ephemeral; scaffold scope-check is duplicate of existing repo decision) Notes: Distilled post-review fixes closeout; both edits were minimal and follow existing decisions — nothing warranted promotion.

### \[2026-04-12] learning-distill | t-20260412-213033-claude-code-guide

Outcome: updated Files: `.agents/playbooks/writing-integration-guides.md`; `.agents/docs/log.md`; `.agents/sessions/20260412-213033-claude-code-integration/summary.json` Accepted: 1 (when writing an integration guide while running as the target tool, the writing session is the dogfood verification pass — note this in the guide and closeout) Rejected: 2 (dedicated-subsection pattern is ephemeral craft; atomic routing-doc update is already covered by playbook step 7) Notes: Distilled Claude Code integration guide closeout; one minimal playbook step 8 amendment; no AGENTS.md or troubleshooting changes warranted.

### \[2026-04-12] learning-distill | t-20260412-161547-log-safety-hardening

Outcome: updated Files: `.agents/docs/repo-decisions.md`; `.agents/playbooks/maintainer-adoption-closeout-distill.md`; `.agents/docs/log.md`; `.agents/sessions/20260412-161547-log-safety-hardening/summary.json` Accepted: 2 (kit-contract policy changes must update `.agents/` too; maintainer closeout checklist should verify dogfood-only vs kit-wide scope before task completion) Rejected: 2 (`.agents/AGENTS.md` update absent; troubleshooting candidate treated as process failure rather than recurring runtime issue) Notes: Distilled log-safety hardening closeout; promoted scope discipline into maintainer docs after the first pass initially missed scaffold copies.

### \[2026-04-12] learning-distill | t-20260412-155309-openclaw-guide-refinement

Outcome: updated Files: `.agents/playbooks/writing-integration-guides.md`; `.agents/docs/log.md`; `.agents/sessions/20260412-155309-openclaw-guide-refinement/summary.json` Accepted: 1 (after an integration guide first draft, do one realistic dogfood pass and add a short concrete workflow example if it improves the framing) Rejected: 2 (`.agents/AGENTS.md` update absent; repo decision candidate too process-local for `repo-decisions.md`) Notes: Distilled OpenClaw guide refinement closeout; promoted a small integration-guide playbook improvement and kept the product-specific example in `docs/integrations/openclaw.md`.

### \[2026-04-12] learning-distill | t-20260412-154653-openclaw-integration-guide

Outcome: updated Files: `.agents/playbooks/writing-integration-guides.md`; `.agents/docs/log.md`; `.agents/sessions/20260412-154653-openclaw-integration-guide/summary.json` Accepted: 1 (persistent-assistant integration guides should explicitly separate personal/runtime memory from repo-local durable knowledge) Rejected: 3 (`.agents/AGENTS.md` update absent; troubleshooting candidate not yet recurring; repo decision already covered by existing docs/integrations policy) Notes: Distilled OpenClaw integration guide closeout; kept durable change in the integration-writing playbook and left product-specific detail in `docs/integrations/openclaw.md`.

### \[2026-04-12] learning-distill | t-20260412-045044-review-followup-docs

Outcome: updated Files: `.agents/docs/repo-decisions.md`; `.agents/playbooks/maintainer-adoption-closeout-distill.md`; `.agents/docs/log.md`; `.agents/sessions/20260412-045044-review-followup-docs/summary.json` Accepted: 3 (`.agent/` typo AGENTS guidance already present; sync-after-scaffold-agent-or-skill-edits decision; maintainer playbook sync step) Rejected: 2 (troubleshooting entry until the sync omission recurs; extra docs about object-path shorthand beyond current identity wording fixes) Notes: Distilled review follow-up docs closeout; kept changes maintainer-local and did not alter scaffold during learning distillation.

### \[2026-04-12] learning-distill | t-20260411-195746-codex-integration

Outcome: updated Files: `.agents/playbooks/writing-integration-guides.md`; `.agents/docs/troubleshooting.md`; `.agents/docs/index.md`; `.agents/docs/log.md`; `.agents/sessions/20260411-195746-codex-integration/summary.json` Accepted: 3 (remove incidental template-tool references from integration guides; Codex `.agents/` write sandbox troubleshooting; index now names Codex among root integration guides) Rejected: 3 (`.agents/AGENTS.md` update absent; repo decision absent; Codex guide-specific verification details stay in `docs/integrations/codex.md`) Notes: Distilled Codex integration guide closeout; no `.agents/` changes because integration docs remain root user-facing docs.

### \[2026-04-12] learning-distill | t-20260412-014546-cursor-integration

Outcome: updated\
Files: `.agents/playbooks/writing-integration-guides.md`; `.agents/docs/index.md`; `.agents/docs/log.md`; `.agents/sessions/20260412-014546-cursor-integration/summary.json`\
Accepted: 2 (playbook section for IDE/rules-based integration patterns; index pointer to root `docs/integrations/`)\
Rejected: 3 (`.agents/AGENTS.md`, `.agents/docs/troubleshooting.md`, `.agents/docs/repo-decisions.md` — candidates absent or already covered by `docs/integrations/cursor.md` and existing decisions)\
Notes: Distilled Cursor integration task-closeout; medium-confidence “doc-verified vs in-app” caveat stays in the published guide, not duplicated here.

### \[2026-04-11] learning-distill | t-20260411-existing-agents-adoption-feedback, t-20260411-quickstart-install-docs

Outcome: updated\
Files: `.agents/docs/repo-decisions.md`; `.agents/docs/index.md`; `.agents/docs/log.md`; `.agents/sessions/20260411-145015-existing-agents-adoption/summary.json`; `.agents/sessions/20260411-145937-quickstart-install-docs/summary.json`\
Accepted: 2 (root docs are the home for kit installation guidance; index pointer to root `INSTALL.md`)\
Rejected: 4 (extra `.agents/AGENTS.md`, troubleshooting, and playbook updates; README/plan content was already present from the source tasks)\
Notes: Distilled two installation-doc bundles; kept copied `.agents/` content unchanged because setup guidance is about consuming the starter repo.

### \[2026-04-11] docs | quickstart-agent-install

Outcome: updated\
Files: `README.md`; `INSTALL.md`; `.agents/plans/consumer-upgrade-path.md`; `.agents/docs/log.md`\
Accepted: 3 (human quick start; agent prompt; detailed agent install guide)\
Rejected: 0\
Notes: Split README quick start by audience and moved detailed install mechanics into a root install guide.

### \[2026-04-11] docs | existing-agents-adoption-feedback

Outcome: updated\
Files: `README.md`; `.agents/plans/consumer-upgrade-path.md`; `.agents/docs/log.md`\
Accepted: 5 (existing `.agents/` merge checklist; `.agents/.gitignore` as sufficient default with root `.gitignore` fallback; root `AGENTS.md` vs `.agents/AGENTS.md` relationship; adoption log/decision recommendation; index update reminder for pre-existing rules/playbooks/skills)\
Rejected: 0\
Notes: Incorporated adopter feedback directly in README and kept the broader consumer upgrade plan open for a possible dedicated scaffold doc.

### \[2026-04-11] learning-distill | t-20260411-203100-scaffold-sync

Outcome: updated\
Files: `.agents/docs/repo-decisions.md`; `.agents/docs/troubleshooting.md`; `.agents/playbooks/maintainer-adoption-closeout-distill.md`; `.agents/docs/index.md`; `.agents/docs/log.md`; `.agents/sessions/20260411-203100-scaffold-sync-closeout/summary.json`\
Accepted: 3 (maintainer-only skills never in `.agents/` decision; wrong-placement troubleshooting; playbook + index pointers to selective sync skill)\
Rejected: 1 (extra `.agents/AGENTS.md` bullet — already covered by existing “Skills” line)\
Notes: Distilled scaffold sync closeout; sync mechanics stay in skill + `sync.sh`.

### \[2026-04-11] knowledge-lint

Outcome: updated\
Files: `.agents/AGENTS.md`; `.agents/docs/repo-decisions.md`; `.agents/docs/index.md`; `.agents/docs/log.md`; `.agents/AGENTS.md`; `README.md`; `.agents/skills/knowledge-lint/SKILL.md`; `.agents/skills/learning-distill/SKILL.md`; `.agents/skills/knowledge-lint/SKILL.md`; `.agents/skills/learning-distill/SKILL.md`\
Notes: Fixed playbook path everywhere (`playbooks/` vs `docs/playbooks/`); aligned sessions bullet with MAINTENANCE; deduped `prior_session` consequences vs troubleshooting; clarified index playbooks location.

### \[2026-04-11] learning-distill | t-20260411-185459-orchestrator, t-20260411-190655-sessions-readme

Outcome: updated\
Files: `.agents/docs/repo-decisions.md`; `.agents/docs/troubleshooting.md`; `.agents/docs/MAINTENANCE.md`; `.agents/docs/index.md`; `.agents/playbooks/maintainer-adoption-closeout-distill.md`; `.agents/docs/log.md`; `.agents/sessions/20260411-185459-orchestrator-closeout/summary.json`; `.agents/sessions/20260411-190655-sessions-readme/summary.json`\
Accepted: 7 (`prior_session` convention, sessions README + gitignore rationale, overlapping-bundle distill guidance, gitignore mismatch symptom/fix, MAINTENANCE sessions wording, maintainer checklist playbook, index playbook link)\
Rejected: 0\
Notes: Distilled orchestrator closeout and sessions README sessions; no `.agents/AGENTS.md` change (candidates optional or already covered).

### \[2026-04-11] policy | scaffold-vs-agents

Outcome: updated\
Files: `.agents/*` (reverted generic templates); `.agents/AGENTS.md`; `.agents/docs/repo-decisions.md`; `.agents/docs/troubleshooting.md`; `.agents/docs/index.md`; `.agents/docs/log.md`; removed `playbooks/refresh-dot-agents-from-scaffold.md`\
Accepted: 1 (scaffold stays consumer-generic; `.agents/` may diverge)\
Rejected: prior “keep scaffold aligned with `.agents/`” approach\
Notes: Scaffold should not encode starter-repo dogfood; maintainer knowledge lives under `.agents/` and README only.

### \[2026-04-11] learning-distill | t-20260411-185215-dogfood

Outcome: updated\
Files: `.agents/AGENTS.md`; `.agents/docs/repo-decisions.md`; `.agents/docs/troubleshooting.md`; `.agents/playbooks/refresh-dot-agents-from-scaffold.md`; `.agents/docs/index.md`; `.agents/docs/log.md`\
Accepted: 5 (dual-tree ops guidance, repo decision, drift troubleshooting, refresh playbook, index pointer)\
Rejected: 0\
Notes: Distilled dogfood adoption session; documented scaffold vs `.agents/` and refresh procedure.

### \[2026-04-12] learning-distill | t-20260412-003934-hermes-integration-review

Outcome: updated\
Files: `.agents/docs/repo-decisions.md`; `.agents/docs/troubleshooting.md`; `.agents/docs/index.md`; `.agents/docs/log.md`; `.agents/playbooks/writing-integration-guides.md`; `.agents/plans/add-integrations.md`; `README.md`; `docs/integrations/README.md`; `docs/integrations/hermes.md`; `.agents/sessions/20260412-003934-hermes-integration-review/summary.json`\
Accepted: 5 (move Hermes guide into `docs/integrations/`; verify dual-skill-namespace warning; narrow earlier broad Hermes file-tool claims; strengthen integration-guides playbook with explicit verification; update add-integrations plan to reflect verified Hermes findings)\
Rejected: 1 (treating earlier file-tool failures as a general Hermes limitation)\
Notes: Distilled the Hermes integration review session; evidence points primarily to a weak model plus a real Hermes-vs-repo skill-namespace gotcha, not to a broad repo-setup failure.

### \[2026-04-12] learning-distill | t-20260411-201214-kilo-code-integration

Outcome: updated Files: `.agents/playbooks/writing-integration-guides.md`; `.agents/docs/log.md`; `.agents/sessions/20260411-201214-kilo-code-integration/summary.json` Accepted: 1 (integration-guide changes should update root README, integrations index, and maintainer tracker together) Rejected: 3 (no `.agents/AGENTS.md` update; Kilo-specific troubleshooting/bootstrap guidance stayed out due to doc-based, not hands-on, evidence; repo decision duplicated existing `docs/integrations/` policy) Notes: Distilled the Kilo Code integration doc task; kept durable changes repo-level and avoided promoting low-confidence Kilo-specific behavior claims.

## Template

### \[YYYY-MM-DD] learning-distill | <task-id>

Outcome: updated Files: `.agents/AGENTS.md`; `.agents/docs/log.md` Accepted: 0 Rejected: 0 Notes: brief summary

### \[YYYY-MM-DD] knowledge-lint

Outcome: cleanup Files: `.agents/AGENTS.md`; `.agents/docs/log.md` Notes: brief summary
