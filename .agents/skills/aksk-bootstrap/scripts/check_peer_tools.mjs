#!/usr/bin/env node
// Verify peer-tool binaries resolve on PATH before use. Never installs.
//
// Standalone:  node check_peer_tools.mjs openspec openwiki
// Importable:  import { requireBinaries } from "./check_peer_tools.mjs";
//
// On a missing binary this prints one error per missing tool followed by the
// exact install commands, then exits 2. Unknown tool names also exit 2.
import { existsSync } from "node:fs";
import path from "node:path";

export const INSTALL_COMMANDS = {
  openspec: "npm i -g @fission-ai/openspec@latest",
  openwiki: "npm i -g openwiki@latest",
};

export function onPath(cmd) {
  const dirs = (process.env.PATH ?? "").split(path.delimiter).filter(Boolean);
  const exts =
    process.platform === "win32"
      ? (process.env.PATHEXT ?? ".EXE;.CMD;.BAT").split(";")
      : [""];
  return dirs.some((d) => exts.some((e) => existsSync(path.join(d, cmd + e))));
}

export function missing(tools) {
  const unknown = tools.filter((t) => !(t in INSTALL_COMMANDS));
  if (unknown.length > 0) {
    throw new Error(`unknown peer tool(s): ${unknown.join(", ")}`);
  }
  return tools.filter((t) => !onPath(t));
}

export function requireBinaries(tools) {
  const gone = missing(tools);
  if (gone.length === 0) return;
  for (const tool of gone) {
    console.error(`error: required peer tool '${tool}' is not installed or not on PATH.`);
  }
  console.error("Install the missing tools with:");
  for (const tool of gone) {
    console.error(`  ${INSTALL_COMMANDS[tool]}`);
  }
  process.exit(2);
}

const argv = process.argv.slice(2);
if (argv.length === 0) {
  console.error("usage: node check_peer_tools.mjs <tool> [<tool> ...]");
  process.exit(2);
}
try {
  requireBinaries(argv);
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exit(2);
}
console.log(`all peer tools present: ${argv.join(", ")}`);
