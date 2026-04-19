---
id: kit-installation-guidance-lives-in-root-docs
title: "Kit installation guidance lives in root docs"
last_updated: 2026-04-19
---

# Kit installation guidance lives in root docs

### Status

Accepted

### Context

Adopter-facing setup instructions need to explain how to copy or merge the starter kit into a target repository, including cases where `.agents/` already exists.

### Rationale

Installation guidance is about consuming this starter repository, not durable knowledge that every consumer should inherit inside its copied `.agents/` tree. Keeping setup guidance in root docs such as `README.md` and `INSTALL.md` lets `.agents/` remain a clean consumer `.agents/` template.

### Consequences

- Put human quick-start guidance, agent install prompts, and detailed install checklists in root docs.
- Add content to `.agents/` only when every adopter should receive it inside their `.agents/` tree.
- If installation guidance creates a durable local policy, record the rationale here rather than duplicating the full checklist.
