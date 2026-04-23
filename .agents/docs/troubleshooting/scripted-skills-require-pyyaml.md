---
id: scripted-skills-require-pyyaml
title: "Scripted skills fail with ImportError: PyYAML is required"
last_updated: 2026-04-23
description: >
  Maintenance scripts under `.agents/skills/` fail when the environment
  lacks required Python dependencies.
tags: [python, skills, build]
---

#### Symptom
Running a scripted skill (for example `docs-compile.sh` or `search-docs.py`) fails with an error message:
`ERROR: PyYAML is required (`pip install pyyaml`).`

#### Likely causes
The sandbox or local environment was initialized without the necessary Python packages for the knowledge layer's maintenance scripts.

#### Fix
Install the missing dependencies using `pip`:
```bash
pip install pyyaml rank_bm25
```

#### Validation
Run a script to confirm the error is resolved:
```bash
python3 .agents/skills/docs-search/scripts/index-docs.py
```
