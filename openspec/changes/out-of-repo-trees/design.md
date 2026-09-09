# Design: Out-of-Repo Knowledge Trees

## Overview

The Agent Knowledge Starter Kit supports multiple knowledge trees that can overlay and extend the repository's `.agents/` layer. This design establishes the architecture for managing out-of-repo trees (user and organization level) while maintaining consistency and security.

## Tree Hierarchy and Locations

### Repository Tree (Primary)
- **Location**: `.agents/` in repository root
- **Purpose**: Project-specific knowledge, shared conventions, CI requirements
- **Scope**: All team members working on the repository

### User Tree (Personal Overlay)
- **Location**: `~/.agents/` (user home directory)
- **Purpose**: Personal preferences, tool configurations, workflow customizations
- **Scope**: Individual developer only

### Organization Tree (Team Overlay)
- **Location**: Configurable path (e.g., `/org/.agents/`, `~/.org/.agents/`)
- **Purpose**: Team policies, organizational standards, shared tooling
- **Scope**: All members of the organization/team

## Precedence and Resolution Rules

Knowledge trees are merged with the following precedence (highest to lowest):

1. **Repository Tree** - Always takes precedence for project-critical knowledge
2. **Organization Tree** - Overrides user preferences for team standards
3. **User Tree** - Personal customizations that don't conflict with higher levels

### Conflict Resolution
- **Same key exists in multiple trees**: Higher precedence tree wins
- **Partial overrides**: Trees can selectively override specific sections
- **Inheritance**: Lower precedence trees inherit from higher ones unless explicitly overridden

## In-Repository Requirements

The following knowledge MUST remain in the repository tree for consistency:

- **CI/CD configurations** (`.agents/scripts/`, build rules)
- **Shared conventions** (coding standards, commit message formats)
- **Security policies** (access controls, secret handling)
- **Project structure** (directory layouts, file naming)

## Security and Hygiene Practices

### Validation Requirements
- **Source verification**: All overlay trees should validate their source integrity
- **No secrets**: Never store credentials or secrets in overlay trees
- **Audit logging**: Track when overlay knowledge is applied

### Safe Loading
- **Isolated execution**: Overlay knowledge runs in sandboxed context
- **Permission checks**: Verify user/org has access to apply overlays
- **Fallback behavior**: Graceful degradation if overlay fails to load

## Implementation Architecture

### Knowledge Merger
A merging component that:
- Loads all available trees in precedence order
- Resolves conflicts according to rules
- Provides unified view to agents

### Tree Discovery
Automatic discovery of overlay trees:
- Check standard locations
- Respect environment variables for custom paths
- Validate tree structure and integrity

### Documentation Structure

```
.agents/docs/
├── integrations/
│   └── out-of-repo-trees.md    # Main guidance document
├── decisions/
│   └── overlay-precedence.md   # Detailed precedence rules
└── troubleshooting/
    └── overlay-conflicts.md    # Common issues and solutions
```