import esbuild from "esbuild";
import { builtinModules } from "node:module";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const production = process.argv[2] === "production";
const pluginRoot = path.dirname(fileURLToPath(import.meta.url));
const context = await esbuild.context({
  absWorkingDir: pluginRoot,
  banner: { js: "/* Generated from src/. Do not edit main.js directly. */" },
  bundle: true,
  entryPoints: [path.join(pluginRoot, "src", "main.ts")],
  external: ["obsidian", "electron", ...builtinModules],
  format: "cjs",
  logLevel: "info",
  minify: production,
  outfile: path.join(pluginRoot, "main.js"),
  platform: "node",
  sourcemap: production ? false : "inline",
  target: "es2022",
  treeShaking: true,
});

if (production) {
  await context.rebuild();
  await context.dispose();
} else {
  await context.watch();
  console.log("Watching local-note-share sources…");
}
