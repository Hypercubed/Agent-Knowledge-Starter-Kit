# Knowledge Maintenance Log

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
