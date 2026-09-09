#!/usr/bin/env node
// Refresh all OpenWiki directory indexes deterministically (no LLM, no CLI run).
//
// Drives the installed openwiki package's exported okf/index-sync helper so
// distill-authored pages get up-to-date directory indexes without invoking
// `openwiki --update`. Locates the global package via `npm root -g`.
//
// Usage: node sync_wiki_indexes.mjs [repo-root]
// Exits 2 with remediation hints when openwiki is missing or uninitialized.
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(2);
}

const root = path.resolve(process.argv[2] ?? process.cwd());
if (!existsSync(path.join(root, "openwiki"))) {
  fail(`${path.join(root, "openwiki")} not found; initialize the wiki first with \`openwiki --init\`.`);
}

const npmRoot = spawnSync("npm", ["root", "-g"], { encoding: "utf8" });
if (npmRoot.error || npmRoot.status !== 0) {
  fail("node and npm are required but were not found on PATH.");
}
const dist = path.join(npmRoot.stdout.trim(), "openwiki", "dist");
if (!existsSync(dist)) {
  fail(
    "the openwiki package is not installed globally.\n" +
    "Install it with:\n  npm i -g openwiki@latest"
  );
}

const backendMod = await import(pathToFileURL(path.join(dist, "agent/docs-only-backend.js")).href);
const syncMod = await import(pathToFileURL(path.join(dist, "okf/index-sync.js")).href);
const backend = new backendMod.OpenWikiLocalShellBackend({
  rootDir: root,
  docsOnly: true,
  virtualMode: true,
  maxOutputBytes: 100_000,
  timeout: 120,
});
await syncMod.synchronizeWikiIndexes(backend, "repository");
console.log(`Wiki indexes synchronized under ${path.join(root, "openwiki")}.`);
