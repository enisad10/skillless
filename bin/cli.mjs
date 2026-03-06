#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, mkdirSync, cpSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { homedir } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CLAUDE_DIR = join(homedir(), ".claude");
const PLUGINS_DIR = join(CLAUDE_DIR, "plugins");
const TARGET = join(PLUGINS_DIR, "skillless");

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
  console.log(`
  skillless - Auto-discovery plugin for Claude Code

  Usage:
    npx skillless            Install the plugin
    npx skillless uninstall  Remove the plugin
    npx skillless status     Check installation status
    npx skillless help       Show this message
`);
}

function install() {
  console.log("\n  Installing skillless...\n");

  // Ensure ~/.claude/plugins exists
  if (!existsSync(PLUGINS_DIR)) {
    mkdirSync(PLUGINS_DIR, { recursive: true });
  }

  // Copy plugin files
  const dirs = [".claude-plugin", "skills", "commands"];

  if (existsSync(TARGET)) {
    console.log("  Updating existing installation...");
    for (const dir of dirs) {
      const targetDir = join(TARGET, dir);
      if (existsSync(targetDir)) {
        execSync(`rm -rf "${targetDir}"`);
      }
    }
  } else {
    mkdirSync(TARGET, { recursive: true });
  }

  for (const dir of dirs) {
    const src = join(ROOT, dir);
    const dest = join(TARGET, dir);
    if (existsSync(src)) {
      cpSync(src, dest, { recursive: true });
    }
  }

  console.log("  Installed to: " + TARGET);
  console.log("");
  console.log("  Next, register the plugin in Claude Code:");
  console.log(`    claude /plugin install ${TARGET}`);
  console.log("");
  console.log("  Then try: /discover react");
  console.log("");
}

function uninstall() {
  if (!existsSync(TARGET)) {
    console.log("\n  skillless is not installed.\n");
    return;
  }

  execSync(`rm -rf "${TARGET}"`);
  console.log("\n  skillless has been removed.\n");
}

function status() {
  if (!existsSync(TARGET)) {
    console.log("\n  Status: not installed\n");
    return;
  }

  const dirs = [".claude-plugin", "skills", "commands"];
  const present = dirs.filter((d) => existsSync(join(TARGET, d)));

  console.log("\n  Status: installed");
  console.log("  Location: " + TARGET);
  console.log("  Components: " + present.join(", "));
  console.log("");
}

switch (command) {
  case "uninstall":
  case "remove":
    uninstall();
    break;
  case "status":
    status();
    break;
  case "help":
  case "--help":
  case "-h":
    printHelp();
    break;
  default:
    install();
    break;
}
