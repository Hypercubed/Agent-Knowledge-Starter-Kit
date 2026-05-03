## Context

The Agent Knowledge Starter Kit provides an `.agents/` directory that adopters place in their repositories. As the kit evolves, existing adopters need a way to integrate new kit capabilities (like new skills or updated core docs) without overwriting their own repository-specific rules, troubleshooting docs, or customized playbooks. Upgrading currently causes friction and fear of losing local data.

## Goals / Non-Goals

**Goals:**
- Provide a clear, step-by-step upgrade path from an older version of the kit to a newer one.
- Establish a "safe" upgrade path using existing tooling (e.g., `npx skills add`) vs manual folder merging.
- Explain the relationship between a repository's root `AGENTS.md` and the starter kit's `.agents/AGENTS.md`.
- Explain how first-time kit adoption works for repositories that already have an `.agents/` folder.
- Ensure existing repo-specific knowledge remains discoverable after an upgrade.

**Non-Goals:**
- Version tagging policy or changelog automation.
- Building a new CLI tool specifically for kit upgrades (we will rely on existing processes and tools).
- Creating a separate set of documents just for the kit within the kit itself, if existing documents (README/INSTALL.md) suffice.

## Decisions

- **Documentation Strategy:** We will update existing documents (`README.md`, `INSTALL.md`) rather than creating a proliferation of new standalone files, to keep the maintenance surface small.
- **Merge Guidance:** We will explicitly document what breaks if an adopter wholesale replaces `.agents/` and provide checklists for what to overwrite vs. what to merge by hand.
- **Gitignore Approach:** We will explicitly document that `.agents/.gitignore` is sufficient for ignoring session bundles, and repo-root `.gitignore` entries are an alternative.
- **Root vs Nested AGENTS:** We will document the relationship between root `AGENTS.md` and `.agents/AGENTS.md`, establishing clear precedence or usage patterns.

## Risks / Trade-offs

- [Risk] Adopters skip the documentation and blindly overwrite their `.agents/` folder. -> Mitigation: Place a highly visible warning in the `README` and `INSTALL.md` right at the top of the upgrade section.
- [Risk] Complex folder structures confuse manual merging. -> Mitigation: Provide a very simple ordered checklist for manual merging.
