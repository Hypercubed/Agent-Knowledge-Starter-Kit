#!/usr/bin/env python3
"""
Search durable docs using a layered fallback strategy:
rg -> git grep -> grep -> native Python fallback.
"""

from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any

DEBUG = os.environ.get("DEBUG_SEARCH") == "1"


def _find_agents_root(start: Path) -> Path | None:
    p = start.resolve()
    for candidate in [p, *p.parents]:
        agents = candidate / ".agents"
        if agents.is_dir():
            return agents
    return None


def _resolve_agents_root(args_agents_root: Path | None) -> Path | None:
    raw: Path | None = args_agents_root
    if raw is None and "AGENTS_ROOT" in os.environ:
        raw = Path(os.environ["AGENTS_ROOT"])
    if raw is not None:
        candidate = raw.expanduser().resolve()
        return candidate if candidate.name == ".agents" else candidate / ".agents"
    return _find_agents_root(Path.cwd())


def _get_metadata(file_path: Path) -> dict[str, str]:
    try:
        content = file_path.read_text(encoding="utf-8")
    except Exception:
        return {"title": file_path.stem, "description": ""}

    title = ""
    description = ""

    # Simple frontmatter extraction
    fm_match = re.match(r"^---\n([\s\S]*?)\n---\n", content)
    if fm_match:
        fm = fm_match.group(1)
        title_match = re.search(r"^title:\s*(.*)$", fm, re.MULTILINE)
        if title_match:
            title = title_match.group(1).strip("'\"").strip()
        desc_match = re.search(r"^description:\s*(.*)$", fm, re.MULTILINE)
        if desc_match:
            description = desc_match.group(1).strip("'\"").strip()

    if not title:
        h1_match = re.search(r"^#\s+(.*)$", content, re.MULTILINE)
        if h1_match:
            title = h1_match.group(1).strip()
        else:
            title = file_path.stem.replace("-", " ").replace("_", " ").title()

    if not description:
        # First paragraph heuristic
        body = re.sub(r"^---\n[\s\S]*?\n---\n", "", content).strip()
        paragraphs = re.split(r"\n\s*\n", body)
        for p in paragraphs:
            clean = re.sub(r"#+.*$", "", p, flags=re.MULTILINE).strip()
            if clean and not clean.startswith("```"):
                description = " ".join(clean.splitlines())[:200].strip()
                if len(description) == 200:
                    description += "..."
                break

    return {"title": title, "description": description}


def _folder_display(repo_path: str) -> str:
    if repo_path.startswith(".agents/playbooks/"):
        return ".agents/playbooks/"
    if repo_path == ".agents/AGENTS.md":
        return ".agents/"

    parts = repo_path.split("/")
    # .agents/docs/folder/file.md -> parts=[.agents, docs, folder, file.md]
    if len(parts) >= 2 and parts[0] == ".agents" and parts[1] == "docs":
        if len(parts) > 3:
            return f".agents/docs/{parts[2]}/"
        return ".agents/docs/"
    return ".agents/"


def _get_existing_search_paths(repo_root: Path) -> list[str]:
    candidates = [".agents/docs", ".agents/playbooks", ".agents/AGENTS.md"]
    return [c for c in candidates if (repo_root / c).exists()]


def _run_search(cmd: str, args: list[str], repo_root: Path) -> list[str]:
    try:
        result = subprocess.run(
            [cmd, *args],
            cwd=repo_root,
            capture_output=True,
            text=True,
            check=False,
        )
        if result.returncode == 0:
            return [line for line in result.stdout.strip().splitlines() if line]
    except Exception:
        pass
    return []


def _search_with_rg(repo_root: Path, query: str, limit: int, force_disable: bool = False) -> list[str] | None:
    if force_disable or not shutil.which("rg"):
        return None

    paths = _get_existing_search_paths(repo_root)
    if not paths:
        return []

    if DEBUG:
        print(f"Trying search with ripgrep in {paths}...", file=sys.stderr)

    args = ["-l", "-i", "--", query] + paths
    results = _run_search("rg", args, repo_root)
    return results[:limit]


def _search_with_git_grep(repo_root: Path, query: str, limit: int, force_disable: bool = False) -> list[str] | None:
    if force_disable or not shutil.which("git"):
        return None

    paths = _get_existing_search_paths(repo_root)
    if not paths:
        return []

    if DEBUG:
        print(f"Trying search with git grep in {paths}...", file=sys.stderr)

    args = ["grep", "-l", "-i", query, "--"] + paths
    results = _run_search("git", args, repo_root)
    return results[:limit]


def _search_with_grep(repo_root: Path, query: str, limit: int, force_disable: bool = False) -> list[str] | None:
    if force_disable or not shutil.which("grep"):
        return None

    paths = _get_existing_search_paths(repo_root)
    if not paths:
        return []

    if DEBUG:
        print(f"Trying search with grep in {paths}...", file=sys.stderr)

    args = ["-r", "-l", "-i", "--", query] + paths
    results = _run_search("grep", args, repo_root)
    return results[:limit]


def _search_native(repo_root: Path, query: str, limit: int) -> list[str]:
    if DEBUG:
        print("Trying search with native Python fallback...", file=sys.stderr)

    results: list[str] = []
    search_dirs = [repo_root / c for c in [".agents/docs", ".agents/playbooks", ".agents/AGENTS.md"]]

    for start_path in search_dirs:
        if not start_path.exists():
            continue
        if start_path.is_file():
            paths = [start_path]
        else:
            paths = sorted(start_path.rglob("*.md"))

        for p in paths:
            try:
                if query.lower() in p.read_text(encoding="utf-8").lower():
                    results.append(str(p.relative_to(repo_root).as_posix()))
                    if len(results) >= limit:
                        return results
            except Exception:
                continue
    return results


def main() -> int:
    parser = argparse.ArgumentParser(description="Search docs with layered fallbacks.")
    parser.add_argument("query", help="Search query")
    parser.add_argument("-n", "--limit", type=int, default=5, help="Max results (default: 5)")
    parser.add_argument("--agents-root", type=Path, default=None, help="Path to .agents directory")
    args = parser.parse_args()

    query = args.query.strip()
    if not query:
        print("ERROR: positional argument 'query' is required.", file=sys.stderr)
        return 1

    agents_root = _resolve_agents_root(args.agents_root)
    if not agents_root or not agents_root.is_dir():
        print("ERROR: could not locate .agents directory.", file=sys.stderr)
        return 1

    repo_root = agents_root.parent
    limit = max(1, args.limit)

    disable_rg = os.environ.get("DISABLE_RG") == "1"
    disable_git = os.environ.get("DISABLE_GIT") == "1"
    disable_grep = os.environ.get("DISABLE_GREP") == "1"

    file_paths = _search_with_rg(repo_root, query, limit, disable_rg)
    if file_paths is None:
        file_paths = _search_with_git_grep(repo_root, query, limit, disable_git)
    if file_paths is None:
        file_paths = _search_with_grep(repo_root, query, limit, disable_grep)
    if file_paths is None:
        file_paths = _search_native(repo_root, query, limit)

    print("🏷️ TOP MATCHES:\n")

    if not file_paths:
        print("(no matches found)")
        return 0

    for repo_path in file_paths:
        full_path = repo_root / repo_path
        if not full_path.exists():
            continue

        meta = _get_metadata(full_path)
        folder = _folder_display(repo_path)
        rel_from_skill = f"../../../{repo_path}"

        print(f"📁 {folder}")
        print(f"   {meta['title']}")
        if meta["description"]:
            print(f"   {meta['description']}")
        print(f"   📄 {rel_from_skill}\n")

    return 0


if __name__ == "__main__":
    sys.exit(main())
