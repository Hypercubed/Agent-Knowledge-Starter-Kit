#!/usr/bin/env python3
"""
Build wiki-index.json from `.agents/docs/` (wiki root: first-level `*/index.md`
plus optional `index.md` at the wiki root).

Refreshes `decisions/` and `troubleshooting/` sibling indexes first by invoking
`scripts/generate-durable-indexes.py` from the repository root.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:  # pragma: no cover
    print("ERROR: PyYAML is required (`pip install pyyaml`).", file=sys.stderr)
    sys.exit(1)


def _find_repo_root(start: Path) -> Path | None:
    p = start.resolve()
    for candidate in [p, *p.parents]:
        if (candidate / ".git").is_dir() or (candidate / ".git").is_file():
            return candidate
    return None


def _read_frontmatter_block(text: str) -> tuple[dict[str, Any], str]:
    if not text.startswith("---\n"):
        return {}, text
    end = text.find("\n---\n", 4)
    if end == -1:
        return {}, text
    block = text[4:end]
    body = text[end + 5 :]
    data = yaml.safe_load(block)
    fm = data if isinstance(data, dict) else {}
    return fm, body


def _squish_ws(s: str) -> str:
    return " ".join(s.split())


def _first_markdown_paragraph(body: str) -> str:
    lines = body.lstrip("\n").splitlines()
    buf: list[str] = []
    in_fence = False
    for line in lines:
        if line.strip().startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        if line.startswith("#"):
            continue
        stripped = line.strip()
        if not stripped:
            if buf:
                break
            continue
        if stripped == "## Index":
            break
        buf.append(stripped)
    return _squish_ws(" ".join(buf))[:500]


def _first_h1_title(body: str) -> str | None:
    for line in body.lstrip("\n").splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return None


def _section_record(
    *,
    wiki_root: Path,
    repo_root: Path,
    index_path: Path,
    folder_label: str,
) -> dict[str, Any]:
    text = index_path.read_text(encoding="utf-8")
    fm, body = _read_frontmatter_block(text)
    title = fm.get("title")
    if isinstance(title, str) and title.strip():
        title_out = _squish_ws(title)
    else:
        h1 = _first_h1_title(body)
        title_out = h1 or folder_label.replace("-", " ").replace("_", " ").title()

    desc = fm.get("description")
    if isinstance(desc, str) and desc.strip():
        description = _squish_ws(desc)[:800]
    else:
        description = _first_markdown_paragraph(body)

    rel_repo = index_path.resolve().relative_to(repo_root.resolve())
    wiki_relpath = index_path.resolve().relative_to(wiki_root.resolve()).as_posix()
    return {
        "id": folder_label or "docs-root",
        "title": title_out,
        "description": description,
        "path": rel_repo.as_posix(),
        "wiki_path": wiki_relpath,
        "folder": folder_label,
    }


def _refresh_durable_indexes(repo_root: Path, dry_run: bool) -> None:
    script = repo_root / "scripts" / "generate-durable-indexes.py"
    if not script.is_file():
        print(f"WARN: missing {script}; skipping index refresh.", file=sys.stderr)
        return
    cmd = [
        sys.executable,
        str(script),
        "-t",
        str(repo_root / ".agents" / "docs" / "decisions"),
        "-t",
        str(repo_root / ".agents" / "docs" / "troubleshooting"),
    ]
    if dry_run:
        cmd.append("--dry-run")
    proc = subprocess.run(cmd, cwd=str(repo_root), check=False)
    if proc.returncode not in (0, 2):
        print(
            f"WARN: {script.name} exited {proc.returncode}; continuing wiki scan.",
            file=sys.stderr,
        )


def _collect_sections(wiki_root: Path, repo_root: Path) -> list[dict[str, Any]]:
    sections: list[dict[str, Any]] = []
    root_index = wiki_root / "index.md"
    if root_index.is_file():
        sections.append(
            _section_record(
                wiki_root=wiki_root,
                repo_root=repo_root,
                index_path=root_index,
                folder_label="",
            )
        )

    for child in sorted(wiki_root.iterdir()):
        if not child.is_dir():
            continue
        idx = child / "index.md"
        if not idx.is_file():
            continue
        sections.append(
            _section_record(
                wiki_root=wiki_root,
                repo_root=repo_root,
                index_path=idx,
                folder_label=child.name,
            )
        )
    return sections


def main() -> int:
    parser = argparse.ArgumentParser(description="Build wiki-index.json under wiki-search.")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Refresh durable indexes in dry-run mode only; do not write wiki-index.json.",
    )
    parser.add_argument(
        "--no-refresh-indexes",
        action="store_true",
        help="Skip running scripts/generate-durable-indexes.py first.",
    )
    args = parser.parse_args()

    skill_dir = Path(__file__).resolve().parent.parent
    repo_root = _find_repo_root(skill_dir)
    if repo_root is None:
        print("ERROR: could not locate repository root (.git).", file=sys.stderr)
        return 1

    wiki_root = repo_root / ".agents" / "docs"
    if not wiki_root.is_dir():
        print(f"ERROR: wiki root not found: {wiki_root}", file=sys.stderr)
        return 1

    if not args.no_refresh_indexes:
        _refresh_durable_indexes(repo_root, dry_run=args.dry_run)

    sections = _collect_sections(wiki_root, repo_root)
    payload = {
        "version": 1,
        "wiki_root": ".agents/docs",
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "sections": sections,
    }

    out_path = skill_dir / "wiki-index.json"
    if args.dry_run:
        print(json.dumps(payload, indent=2)[:2000] + "\n...", file=sys.stderr)
        print(f"DRY-RUN: would write {out_path}", file=sys.stderr)
        return 0

    out_path.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    print(f"Wrote {out_path} ({len(sections)} sections).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
