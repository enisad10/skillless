#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, mkdirSync, cpSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { homedir } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CLAUDE_DIR = join(homedir(), ".claude");
const PLUGINS_DIR = join(CLAUDE_DIR, "plugins");
const TARGET = join(PLUGINS_DIR, "skillless");
const SETTINGS_PATH = join(CLAUDE_DIR, "settings.json");
const PLUGIN_KEY = "skillless";

function readSettings() {
  if (!existsSync(SETTINGS_PATH)) return {};
  try {
    return JSON.parse(readFileSync(SETTINGS_PATH, "utf8"));
  } catch {
    return {};
  }
}

function writeSettings(settings) {
  writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2) + "\n");
}

function registerPlugin() {
  const settings = readSettings();
  settings.enabledPlugins = settings.enabledPlugins || {};
  if (settings.enabledPlugins[PLUGIN_KEY]) {
    return false;
  }
  settings.enabledPlugins[PLUGIN_KEY] = true;
  writeSettings(settings);
  return true;
}

function unregisterPlugin() {
  const settings = readSettings();
  if (!settings.enabledPlugins || !settings.enabledPlugins[PLUGIN_KEY]) {
    return false;
  }
  delete settings.enabledPlugins[PLUGIN_KEY];
  writeSettings(settings);
  return true;
}

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

  // Auto-register in Claude Code settings
  const registered = registerPlugin();
  if (registered) {
    console.log("  Registered in Claude Code settings.");
  } else {
    console.log("  Already registered in Claude Code settings.");
  }

  console.log("");
  console.log("  Ready! Try: /discover react");
  console.log("");
}

function uninstall() {
  if (!existsSync(TARGET)) {
    console.log("\n  skillless is not installed.\n");
    return;
  }

  execSync(`rm -rf "${TARGET}"`);
  unregisterPlugin();
  console.log("\n  skillless has been removed.\n");
}

function status() {
  if (!existsSync(TARGET)) {
    console.log("\n  Status: not installed\n");
    return;
  }

  const dirs = [".claude-plugin", "skills", "commands"];
  const present = dirs.filter((d) => existsSync(join(TARGET, d)));

  const settings = readSettings();
  const isRegistered = !!(settings.enabledPlugins && settings.enabledPlugins[PLUGIN_KEY]);

  console.log("\n  Status: installed");
  console.log("  Location: " + TARGET);
  console.log("  Components: " + present.join(", "));
  console.log("  Registered: " + (isRegistered ? "yes" : "no"));
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
