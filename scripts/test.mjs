import esbuild from "esbuild";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const pluginRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outputDirectory = path.join(pluginRoot, ".test-build");
const testsDirectory = path.join(pluginRoot, "tests");

try {
  const entries = (await fs.readdir(testsDirectory))
    .filter((name) => name.endsWith(".test.ts"))
    .map((name) => path.join(testsDirectory, name));

  await esbuild.build({
    bundle: true,
    entryPoints: entries,
    external: ["node:*"],
    format: "esm",
    outExtension: { ".js": ".mjs" },
    outdir: outputDirectory,
    platform: "node",
    target: "node22",
  });

  for (const name of await fs.readdir(outputDirectory)) {
    if (name.endsWith(".mjs")) await import(pathToFileURL(path.join(outputDirectory, name)).href);
  }
} finally {
  await fs.rm(outputDirectory, { force: true, recursive: true });
}
