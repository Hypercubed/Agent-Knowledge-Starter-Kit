#!/usr/bin/env node
// Attach the AKSK curation contract to an initialized OpenWiki wiki.
//
// Appends the contract section between AKSK markers to an existing
// openwiki/INSTRUCTIONS.md. Never creates the file, never replaces existing
// content. Idempotent and self-updating: re-running is a no-op unless the
// attached section differs from the current template, in which case only the
// marked section is refreshed in place. Fails fast with the initialization
// prerequisite when the file is missing.
//
// Usage: node attach_wiki_contract.mjs [repo-root]
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MARKER_BEGIN = "<!-- AKSK:WIKI-CONTRACT:BEGIN -->";
const MARKER_END = "<!-- AKSK:WIKI-CONTRACT:END -->";
const DEFAULT_STUB = "A code wiki for this repository.";
const INIT_PREREQ = "openwiki --init";
const TEMPLATE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "references", "wiki-contract-template.md");

function refresh(text, section) {
  const re = new RegExp(`${MARKER_BEGIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*?${MARKER_END.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "s");
  const match = re.exec(text);
  if (!match || match[0].trim() === section.trim()) return [text, false];
  return [text.slice(0, match.index) + section + text.slice(match.index + match[0].length), true];
}

const root = path.resolve(process.argv[2] ?? process.cwd());
const instructions = path.join(root, "openwiki", "INSTRUCTIONS.md");
let text;
try {
  text = readFileSync(instructions, "utf8");
} catch {
  console.error(
    `error: ${instructions} not found; this repository has no initialized ` +
    `OpenWiki wiki. Initialize it first with \`${INIT_PREREQ}\`.`
  );
  process.exit(2);
}

const section = readFileSync(TEMPLATE, "utf8");
if (text.includes(MARKER_BEGIN)) {
  const [updated, changed] = refresh(text, section);
  if (!changed) {
    console.log("AKSK wiki contract already up to date; no changes made.");
  } else {
    writeFileSync(instructions, updated);
    console.log("Refreshed the AKSK curation contract from the current template.");
  }
  process.exit(0);
}

const base = text.endsWith("\n") ? text : text + "\n";
writeFileSync(instructions, `${base}\n${section}`);
console.log(
  text.trim() === DEFAULT_STUB
    ? "Attached AKSK curation contract below OpenWiki's default stub."
    : "Attached AKSK curation contract below existing INSTRUCTIONS.md content."
);
