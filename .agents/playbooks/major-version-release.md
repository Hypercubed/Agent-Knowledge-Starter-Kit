# Major Version Release

When preparing a major version release for this starter kit, ensure you perform the following checks to keep the starter repository clean and consistent:

1. **Search for deprecated artifacts:** Aggressively `grep` the entire repository (including all docs, skills, and playbooks) for old file names or legacy artifact terms (e.g., `docs-search-index.json`). This ensures that removed tools do not leave lingering references in documentation.
2. **Review platform portability:** Ensure newly added python or bash scripts handle cross-platform paths correctly (e.g., Windows path separators vs Linux).
3. **Run tests:** Ensure the kit layout is healthy via `bash scripts/check-agents-structure.sh .agents` and `bash scripts/check-publish.sh`.
