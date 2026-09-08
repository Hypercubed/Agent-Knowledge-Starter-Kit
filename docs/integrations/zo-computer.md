# Zo Computer Integration Quick Reference

Use this page for Zo Computer–specific wiring. For the shared integration model, read [Integration Patterns](./patterns.md).

Verified against Zo Computer behavior and documentation on April 21, 2026. Re-check after Zo platform updates, especially around skill discovery and workspace conventions.

## Setup

1. Install the kit per [Adopting the kit](./patterns.md#adopting-the-kit).
2. Keep a short root `AGENTS.md` that routes Zo into `.agents/`.
3. Keep durable repo knowledge in `.agents/`, not scattered across Zo workspace files.
4. Mirror skills into `/home/workspace/Skills/` for Zo UI visibility: copy (or symlink) each skill from `.agents/skills/<name>/` to `/home/workspace/Skills/<name>/`. Zo scans `/home/workspace/Skills/` for `SKILL.md` files; it does not auto-discover skills nested inside `.agents/` or other repo subdirectories.
5. Update `/home/workspace/AGENTS.md` to include the Skills Discovery section (see below). This ensures future agents in this workspace know to check both `.agents/skills/` and `/home/workspace/Skills/` when looking up skills.
6. Verify peer tools after install: `node .agents/skills/aksk-bootstrap/scripts/check_peer_tools.mjs openspec openwiki`.

Root `AGENTS.md` example:

Attach the marker-delimited `AKSK:ROUTING` section rather than hand-writing this file:

```bash
node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs . AGENTS.md
```

The attachment appends the section below any existing content, refreshes it in place when the kit's template changes, and is idempotent on re-run. Add tool-specific notes outside the markers - never edit between them.

Optionally add this Zo-specific discovery section to `/home/workspace/AGENTS.md` after install (outside the AKSK-managed markers):

```markdown
## Skills Discovery
- Repo-local skills live in `.agents/skills/<name>/SKILL.md` (canonical definitions)
- Zo Computer and other tools may scan `/home/workspace/Skills/` for runnable skills — this is a mirror location, not the canonical source
- When a skill is requested by name, check both paths: `/home/workspace/Skills/<name>/SKILL.md` (UI discovery) and `.agents/skills/<name>/SKILL.md` (repo canonical)
```

## Discovery and Config

| Mechanism        | Location                              | Use                                              |
| ---------------- | ------------------------------------- | ------------------------------------------------ |
| Repo entrypoint  | root `AGENTS.md`                      | Bootstrap into `.agents/`                        |
| Kit instructions | `.agents/AGENTS.md`                   | Durable repo guidance after root routing         |
| Kit docs         | `openwiki/{decisions,troubleshooting}/`, `.agents/playbooks/` | Decisions, troubleshooting, procedures |
| Kit skills       | `.agents/skills/<name>/SKILL.md`      | Repo-local workflows (canonical definitions)     |
| Zo Skills UI     | `/home/workspace/Skills/`             | Where Zo discovers and lists runnable skills     |
| Zo Rules         | Zo Settings → AI → Rules              | User-wide behavioral preferences for Zo          |
| Zo Automations   | Zo Automations page                   | Scheduled or recurring agent tasks               |

## Zo-Specific Caveats

- Zo does not auto-discover skills under `.agents/skills/`. You must copy (or symlink) them into `/home/workspace/Skills/` for the Skills UI to list them. The canonical definitions should stay in `.agents/skills/`; treat `/home/workspace/Skills/` as a mirror.
- Zo reads `AGENTS.md` files along the workspace path. A root `AGENTS.md` is visible when Zo works in the repo root, but `.agents/AGENTS.md` is only visible when Zo works inside `.agents/`. Use the root file as a thin bootstrap that points into `.agents/`.
- Zo has no separate "reload skills" or "import skill" UI action. After copying skill folders into `/home/workspace/Skills/`, they appear on the next visit to the Skills page.
- Zo Rules (Settings → AI → Rules) are user-wide and always active. Do not duplicate repo-specific policy there; keep repo conventions in `.agents/AGENTS.md` and use Rules only for cross-repo behavioral preferences.
- Do not expose private repo knowledge via public Zo Space routes or `zopub` collections unless that is intentional.

## Workflow

1. Clone or open the repo in the Zo workspace.
2. Confirm root `AGENTS.md` routes into `.agents/`.
3. Read `.agents/AGENTS.md` and `openwiki/index.md` before changing conventions.
4. Use repo-local skills for closeout, distillation, and linting — follow each skill's `SKILL.md`.
5. After meaningful work, run `task-closeout` to capture session evidence in `.agents/sessions/`, then `learning-distill` to promote stable lessons into the curated wiki trees.
6. Rebuild derived artifacts: `node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs` regenerates OpenWiki directory indexes.

## Troubleshooting

- **Skills not visible in UI:** Confirm the `SKILL.md` file exists under `/home/workspace/Skills/<skill-name>/SKILL.md` with valid YAML frontmatter (`name` and `description` are required).
- **Knowledge search finds nothing:** Broaden your query or check that `openwiki/` contains pages; wiki indexes refresh via `sync_wiki_indexes.mjs`.
- **`.agents/AGENTS.md` not picked up:** Zo only auto-reads `AGENTS.md` relative to its working directory. Ensure the root `AGENTS.md` explicitly points to `.agents/AGENTS.md`.

## References

- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [Integration Patterns](./patterns.md)

<!-- markdown-link-check-disable -->

External Zo docs (verify in-browser; automated checks may see HTTP 403):

- [Zo Computer documentation](https://docs.zocomputer.com)
- [Zo Skills page](https://www.zocomputer.com/skills)

<!-- markdown-link-check-enable -->
