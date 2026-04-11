# Knowledge Maintenance Log

### [2026-04-11] learning-distill | t-20260411-203100-scaffold-sync
Outcome: updated  
Files: `.agents/docs/repo-decisions.md`; `.agents/docs/troubleshooting.md`; `.agents/playbooks/maintainer-adoption-closeout-distill.md`; `.agents/docs/index.md`; `.agents/docs/log.md`; `.agents/sessions/20260411-203100-scaffold-sync-closeout/summary.json`  
Accepted: 3 (maintainer-only skills never in `scaffold/` decision; wrong-placement troubleshooting; playbook + index pointers to selective sync skill)  
Rejected: 1 (extra `AGENTS.md` bullet — already covered by existing “Skills” line)  
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
Notes: Distilled orchestrator closeout and sessions README sessions; no `AGENTS.md` change (candidates optional or already covered).

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

## Template

### [YYYY-MM-DD] learning-distill | <task-id>
Outcome: updated
Files: consumer repo `.agents/AGENTS.md`; consumer repo `.agents/docs/log.md`
Accepted: 0
Rejected: 0
Notes: brief summary

### [YYYY-MM-DD] knowledge-lint
Outcome: cleanup
Files: consumer repo `.agents/AGENTS.md`; consumer repo `.agents/docs/log.md`
Notes: brief summary
