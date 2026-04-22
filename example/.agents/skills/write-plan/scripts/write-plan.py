#!/usr/bin/env python3
"""
Scaffold a new plan markdown file under .agents/docs/plans/ with valid frontmatter.

Checks id uniqueness against decisions/, troubleshooting/, and existing plans/.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import date
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:  # pragma: no cover
    print("ERROR: PyYAML is required (`pip install pyyaml`).", file=sys.stderr)
    sys.exit(1)

_SLUG_RE = re.compile(r"^[a-z0-9_-]+$")


def _find_agents_root(start: Path) -> Path | None:
    p = start.resolve()
    for candidate in [p, *p.parents]:
        agents = candidate / ".agents"
        if agents.is_dir():
            return agents
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


def _collect_ids_from_folder(folder: Path) -> set[str]:
    ids: set[str] = set()
    if not folder.is_dir():
        return ids
    for path in folder.glob("*.md"):
        if path.name == "index.md":
            continue
        fm, _ = _read_frontmatter_block(path.read_text(encoding="utf-8"))
        entry_id = fm.get("id")
        if isinstance(entry_id, str) and entry_id.strip():
            ids.add(entry_id.strip())
        else:
            ids.add(path.stem)
    return ids


def _suggest_related_decisions(
    *,
    agents_root: Path,
    title: str,
    description: str,
    limit: int = 5,
) -> list[str]:
    """Keyword overlap against decision titles (optional helper)."""
    decisions_dir = agents_root / "docs" / "decisions"
    if not decisions_dir.is_dir():
        return []
    hay = f"{title} {description}".lower()
    words = {w for w in re.findall(r"[a-z0-9]{4,}", hay)}
    if not words:
        return []
    scored: list[tuple[int, str]] = []
    for path in sorted(decisions_dir.glob("*.md")):
        if path.name == "index.md":
            continue
        fm, _ = _read_frontmatter_block(path.read_text(encoding="utf-8"))
        did = fm.get("id")
        if not isinstance(did, str) or not did.strip():
            did = path.stem
        tit = fm.get("title")
        tit_s = tit.lower() if isinstance(tit, str) else path.stem.replace("-", " ")
        score = sum(1 for w in words if w in tit_s)
        if score:
            scored.append((score, did.strip()))
    scored.sort(key=lambda t: (-t[0], t[1]))
    out: list[str] = []
    seen: set[str] = set()
    for _s, did in scored:
        if did in seen:
            continue
        seen.add(did)
        out.append(did)
        if len(out) >= limit:
            break
    return out


def _render_plan_markdown(
    *,
    plan_id: str,
    title: str,
    description: str,
    tags: list[str],
    status: str,
    kind: str,
    related_decisions: list[str],
    consumer_portable: bool,
) -> str:
    desc_one_line = " ".join(description.split())
    parts: list[str] = [
        "---",
        f"id: {plan_id}",
        f"title: {json.dumps(title, ensure_ascii=False)}",
        f"last_updated: {date.today().isoformat()}",
        "description: >",
        f"  {desc_one_line}",
        f"tags: {json.dumps(tags, ensure_ascii=False)}",
        f"status: {status}",
        f"kind: {kind}",
    ]
    if related_decisions:
        parts.append("related_decisions:")
        parts.extend(f"  - {d}" for d in related_decisions)
    parts.append(f"consumer_portable: {'true' if consumer_portable else 'false'}")
    parts.append("---")
    header = "\n".join(parts) + "\n"

    body = f"""
# {title}

## Goal

(TODO: one paragraph — why this initiative exists and what gap it closes.)

## Scope / non-goals

- (TODO)

## Approach

(TODO: link to [relevant decisions](../decisions/) or playbooks instead of restating.)

## Phases or milestones

1. (TODO)

## Success criteria

- [ ] (TODO)

## Risks

| Risk | Mitigation |
| --- | --- |
| (TODO) | (TODO) |

## Knowledge routing

| Output | Destination |
| --- | --- |
| (TODO) | (TODO) |
"""
    return header + body.lstrip("\n")


def main() -> int:
    parser = argparse.ArgumentParser(description="Create .agents/docs/plans/<id>.md with plan frontmatter.")
    parser.add_argument("--id", required=True, help="Stable slug; must match filename [a-z0-9_-]+")
    parser.add_argument("--title", required=True)
    parser.add_argument("--description", required=True)
    parser.add_argument(
        "--tags",
        required=True,
        help="Comma-separated tags (lowercase [a-z0-9_-])",
    )
    parser.add_argument(
        "--status",
        default="draft",
        choices=[
            "draft",
            "active",
            "paused",
            "completed",
            "cancelled",
            "superseded",
            "archived",
        ],
    )
    parser.add_argument(
        "--kind",
        default="initiative",
        choices=["initiative", "meta", "exploration"],
    )
    parser.add_argument(
        "--related",
        action="append",
        default=[],
        metavar="DECISION_ID",
        help="Repeatable durable decision id for related_decisions",
    )
    parser.add_argument(
        "--auto-related",
        action="store_true",
        help="Suggest related_decisions from keyword overlap with decision titles",
    )
    parser.add_argument(
        "--consumer-portable",
        action="store_true",
        help="Set consumer_portable: true (default false)",
    )
    parser.add_argument(
        "--agents-root",
        type=Path,
        default=None,
        help="Path to .agents directory (default: discover from cwd)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the file content to stdout only; do not write",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite an existing plan file",
    )
    args = parser.parse_args()

    plan_id = args.id.strip()
    if not _SLUG_RE.match(plan_id):
        print(f"ERROR: id must match {_SLUG_RE.pattern}", file=sys.stderr)
        return 1

    raw_root = args.agents_root
    if raw_root is not None:
        agents_root = raw_root.expanduser().resolve()
        if agents_root.name != ".agents":
            agents_root = agents_root / ".agents"
    else:
        env_root = Path(os.environ["AGENTS_ROOT"]) if "AGENTS_ROOT" in os.environ else None
        if env_root is not None:
            agents_root = env_root.expanduser().resolve()
            if agents_root.name != ".agents":
                agents_root = agents_root / ".agents"
        else:
            found = _find_agents_root(Path.cwd())
            if found is None:
                print(
                    "ERROR: could not locate .agents; pass --agents-root or set AGENTS_ROOT",
                    file=sys.stderr,
                )
                return 1
            agents_root = found

    decisions = agents_root / "docs" / "decisions"
    troubleshooting = agents_root / "docs" / "troubleshooting"
    plans_dir = agents_root / "docs" / "plans"

    used: set[str] = set()
    used |= _collect_ids_from_folder(decisions)
    used |= _collect_ids_from_folder(troubleshooting)
    used |= _collect_ids_from_folder(plans_dir)

    target = plans_dir / f"{plan_id}.md"
    if plan_id in used:
        if target.is_file() and args.force:
            pass
        elif target.is_file() and not args.force:
            print(f"ERROR: {target} already exists (pass --force to overwrite)", file=sys.stderr)
            return 1
        else:
            print(
                f"ERROR: id {plan_id!r} already used (collision across decisions/troubleshooting/plans)",
                file=sys.stderr,
            )
            return 1

    tags = [t.strip() for t in args.tags.split(",") if t.strip()]
    if not tags:
        print("ERROR: at least one tag is required", file=sys.stderr)
        return 1
    for t in tags:
        if not re.match(r"^[a-z0-9_-]+$", t):
            print(f"ERROR: invalid tag {t!r} (use lowercase [a-z0-9_-])", file=sys.stderr)
            return 1

    related = list(dict.fromkeys(args.related))
    if args.auto_related:
        for sid in _suggest_related_decisions(
            agents_root=agents_root,
            title=args.title,
            description=args.description,
        ):
            if sid not in related:
                related.append(sid)

    content = _render_plan_markdown(
        plan_id=plan_id,
        title=args.title.strip(),
        description=args.description.strip(),
        tags=tags,
        status=args.status,
        kind=args.kind,
        related_decisions=related,
        consumer_portable=bool(args.consumer_portable),
    )

    if args.dry_run:
        print(content)
        return 0

    plans_dir.mkdir(parents=True, exist_ok=True)
    if target.exists() and not args.force:
        print(f"ERROR: {target} already exists (pass --force to overwrite)", file=sys.stderr)
        return 1

    target.write_text(content, encoding="utf-8", newline="\n")
    print(f"Wrote {target}")
    if related:
        print("related_decisions:", ", ".join(related))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
