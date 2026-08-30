#!/usr/bin/env node
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
console.log("aksk-bootstrap shim (compat): running global lane then repo lane (new code should run aksk-bootstrap global and aksk-init repo separately)");
let r = spawnSync("node", [path.join(dir,"bootstrap-global.mjs"), ...args], {stdio:"inherit"});
if(r.status!==0) process.exit(r.status??0);
const candidate = path.resolve(dir, "..", "aksk-init", "scripts", "bootstrap-repo.mjs");
if (existsSync(candidate)) {
  r = spawnSync("node", [candidate, ...args], {stdio:"inherit"});
  process.exit(r.status??0);
} else {
  console.log("aksk-init not found - global lane complete. Run aksk-init separately.");
  process.exit(0);
}
