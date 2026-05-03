# Ship Structure Check Script With The Kit

## Summary

Make `check-agents-structure.sh` easy for consumers to run against their installed `.agents/` tree. Keep `check-publish.sh` maintainer-only for this starter repo's release hygiene.

## Repository Context (2026-04)

The parallel `scaffold/` directory was removed; `scripts/check-publish.sh` now runs the portable validator on **root `.agents/` only** (not a second tree). There is still **no** tracked `.agents/scripts/check-agents-structure.sh` in this repo — only `scripts/check-agents-structure.sh` at the repository root.

## Motivation

Consumers need a way to validate their `.agents/` tree after installation or modifications. The existing script is portable but not easily accessible in the consumer layout.

## Impact

- Improves consumer experience by providing easy validation.
- Maintains separation between consumer tools and maintainer tools.
- Ensures portability and location-awareness of the script.