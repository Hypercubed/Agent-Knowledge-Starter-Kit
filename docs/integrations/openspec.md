# OpenSpec Integration Guide

This guide describes how to integrate OpenSpec into this project to enhance agentic workflows, documentation quality, and knowledge persistence.

## 0. Prerequisites
- **Node.js (LTS):** Required to run OpenSpec via `npx`.
- **Project Structure:** Ensure your repository includes the `.agents/` directory (see [`openwiki/index.md`](../../openwiki/index.md)).

## 1. Setup and Configuration
Create a `openspec.yaml` in your project root. Ensure `read-and-reference` targets are scoped correctly to your project's knowledge base.

```yaml
rules:
  - name: AKSK Knowledge Persistence
    description: Enforce AKSK documentation and constraint standards.
    patterns:
      - .agents/**/*.md
      - docs/**/*.md
    action: read-and-reference
```

*Verification:* Run `npx openspec status` from the repository root to confirm the new ruleset is active and covering the targeted directories.

## 2. Integrated Workflow (The "Capture-as-you-go" Model)
Integrate OpenSpec into your development lifecycle:

| Phase | Agent Responsibility | Documentation Action |
| :--- | :--- | :--- |
| **Planning** | Validate proposed changes against existing `SKILL.md` constraints. | Update/Draft `docs/plans/` records. |
| **Development** | Consult `SKILL.md` before executing complex operations. | Log deviations in `SKILL.md`. |
| **Distillation** | Synthesize lesson-learned into permanent knowledge. | Append findings to `SKILL.md` or `docs/`. |

*Pro-tip:* Use `npx openspec check` before committing to ensure adherence to policies.

## 3. Troubleshooting
- **Rule not active?** Confirm `openspec.yaml` is in the project root. Run `npx openspec status`.
- **Path resolution fail?** Use absolute paths where possible, and avoid complex globbing. Check `openwiki/index.md` for known infrastructure patterns.
- **Permission denied?** Ensure the `node_modules` and `.openspec/` directories have standard read/write permissions.

## 4. Best Practices
- **Define Imperatives:** Use "MUST"/"MUST NOT" in `SKILL.md`.
- **Root-Relative Pathing:** Always define paths relative to the project root.
- **Avoid Ambiguity:** Use explicit globbing (e.g., `docs/**/*.md`).

---
See also: [`docs/integrations/README.md`](README.md) for more tool integrations.
