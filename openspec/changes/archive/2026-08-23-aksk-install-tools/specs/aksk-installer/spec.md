## ADDED Requirements

### Requirement: Install External Tools
The installer SHALL ensure `openspec` and `openwiki` are installed in the user's repository, typically as `devDependencies`.

#### Scenario: Running the installer in a new repository
- **WHEN** the user executes the init command
- **THEN** the system installs `openspec` and `openwiki` via the local package manager
