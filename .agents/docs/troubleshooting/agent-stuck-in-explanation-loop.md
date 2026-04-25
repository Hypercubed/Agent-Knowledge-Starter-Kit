---
id: agent-stuck-in-explanation-loop
title: "Agent stuck in explanation loop"
last_updated: 2026-04-25
description: Recover from agents repeatedly describing processes instead of executing them.
tags:
  - agent-behavior
  - prompt-engineering
---

# Agent stuck in explanation loop

If an agent describes its process repeatedly rather than executing the requested file operations or commands:

1. **Explicit constraints:** Specify the exact output format required, such as "Only output the JSON" or "Only write the file".
2. **Imperative urgency:** Use strong directive verbs with immediate timing (e.g., "Write the bundle now" or "Execute actions immediately").
