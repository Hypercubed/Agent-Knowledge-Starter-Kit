#!/usr/bin/env node
// Deterministic bootstrap orchestrator for AKSK + OpenSpec/OpenWiki.
//
// Global-only lane: installs openspec/openwiki globally (npm i -g).
// Per-repo setup lives in aksk-init (bootstrap-repo.mjs). Never half-installs: a failed step prints the
// exact remaining commands and exits clean without partial state from that
// step. Global installs are per-user via `npm i -g` (user scope, not
// repo-local `npx` or `node_modules`).
//
// Usage: node bootstrap-global.mjs [repo-root] [--force] [--json]
//
// Preflight: Node >=22, tools on PATH, .agents/ / openspec/ / openwiki/
// receipts, then state report before acting.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const MIN_NODE_MAJOR = 22;
function versionsFromPackageJson(repoRoot) {
  // C: caret range pinned in package.json, bundled as references/versions.json
  // which IS copied via `npx skills add` (skill references are copied). Consumer
  // repo's package.json is checked first to allow local override, then bundled.
  const bundled = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "references", "versions.json");
  const candidates = [
    path.join(repoRoot, "package.json"),
    bundled,
  ];
  for (const cand of candidates) {
    try {
      const raw = JSON.parse(readFileSync(cand, "utf8"));
      // package.json shape: devDependencies; versions.json shape: flat keys
      const isPkg = !!raw.devDependencies || !!raw.dependencies;
      const dev = isPkg ? (raw.devDependencies || {}) : raw;
      const deps = isPkg ? (raw.dependencies || {}) : {};
      const ospec = dev["@fission-ai/openspec"] || deps["@fission-ai/openspec"] || raw["@fission-ai/openspec"];
      const owiki = dev["openwiki"] || deps["openwiki"] || raw["openwiki"];
      if (ospec || owiki) return { openspec: ospec, openwiki: owiki, source: cand };
    } catch {}
  }
  return null;
}
// Resolved lazily per repoRoot in run(); constants below are fallbacks for --help text.
const INSTALL_COMMANDS_FALLBACK = {
  openspec: "npm i -g @fission-ai/openspec@latest",
  openwiki: "npm i -g openwiki@latest",
};
const BOTH_INSTALL_FALLBACK = "npm i -g @fission-ai/openspec@latest openwiki@latest";

function onPath(cmd) {
  const dirs = (process.env.PATH ?? "").split(path.delimiter).filter(Boolean);
  const exts = process.platform === "win32" ? (process.env.PATHEXT ?? ".EXE;.CMD;.BAT").split(";") : [""];
  return dirs.some((d) => exts.some((e) => existsSync(path.join(d, cmd + e))));
}

function hasNode() {
  const major = parseInt(process.versions.node.split(".")[0], 10);
  return { major, ok: major >= MIN_NODE_MAJOR };
}

function detectState(root) {
  const tools = {
    openspec: onPath("openspec"),
    openwiki: onPath("openwiki"),
  };
  const trees = {
    agents: existsSync(path.join(root, ".agents")),
    openspec: existsSync(path.join(root, "openspec")),
    openwiki: existsSync(path.join(root, "openwiki")),
    instructions: existsSync(path.join(root, "openwiki", "INSTRUCTIONS.md")),
  };
  const contractAttached = (() => {
    try {
      const t = readFileSync(path.join(root, "openwiki", "INSTRUCTIONS.md"), "utf8");
      return t.includes("<!-- AKSK:WIKI-CONTRACT:BEGIN -->");
    } catch { return false; }
  })();
  const routingAttached = (() => {
    try {
      const t = readFileSync(path.join(root, "AGENTS.md"), "utf8");
      return t.includes("<!-- AKSK:ROUTING:BEGIN -->");
    } catch { return false; }
  })();
  // Receipts via openwiki integrations list (best-effort, never throws)
  let receipts = null;
  if (tools.openwiki) {
    const r = spawnSync("openwiki", ["integrations", "list", "--project"], { encoding: "utf8", cwd: root });
    if (r.status === 0) receipts = r.stdout;
  }
  return { tools, trees, contractAttached, routingAttached, receipts };
}

function printState(s, json) {
  if (json) {
    console.log(JSON.stringify(s, null, 2));
    return;
  }
  console.log(`Node: ${process.versions.node} (requires >=${MIN_NODE_MAJOR}) — ${s.nodeOk ? "ok" : "unsupported"}`);
  console.log(`Tools: openspec ${s.tools.openspec ? "present" : "missing"}, openwiki ${s.tools.openwiki ? "present" : "missing"}`);
  console.log(`Repo: .agents ${s.trees.agents ? "present" : "missing"}, openspec/ ${s.trees.openspec ? "present" : "missing"}, openwiki/ ${s.trees.openwiki ? "present" : "missing"}`);
  console.log(`Contract: ${s.contractAttached ? "attached" : "not attached"}; Routing: ${s.routingAttached ? "attached" : "not attached"}`);
  if (s.receipts) {
    console.log("Receipts (openwiki integrations list --project):");
    console.log(s.receipts.trim().split("\n").slice(0, 20).join("\n"));
  }
}

function instructRemaining(steps) {
  console.log("\nINSTRUCT lane — run these commands manually (copy-paste):");
  for (const c of steps) console.log(`  ${c}`);
  console.log("\nNo partial state was written for the failed step.");
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", ...opts });
  return r;
}



const argv = process.argv.slice(2);
let repoRoot = process.cwd();
let force=false, json=false;
for(const a of argv){ if(a==="--force") force=true; else if(a==="--json") json=true; else if(a==="--help"||a==="-h"){ console.log("Usage: node bootstrap-global.mjs [repo-root] [--yes] [--force] [--json]"); process.exit(0);} else if(!a.startsWith("-")) repoRoot=path.resolve(a); }
repoRoot=path.resolve(repoRoot);
const {major, ok:nodeOk} = hasNode();
let state={...detectState(repoRoot), nodeOk, nodeMajor:major};
printState(state, json);
if(!nodeOk){ console.error(`error: Node ${major} < ${MIN_NODE_MAJOR}`); process.exit(2); }

// Global lane (non-interactive; skill prompts before invoking)
const missingTools = Object.entries(state.tools).filter(([,v])=>!v).map(([k])=>k);
const ver = versionsFromPackageJson(repoRoot);
const verOpenspec = ver?.openspec||null, verOpenwiki=ver?.openwiki||null;
if(ver && missingTools.length>0) console.log(`Versions from ${ver.source}: openspec ${verOpenspec||"latest"} / openwiki ${verOpenwiki||"latest"}`);
const pkgOpenspec = verOpenspec?`@fission-ai/openspec@${verOpenspec}`:"@fission-ai/openspec@latest";
const pkgOpenwiki = verOpenwiki?`openwiki@${verOpenwiki}`:"openwiki@latest";
const INSTALL_COMMANDS={openspec:`npm i -g ${pkgOpenspec}`, openwiki:`npm i -g ${pkgOpenwiki}`};
const BOTH_INSTALL = missingTools.length===2?`npm i -g ${pkgOpenspec} ${pkgOpenwiki}`:missingTools.length===1?INSTALL_COMMANDS[missingTools[0]]:"npm i -g @fission-ai/openspec@latest openwiki@latest";
if(missingTools.length>0){
  console.log(`\nGlobal lane: missing ${missingTools.join(", ")} → ${BOTH_INSTALL}`);
  if(!onPath("npm")){ console.error("npm not on PATH"); instructRemaining(missingTools.map(t=>INSTALL_COMMANDS[t])); process.exit(0); }
  { // non-interactive: auto-install (agent prompts before invoking script)
    const installArgs = missingTools.length===2?["i","-g",pkgOpenspec,pkgOpenwiki]:["i","-g",...missingTools.map(t=>t==="openspec"?pkgOpenspec:pkgOpenwiki)];
    const r=run("npm",installArgs,{cwd:repoRoot});
    if(r.status!==0){ console.error(r.stderr||r.stdout); instructRemaining([`npm ${installArgs.join(" ")}`]); process.exit(0); }
    console.log(r.stdout.trim().split("\n").slice(-5).join("\n"));
    state={...detectState(repoRoot), nodeOk, nodeMajor:major};
  }
} else { console.log("\nGlobal lane: tools present — skipping install."); for(const t of ["openspec","openwiki"]){ const r=run(t,["--version"],{encoding:"utf8"}); if(r.status===0) console.log(`  ${t} ${r.stdout.trim()}`);} }

console.log("\nGlobal setup complete. Run aksk-init in a repo to scaffold it.");
