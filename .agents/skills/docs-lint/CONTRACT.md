# Docs Lint Contract

Machine-oriented scope.

## Reads

Root instruction files and their marker blocks; `openwiki/INSTRUCTIONS.md`; `openwiki/**`; `.agents/AGENTS.md`; `.agents/playbooks/`; `openspec/changes/archive/`.

## Writes

Reports and minimal edits to AKSK-owned files only (`.agents/AGENTS.md`, playbooks, curated knowledge page content). Never writes OpenWiki-owned files (indexes, run metadata) or files inside marker blocks other than by rerunning the aksk-bootstrap attachment scripts.

## Failure conditions (wiring)

Damaged/duplicated/stale routing blocks; missing wiki curation contract; archived changes without wiki coverage or recorded deferral; curated pages contradicting repository reality.
