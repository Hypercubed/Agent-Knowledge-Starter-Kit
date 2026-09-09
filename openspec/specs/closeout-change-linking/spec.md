# closeout-change-linking Specification

## Purpose
Connects captured sessions to the OpenSpec intent layer so implementation history stays traceable: bundles record which change they served, and spec updates happen at archive time rather than at closeout time.

## Requirements
### Requirement: Session bundles link to OpenSpec changes
`task-closeout` SHALL include an `openspec_change` field in `summary.json` naming the OpenSpec change the task worked on, when one exists.

#### Scenario: Closeout after working a change
- **WHEN** a session performed work under an OpenSpec change and runs closeout
- **THEN** the resulting `summary.json` records that change name in `openspec_change`

#### Scenario: Session unrelated to any change
- **WHEN** a session had no associated OpenSpec change
- **THEN** `openspec_change` is absent or null and closeout succeeds normally

### Requirement: Spec updates defer to archive time
Spec updates SHALL happen when an OpenSpec change is archived (`/opsx:archive`), not during task closeout; closeout captures state but does not modify specs under `openspec/`.

#### Scenario: Closeout during an in-flight change
- **WHEN** closeout runs while the linked change is still active
- **THEN** files under `openspec/` are left untouched and the bundle notes pending spec updates for archive time
