# Files

- [The Knowledge Layer: .agents/ and Curated Wiki Trees](knowledge-layer.md) - How AKSK 2.0 splits durable knowledge: prescriptive agent-behavior files under .agents/ (AGENTS.md, playbooks) versus curated OKF pages under openwiki/{decisions,troubleshooting}/ with aksk_* lifecycle frontmatter, plus the sessions model that feeds both.
- [AKSK Architecture Overview](overview.md) - What the Agent Knowledge Starter Kit is, its peer-dependency design (OpenSpec + OpenWiki), the prescriptive-versus-curated knowledge split, and how closeout, distillation, and lint form a knowledge maintenance loop.
- [Task Lifecycle and Session Bundles](task-lifecycle.md) - How task identity works (task_id in summary.json vs folder labels), the five-file closeout bundle with its optional openspec_change link, the closeout-to-distilled state machine, and how distillation now ends in deterministic wiki index sync instead of a log append.
