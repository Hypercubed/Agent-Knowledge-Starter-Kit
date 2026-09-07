#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const MIN_NODE_MAJOR = 22;

function onPath(cmd) {
  const dirs = (process.env.PATH ?? "").split(path.delimiter).filter(Boolean);
  const exts = process.platform === "win32" ? (process.env.PATHEXT ?? ".EXE;.CMD;.BAT").split(";") : [""];
  return dirs.some((d) => exts.some((e) => existsSync(path.join(d, cmd + e))));
}

function detectState(root) {
  return {
    tools: {
      openspec: onPath("openspec"),
      openwiki: onPath("openwiki"),
    },
    trees: {
      agents: existsSync(path.join(root, ".agents")),
      openspec: existsSync(path.join(root, "openspec")),
      openwiki: existsSync(path.join(root, "openwiki")),
    },
  };
}

function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, { encoding: "utf8", ...opts });
}

const argv = process.argv.slice(2);
let repoRoot = process.cwd();
for (const a of argv) {
  if (!a.startsWith("-")) repoRoot = path.resolve(a);
}
repoRoot = path.resolve(repoRoot);

if (argv.includes("--help") || argv.includes("-h")) {
  console.log("Usage: node bootstrap-repo.mjs [repo-root] [--yes]");
  console.log("Per-repo AKSK init: scaffold .agents, openspec/openwiki init, attach routing/lifecycle/contract, install .openwikiignore. Non-interactive; re-running is a no-op.");
  process.exit(0);
}

const major = parseInt(process.versions.node.split(".")[0], 10);
if (major < MIN_NODE_MAJOR) {
  console.error(`Node ${major} < ${MIN_NODE_MAJOR}`);
  process.exit(2);
}
if (!onPath("openspec") || !onPath("openwiki")) {
  console.error("Missing tools — run aksk-bootstrap first.");
  let ver=null; try{ ver=JSON.parse(readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)),"..","..","aksk-bootstrap","references","versions.json"),"utf8"));}catch{}
  const ospec=ver?.["@fission-ai/openspec"]||"latest", owiki=ver?.["openwiki"]||"latest";
  console.log(`INSTRUCT: npm i -g @fission-ai/openspec@${ospec} openwiki@${owiki}`);
  process.exit(2);
}

console.log(`Node ${process.versions.node} ok; Tools: openspec/openwiki present`);

// 1. scaffold .agents + AGENTS.md baseline FIRST
let s = detectState(repoRoot);
if (!s.trees.agents) {
  mkdirSync(path.join(repoRoot, ".agents", "skills"), { recursive: true });
  mkdirSync(path.join(repoRoot, ".agents", "sessions"), { recursive: true });
  console.log(" .agents scaffolded");
}
{
  const script = path.join(path.dirname(fileURLToPath(import.meta.url)), "init_agents_md.mjs");
  const r = run("node", [script, repoRoot], { encoding: "utf8" });
  console.log((r.stdout || r.stderr || "").trim().split("\n").slice(-2).join(" | "));
}

s = detectState(repoRoot);
if (!s.trees.openspec) {
  console.log(" openspec/ missing -> openspec init");
  const r = run("openspec", ["init", "--tools", "none"], { cwd: repoRoot, encoding: "utf8" });
  if (r.status !== 0) console.error(r.stderr || r.stdout);
  else console.log(" openspec init ok");
} else {
  console.log(" openspec/ present");
}

if (!s.trees.openwiki) {
  console.log(" openwiki/ missing -> openwiki --init (or use harness: no extra key; CLI needs OPENAI_API_KEY)");
  const r = run("openwiki", ["--init"], { cwd: repoRoot, encoding: "utf8" });
  console.log((r.stdout || r.stderr || "").trim().split("\n").slice(-5).join("\n"));
  if (r.status !== 0) console.log("  CLI failed: set OPENAI_API_KEY or use harness path");
} else {
  console.log(" openwiki/ present");
}

for (const tmpl of ["routing-note-template.md", "lifecycle-template.md"]) {
  const sc = path.join(path.dirname(fileURLToPath(import.meta.url)), "attach_section.mjs");
  const r = run("node", [sc, repoRoot, "AGENTS.md", tmpl], { encoding: "utf8" });
  console.log(` ${tmpl}: ${(r.stdout || r.stderr || "").trim().split("\n").slice(-1)[0]}`);
}

{
  const sc = path.join(path.dirname(fileURLToPath(import.meta.url)), "attach_wiki_contract.mjs");
  const r = run("node", [sc, repoRoot], { encoding: "utf8" });
  console.log(` contract: ${(r.stdout || r.stderr || "").trim().split("\n").slice(-1)[0]}`);
}

{
  const sc = path.join(path.dirname(fileURLToPath(import.meta.url)), "init_openwikiignore.mjs");
  const r = run("node", [sc, repoRoot], { encoding: "utf8" });
  console.log(` openwikiignore: ${(r.stdout || r.stderr || "").trim().split("\n").slice(-1)[0]}`);
}

console.log("Repo init complete.");
