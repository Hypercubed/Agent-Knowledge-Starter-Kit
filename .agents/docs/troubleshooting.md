# Troubleshooting

This template belongs in `.agents/docs/troubleshooting.md`.

Use this file for recurring issue patterns and validated recoveries.

### Comparing `scaffold/` to `.agents/` in this starter repo

#### Symptom
Expectation that `diff` between `scaffold/` and `.agents/` should be empty (aside from sessions).

#### Likely causes
- Assumption that the two trees are meant to stay mirrored. They are not: `scaffold/` is the generic kit; `.agents/` is optional maintainer dogfood and may differ.

#### Fix
- Use `scaffold/` when changing what **consumers** receive. Use `.agents/` for **this repo’s** durable notes without forcing them back into the template.

#### Validation
- `scaffold/` files contain no references to this repository’s layout beyond what a normal consumer would write in `.agents/`.

## Entry template

### Symptom
Describe the visible failure.

### Likely causes
- Cause 1
- Cause 2

### Fix
Describe the known recovery steps.

### Validation
How to confirm the problem is resolved.
