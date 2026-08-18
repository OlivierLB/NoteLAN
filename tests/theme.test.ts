import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSettings } from "../src/settings";
import { customCssBlock, themeVariables } from "../src/theme";

test("renders selected theme values", () => {
  const settings = normalizeSettings({ theme: { preset: "light", accentColor: "#123456", contentWidth: 1200 } });
  const css = themeVariables(settings.theme);
  assert.match(css, /--content-width: 1200px/);
  assert.match(css, /--page-link: #123456/);
  assert.match(css, /color-scheme: light/);
});

test("custom CSS cannot close the generated style element", () => {
  const settings = normalizeSettings({ theme: { customCss: "</style><script>alert(1)</script>" } });
  assert.doesNotMatch(customCssBlock(settings.theme), /<\/style>/i);
});
