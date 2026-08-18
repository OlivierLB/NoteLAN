const assert = require("node:assert/strict");
const Module = require("node:module");
const path = require("node:path");

class ObsidianBase {}
const obsidianMock = {
  Modal: ObsidianBase,
  Notice: ObsidianBase,
  Plugin: ObsidianBase,
  PluginSettingTab: ObsidianBase,
  Setting: ObsidianBase,
  TFile: ObsidianBase,
  TFolder: ObsidianBase,
  setIcon() {},
};

const originalLoad = Module._load;
Module._load = function load(request, parent, isMain) {
  if (request === "obsidian") return obsidianMock;
  return originalLoad.call(this, request, parent, isMain);
};

try {
  const loaded = require(path.join(__dirname, "..", "main.js"));
  const PluginClass = loaded?.default ?? loaded;
  assert.equal(typeof PluginClass, "function", "main.js must export an Obsidian plugin class");
} finally {
  Module._load = originalLoad;
}
