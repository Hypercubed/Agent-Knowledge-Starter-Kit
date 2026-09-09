---
type: Decision
title: Adopt upstream tools over reimplementation
description: Supersedes the repo-centric-wiki-tooling approach and the extraction-based
  integrate-openwiki-skills approach; AKSK routes onto shipped OpenWiki/OpenSpec surfaces
  instead of copying or reimplementing them.
tags:
- architecture
- openwiki
- openspec
- supersession
timestamp: '2026-08-23T00:00:00Z'
aksk_status: accepted
aksk_depends_on:
- decisions/openspec-openwiki-aksk-division-of-labor
---

# Adopt upstream tools over reimplementation

### Status

Accepted — supersedes earlier approaches listed below

### Context

Two earlier directions aimed at the same problem (repo documentation and agent-process knowledge drifting out of date):

1. **Repo-centric wiki tooling** (`repo-centric-wiki-tooling`, an early plan/change later marked Overcome-By-Events): build wiki generation around this repository's own scripts.
2. **Extraction-based OpenWiki skills** (`integrate-openwiki-skills`, archived 2026-08-23 as superseded): copy OpenWiki's internal prompts into native AKSK skills so hosts could author wiki content without OpenWiki's harness.

Both create second sources of truth that drift from upstream.

### Decision

Neither approach is pursued. AKSK routes onto shipped upstream surfaces: descriptive lessons are authored directly by the distilling agent using OpenWiki guidance loaded at runtime from the installed package (`createSystemPrompt` export), validated with its deterministic OKF helpers; process artifacts route through OpenSpec's CLI. Agents following stale pointers to either superseded approach should treat this entry as the redirect target and read the division-of-labor decision for the replacement model.

### Rationale

Runtime loading gets upstream prompt improvements without re-extraction; host-authoring keeps session context that a delegated CLI run cannot see. Reimplementation of either tool's core loop duplicates maintenance AKSK cannot sustain.

### Related

- [OpenSpec / OpenWiki / AKSK division of labor](openspec-openwiki-aksk-division-of-labor.md)
