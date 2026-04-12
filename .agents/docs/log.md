# Knowledge Maintenance Log


=======
### [2026-04-12] learning-distill | t-20260412-161547-log-safety-hardening
Outcome: updated
Files: `.agents/docs/repo-decisions.md`; `.agents/playbooks/maintainer-adoption-closeout-distill.md`; `.agents/docs/log.md`; `.agents/sessions/20260412-161547-log-safety-hardening/summary.json`
Accepted: 2 (kit-contract policy changes must update `scaffold/` too; maintainer closeout checklist should verify dogfood-only vs kit-wide scope before task completion)
Rejected: 2 (`.agents/AGENTS.md` update absent; troubleshooting candidate treated as process failure rather than recurring runtime issue)
Notes: Distilled log-safety hardening closeout; promoted scope discipline into maintainer docs after the first pass initially missed scaffold copies.]

### [2026-04-12] learning-distill | t-20260412-155309-openclaw-guide-refinement
Outcome: updated
Files: `.agents/playbooks/writing-integration-guides.md`; `.agents/docs/log.md`; `.agents/sessions/20260412-155309-openclaw-guide-refinement/summary.json`
Accepted: 1 (after an integration guide first draft, do one realistic dogfood pass and add a short concrete workflow example if it improves the framing)
Rejected: 2 (`.agents/AGENTS.md` update absent; repo decision candidate too process-local for `repo-decisions.md`)
Notes: Distilled OpenClaw guide refinement closeout; promoted a small integration-guide playbook improvement and kept the product-specific example in `docs/integrations/openclaw.md`.


### [2026-04-12] learning-distill | t-20260412-154653-openclaw-integration-guide
Outcome: updated
Files: `.agents/playbooks/writing-integration-guides.md`; `.agents/docs/log.md`; `.agents/sessions/20260412-154653-openclaw-integration-guide/summary.json`
Accepted: 1 (persistent-assistant integration guides should explicitly separate personal/runtime memory from repo-local durable knowledge)
Rejected: 3 (`.agents/AGENTS.md` update absent; troubleshooting candidate not yet recurring; repo decision already covered by existing docs/integrations policy)
Notes: Distilled OpenClaw integration guide closeout; kept durable change in the integration-writing playbook and left product-specific detail in `docs/integrations/openclaw.md`.

### [2026-04-12] learning-distill | t-20260412-161547-log-safety-hardening
Outcome: updated
Files: `.agents/docs/repo-decisions.md`; `.agents/playbooks/maintainer-adoption-closeout-distill.md`; `.agents/docs/log.md`; `.agents/sessions/20260412-161547-log-safety-hardening/summary.json`
Accepted: 2 (kit-contract policy changes must update `scaffold/` too; maintainer closeout checklist should verify dogfood-only vs kit-wide scope before task completion)
Rejected: 2 (`.agents/AGENTS.md` update absent; troubleshooting candidate treated as process failure rather than recurring runtime issue)
Notes: Distilled log-safety hardening closeout; promoted scope discipline into maintainer docs after the first pass initially missed scaffold copies.


### [2026-04-12] learning-distill | t-20260412-045044-review-followup-docs
Outcome: updated
Files: `.agents/docs/repo-decisions.md`; `.agents/playbooks/maintainer-adoption-closeout-distill.md`; `.agents/docs/log.md`; `.agents/sessions/20260412-045044-review-followup-docs/summary.json`
Accepted: 3 (`.agent/` typo AGENTS guidance already present; sync-after-scaffold-agent-or-skill-edits decision; maintainer playbook sync step)
Rejected: 2 (troubleshooting entry until the sync omission recurs; extra docs about object-path shorthand beyond current identity wording fixes)
Notes: Distilled review follow-up docs closeout; kept changes maintainer-local and did not alter scaffold during learning distillation.

### [2026-04-12] learning-distill | t-20260411-195746-codex-integration
Outcome: updated
Files: `.agents/playbooks/writing-integration-guides.md`; `.agents/docs/troubleshooting.md`; `.agents/docs/index.md`; `.agents/docs/log.md`; `.agents/sessions/20260411-195746-codex-integration/summary.json`
Accepted: 3 (remove incidental template-tool references from integration guides; Codex `.agents/` write sandbox troubleshooting; index now names Codex among root integration guides)
Rejected: 3 (`.agents/AGENTS.md` update absent; repo decision absent; Codex guide-specific verification details stay in `docs/integrations/codex.md`)
Notes: Distilled Codex integration guide closeout; no `scaffold/` changes because integration docs remain root user-facing docs.

### [2026-04-12] learning-distill | t-20260412-014546-cursor-integration
Outcome: updated  
Files: `.agents/playbooks/writing-integration-guides.md`; `.agents/docs/index.md`; `.agents/docs/log.md`; `.agents/sessions/20260412-014546-cursor-integration/summary.json`  
Accepted: 2 (playbook section for IDE/rules-based integration patterns; index pointer to root `docs/integrations/`)  
Rejected: 3 (`.agents/AGENTS.md`, `.agents/docs/troubleshooting.md`, `.agents/docs/repo-decisions.md` — candidates absent or already covered by `docs/integrations/cursor.md` and existing decisions)  
Notes: Distilled Cursor integration task-closeout; medium-confidence “doc-verified vs in-app” caveat stays in the published guide, not duplicated here.

### [2026-04-11] learning-distill | t-20260411-existing-agents-adoption-feedback, t-20260411-quickstart-install-docs
Outcome: updated  
Files: `.agents/docs/repo-decisions.md`; `.agents/docs/index.md`; `.agents/docs/log.md`; `.agents/sessions/20260411-145015-existing-agents-adoption/summary.json`; `.agents/sessions/20260411-145937-quickstart-install-docs/summary.json`  
Accepted: 2 (root docs are the home for kit installation guidance; index pointer to root `INSTALL.md`)  
Rejected: 4 (extra `.agents/AGENTS.md`, troubleshooting, and playbook updates; README/plan content was already present from the source tasks)  
Notes: Distilled two installation-doc bundles; kept copied `scaffold/` content unchanged because setup guidance is about consuming the starter repo.

### [2026-04-11] docs | quickstart-agent-install
Outcome: updated  
Files: `README.md`; `INSTALL.md`; `.agents/plans/consumer-upgrade-path.md`; `.agents/docs/log.md`  
Accepted: 3 (human quick start; agent prompt; detailed agent install guide)  
Rejected: 0  
Notes: Split README quick start by audience and moved detailed install mechanics into a root install guide.

### [2026-04-11] docs | existing-agents-adoption-feedback
Outcome: updated  
Files: `README.md`; `.agents/plans/consumer-upgrade-path.md`; `.agents/docs/log.md`  
Accepted: 5 (existing `.agents/` merge checklist; `.agents/.gitignore` as sufficient default with root `.gitignore` fallback; root `AGENTS.md` vs `.agents/AGENTS.md` relationship; adoption log/decision recommendation; index update reminder for pre-existing rules/playbooks/skills)  
Rejected: 0  
Notes: Incorporated adopter feedback directly in README and kept the broader consumer upgrade plan open for a possible dedicated scaffold doc.

### [2026-04-11] learning-distill | t-20260411-203100-scaffold-sync
Outcome: updated  
Files: `.agents/docs/repo-decisions.md`; `.agents/docs/troubleshooting.md`; `.agents/playbooks/maintainer-adoption-closeout-distill.md`; `.agents/docs/index.md`; `.agents/docs/log.md`; `.agents/sessions/20260411-203100-scaffold-sync-closeout/summary.json`  
Accepted: 3 (maintainer-only skills never in `scaffold/` decision; wrong-placement troubleshooting; playbook + index pointers to selective sync skill)  
Rejected: 1 (extra `.agents/AGENTS.md` bullet — already covered by existing “Skills” line)  
Notes: Distilled scaffold sync closeout; sync mechanics stay in skill + `sync.sh`.

### [2026-04-11] knowledge-lint
Outcome: updated  
Files: `.agents/AGENTS.md`; `.agents/docs/repo-decisions.md`; `.agents/docs/index.md`; `.agents/docs/log.md`; `scaffold/AGENTS.md`; `README.md`; `.agents/skills/knowledge-lint/SKILL.md`; `.agents/skills/learning-distill/SKILL.md`; `scaffold/skills/knowledge-lint/SKILL.md`; `scaffold/skills/learning-distill/SKILL.md`  
Notes: Fixed playbook path everywhere (`playbooks/` vs `docs/playbooks/`); aligned sessions bullet with MAINTENANCE; deduped `prior_session` consequences vs troubleshooting; clarified index playbooks location.

### [2026-04-11] learning-distill | t-20260411-185459-orchestrator, t-20260411-190655-sessions-readme
Outcome: updated  
Files: `.agents/docs/repo-decisions.md`; `.agents/docs/troubleshooting.md`; `.agents/docs/MAINTENANCE.md`; `.agents/docs/index.md`; `.agents/playbooks/maintainer-adoption-closeout-distill.md`; `.agents/docs/log.md`; `.agents/sessions/20260411-185459-orchestrator-closeout/summary.json`; `.agents/sessions/20260411-190655-sessions-readme/summary.json`  
Accepted: 7 (`prior_session` convention, sessions README + gitignore rationale, overlapping-bundle distill guidance, gitignore mismatch symptom/fix, MAINTENANCE sessions wording, maintainer checklist playbook, index playbook link)  
Rejected: 0  
Notes: Distilled orchestrator closeout and sessions README sessions; no `.agents/AGENTS.md` change (candidates optional or already covered).

### [2026-04-11] policy | scaffold-vs-agents
Outcome: updated  
Files: `scaffold/*` (reverted generic templates); `.agents/AGENTS.md`; `.agents/docs/repo-decisions.md`; `.agents/docs/troubleshooting.md`; `.agents/docs/index.md`; `.agents/docs/log.md`; removed `playbooks/refresh-dot-agents-from-scaffold.md`  
Accepted: 1 (scaffold stays consumer-generic; `.agents/` may diverge)  
Rejected: prior “keep scaffold aligned with `.agents/`” approach  
Notes: Scaffold should not encode starter-repo dogfood; maintainer knowledge lives under `.agents/` and README only.

### [2026-04-11] learning-distill | t-20260411-185215-dogfood
Outcome: updated  
Files: `.agents/AGENTS.md`; `.agents/docs/repo-decisions.md`; `.agents/docs/troubleshooting.md`; `.agents/playbooks/refresh-dot-agents-from-scaffold.md`; `.agents/docs/index.md`; `.agents/docs/log.md`  
Accepted: 5 (dual-tree ops guidance, repo decision, drift troubleshooting, refresh playbook, index pointer)  
Rejected: 0  
Notes: Distilled dogfood adoption session; documented scaffold vs `.agents/` and refresh procedure.

### [2026-04-12] learning-distill | t-20260412-003934-hermes-integration-review
Outcome: updated  
Files: `.agents/docs/repo-decisions.md`; `.agents/docs/troubleshooting.md`; `.agents/docs/index.md`; `.agents/docs/log.md`; `.agents/playbooks/writing-integration-guides.md`; `.agents/plans/add-integrations.md`; `README.md`; `docs/integrations/README.md`; `docs/integrations/hermes.md`; `.agents/sessions/20260412-003934-hermes-integration-review/summary.json`  
Accepted: 5 (move Hermes guide into `docs/integrations/`; verify dual-skill-namespace warning; narrow earlier broad Hermes file-tool claims; strengthen integration-guides playbook with explicit verification; update add-integrations plan to reflect verified Hermes findings)  
Rejected: 1 (treating earlier file-tool failures as a general Hermes limitation)  
Notes: Distilled the Hermes integration review session; evidence points primarily to a weak model plus a real Hermes-vs-repo skill-namespace gotcha, not to a broad repo-setup failure.

### [2026-04-12] learning-distill | t-20260411-201214-kilo-code-integration
Outcome: updated
Files: `.agents/playbooks/writing-integration-guides.md`; `.agents/docs/log.md`; `.agents/sessions/20260411-201214-kilo-code-integration/summary.json`
Accepted: 1 (integration-guide changes should update root README, integrations index, and maintainer tracker together)
Rejected: 3 (no `.agents/AGENTS.md` update; Kilo-specific troubleshooting/bootstrap guidance stayed out due to doc-based, not hands-on, evidence; repo decision duplicated existing `docs/integrations/` policy)
Notes: Distilled the Kilo Code integration doc task; kept durable changes repo-level and avoided promoting low-confidence Kilo-specific behavior claims.

## Template

### [YYYY-MM-DD] learning-distill | <task-id>
Outcome: updated
Files: `.agents/AGENTS.md`; `.agents/docs/log.md`
Accepted: 0
Rejected: 0
Notes: brief summary

### [YYYY-MM-DD] knowledge-lint
Outcome: cleanup
Files: `.agents/AGENTS.md`; `.agents/docs/log.md`
Notes: brief summary
