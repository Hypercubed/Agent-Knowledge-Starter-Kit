# Proposal: Add Script Tests

## Problem
The docs-search and docs-compile scripts are now consumer-facing surfaces in the Agent Knowledge Starter Kit, but lack automated test coverage. Without tests, regressions in script behavior and output contracts go undetected, risking instability for downstream users.

## Proposed Change
Add a minimal, focused pytest-based test suite that validates script behavior through black-box CLI invocation. Tests will:
- Exercise scripts as users invoke them (CLI interface)
- Use temporary fixture repositories to model minimal `.agents/` structures
- Assert key invariants over output and generated files
- Verify exit codes and error messages for failure modes

## Impact
- **Stability**: Consumer-facing scripts gain regression protection
- **Maintainability**: Contributors can refactor internal logic with confidence
- **User Trust**: Automated validation demonstrates reliability to downstream consumers
- **Documentation**: Test examples serve as implicit usage documentation

## Success Criteria
1. Tests fail if docs-search regresses to requiring durable section `index.md` files
2. Tests fail if docs-compile no longer degrades gracefully when optional components are absent
3. Test suite passes deterministically on repeated local runs
4. Suite remains small and fast enough for routine maintainer use
