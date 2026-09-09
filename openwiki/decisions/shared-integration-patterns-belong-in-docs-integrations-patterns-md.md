---
type: Decision
title: Shared integration patterns belong in `docs/integrations/patterns.md`
description: 'Cross-vendor patterns that are not kit-specific belong in `docs/integrations/patterns.md`
  instead of duplicating them across agent trees.

  '
tags:
- docs
- integrations
- architecture
timestamp: '2026-04-19T00:00:00Z'
aksk_status: accepted
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
