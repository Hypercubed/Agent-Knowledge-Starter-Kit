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

### Overlapping session bundles for one initiative

#### Symptom
Two or more folders under `.agents/sessions/` describe related work, or `summary.json` includes a `prior_session` pointer.

#### Likely causes
- Multi-agent flows where an orchestrator wrote a second closeout instead of editing an earlier bundle.
- Legitimate split of evidence across bundles for the same arc.

#### Fix
- During `learning-distill`, merge lessons mentally (or in durable docs) using `task_id`, timestamps, and `prior_session`; do not edit earlier session files to combine narratives.
- Prefer adding a new bundle that references the prior path over mutating an already closed packet.

#### Validation
- Durable doc updates reference the right bundle IDs; raw session trees remain unchanged aside from allowed `summary.json` status fields.

### Unexpected files under `sessions/` in git status

#### Symptom
`git status` shows unwanted tracked files, or bundles appear tracked, under `sessions/`.

#### Likely causes
- `.gitignore` negation rules do not match the tracked `README` path or filename (including case).
- A local `.gitignore` differs from the kit after a partial copy.

#### Fix
- Confirm the pattern pair: ignore `sessions/*` (or equivalent) and a single negated path such as `!sessions/README.md` that exactly matches the file you intend to track.
- Remove accidental `git add` of bundle paths; keep bundles untracked.

#### Validation
- Only the intended `sessions/README.md` (if any) is tracked; bundle directories stay ignored.

### Maintainer skill lives under `scaffold/skills/` by mistake

#### Symptom
A skill meant only for this repo’s dual-tree maintenance appears under `scaffold/skills/`, or adopters would inherit maintainer-only automation.

#### Likely causes
- Skill added before deciding whether the audience is **every kit adopter** or **this repository only**.

#### Fix
- Remove the skill from `scaffold/skills/`. Keep it only under `.agents/skills/<skill-name>/` with any helper script in the same folder as `SKILL.md`.

#### Validation
- `scaffold/skills/` lists only portable kit skills; maintainer sync or similar tooling exists only under `.agents/skills/` when applicable.

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
