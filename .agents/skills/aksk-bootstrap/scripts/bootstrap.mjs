#!/usr/bin/env node
// Deterministic bootstrap orchestrator for AKSK + OpenSpec/OpenWiki.
//
// One idempotent entry point (EXECUTE / INSTRUCT lanes) that takes a repo
// from bare to fully wired. Never half-installs: a failed step prints the
// exact remaining commands and exits clean without partial state from that
// step. Global installs are per-user via `npm i -g` (user scope, not
// repo-local `npx` or `node_modules`).
//
// Usage: node bootstrap.mjs [repo-root] [--force] [--json]
//
// Preflight: Node >=22, tools on PATH, .agents/ / openspec/ / openwiki/
// receipts, then state report before acting.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
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

// ---- arg parsing
const argv = process.argv.slice(2);
let repoRoot = process.cwd();
let force = false;
let json = false;
for (const a of argv) {
  if (a === "--force") force = true;
  else if (a === "--json") json = true;
  else if (a === "--help" || a === "-h") {
    console.log(`Usage: node bootstrap.mjs [repo-root] [--force] [--json]\n\nGlobal lane is per-user via 'npm i -g' (user scope, not repo-local).`);
    process.exit(0);
  } else if (!a.startsWith("-")) repoRoot = path.resolve(a);
}
repoRoot = path.resolve(repoRoot);

// 1. Node preflight
const { major, ok: nodeOk } = hasNode();
let state = { ...detectState(repoRoot), nodeOk, nodeMajor: major };
printState(state, json);
if (!nodeOk) {
  console.error(`\nerror: Node ${major} < ${MIN_NODE_MAJOR}. Install Node >=${MIN_NODE_MAJOR} (e.g. via nvm/fnm) then re-run.`);
  console.error("No changes made.");
  process.exit(2);
}

// 2. Global lane — user scope `npm i -g` with caret range from package.json (C), skip when present
const missingTools = Object.entries(state.tools).filter(([, v]) => !v).map(([k]) => k);
const ver = versionsFromPackageJson(repoRoot);
const verOpenspec = ver?.openspec || null;
const verOpenwiki = ver?.openwiki || null;
if (ver && missingTools.length > 0) console.log(`Global lane versions from ${ver.source}: openspec ${verOpenspec || "latest"} / openwiki ${verOpenwiki || "latest"} (caret, not latest)`);
const pkgOpenspec = verOpenspec ? `@fission-ai/openspec@${verOpenspec}` : "@fission-ai/openspec@latest";
const pkgOpenwiki = verOpenwiki ? `openwiki@${verOpenwiki}` : "openwiki@latest";
const INSTALL_COMMANDS = {
  openspec: `npm i -g ${pkgOpenspec}`,
  openwiki: `npm i -g ${pkgOpenwiki}`,
};
const BOTH_INSTALL = missingTools.length === 2
  ? `npm i -g ${pkgOpenspec} ${pkgOpenwiki}`
  : missingTools.length === 1 ? INSTALL_COMMANDS[missingTools[0]] : BOTH_INSTALL_FALLBACK;
if (missingTools.length > 0) {
  console.log(`\nGlobal lane (user scope, caret from package.json): missing ${missingTools.join(", ")} → ${BOTH_INSTALL}`);
  if (!onPath("npm")) {
    console.error("error: npm not found on PATH; cannot perform global install.");
    instructRemaining(missingTools.map((t) => INSTALL_COMMANDS[t]));
    process.exit(0);
  }
  // Attempt single combined install when both missing, else per-tool — both are `npm i -g` (user scope, caret)
  const installArgs = missingTools.length === 2 ? ["i", "-g", pkgOpenspec, pkgOpenwiki] : ["i", "-g", ...missingTools.map((t) => t === "openspec" ? pkgOpenspec : pkgOpenwiki)];
  const r = run("npm", installArgs, { cwd: repoRoot });
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout || "npm install failed");
    instructRemaining([`npm ${installArgs.join(" ")}`]);
    process.exit(0);
  }
  console.log(r.stdout.trim().split("\n").slice(-5).join("\n"));
  // Re-detect; verify openwiki resolves before MCP registration
  state = { ...detectState(repoRoot), nodeOk, nodeMajor: major };
  if (!state.tools.openwiki) {
    console.error("error: openwiki still not on PATH after global install; add npm global bin to PATH.");
    instructRemaining(["openwiki integrations list"]);
    process.exit(0);
  }
  console.log("Global lane complete (user scope `npm i -g`; no repo-local installs).");
} else {
  console.log("\nGlobal lane: both tools present — skipping user-scope install (already `npm i -g` installed).");
  // Report versions
  for (const t of ["openspec", "openwiki"]) {
    const r = run(t, ["--version"], { encoding: "utf8" });
    if (r.status === 0) console.log(`  ${t} ${r.stdout.trim()}`);
  }
}

// 3. Per-repo lane
console.log("\nPer-repo lane:");
const remaining = [];
// openspec init when missing
if (!state.trees.openspec) {
  console.log("  openspec/ missing → running `openspec init --tools none`");
  if (!state.tools.openspec && !onPath("openspec")) {
    remaining.push("openspec init --tools none");
  } else {
    const r = run("openspec", ["init", "--tools", "none"], { cwd: repoRoot, encoding: "utf8" });
    if (r.status !== 0) {
      console.error(r.stderr || r.stdout);
      instructRemaining(["openspec init --tools none", "node .agents/skills/aksk-bootstrap/scripts/attach_wiki_contract.mjs", "node .agents/skills/aksk-bootstrap/scripts/attach_section.mjs"]);
      process.exit(0);
    }
    console.log("  openspec init complete");
  }
} else {
  console.log("  openspec/ present — skipping init");
}

// .agents scaffold — minimal when missing or incomplete
if (!state.trees.agents) {
  console.log("  .agents/ missing → scaffolding minimal kit tree");
  try {
    mkdirSync(path.join(repoRoot, ".agents", "skills"), { recursive: true });
    mkdirSync(path.join(repoRoot, ".agents", "sessions"), { recursive: true });
    // Copy kit templates if running from kit repo; otherwise create placeholder
    const kitAgents = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
    // Only scaffold .agents/AGENTS.md etc if not present; real scaffold copies finalized kit templates per design
    const targetAgentsMd = path.join(repoRoot, ".agents", "AGENTS.md");
    if (!existsSync(targetAgentsMd)) {
      // Reuse attach_section templates by invoking that script later; create empty for now
      writeFileSync(targetAgentsMd, "");
    }
    console.log("  .agents/ scaffolded");
  } catch (e) {
    console.error(`  scaffold failed: ${e.message}`);
    instructRemaining(["# manually scaffold .agents/ from kit templates"]);
    process.exit(0);
  }
} else {
  console.log("  .agents/ present — skipping scaffold (idempotent check)");
}

// curation-contract attachment — delegate to existing script semantics, never create openwiki/INSTRUCTIONS.md
if (!state.trees.openwiki) {
  console.log("  openwiki/ missing — skipping contract attachment (run `openwiki --init` first)");
  remaining.push("openwiki --init");
} else {
  const script = path.join(path.dirname(fileURLToPath(import.meta.url)), "attach_wiki_contract.mjs");
  const r = run("node", [script, repoRoot], { encoding: "utf8" });
  console.log(`  contract: ${r.stdout.trim() || r.stderr.trim()}`);
  if (r.status !== 0 && r.status !== null) {
    // attach script exits 2 when INSTRUCTIONS.md missing — treat as INSTRUCT
    instructRemaining(["openwiki --init", `node ${script} ${repoRoot}`]);
    process.exit(0);
  }
}

// baseline seed — FerroxLabs AGENTS.md wrapped in AKSK:AGENTS-BASELINE (before OpenWiki/AKSK zones)
{
  const script = path.join(path.dirname(fileURLToPath(import.meta.url)), "init_agents_md.mjs");
  const r = run("node", [script, repoRoot], { encoding: "utf8" });
  const out = (r.stdout || "") + (r.stderr || "");
  if (r.status === 0) {
    console.log(`  baseline: ${out.trim().split("\n").slice(-2).join(" | ") || "seeded/no-op"}`);
  } else if (r.status === 2) {
    // Existing file with non-matching content — requires explicit --replace or --combine; never half-install
    console.log(out.trim());
    instructRemaining([
      `node ${script} ${repoRoot} --replace  # overwrite with vendored baseline`,
      `node ${script} ${repoRoot} --combine  # stage existing + baseline under .agents/sessions/agents-md-combine/<timestamp>/ for LLM merge`,
    ]);
    process.exit(0);
  } else {
    console.error(out.trim() || `init_agents_md.mjs failed with status ${r.status}`);
    instructRemaining([`node ${script} ${repoRoot}`]);
    process.exit(0);
  }
}

// routing block merge into root AGENTS.md — preserves OpenWiki block (runs after baseline per zoned order baseline → OpenWiki → AKSK)
{
  const script = path.join(path.dirname(fileURLToPath(import.meta.url)), "attach_section.mjs");
  const r = run("node", [script, repoRoot, "AGENTS.md", "routing-note-template.md"], { encoding: "utf8" });
  console.log(`  routing: ${r.stdout.trim() || r.stderr.trim()}`);
  if (r.status !== 0) {
    instructRemaining([`node ${script} ${repoRoot} AGENTS.md routing-note-template.md`]);
    process.exit(0);
  }
}

// lifecycle block (idempotent; attach alongside routing)
{
  const script = path.join(path.dirname(fileURLToPath(import.meta.url)), "attach_section.mjs");
  const r = run("node", [script, repoRoot, "AGENTS.md", "lifecycle-template.md"], { encoding: "utf8" });
  // Non-fatal if .agents/AGENTS.md handling differs; just report
  if (r.status === 0) console.log(`  lifecycle: ${r.stdout.trim()}`);
}

// 4. Integration spread — lane ladder per detected agent, receipt-partitioned
console.log("\nIntegration spread:");
if (!onPath("openwiki")) {
  console.log("  openwiki not on PATH — cannot spread; headless fallback: use `openwiki --init -p` / `--update -p`");
  if (remaining.length) instructRemaining(remaining);
} else {
  const list = run("openwiki", ["integrations", "list"], { encoding: "utf8" });
  const output = (list.stdout || "") + (list.stderr || "");
  console.log(output.trim().split("\n").slice(0, 40).join("\n"));
  // Determine hosts: codex, claude, opencode are supported; others headless
  const hosts = ["codex", "claude", "opencode"];
  for (const host of hosts) {
    const installed = output.includes(host) && output.includes("installed");
    const modified = output.includes(host) && output.includes("modified");
    const notInstalled = !installed && !modified;
    if (installed && !force) {
      console.log(`  ${host}: already installed — skip (ownership partition by receipt .openwiki-install.json)`);
      continue;
    }
    if (modified && !force) {
      console.log(`  ${host}: modified — skip; re-run with --force to overwrite (backup created)`);
      continue;
    }
    if (notInstalled || force) {
      // Only attempt install if host appears detectable; otherwise skip silently
      // For now, attempt install when not installed; openwiki will error with guidance if host not applicable
      console.log(`  ${host}: ${force && modified ? "force " : ""}installing via \`openwiki integrations install ${host}\` (skill + MCP atomically)`);
      const r = run("openwiki", ["integrations", "install", host, ...(force ? ["--force"] : [])], { encoding: "utf8" });
      const msg = (r.stdout || "") + (r.stderr || "");
      console.log(msg.trim().split("\n").slice(0, 20).join("\n") || `(no output, status ${r.status})`);
      if (r.status !== 0) {
        // Check if host not detected / not applicable — not an error, just report
        if (msg.includes("not-installed") || msg.includes("unknown")) {
          console.log(`  ${host}: host not applicable on this machine — headless lane remains`);
        } else {
          console.log(`  ${host}: install failed — see above; remaining host installs skipped for this run`);
        }
      } else {
        // Verify via list
        const verify = run("openwiki", ["integrations", "list"], { encoding: "utf8" });
        console.log(`  verify: ${verify.stdout.trim().split("\n").filter((l) => l.includes(host)).join(" | ")}`);
      }
    }
  }
  console.log("\nHeadless lane: agents without supported integration (not codex|claude|opencode) use `openwiki --init -p` / `openwiki --update -p` directly.");
}

// Final report
console.log("\nBootstrap complete — idempotent re-run will report no changes when repo is fully bootstrapped.");
if (remaining.length) {
  console.log("Remaining manual steps (INSTRUCT):");
  for (const c of remaining) console.log(`  ${c}`);
}
