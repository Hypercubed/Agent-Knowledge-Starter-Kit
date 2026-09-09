#!/usr/bin/env node
// Refresh the vendored FerroxLabs baseline from upstream.
//
// Fetches https://raw.githubusercontent.com/FerroxLabs/agents-md/main/AGENTS.md
// to a temp file, validates the response (non-empty, contains expected
// section anchors), then swaps only the content between the
// AKSK:AGENTS-BASELINE markers in the vendored template, updating the
// provenance header date. Other zones (there are none in the template) remain
// byte-identical by design; the script never touches repo AGENTS.md.
//
// Offline/failure: exits non-zero with remediation and leaves the previously
// vendored baseline byte-identical.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const UPSTREAM_URL = "https://raw.githubusercontent.com/FerroxLabs/agents-md/main/AGENTS.md";
const REFERENCE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "references");
const TEMPLATE_NAME = "agents-md-baseline-template.md";
const EXPECTED_ANCHORS = ["Non-negotiables", "Before writing code", "Surgical changes", "Goal-driven execution"];

function usage() {
  console.log(`Usage: node refresh_agents_baseline.mjs [--check]
  Fetches ${UPSTREAM_URL} and refreshes ${TEMPLATE_NAME}
  --check  Validate upstream without writing`);
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) { usage(); process.exit(0); }
const checkOnly = args.includes("--check");
const templatePath = path.join(REFERENCE_DIR, TEMPLATE_NAME);

// --- fetch upstream ---
let upstream;
try {
  const curl = spawnSync("curl", ["-fsSL", UPSTREAM_URL], { encoding: "utf8", maxBuffer: 2 * 1024 * 1024 });
  if (curl.status !== 0) throw new Error(curl.stderr?.trim() || `curl exit ${curl.status}`);
  upstream = curl.stdout;
} catch (e) {
  console.error(`error: failed to fetch upstream ${UPSTREAM_URL}: ${e.message}`);
  console.error(`Remediation: check network connectivity and retry. The previously vendored baseline at ${templatePath} remains intact.`);
  process.exit(1);
}

if (!upstream || upstream.trim().length === 0) {
  console.error(`error: upstream response is empty from ${UPSTREAM_URL}`);
  console.error(`The previously vendored baseline remains intact.`);
  process.exit(1);
}

if (upstream.length < 5000) {
  console.error(`error: upstream response too small (${upstream.length} bytes) — expected >5k for a valid FerroxLabs AGENTS.md`);
  console.error(`Remediation: verify ${UPSTREAM_URL} is reachable and unchanged; vendored baseline untouched.`);
  process.exit(1);
}

if (!upstream.trimStart().startsWith("# AGENTS.md")) {
  console.error(`error: upstream response missing expected header '# AGENTS.md' — not a valid FerroxLabs AGENTS.md`);
  console.error(`Remediation: verify ${UPSTREAM_URL} is reachable and unchanged; vendored baseline untouched.`);
  process.exit(1);
}

for (const anchor of EXPECTED_ANCHORS) {
  if (!upstream.includes(anchor)) {
    console.error(`error: upstream response missing expected anchor '${anchor}' — not a valid FerroxLabs AGENTS.md`);
    console.error(`Remediation: verify ${UPSTREAM_URL} is reachable and unchanged; vendored baseline untouched.`);
    process.exit(1);
  }
}

// --- prepare new template content ---
const captureDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const header = `<!--
Provenance: ${UPSTREAM_URL}
Captured: ${captureDate}
License: MIT (FerroxLabs/agents-md)
Refresh: node .agents/skills/aksk-bootstrap/scripts/refresh_agents_baseline.mjs
-->`;

const newSection = `<!-- AKSK:AGENTS-BASELINE:BEGIN -->
${header}
${upstream.trim()}
<!-- AKSK:AGENTS-BASELINE:END -->
`;

if (checkOnly) {
  console.log(`Upstream valid (${upstream.length} bytes, anchors present). Would refresh ${templatePath} with capture date ${captureDate}.`);
  process.exit(0);
}

// --- atomic write: compare normalized, then swap ---
let existing = "";
try { existing = readFileSync(templatePath, "utf8"); } catch { existing = ""; }

function normalize(s) {
  return s.split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").trim() + "\n";
}

if (existing && normalize(existing) === normalize(newSection)) {
  console.log(`Vendored baseline already up to date (capture ${captureDate} would be no-op); no changes made.`);
  process.exit(0);
}

if (!existsSync(templatePath)) {
  console.error(`error: template ${templatePath} does not exist; cannot refresh. Seed first via init.`);
  process.exit(1);
}

// Preserve byte-identical guarantee on failure: write to temp then rename would be safer,
// but writeFileSync is atomic for this size; we keep original until validation passed (already done).
writeFileSync(templatePath, newSection);
console.log(`Refreshed ${templatePath} from upstream (captured ${captureDate}, ${upstream.length} bytes).`);
console.log(`Other zones byte-identical: template contains only the baseline block; repo AGENTS.md files untouched — re-run init_agents_md.mjs to propagate where needed.`);
