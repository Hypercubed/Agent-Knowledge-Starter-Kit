# AKSK v2.0 Release Readiness Review (develop)

Date: 2026-04-24 (UTC)
Reviewer: Codex agent
Branch: develop

## Executive summary

The kit is close to release, but **not fully v2.0-ready yet**.

- ✅ Core portable structure checks pass for both `.agents/` and `example/.agents/`.
- ✅ Pre-publish script runs successfully with no blocking failures.
- ⚠️ Two meaningful quality warnings remain in pre-publish checks (tooling availability and high-signal path scan).
- ❌ One release-blocking packaging defect was present and fixed in this change (`package.json` malformed JSON).
- ⚠️ Documentation consistency issue was present and fixed in this change (outdated plan path reference).

## What was reviewed

- Core docs and install flows (`README.md`, `INSTALL.md`, `docs/architecture.md`, `docs/integrations/README.md`)
- Package manifest integrity (`package.json`)
- Structural and pre-publish scripts (`scripts/check-publish.sh`, `scripts/check-agents-structure.sh`)
- Knowledge-layer hygiene via existing repository checks (`.agents/` and `example/.agents/`)

## Findings

### 1) Packaging manifest integrity (fixed)

`package.json` had invalid JSON syntax that would break npm tooling (`npm install`, `npm run`, release automation):

- Missing comma between `search` and `format` scripts.
- Extra trailing `s` after the scripts object (`},s`).

This is now fixed.

### 2) Integrations planning reference drift (fixed)

A stale plan path was referenced in integration maintenance docs:

- `plan-add-integrations.md` was referenced, but actual file is `add-integrations.md`.

Both references fixed:

- `docs/integrations/README.md`
- `.agents/playbooks/writing-integration-guides.md`

### 3) Release check coverage gaps (still open)

`check-publish.sh` intentionally warns when optional markdown tooling (`remark`, `markdown-link-check`) is unavailable. In this environment those checks were skipped, which leaves formatting/link integrity partially unverified.

Recommendation before cutting v2.0:

1. Ensure dev dependencies install cleanly from fixed `package.json`.
2. Run markdown format and link checks with local tooling available.

### 4) High-signal leakage scanner warnings need triage (still open)

`check-publish.sh` flagged local-path-like strings (e.g. `/home/workspace/...`) in Zo integration guidance and log entries. These look like **intentional documentation examples**, not secrets.

Recommendation before release:

- Do a deliberate triage pass and either:
  - accept/document these as expected examples, or
  - rephrase to lower false-positive noise in future release checks.

### 5) Version labeling ambiguity for release messaging (still open)

Current visible version labeling is prerelease-like:

- `README.md` title includes `v2.0a`.
- `package.json` version is `2.0.0-alpha.1`.

If you intend to release stable **v2.0**, align version strings and release notes accordingly.

## Suggested go/no-go gates for v2.0

Before tagging and publishing:

1. **Pass all publish checks with tooling installed** (including markdown and link checks).
2. **Triage/acknowledge leakage scan warnings** so signal is clean.
3. **Align version labels** (`README`, package metadata, release tag/changelog).
4. Optionally run a clean clone smoke test of install instructions (`npx skills add ...` + skill initialization).

## Commands executed for this review

- `bash scripts/check-publish.sh`
- `bash scripts/check-agents-structure.sh example/.agents`
- `bash -n scripts/check-publish.sh`
- `bash -n scripts/check-agents-structure.sh`
- `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package.json valid')"`
- `python3 -m json.tool package.json >/dev/null`
- `python3` ad-hoc local-link existence scan

