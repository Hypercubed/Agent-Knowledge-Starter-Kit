# Tasks: Introduce Manifest-Based Docs Structure

- [ ] Phase 1: Define manifest
  - [ ] Add "manifest.yaml" with initial schema
  - [ ] Populate with current folder structure

- [ ] Phase 2: Implement resolver
  - [ ] Create utility to resolve paths from "(type, slug)"
  - [ ] Replace hardcoded paths in "write-plan" skill

- [ ] Phase 3: Update search integration
  - [ ] Modify search script to read manifest
  - [ ] Build search paths from "roots", "types", and "extra_paths"

- [ ] Phase 4: Add extra_paths support
  - [ ] Ensure search includes these folders
  - [ ] Do not allow skills to write to them

- [ ] Phase 5: Generate maintenance.md
  - [ ] Implement generator script
  - [ ] Output structured overview of manifest
  - [ ] Add npm script for regeneration

- [ ] Phase 6: Validate
  - [ ] Test path resolution across types
  - [ ] Test search across all configured paths
  - [ ] Add a sample "wiki/" folder and verify behavior