# Design: Manifest-Based Docs Structure

## Manifest Location
`.agents/docs/manifest.yaml`

## Manifest Schema
```yaml
roots:
  - .agents/docs

types:
  plan:
    path: plans
  decision:
    path: decisions
  troubleshooting:
    path: troubleshooting

extra_paths:
  - wiki
  - notes
```

## Semantics
- "roots" define top-level search locations
- "types" define structured content used by skills
- "extra_paths" define unstructured, search-only folders

## Path Resolution
For typed content: `<root>/<types[type].path>/<slug>.md`

Example: `.agents/docs/plans/add-plan-writing.md`

## Search Integration
Search tools will include all "roots", "types[*].path", and "extra_paths". No indexing required.

## maintenance.md Generation
Introduce a generated file: `.agents/docs/maintenance.md`

Generated from the manifest and includes:
- list of typed folders
- list of extra paths
- search scope description
- usage notes

This file is derived and should not be manually edited.