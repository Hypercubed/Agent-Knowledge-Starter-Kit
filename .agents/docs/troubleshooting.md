# Troubleshooting

This template belongs in `.agents/docs/troubleshooting.md`.

Use this file for recurring issue patterns and validated recoveries.

### Comparing `.agents/` to `.agents/` in this starter repo

#### Symptom

Expectation that `diff` between `.agents/` and `.agents/` should be empty (aside from sessions).

#### Likely causes

- Assumption that the two trees are meant to stay mirrored. They are not: `.agents/` is the generic kit; `.agents/` is optional maintainer dogfood and may differ.

#### Fix

- Use `.agents/` when changing what **consumers** receive. Use `.agents/` for **this repo’s** durable notes without forcing them back into the template.

#### Validation

- `.agents/` files contain no references to this repository’s layout beyond what a normal consumer would write in `.agents/`.

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

### Unexpected files under `.agents/sessions/` in git status

#### Symptom

`git status` shows unwanted tracked files, or bundles appear tracked, under `.agents/sessions/`.

#### Likely causes

- `.agents/.gitignore` negation rules do not match the tracked `README` path or filename (including case).
- A local `.gitignore` differs from the kit after a partial copy.

#### Fix

- Confirm the pattern pair in `.agents/.gitignore`: ignore `sessions/*` (or equivalent) and a single negated path such as `!sessions/README.md` (relative to `.agents/`) that exactly matches the file you intend to track.
- Remove accidental `git add` of bundle paths; keep bundles untracked.

#### Validation

- Only the intended `.agents/sessions/README.md` (if any) is tracked; bundle directories stay ignored.

### Maintainer skill lives under `.agents/skills/` by mistake

#### Symptom

A skill meant only for this repo’s dual-tree maintenance appears under `.agents/skills/`, or adopters would inherit maintainer-only automation.

#### Likely causes

- Skill added before deciding whether the audience is **every kit adopter** or **this repository only**.

#### Fix

- Remove the skill from `.agents/skills/`. Keep it only under `.agents/skills/<skill-name>/` with any helper script in the same folder as `SKILL.md`.

#### Validation

- `.agents/skills/` lists only portable kit skills; maintainer sync or similar tooling exists only under `.agents/skills/` when applicable.

### Codex cannot write under `.agents/` during closeout or distill

#### Symptom

Codex can read `.agents/` but creating a session folder or updating durable knowledge files fails with a read-only filesystem or approval-related error.

#### Likely causes

- Codex sandbox settings protect `.agents/` under workspace-write mode.
- The current session is running in read-only mode.

#### Fix

- Approve the specific `.agents/` write needed for closeout or distillation, or use a configuration that permits the intended maintenance edit.
- Do not treat the error as a kit layout problem; `.agents/` is still the correct location for dogfood knowledge and session bundles in this repo.

#### Validation

- The intended `.agents/` file or session folder is created or updated.
- `git status --short` shows only expected durable knowledge changes; per-task session bundles remain ignored.

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

### Hermes Agent–specific: Dual skill namespace (`skill_view` returns wrong file)

#### Symptom

Agent calls `skill_view(name="task-closeout")` and gets back a stub or different content than what exists at `.agents/skills/task-closeout/SKILL.md` in the repo.

#### Likely causes

- `skill_view` looks up skills from the Hermes system directory (`~/.hermes/skills/`), not from the repo's `.agents/skills/` directory.
- The two namespaces can have entries with the same name but completely different content.
- Subagents especially will grab whichever one they find first via the skill system, never looking at the repo file tree.

#### Fix

- Read skills directly from the repo filesystem (`read_file` or `cat .agents/skills/<name>/SKILL.md`) rather than using `skill_view`.
- Do not rely on the Hermes skill system for repo-local skills.

#### Validation

- The skill content matches the repo file exactly.
- `skill_view` and direct filesystem read return the same content (or `skill_view` returns nothing).

### Hermes Agent–specific: Suspected tool anomaly from a single weak run

#### Symptom

An earlier session reports that `write_file`, `patch`, or `read_file` behaved inconsistently with the real repository state.

#### Likely causes

- The observation came from a low-confidence or weak-model run and may have included incorrect conclusions.
- The failure may have been specific to a delegated or unusual execution context rather than Hermes as a whole.
- The reported symptom was not reproduced in a later direct verification pass.

#### Fix

- Reproduce the issue in the current execution context before recording it as durable repo knowledge.
- Verify important writes with an independent follow-up check such as `read_file`, `git status`, or terminal inspection.
- If the anomaly only appears in a delegated or sandboxed context, document it narrowly with that context spelled out.

#### Validation

- A direct rerun in the current session reproduces the failure consistently, or later verification shows normal behavior and the broad claim is removed.

### Antigravity: Lessons learned aren't visible to teammate's agents

#### Symptom

Antigravity thoroughly researched and optimized a pattern on a local machine, but teammates' agents or CI runners do not seem to be aware of the pattern.

#### Likely causes

- Antigravity saved the context internally inside its Persistent Context layer (Knowledge Items or Context Logs). Neither is visible to a CI agent or a teammate's IDE.

#### Fix

- Direct Antigravity to write the finalized documentation or conventions into `.agents/docs/` or explicitly run `task-closeout` exporting the lesson. The `.agents/` tree is the shared communication boundary for all tools, so local Knowledge Items must be periodically distilled.

#### Validation

- The lesson is visible under `.agents/` and trackable via `git log`.

### Windows-to-WSL Tool Path Failures

#### Symptom

Agent tool calls to list, read, or write files in a WSL workspace fail with "The system cannot find the file specified" or "The directory name is invalid" from a Windows host.

#### Likely causes

- Agent is targeting Linux-style paths (`/Ubuntu/home/`) or improperly formatted network paths (`//wsl.localhost/`) directly in Windows APIs.

#### Fix

- Ensure path targets are properly formatted Windows paths (e.g., `\\wsl.localhost\Ubuntu\home\...`) matching the actual host environment layout.

#### Validation

- Tool calls complete successfully.

### Gemini CLI not following durable guidance

#### Symptom

Gemini CLI ignores playbooks, repo decisions, or conventions stored under `.agents/`.

#### Likely causes

- Lack of a root `GEMINI.md` file.
- The root `GEMINI.md` does not explicitly mandate reading `.agents/AGENTS.md`.

#### Fix

- Create or update `GEMINI.md` at the project root to include a mandate: "Read and follow `.agents/AGENTS.md` at the start of every session."

#### Validation

- Gemini CLI acknowledges the mandates in `GEMINI.md` and correctly references `.agents/` files during its Research phase.

### GitHub Copilot Chat context not in focus

#### Symptom

Copilot Chat answers don't reference `.agents/AGENTS.md` even though `.github/copilot-instructions.md` exists.

#### Likely causes

- `.github/copilot-instructions.md` is not being read at session start; verify file exists and VS Code recognizes the discovery.
- Copilot Chat is using a conversation-scoped context model; `.agents/AGENTS.md` is not automatically in context outside the `.agents/` directory.
- Nested `.agents/` files require explicit `@` reference or prompt in chat.

#### Fix

- Use `@.agents/AGENTS.md` or `@.agents/docs/index.md` in chat when context is needed.
- Ask Copilot to read the bootstrap file: "What does `.github/copilot-instructions.md` tell you?"
- For persistent guidance, use root `AGENTS.md` instead of relying only on nested `.agents/AGENTS.md`.

#### Validation

- Open `.github/copilot-instructions.md` and confirm it routes to `.agents/`.
- In Copilot Chat, use `@` to explicitly reference durable files when needed.

### Clean `git status` but you need touched paths for closeout

#### Symptom

The working tree is clean (changes already committed), but **task-closeout** needs an accurate list of paths touched in the session.

#### Likely causes

- Commits landed before closeout.
- The arc spans multiple commits.

#### Fix

- Use `git log -1 --name-only` for the latest commit, or widen the window (`git log -N --name-only`, or `git diff --name-only <base>..HEAD`) to match the task scope.

#### Validation

- Closeout artifacts (for example `changed-files.txt`) list the expected paths.

### Session Discovery Fails During Distillation or Closeout

#### Symptom

A first-pass glob suggests `.agents/sessions/` contains no bundles, even though active sessions exist.

#### Likely causes

- Searching for misspelled or non-existent directories.
- Using a narrow glob and accepting an incomplete result without structure-aware verification.

#### Fix

- Verify with a structure-aware query like `.agents/sessions/*/summary.json` before assuming the directory is empty.
- Read `summary.json` to filter sessions by state fields such as `distilled` rather than relying on folder names.

#### Validation

- The correct list of active or undistilled session bundles is found and enumerated.

