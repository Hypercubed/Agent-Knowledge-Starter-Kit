---
id: stalled-maintenance-scripts
title: "Stalled maintenance scripts"
last_updated: 2026-04-25
description: >
  Long-running scripts (especially those using npx) may appear stuck 
  due to buffered output.
tags: [tooling, scripts, npx]
---

#### Symptom
A maintenance script (like `generate-example`) appears to hang or produce no output for several minutes when run in the background.

#### Likely causes
- `npx` commands can be slow as they download or resolve dependencies.
- Output might be buffered, hiding progress until a large chunk is ready or the command completes.

#### Fix
- Run the script with a `--verbose` flag if available.
- Execute the script using `bash -x <script_path>` to see each command as it runs.
- Check the `command_status` frequently to see if the PID is still active.

#### Validation
Progress messages or shell trace (`set -x`) output should appear in the terminal/status.
