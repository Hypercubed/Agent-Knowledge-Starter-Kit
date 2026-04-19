---
id: shared-integration-patterns-belong-in-docs-integrations-patterns-md
title: "Shared integration patterns belong in `docs/integrations/patterns.md`"
last_updated: 2026-04-19
---

# Shared integration patterns belong in `docs/integrations/patterns.md`

#### Status

Accepted

#### Context

The product-specific integration guides began repeating the same "thin wiring, canonical `.agents/`" guidance across many tools.

#### Rationale

Shared integration concepts are easier to maintain in one pattern guide. Product pages stay useful when they focus on tool-specific filenames, snippets, caveats, verification dates, and references.

#### Consequences

- Put reusable integration models and comparison matrices in `docs/integrations/patterns.md`.
- Keep product-specific integration pages as quick references that link back to the shared pattern guide.
- Update both integration indexes when adding or reorganizing integration guides.
