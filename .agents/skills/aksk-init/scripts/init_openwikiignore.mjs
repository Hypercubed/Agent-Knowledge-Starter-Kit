#!/usr/bin/env node
// Install the AKSK-managed .openwikiignore with merge-not-clobber semantics.
//
// - Missing file -> write the template verbatim.
// - Existing file without AKSK markers -> append the tagged section.
// - Existing file with markers -> refresh only the tagged section.
// User content outside the markers is never removed. Idempotent: re-running
// when the ignore already matches the template is a no-op.
//
// Usage: node init_openwikiignore.mjs [repo-root] [--verbose]
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MARKER_BEGIN = "# AKSK:OPENWIKIIGNORE:BEGIN";
const MARKER_END = "# AKSK:OPENWIKIIGNORE:END";
const TEMPLATE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "references", "openwikiignore-template.md");

const argv = process.argv.slice(2);
const verbose = argv.includes("--verbose");
let repoRoot = process.cwd();
for (const a of argv) {
  if (!a.startsWith("-")) repoRoot = path.resolve(a);
}

const log = (...args) => {
  if (verbose) console.log(...args);
};

console.log("Starting .openwikiignore install...");

const template = readFileSync(TEMPLATE, "utf8");
const sectionRe = new RegExp(
  `${MARKER_BEGIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*?${MARKER_END.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
  "s"
);
const sectionMatch = sectionRe.exec(template);
if (!sectionMatch) {
  console.error(`error: template ${TEMPLATE} carries no AKSK markers; refusing to write.`);
  process.exit(2);
}
const section = sectionMatch[0];

const target = path.join(repoRoot, ".openwikiignore");
let text;
try {
  text = readFileSync(target, "utf8");
} catch {
  writeFileSync(target, template.endsWith("\n") ? template : template + "\n");
  console.log("Created .openwikiignore from the AKSK template.");
  process.exit(0);
}

if (!text.includes(MARKER_BEGIN)) {
  const base = text.endsWith("\n") ? text : text + "\n";
  writeFileSync(target, `${base}\n${section}\n`);
  console.log("Appended the AKSK-managed section to existing .openwikiignore; custom rules preserved.");
  process.exit(0);
}

const match = sectionRe.exec(text);
if (match && match[0] === section) {
  console.log(".openwikiignore already up to date; no changes made.");
  process.exit(0);
}
const updated = text.slice(0, match.index) + section + text.slice(match.index + match[0].length);
log("Refreshing marked section only; content outside markers untouched.");
writeFileSync(target, updated);
console.log("Refreshed the AKSK-managed section of .openwikiignore; custom rules preserved.");
