#!/usr/bin/env node
// Seed root AGENTS.md from the vendored FerroxLabs baseline.
//
// One deterministic command that seeds AGENTS.md when absent, is idempotent
// when the marked baseline section already matches, and forces an explicit
// user-mediated decision when a custom file exists.
//
// Usage: node init_agents_md.mjs [repo-root] [--replace] [--combine] [--help]
//   No flag + missing file          → create with baseline markers (exit 0)
//   No flag + matching baseline     → no-op (exit 0)
//   No flag + existing non-matching → exit 2 with replace-vs-combine prompt, no writes
//   --replace                       → overwrite with baseline section (exit 0)
//   --combine                       → stage existing + baseline + COMBINE brief under .agents/sessions/agents-md-combine/<timestamp>/ (exit 0, original untouched)
//
// Markers are read from the template, never hard-coded. Compare is
// trailing-whitespace/newline-at-EOF normalized per spec.

import { existsSync, readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REFERENCE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "references");
const TEMPLATE_NAME = "agents-md-baseline-template.md";

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function markersOf(section) {
  const begin = /<!--\s*(AKSK:[A-Z-]+):BEGIN\s*-->/.exec(section);
  const end = /<!--\s*(AKSK:[A-Z-]+):END\s*-->/.exec(section);
  if (!begin || !end) {
    console.error(`error: template ${TEMPLATE_NAME} has no AKSK:* marker pair.`);
    process.exit(2);
  }
  if (begin[1] !== end[1]) {
    console.error(`error: template ${TEMPLATE_NAME} marker mismatch: BEGIN ${begin[1]} != END ${end[1]}.`);
    process.exit(2);
  }
  return [begin[0], end[0], begin[1]];
}

function normalize(s) {
  // Per spec: byte-compare idempotency false-negatives from trailing whitespace
  // → normalize trailing whitespace per line and newline-at-EOF before comparing.
  return s.split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").trim() + "\n";
}

function usage() {
  console.log(`Usage: node init_agents_md.mjs [repo-root] [--replace] [--combine]
  --replace  Overwrite existing AGENTS.md with the vendored baseline
  --combine  Stage existing + baseline for LLM merge under .agents/sessions/agents-md-combine/<timestamp>/`);
}

// --- arg parse (repo-root is positional, flags are --*) ---
const raw = process.argv.slice(2);
let root = null;
const flags = new Set();
for (const a of raw) {
  if (a === "--help" || a === "-h") {
    usage();
    process.exit(0);
  } else if (a.startsWith("--")) {
    flags.add(a);
  } else if (root === null) {
    root = a;
  } else {
    console.error(`error: unexpected argument '${a}'.`);
    usage();
    process.exit(2);
  }
}
if (flags.has("--replace") && flags.has("--combine")) {
  console.error("error: --replace and --combine are mutually exclusive.");
  process.exit(2);
}
for (const f of flags) {
  if (f !== "--replace" && f !== "--combine") {
    console.error(`error: unknown flag '${f}'. Allowed: --replace, --combine`);
    process.exit(2);
  }
}
const resolvedRoot = path.resolve(root ?? process.cwd());
const templatePath = path.join(REFERENCE_DIR, TEMPLATE_NAME);
if (!existsSync(templatePath)) {
  console.error(`error: missing template ${templatePath}. Run aksk-bootstrap setup first.`);
  process.exit(2);
}
const section = readFileSync(templatePath, "utf8");
const [markBegin, markEnd, markName] = markersOf(section);

const target = path.join(resolvedRoot, "AGENTS.md");
let stat = null;
try { stat = statSync(target); } catch {}
if (stat?.isDirectory()) {
  console.error(`error: ${target} is a directory, expected a file.`);
  process.exit(2);
}

// --- missing file: seed ---
if (stat === null || !stat.isFile()) {
  if (flags.has("--replace") || flags.has("--combine")) {
    console.error(`error: ${target} does not exist; --replace/--combine require an existing file.`);
    process.exit(2);
  }
  writeFileSync(target, section);
  console.log(`Created ${target} with the ${markName} section.`);
  process.exit(0);
}

// --- existing file ---
const text = readFileSync(target, "utf8");

// Check if baseline zone already matches (normalized)
if (text.includes(markBegin)) {
  const re = new RegExp(`${escapeRe(markBegin)}.*?${escapeRe(markEnd)}`, "s");
  const m = re.exec(text);
  if (m) {
    const existingBlock = m[0];
    if (normalize(existingBlock) === normalize(section)) {
      console.log(`${markName} section already up to date in ${target}; no changes made.`);
      process.exit(0);
    }
  }
}

// At this point: existing file with non-matching or missing baseline block
if (flags.has("--replace")) {
  writeFileSync(target, section);
  console.log(`Replaced ${target} with the ${markName} section (provenance header included).`);
  console.log(`Next: run OpenWiki attachment and 'node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs' to add AKSK zones below the baseline.`);
  process.exit(0);
}

if (flags.has("--combine")) {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const stageDir = path.join(resolvedRoot, ".agents", "sessions", "agents-md-combine", ts);
  mkdirSync(stageDir, { recursive: true });
  const existingPath = path.join(stageDir, "existing.md");
  const baselinePath = path.join(stageDir, "baseline.md");
  const combinePath = path.join(stageDir, "COMBINE.md");
  writeFileSync(existingPath, text);
  writeFileSync(baselinePath, section);
  const combineBrief = `# Combine existing AGENTS.md with the FerroxLabs baseline

This bundle was staged by \`init_agents_md.mjs --combine\`. The script itself did not modify \`${target}\`.

## Inputs
- \`existing.md\` — current ${path.basename(target)} from the repo (project-specific learnings, filled-in sections 10/11, any custom content)
- \`baseline.md\` — vendored FerroxLabs baseline wrapped in \`${markBegin}\` / \`${markEnd}\` (source: https://raw.githubusercontent.com/FerroxLabs/agents-md/main/AGENTS.md)

## Merge rules (keep markers verbatim)
1. Preserve project-specific learnings and filled-in context from \`existing.md\` (especially sections that were customized like project overview, tech stack, or section 10/11 equivalents).
2. Prefer the baseline structure for sections 0–9 (non-negotiables, before-writing-code, surgical changes, goal-driven execution, etc.).
3. Keep every AKSK-managed marker block verbatim — do not rename or remove markers:
   - \`${markBegin}\` / \`${markEnd}\` (baseline)
   - \`<!-- OPENWIKI:START -->\` / \`<!-- OPENWIKI:END -->\` (OpenWiki, if present)
   - \`<!-- AKSK:ROUTING:BEGIN/END -->\` and \`<!-- AKSK:LIFECYCLE:BEGIN/END -->\` (AKSK)
4. Final file must be zoned and ordered: baseline → OpenWiki → AKSK. If existing.md already has OpenWiki/AKSK blocks, keep them in that order below the baseline.
5. Do not add network fetches or remove the provenance header inside the baseline block.

## Agent instructions
1. Produce the merged result and write it to \`${target}\` (overwrite).
2. Show the diff to the user before writing (or include it in the summary).
3. After writing, verify zones: \`grep -c "AKSK:AGENTS-BASELINE" AGENTS.md\` etc.

## Source of this brief
Generated at ${new Date().toISOString()} from template ${TEMPLATE_NAME}.
`;
  writeFileSync(combinePath, combineBrief);
  console.log(`Staged combine inputs under ${stageDir}`);
  console.log(`  - existing.md (current AGENTS.md, untouched)`);
  console.log(`  - baseline.md (vendored baseline, wrapped)`);
  console.log(`  - COMBINE.md (merge brief)`);
  console.log(``);
  console.log(`Agent: merge existing.md + baseline.md per COMBINE.md, then write the result to ${target}. The original remains untouched until you write.`);
  process.exit(0);
}

// No flag: prompt for explicit decision
console.error(`error: ${target} already exists and does not contain the current ${markName} baseline.`);
console.error(``);
console.error(`Replace AGENTS.md with the FerroxLabs baseline, or combine both using the LLM?`);
console.error(``);
console.error(`  --replace  Overwrite the file with the vendored baseline (wrapped in ${markBegin} / ${markEnd}, provenance header included)`);
console.error(`  --combine  Keep the original untouched; stage existing.md + baseline.md + COMBINE.md under .agents/sessions/agents-md-combine/<timestamp>/ and print merge instructions`);
console.error(``);
console.error(`Re-run with one of those flags:`);
console.error(`  node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs ${resolvedRoot} --replace`);
console.error(`  node .agents/skills/aksk-bootstrap/scripts/init_agents_md.mjs ${resolvedRoot} --combine`);
process.exit(2);
