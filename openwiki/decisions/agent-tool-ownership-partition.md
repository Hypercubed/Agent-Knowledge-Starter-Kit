---
type: Decision
title: Agent-tool ownership partition via receipts
description: When an installer receipt exists in a target agent's directory, that
  installing lane owns the directory and all other lanes skip it; AKSK never writes
  into another lane's owned directory.
tags:
- distribution
- integrations
- policy
timestamp: '2026-08-23T00:00:00Z'
aksk_status: accepted
aksk_depends_on:
- decisions/openwiki-integration-distribution-stack
---

# Agent-tool ownership partition via receipts

### Status

Accepted

### Context

Multiple installation lanes can target the same agent configuration directories (per-agent skill folders, MCP config files). Without coordination, two lanes overwrite each other's files or duplicate registrations, and uninstall by one lane breaks the other's assumptions.

### Decision

Ownership is claimed and detected by receipt: when a lane installs into an agent directory it records a receipt file there, and the presence of another lane's receipt marks that directory as owned. Lanes check for foreign receipts before writing and skip owned directories rather than merging or overwriting. Absence of any receipt means the directory is unmanaged and available.

### Rationale

Receipts turn an ambiguous multi-writer problem into a local file check that every lane can perform deterministically, without a central registry or network coordination.

### Related

- [OpenWiki integration distribution stack](openwiki-integration-distribution-stack.md)
