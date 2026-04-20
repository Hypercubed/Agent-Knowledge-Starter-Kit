#!/usr/bin/env python3
"""
Build docs-search-index.json from `.agents/docs/` (docs root: first-level
`*/index.md` plus optional root `index.md`).

Does not regenerate durable `decisions/` or `troubleshooting/` indexes; run
`bash scripts/docs-compile.sh` or `python3 scripts/generate-durable-indexes.py`
first when those entries changed.
"""

from __future__ import annotations

import argparse
import json
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
    docs_root: Path,
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
    docs_relpath = index_path.resolve().relative_to(docs_root.resolve()).as_posix()
    return {
        "id": folder_label or "docs-root",
        "title": title_out,
        "description": description,
        "path": rel_repo.as_posix(),
        "docs_path": docs_relpath,
        "folder": folder_label,
    }


def _collect_sections(docs_root: Path, repo_root: Path) -> list[dict[str, Any]]:
    sections: list[dict[str, Any]] = []
    root_index = docs_root / "index.md"
    if root_index.is_file():
        sections.append(
            _section_record(
                docs_root=docs_root,
                repo_root=repo_root,
                index_path=root_index,
                folder_label="",
            )
        )

    for child in sorted(docs_root.iterdir()):
        if not child.is_dir():
            continue
        idx = child / "index.md"
        if not idx.is_file():
            continue
        sections.append(
            _section_record(
                docs_root=docs_root,
                repo_root=repo_root,
                index_path=idx,
                folder_label=child.name,
            )
        )
    return sections


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Build docs-search-index.json under docs-search skill."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print sample JSON to stderr only; do not write docs-search-index.json.",
    )
    args = parser.parse_args()

    skill_dir = Path(__file__).resolve().parent.parent
    repo_root = _find_repo_root(skill_dir)
    if repo_root is None:
        print("ERROR: could not locate repository root (.git).", file=sys.stderr)
        return 1

    docs_root = repo_root / ".agents" / "docs"
    if not docs_root.is_dir():
        print(f"ERROR: docs root not found: {docs_root}", file=sys.stderr)
        return 1

    sections = _collect_sections(docs_root, repo_root)
    payload = {
        "version": 2,
        "docs_root": ".agents/docs",
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "sections": sections,
    }

    out_path = skill_dir / "docs-search-index.json"
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
