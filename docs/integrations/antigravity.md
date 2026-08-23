# Antigravity Integration Quick Reference

Use this page for Antigravity-specific wiring. For the shared integration model, read [Integration Patterns](./patterns.md).

Verified against Antigravity's current behavior using the standard Antigravity tool interface.

## Setup

1. Install starter skills in the target repo with `npx skills add Hypercubed/Agent-Knowledge-Starter-Kit`, then run each installed skill's initialization from its `SKILL.md` (see [`INSTALL.md`](../../INSTALL.md)).
2. Keep an optional root `AGENTS.md` bootstrap for interoperability with other tools.
3. Treat Antigravity Knowledge Items as a local cache, not shared repo documentation.
4. At closeout, prompt Antigravity to export final task evidence into `.agents/sessions/<folder>/`.
5. Distill durable lessons into the curated wiki trees, `.agents/playbooks/`, or `.agents/AGENTS.md`.

## Discovery and Config

| Mechanism          | Location               | Use                                       |
| ------------------ | ---------------------- | ----------------------------------------- |
| Knowledge Items    | Agent-private app data | Local persistent context                  |
| Conversation logs  | Agent-private app data | Raw local logs and artifacts              |
| Planning artifacts | Agent-private app data | Implementation plans and walkthroughs     |
| Tool system        | Antigravity runtime    | File reads, search, shell commands, edits |
| Kit knowledge      | `.agents/`             | Shared repo knowledge and session bundles |

## Antigravity-Specific Caveats

- Antigravity artifacts and KIs are not visible to other tools by default.
- Other agents only benefit from Antigravity findings after the durable parts are written into `.agents/`.
- Ask for explicit export at task closeout; do not assume planning artifacts are already in the repo.

## Workflow

1. Let Antigravity use its native high-context planning and Knowledge Items during the task.
2. Before closeout, ask it to summarize reusable findings.
3. Write the closeout bundle under `.agents/sessions/<folder>/`.
4. Run a later learning pass to promote stable lessons into durable `.agents/` files.

## References

- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [Integration Patterns](./patterns.md)
