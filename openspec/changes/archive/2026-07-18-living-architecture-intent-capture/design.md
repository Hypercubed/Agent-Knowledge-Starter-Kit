# Design: Living Architecture & Intent Capture System

## Structural Changes

### Manifest Updates (.agents/manifest.json)
The manifest becomes the source of truth for location and governance rules, ensuring portability.

```json
{
  "paths": {
    "decisions": "docs/decisions",
    "templates": ".agents/templates"
  },
  "governance": {
    "capture_on_closeout": true,
    "adr_template": "adr-template.md"
  }
}
```

### New Directory: docs/decisions/
Houses all Markdown records with naming convention: NNNN-slug-title.md (e.g., 0001-spherical-coordinate-system.md).
Content combines Architectural Decision Records (ADR) and Operational Decisions.

## The "Editor" Workflow
Integrated into task-closeout playbook:

1. **Detection**: Git diff against starting state.
2. **Inference**: Categorize changes as Architectural or Operational.
3. **Proposal**: Present draft to user for confirmation/edit.
4. **Persistence**: Write approved record to manifest-defined path.

## Decision Points: Internal vs. External Tools

| Feature | Option A: Internal (AKSK Skill) | Option B: External Tool | Recommendation |
|---|---|---|---|
| Record Management | Custom agent scripts for naming/numbering | git-adr CLI | Option B: Use git-adr; wrap in AKSK skill |
| Diff Analysis | Agent reads git diff in prompt | Aider/Roo Code diff summarization | Option A: Custom prompt for "Why" vs "What" |
| Visual Mapping | Manual Mermaid.js edits in /docs | Structurizr/IcePanel | Option A: Simple Mermaid.js in Markdown |

## Skill Implementation

### document-intent.md (New Skill)
- Analyze session history and diff.
- Draft record using {adr_template}.
- Prompting: Propose draft, ask for validation/correction.
- Constraint: Never save without explicit approval.

### knowledge-lint.md (Updated)
- Check: Modified /src/core files have docs/decisions entries.
- Check: Decisions path reachable and indexed.

### distill-learning.md (Updated)
- Add docs/decisions to ingestion list.
- Synthesize recurring "Consequences" into global patterns.

## Implementation Strategy
- **Manifest First**: Establish .agents/manifest.json as source of truth.
- **Template Standardization**: Create .agents/templates/adr-template.md.
- **Workflow Integration**: Embed in task-closeout.
- **Linting Enforcement**: Update checks for intent-first standard.