# Files

- [AGENTS.md Zoning and Markers](agents-md-zoning.md) - Marker-delimited zoning of root AGENTS.md into FerroxLabs baseline (AKSK:AGENTS-BASELINE), OpenWiki (OPENWIKI:START/END), and AKSK routing/lifecycle (AKSK:ROUTING/LIFECYCLE) — ownership, order, and isolation guarantees.
- [Knowledge Curation Contract](knowledge-curation-contract.md) - How AKSK curates OpenWiki knowledge — curated trees, the INSTRUCTIONS.md attachment contract, preserve-and-link update semantics, aksk_* frontmatter extensions, and the descriptive versus prescriptive routing that distillation enforces.
- [Session Identity and Storage](session-identity-and-storage.md) - How task-closeout identifies sessions via task_id in summary.json, stores temporary bundles under .agents/sessions with gitignore and openwikiignore rules, supports optional prior_session chaining, and keeps bundles repo-local until distillation promotes lessons to durable .agents/ or openwiki/.
