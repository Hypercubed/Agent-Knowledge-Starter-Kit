#!/usr/bin/env python3
"""
Rank wiki sections from wiki-index.json using simple token overlap + regex.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any


def _load_index(skill_dir: Path) -> dict[str, Any]:
    path = skill_dir / "wiki-index.json"
    if not path.is_file():
        print(
            f"ERROR: {path} not found. Run: python3 scripts/index-wiki.py",
            file=sys.stderr,
        )
        sys.exit(2)
    return json.loads(path.read_text(encoding="utf-8"))


def _tokenize(q: str) -> list[str]:
    q = q.casefold()
    return [t for t in re.split(r"[^a-z0-9_]+", q) if len(t) >= 2]


def _score_section(query: str, tokens: list[str], sec: dict[str, Any]) -> float:
    hay = " ".join(
        [
            str(sec.get("title", "")),
            str(sec.get("description", "")),
            str(sec.get("path", "")),
            str(sec.get("wiki_path", "")),
            str(sec.get("folder", "")),
        ]
    ).casefold()

    score = 0.0
    if query.casefold() in hay:
        score += 12.0
    for tok in tokens:
        if tok in hay:
            score += 3.0
        try:
            if re.search(re.escape(tok), hay):
                score += 1.0
        except re.error:
            pass
    return score


def _folder_display(folder: str) -> str:
    if not folder:
        return ".agents/docs/"
    return f".agents/docs/{folder}/"


def main() -> int:
    parser = argparse.ArgumentParser(description="Search wiki-index.json.")
    parser.add_argument("query", help="Free-text query")
    parser.add_argument(
        "-n",
        "--limit",
        type=int,
        default=5,
        help="Max results (default: 5)",
    )
    args = parser.parse_args()

    skill_dir = Path(__file__).resolve().parent.parent
    data = _load_index(skill_dir)
    sections = data.get("sections")
    if not isinstance(sections, list):
        print("ERROR: invalid index: missing sections[]", file=sys.stderr)
        return 1

    query = args.query.strip()
    if not query:
        print("ERROR: empty query", file=sys.stderr)
        return 1

    tokens = _tokenize(query)
    ranked: list[tuple[float, dict[str, Any]]] = []
    for sec in sections:
        if not isinstance(sec, dict):
            continue
        s = _score_section(query, tokens, sec)
        if s > 0:
            ranked.append((s, sec))
    ranked.sort(key=lambda x: (-x[0], str(x[1].get("path", ""))))

    limit = max(1, args.limit)
    top = ranked[:limit]

    print("🏷️ TOP MATCHES:\n")
    if not top:
        print("(no matches — run index-wiki.py or broaden your query)")
        return 0

    for score, sec in top:
        title = sec.get("title", "(untitled)")
        desc = str(sec.get("description", "")).strip()
        wiki_path = sec.get("wiki_path") or sec.get("path", "")
        folder = str(sec.get("folder", ""))
        rel_from_skill = f"../../docs/{wiki_path}" if wiki_path else "../../docs/index.md"
        print(f"📁 {_folder_display(folder)}")
        print(f"   {title}")
        if desc:
            short = desc if len(desc) <= 220 else desc[:217] + "..."
            print(f"   {short}")
        print(f"   📄 {rel_from_skill}")
        print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
