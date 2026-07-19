## Context

The `write-plan` skill was previously used for generating `.agents/docs/plans` scaffolding. The user no longer wants this skill as part of the AKSK.

## Goals / Non-Goals

**Goals:**
- Completely remove the `.agents/skills/write-plan/` directory.
- Remove references to `write-plan` and its schema contracts from other kit files, including `index.md`, `MAINTENANCE.md`, and skills docs.
- Ensure the `generate-example` script no longer tries to bootstrap `write-plan` files.

**Non-Goals:**
- Do not remove the `.agents/docs/plans/` directory or change the conceptual existence of plans.

## Decisions

- We will modify `SKILL.md`, `CONTRACT.md`, `index.md`, `MAINTENANCE.md`, and `run.sh` to scrub out references to `write-plan`.
- We will rely on simple directory creation rather than `write-plan` bootstrap logic.

## Risks / Trade-offs

- The lack of `write-plan` means users will have to manually create the structure for their plans, but it simplifies the toolkit.
