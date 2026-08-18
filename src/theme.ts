import type { ThemeSettings } from "./settings";

interface Palette {
  colorScheme: "dark" | "light" | "normal";
  background: string;
  text: string;
  surface: string;
  surfaceStrong: string;
  border: string;
  muted: string;
  accent: string;
  shadow: string;
}

const PALETTES: Record<ThemeSettings["preset"], Palette> = {
  "royal-velvet": {
    colorScheme: "dark",
    background: "#000000",
    text: "hsl(60 30% 96%)",
    surface: "hsl(235 15% 13% / 0.9)",
    surfaceStrong: "hsl(235 15% 19% / 0.96)",
    border: "hsl(285 100% 75.1% / 0.24)",
    muted: "hsl(60 30% 96% / 0.6)",
    accent: "hsl(35 100% 75.1%)",
    shadow: "0 20px 60px hsl(235 25% 4% / 0.5)",
  },
  light: {
    colorScheme: "light",
    background: "#f7f7f5",
    text: "#252522",
    surface: "rgb(255 255 255 / 0.92)",
    surfaceStrong: "#ffffff",
    border: "rgb(37 37 34 / 0.14)",
    muted: "rgb(37 37 34 / 0.62)",
    accent: "#9a5b00",
    shadow: "0 18px 50px rgb(31 35 40 / 0.12)",
  },
  system: {
    colorScheme: "normal",
    background: "Canvas",
    text: "CanvasText",
    surface: "color-mix(in srgb, Canvas 92%, CanvasText 8%)",
    surfaceStrong: "color-mix(in srgb, Canvas 86%, CanvasText 14%)",
    border: "color-mix(in srgb, CanvasText 20%, transparent)",
    muted: "color-mix(in srgb, CanvasText 62%, transparent)",
    accent: "LinkText",
    shadow: "0 18px 50px rgb(0 0 0 / 0.18)",
  },
};

export function themeVariables(settings: ThemeSettings): string {
  const palette = PALETTES[settings.preset];
  return `
    color-scheme: ${palette.colorScheme};
    font-family: ${safeCssValue(settings.fontFamily)};
    --content-width: ${settings.contentWidth}px;
    --page-bg: ${palette.background};
    --page-text: ${palette.text};
    --page-link: ${settings.accentColor};
    --page-surface: ${palette.surface};
    --page-surface-strong: ${palette.surfaceStrong};
    --page-border: ${palette.border};
    --page-muted: ${palette.muted};
    --page-accent: ${palette.accent};
    --page-shadow: ${palette.shadow};
    --heading-pink: ${settings.accentColor};
    --heading-orange: hsl(35 100% 65%);
    --heading-yellow: hsl(55 92% 62%);
    --heading-green: hsl(115 58% 58%);
    --heading-blue: hsl(190 75% 58%);
    --heading-purple: hsl(265 78% 72%);
  `.trim();
}

export function customCssBlock(settings: ThemeSettings): string {
  if (!settings.customCss.trim()) return "";
  return settings.customCss.replace(/<\/style/gi, "<\\/style");
}

function safeCssValue(value: string): string {
  return value.replace(/[;{}<>]/g, "").trim() || "system-ui, sans-serif";
}
