---
id: gemini-cli-not-following-durable-guidance
title: "Gemini CLI not following durable guidance"
last_updated: 2026-04-19
---

# Gemini CLI not following durable guidance

#### Symptom

Gemini CLI ignores playbooks, decisions under `.agents/docs/repo-decisions/`, troubleshooting entries, or other conventions reached via `.agents/AGENTS.md` / [`.agents/docs/index.md`](../index.md).

#### Likely causes

- Lack of a root `GEMINI.md` file.
- The root `GEMINI.md` does not explicitly mandate reading `.agents/AGENTS.md`.

#### Fix

- Create or update `GEMINI.md` at the project root to include a mandate: "Read and follow `.agents/AGENTS.md` at the start of every session."

#### Validation

- Gemini CLI acknowledges the mandates in `GEMINI.md` and correctly references `.agents/` files during its Research phase.
