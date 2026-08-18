import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pluginRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const mainPath = path.join(pluginRoot, "src", "main.ts");
const stylesPath = path.join(pluginRoot, "src", "page-styles.ts");
const source = fs.readFileSync(mainPath, "utf8");
const renderPageStart = source.indexOf("  renderPage(title, body, notePath)");
const start = source.indexOf("  <style>\n", renderPageStart);
const end = source.indexOf("  </style>", start);
if (renderPageStart < 0 || start < 0 || end < 0) throw new Error("Unable to locate generated page styles");

const css = source.slice(start + "  <style>\n".length, end);
const moduleSource = `import type { ThemeSettings } from "./settings";
import { customCssBlock, themeVariables } from "./theme";

export function pageStyles(settings: ThemeSettings): string {
  return \`${css.replaceAll("this.settings.theme", "settings")}\`;
}
`;

fs.writeFileSync(stylesPath, moduleSource, "utf8");
fs.writeFileSync(mainPath, `${source.slice(0, start)}  <style>\${pageStyles(this.settings.theme)}</style>\n${source.slice(end + "  </style>\n".length)}`, "utf8");
