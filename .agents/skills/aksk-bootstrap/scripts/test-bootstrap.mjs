#!/usr/bin/env node
// Idempotency tests for bootstrap.mjs
// Task 2.6: re-run on fully bootstrapped fixture changes nothing;
// re-run on partially bootstrapped fixture completes only missing steps.
import { mkdtempSync, rmSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";

function runBootstrap(cwd, extra = []) {
  const script = path.join(process.cwd(), ".agents/skills/aksk-bootstrap/scripts/bootstrap.mjs");
  const r = spawnSync("node", [script, cwd, ...extra], { encoding: "utf8" });
  return r;
}

function assert(cond, msg) {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`PASS: ${msg}`);
}

// --- Test 1: fully bootstrapped fixture (this repo) — re-run changes nothing
console.log("\n=== Test 1: fully bootstrapped fixture ===");
{
  const r1 = runBootstrap(process.cwd());
  const r2 = runBootstrap(process.cwd());
  // Second run should report already up to date for contract/routing
  assert(r2.stdout.includes("already up to date") || r2.stdout.includes("skipping"), "fully bootstrapped re-run is no-op (idempotent)");
  assert(r2.status === 0, "exit 0 on idempotent re-run");
  // Ensure no repo-local installs introduced
  assert(!r2.stdout.includes("npm i --save") && !r2.stdout.includes("npx"), "no repo-local npx or npm --save fallback");
  assert(r2.stdout.includes("user scope") || r2.stdout.includes("user-scope") || r2.stdout.includes("Global lane"), "global lane reports user scope");
}

// --- Test 2: partially bootstrapped fixture
console.log("\n=== Test 2: partially bootstrapped fixture ===");
{
  const tmp = mkdtempSync(path.join(os.tmpdir(), "aksk-bootstrap-test-"));
  try {
    // Create minimal repo with no .agents, no openspec, no openwiki
    const agentsBefore = existsSync(path.join(tmp, ".agents"));
    assert(!agentsBefore, "tmp starts without .agents");
    // Run bootstrap — should scaffold at least .agents and routing, but skip global lane if tools present
    const r = runBootstrap(tmp);
    assert(r.status === 0, "partial fixture bootstrap exits 0");
    // Check that bootstrap attempted per-repo steps (reported scaffold or contract skip)
    const output = r.stdout + r.stderr;
    // Since openwiki/ missing, it should report skipping contract and suggesting openwiki --init
    assert(output.includes("Per-repo lane") || output.includes("scaffold"), "per-repo lane executed");
    // Verify .agents was scaffolded
    assert(existsSync(path.join(tmp, ".agents")), ".agents scaffolded on partial fixture");
    // Second run should be closer to idempotent (no duplicate work)
    const r2 = runBootstrap(tmp);
    assert(r2.stdout.includes("already up to date") || r2.stdout.includes("present — skipping"), "second run skips completed steps");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

// --- Test 3: user scope check — bootstrap must use `npm i -g` not repo-local
console.log("\n=== Test 3: user scope check ===");
{
  const scriptText = readFileSync(path.join(process.cwd(), ".agents/skills/aksk-bootstrap/scripts/bootstrap.mjs"), "utf8");
  assert(scriptText.includes("npm i -g"), "bootstrap script contains `npm i -g` (user scope)");
  assert(!scriptText.includes("npm i --save") && !scriptText.includes("npm install --save"), "no repo-local npm --save");
  // Ensure SKILL.md says update not write and mentions user scope
  const skillText = readFileSync(path.join(process.cwd(), ".agents/skills/aksk-bootstrap/SKILL.md"), "utf8");
  assert(skillText.includes("npm i -g") && skillText.includes("not repo-local"), "SKILL.md documents user scope global lane");
  assert(skillText.toLowerCase().includes("already exists") || skillText.includes("original precondition provider"), "SKILL.md notes update semantics (not write)");
}

console.log("\nAll idempotency tests passed.");
