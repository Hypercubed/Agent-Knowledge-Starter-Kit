#!/usr/bin/env node
// Attach an AKSK-managed section to a root agent instruction file.
//
// One attachment mechanism for N marker-delimited sections. The named
// template (from ../references/) carries its own BEGIN/END markers; this
// script appends the section to the target file below existing content,
// refreshes an outdated marked section in place, or no-ops when current.
// Existing content outside the markers is never replaced or removed.
//
// Root router files have no upstream initializer, so a missing file is created
// containing only the attached section.
//
// Usage: node attach_section.mjs [repo-root] [target-file-name] [template-name]
//   target-file-name defaults to AGENTS.md
//   template-name defaults to routing-note-template.md
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REFERENCE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "references");

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function markersOf(section) {
  const begin = /<!--\s*(AKSK:[A-Z-]+):BEGIN\s*-->/.exec(section);
  const end = /<!--\s*AKSK:[A-Z-]+:END\s*-->/.exec(section);
  if (!begin || !end) {
    console.error(`error: template has no AKSK:* marker pair.`);
    process.exit(2);
  }
  return [begin[0].replace(/\s+/g, " "), end[0], begin[1]];
}

function refresh(text, section, markBegin, markEnd) {
  const re = new RegExp(`${escapeRe(markBegin)}.*?${escapeRe(markEnd)}`, "s");
  const match = re.exec(text);
  if (!match || match[0].trim() === section.trim()) return [text, false];
  return [text.slice(0, match.index) + section + text.slice(match.index + match[0].length), true];
}

const root = path.resolve(process.argv[2] ?? process.cwd());
const targetName = process.argv[3] ?? "AGENTS.md";
const templateName = process.argv[4] ?? "routing-note-template.md";
const templatePath = path.join(REFERENCE_DIR, templateName);
if (!existsSync(templatePath)) {
  console.error(`error: unknown template '${templateName}' (no ${templatePath}).`);
  process.exit(2);
}

const target = path.join(root, targetName);
let stat = null;
try {
  stat = statSync(target);
} catch {}
if (stat?.isDirectory()) {
  console.error(`error: ${target} is a directory, expected a file.`);
  process.exit(2);
}

const section = readFileSync(templatePath, "utf8");
const [markBegin, markEnd, markName] = markersOf(section);

if (stat === null || !stat.isFile()) {
  writeFileSync(target, section);
  console.log(`Created ${target} with the ${markName} section.`);
  process.exit(0);
}

const text = readFileSync(target, "utf8");
if (text.includes(markBegin)) {
  const [updated, changed] = refresh(text, section, markBegin, markEnd);
  if (!changed) {
    console.log(`${markName} section already up to date in ${target}; no changes made.`);
  } else {
    writeFileSync(target, updated);
    console.log(`Refreshed the ${markName} section in ${target} from template ${templateName}.`);
  }
  process.exit(0);
}

const base = text.endsWith("\n") ? text : text + "\n";
writeFileSync(target, `${base}\n${section}`);
console.log(`Attached ${markName} section to ${target} below existing content.`);
