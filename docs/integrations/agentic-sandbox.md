# Agentic Sandbox Integration Quick Reference

Use this page for agents operating in a sandbox with full filesystem and shell access (for example, Jules, OpenClaw, or custom autonomous agents). For the shared integration model, read [Integration Patterns](./patterns.md).

## Setup

1. Install the kit per [Adopting the kit](./patterns.md#adopting-the-kit).
2. Use the **Root `AGENTS.md`** pattern. Ensure a root `AGENTS.md` exists to route the agent into `.agents/`.
3. If the sandbox environment allows, install Python dependencies required for scripted skills:
   ```bash
   pip install pyyaml rank_bm25
   ```

## Agent Capabilities vs. Kit Skills

Agents with tool access (filesystem and shell) interact with the kit differently than IDE-bound agents:

| Capability | Integration Strategy |
| :--- | :--- |
| **Procedural Skills** | Read `.agents/skills/*/SKILL.md` and execute the steps using native tools (`write_file`, `run_in_bash_session`, etc.). |
| **Scripted Skills** | Run the scripts under `.agents/skills/*/scripts/` directly in the shell. |
| **Durable Docs** | Browse `openwiki/index.md` and the curated trees to understand repo policy before starting work. |
| **Session Bundles** | Use the `task-closeout` procedure to capture work state before finishing a task. |

## Scripted Skill Execution

When environment dependencies are met, agents should use the provided scripts to maintain the knowledge layer:


### Search Knowledge Layer
```bash
grep -ri "<query>" openwiki/
```

### Compile Durable Indexes
```bash
node .agents/skills/aksk-bootstrap/scripts/sync_wiki_indexes.mjs
```

## Agent-Specific Caveats

- **No Staging/Commit**: Unless explicitly instructed, agents should leave Git operations to the human maintainer.
- **Environment Drift**: Dependencies installed via `pip` in the sandbox may not persist across session boundaries depending on the platform. Verify environment state if scripts fail.
- **Root Routing**: If multiple agents or tools are used, ensure the root `AGENTS.md` is clear about the source of truth being in `.agents/`.

## Workflow for Autonomous Agents

1. **Bootstrap**: Read root `AGENTS.md` -> `.agents/AGENTS.md`.
2. **Search**: Run `search-docs.py` to find relevant decisions or troubleshooting patterns.
3. **Execute**: Perform the task following repo conventions.
4. **Closeout**: Follow `.agents/skills/task-closeout/SKILL.md` to create a session bundle.
5. **Distill (Optional)**: If acting as a learning agent, run `learning-distill` logic and refresh wiki indexes with `sync_wiki_indexes.mjs`.

## References

- [`README.md`](../../README.md)
- [`INSTALL.md`](../../INSTALL.md)
- [Integration Patterns](./patterns.md)
