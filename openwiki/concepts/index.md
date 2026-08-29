# Files

- [AGENTS.md Zoning and Baseline](agents-md-zoning.md) - How root AGENTS.md is split into marker-delimited zones, which zones are shipped today, and the proposal-only FerroxLabs baseline that would add a vendored behavioral contract with isolated refresh and combine semantics.
- [Knowledge Curation Contract](knowledge-curation-contract.md) - How AKSK curates OpenWiki knowledge — curated trees, the INSTRUCTIONS.md attachment contract, preserve-and-link update semantics, aksk_* frontmatter extensions, and the descriptive versus prescriptive routing that distillation enforces.
- [Session Identity and Storage](session-identity-and-storage.md) - How task-closeout identifies sessions via task_id in summary.json, stores temporary bundles under .agents/sessions with gitignore rules, supports optional prior_session chaining, and keeps bundles repo-local until distillation promotes lessons to durable .agents/ or openwiki/.
