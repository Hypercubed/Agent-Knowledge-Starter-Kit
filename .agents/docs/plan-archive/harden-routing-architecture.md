---
id: harden-routing-architecture
title: "Harden routing architecture"
last_updated: 2026-04-28
description: "A comprehensive, three-phase plan to harden the routing architecture, ensure consumers of the kit inherit these best practices, and definitively prove that the system works."
tags:
  - routing
  - architecture
  - hardening
status: completed
---

# Harden Routing Architecture

## Phase 1: Hardening the Root AGENTS.md

The goal here is to transform the root AGENTS.md from a passive map into an active traffic controller. Agents need explicit triggers to break them out of their default behavior (which is usually to immediately start writing code or guessing at fixes).

Implement "On-Startup" Directives: Force the agent to ingest the project's architectural map immediately.

Action: Add a mandatory rule: "UPON STARTUP: You MUST read .agents/docs/index.md before executing any file modifications. This ensures you understand the repository layout and available tools."

Create Strict Triggers for docs-search: Tie the search skill directly to specific developer pain points.

Action: Add a troubleshooting trigger: "WHEN DEBUGGING: If you encounter a failing test, build error, or runtime exception, your FIRST action MUST be to execute .agents/skills/docs-search using the error output as your query."

Enforce Architectural Compliance: Ensure that the Architectural Decision Records (ADRs) and Docs-as-Code you've established are actually respected.

Action: Add a planning trigger: "BEFORE ARCHITECTURAL CHANGES: You MUST search .agents/docs/decisions/ or read its index.md to ensure your proposed changes do not violate established design patterns."

## Phase 2: Propagating Guidance to Consumers

If other developers adopt the Starter Kit, they need this hardened routing out of the box, rather than having to discover the discoverability problem themselves.

Option A: Update the INSTALL.md (Manual Route)

Revise the "agent-facing installation and merge checklist" within INSTALL.md. Add a step requiring the agent assisting with the installation to inject the strict MUST/WHEN triggers into the target repository's root AGENTS.md.

Option B: Update the Initialization Templates (Automated Route - Recommended)

If your portable kit skills (like generate-example) use a bootstrap/ tree to initialize the setup, modify the template AGENTS.md inside those folders.

Action: Ensure the default AGENTS.md copied into a consumer's repo already contains the strict "On-Startup", "When Debugging", and "Before Architectural Changes" directives. This makes the "pit of success" the default state.

## Phase 3: The Verification & Validation Plan

To confidently publish v2.0, you need empirical evidence that agents are reading the fragmented knowledge base.

### 1. The Synthetic "Amnesia" Test (Unit Testing for Agents)

Create a controlled environment to prove the routing logic fires correctly.

Step A: Branch off develop into a sandboxed test branch.

Step B: Introduce a highly specific, non-obvious bug (e.g., a deliberate misconfiguration in a build script or an obscure mock data error).

Step C: Document the exact, counter-intuitive fix in a deeply nested file: .agents/docs/troubleshooting/synthetic-bug-fix.md. Run docs-compile if necessary to update the index.

Step D: Launch a fresh agent session (using Roo Code, OpenClaw, etc.) with a blank context window. Instruct it: "Fix the failing build."

Success Criteria: Review the agent's tool execution trace. The test passes only if the agent executes docs-search (or reads the index) BEFORE it attempts to rewrite the broken code.

### 2. Skill Telemetry (Continuous Validation)

Implement a lightweight, persistent way to monitor tool usage across general development.

Action: Update the .agents/skills/docs-search script to silently append every search query and a timestamp to an ignored local file (e.g., .agents/logs/search-telemetry.log).

Value: Over the course of a week of regular development, you can review this log. If it is full of queries, your agents are actively self-serving knowledge. If it remains empty, the root AGENTS.md triggers are still too weak.
