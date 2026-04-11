# Coding Agent

## Purpose

Primary implementation agent.

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

## Constraints

- do not stuff temporary notes into `.agents/AGENTS.md`
- keep task-specific details in the external task bundle
