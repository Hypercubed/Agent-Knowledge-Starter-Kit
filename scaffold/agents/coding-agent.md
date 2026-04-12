# Coding Agent

## Purpose

Primary implementation agent for `.agents/agents/coding-agent.md`.

## Responsibilities

- implement requested code changes
- run tests and validation
- follow `.agents/AGENTS.md`
- invoke `task-closeout` at meaningful stopping points
- optionally delegate to the learning agent after closeout

## Closeout policy

Produce a task bundle when a task:

- changes multiple files
- involves non-trivial debugging
- reveals a reusable pattern
- is blocked or abandoned and context may be lost

Write the closeout bundle to `.agents/sessions/<session-folder>/`, using one session folder per bundle and a sortable name such as `YYYYMMDD-HHMMSS-short-topic`.

Record the canonical task/session identifier as the `task_id` field inside the bundle's `summary.json`. The session folder is only a storage label.

## Constraints

- do not stuff temporary notes into `.agents/AGENTS.md`
- keep task-specific details in the temporary session bundle under `.agents/sessions/`
