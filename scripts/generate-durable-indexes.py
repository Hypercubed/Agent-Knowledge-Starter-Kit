#!/usr/bin/env python3
"""
Regenerate decisions/ and troubleshooting/ index.md files from durable-entry YAML
frontmatter (see .agents/docs/MAINTENANCE.md).

Requirements:
  - Python 3.9+
  - PyYAML (`pip install pyyaml` or your distro package)

Default roots:
  - .agents/docs/decisions
  - .agents/docs/troubleshooting

Usage:
  python3 scripts/generate-durable-indexes.py
  python3 scripts/generate-durable-indexes.py --agents-root path/to/.agents
"""

from __future__ import annotations

import argparse
import datetime as _dt
import json
import re
import sys
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:  # pragma: no cover
    print(
        "ERROR: PyYAML is required. Install with: pip install pyyaml",
        file=sys.stderr,
    )
    sys.exit(1)


_SLUG_RE = re.compile(r"^[a-z0-9_-]+$")


def _read_frontmatter_block(path: Path) -> tuple[dict[str, Any], str]:
    text = path.read_text(encoding="utf-8")
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


def _read_frontmatter(path: Path) -> dict[str, Any]:
    fm, _body = _read_frontmatter_block(path)
    return fm


def _normalize_title(raw: Any) -> str:
    if raw is None:
        return ""
    if not isinstance(raw, str):
        return str(raw)
    return " ".join(raw.split())


def _today_iso() -> str:
    return _dt.date.today().isoformat()


def _yaml_title_line(title: str) -> str:
    # Match existing kit indexes: `title: "..."` with JSON string escaping rules.
    return f"title: {json.dumps(title, ensure_ascii=False)}"


def _index_body_lines(
    heading: str, blurb: str, entries: list[tuple[str, str]]
) -> list[str]:
    lines: list[str] = [
        f"# {heading}",
        "",
        blurb,
        "",
        "## Index",
        "",
    ]
    for title, filename in entries:
        lines.append(f"- [{title}]({filename})")
    lines.append("")
    return lines


def _render_index(
    *,
    index_id: str,
    index_title: str,
    heading: str,
    blurb: str,
    entries: list[tuple[str, str]],
    last_updated: str,
) -> str:
    body = "\n".join(_index_body_lines(heading, blurb, entries))
    header = "\n".join(
        [
            "---",
            f"id: {index_id}",
            _yaml_title_line(index_title),
            f"last_updated: {last_updated}",
            "---",
        ]
    )
    return header + "\n\n" + body.lstrip("\n")


def _collect_entries(folder: Path, kind: str) -> list[tuple[Path, dict[str, Any]]]:
    out: list[tuple[Path, dict[str, Any]]] = []
    for path in sorted(folder.glob("*.md")):
        if path.name == "index.md":
            continue
        fm = _read_frontmatter(path)
        entry_id = fm.get("id")
        title = _normalize_title(fm.get("title"))
        if not title:
            print(f"WARN: missing title in {path}", file=sys.stderr)
            title = path.stem.replace("-", " ")
        if entry_id is not None and isinstance(entry_id, str):
            if entry_id != path.stem:
                print(
                    f"WARN: frontmatter id {entry_id!r} != filename stem "
                    f"{path.stem!r} ({path})",
                    file=sys.stderr,
                )
            if not _SLUG_RE.match(entry_id):
                print(
                    f"WARN: id {entry_id!r} should match [a-z0-9_-]+ ({path})",
                    file=sys.stderr,
                )
        if kind == "decisions":
            status = fm.get("status")
            if status not in ("accepted", "superseded", "provisional"):
                print(
                    f"WARN: expected status accepted|superseded|provisional "
                    f"in {path}, got {status!r}",
                    file=sys.stderr,
                )
        elif kind == "troubleshooting" and "status" in fm:
            print(
                f"WARN: troubleshooting entry should not have status ({path})",
                file=sys.stderr,
            )
        out.append((path, fm))
    return out


def _build_sorted_links(
    entries: list[tuple[Path, dict[str, Any]]],
) -> list[tuple[str, str]]:
    decorated: list[tuple[str, str, str]] = []
    for path, fm in entries:
        title = _normalize_title(fm.get("title")) or path.stem.replace("-", " ")
        decorated.append((title.casefold(), title, path.name))
    decorated.sort(key=lambda t: (t[0], t[2]))
    return [(t[1], t[2]) for t in decorated]


def _resolve_last_updated(
    path: Path, new_body: str, candidate_last_updated: str
) -> str:
    if not path.exists():
        return candidate_last_updated
    old_fm, old_body = _read_frontmatter_block(path)
    # Parser keeps the newline immediately after the closing `---` in `old_body`.
    if old_body.lstrip("\n") == new_body.lstrip("\n"):
        prev = old_fm.get("last_updated")
        if isinstance(prev, str) and prev:
            return prev
    return candidate_last_updated


def _write_if_changed(path: Path, content: str, dry_run: bool) -> bool:
    if path.exists() and path.read_text(encoding="utf-8") == content:
        print(f"OK: unchanged {path}")
        return False
    print(f"WRITE: {path}")
    if not dry_run:
        path.write_text(content, encoding="utf-8", newline="\n")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Regenerate decisions/ and troubleshooting/ index.md files."
    )
    parser.add_argument(
        "--agents-root",
        type=Path,
        default=Path(".agents"),
        help="Path to the .agents directory (default: ./.agents)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print actions only; do not write files.",
    )
    args = parser.parse_args()
    agents_root: Path = args.agents_root
    docs = agents_root / "docs"
    decisions_dir = docs / "decisions"
    troubleshooting_dir = docs / "troubleshooting"
    today = _today_iso()

    if not docs.is_dir():
        print(f"ERROR: docs directory not found: {docs}", file=sys.stderr)
        return 1

    changed = False

    if decisions_dir.is_dir():
        entries = _collect_entries(decisions_dir, "decisions")
        links = _build_sorted_links(entries)
        blurb = (
            "One file per durable architectural or policy decision. New entries: "
            "follow [Entry shape](../MAINTENANCE.md#entry-shape) in `MAINTENANCE.md`, "
            "then add a row below."
        )
        body = "\n".join(_index_body_lines("Decisions", blurb, links))
        last_updated = _resolve_last_updated(
            decisions_dir / "index.md", body, today
        )
        content = _render_index(
            index_id="decisions-index",
            index_title="Decisions index",
            heading="Decisions",
            blurb=blurb,
            entries=links,
            last_updated=last_updated,
        )
        if _write_if_changed(decisions_dir / "index.md", content, args.dry_run):
            changed = True
    else:
        print(f"WARN: skipping missing directory {decisions_dir}", file=sys.stderr)

    if troubleshooting_dir.is_dir():
        entries = _collect_entries(troubleshooting_dir, "troubleshooting")
        links = _build_sorted_links(entries)
        tblurb = (
            "One file per recurring issue pattern. New entries: follow "
            "[Entry shape](../MAINTENANCE.md#entry-shape) in `MAINTENANCE.md`, "
            "then add a row below."
        )
        body = "\n".join(_index_body_lines("Troubleshooting", tblurb, links))
        last_updated = _resolve_last_updated(
            troubleshooting_dir / "index.md", body, today
        )
        content = _render_index(
            index_id="troubleshooting-index",
            index_title="Troubleshooting index",
            heading="Troubleshooting",
            blurb=tblurb,
            entries=links,
            last_updated=last_updated,
        )
        if _write_if_changed(troubleshooting_dir / "index.md", content, args.dry_run):
            changed = True
    else:
        print(
            f"WARN: skipping missing directory {troubleshooting_dir}",
            file=sys.stderr,
        )

    if changed and args.dry_run:
        print("\nDry run: one or more indexes would change.", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
