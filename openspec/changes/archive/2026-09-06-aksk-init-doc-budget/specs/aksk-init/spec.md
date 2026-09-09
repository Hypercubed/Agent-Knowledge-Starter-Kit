## ADDED Requirements

### Requirement: Documentation budget distribution via aksk-init
The per-repo init lane (`bootstrap-repo.mjs`) SHALL distribute the Documentation budget by (a) ensuring the wiki contract template carrying the brief is attached via `attach_wiki_contract.mjs` and (b) installing `.openwikiignore` from `references/openwikiignore-template.md` via the ignore installer with merge-not-clobber semantics. The lane SHALL perform these steps after `openwiki --init` and contract attachment, SHALL be non-interactive, and SHALL be idempotent — re-running on a fully initialized repo with current templates is a no-op. When execution is not possible locally, it SHALL print repo-scoped INSTRUCT commands for remaining steps without including global-lane commands.

#### Scenario: Happy path — fresh repo init
- **WHEN** user runs `aksk-init` with defaults in a fresh repo
- **THEN** `.openwikiignore` is created from the template and `openwiki/INSTRUCTIONS.md` contains the Documentation brief inside `AKSK:WIKI-CONTRACT` markers

#### Scenario: Idempotent re-run
- **WHEN** `aksk-init` re-runs on a repo where the ignore and contract already match current templates
- **THEN** no files are modified

#### Scenario: Customized ignore preserved
- **WHEN** `aksk-init` re-runs and the user has added rules outside the AKSK markers in `.openwikiignore`
- **THEN** those rules are preserved and only the marked section is refreshed if needed
