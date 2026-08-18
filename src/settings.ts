import {
  DEFAULT_ANALYTICS_SETTINGS,
  createEmptyAnalyticsData,
  normalizeAnalyticsData,
  normalizeAnalyticsSettings,
  type AnalyticsData,
  type AnalyticsSettings,
} from "./analytics";

export type ThemePreset = "royal-velvet" | "light" | "system";

export interface ThemeSettings {
  preset: ThemePreset;
  accentColor: string;
  contentWidth: number;
  fontFamily: string;
  showFilePaths: boolean;
  customCss: string;
}

export interface LocalNoteShareSettings {
  port: number;
  autoStart: boolean;
  autoStopMinutes: number;
  requireToken: boolean;
  token: string;
  sharedNotes: string[];
  sharedFolders: string[];
  analytics: AnalyticsSettings;
  analyticsData: AnalyticsData;
  theme: ThemeSettings;
}

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  preset: "royal-velvet",
  accentColor: "#ff80bf",
  contentWidth: 980,
  fontFamily: '"Segoe UI", Inter, ui-sans-serif, system-ui, sans-serif',
  showFilePaths: true,
  customCss: "",
};

export const DEFAULT_SETTINGS: LocalNoteShareSettings = {
  port: 8099,
  autoStart: false,
  autoStopMinutes: 0,
  requireToken: true,
  token: "",
  sharedNotes: [],
  sharedFolders: [],
  analytics: DEFAULT_ANALYTICS_SETTINGS,
  analyticsData: createEmptyAnalyticsData(),
  theme: DEFAULT_THEME_SETTINGS,
};

const THEME_PRESETS = new Set<ThemePreset>(["royal-velvet", "light", "system"]);

export function normalizeSettings(value: unknown): LocalNoteShareSettings {
  const input = isRecord(value) ? value : {};
  const rawTheme = isRecord(input.theme) ? input.theme : {};
  const port = Number(input.port);
  const contentWidth = Number(rawTheme.contentWidth);
  const autoStopMinutes = Number(input.autoStopMinutes);
  const preset = typeof rawTheme.preset === "string" && THEME_PRESETS.has(rawTheme.preset as ThemePreset)
    ? rawTheme.preset as ThemePreset
    : DEFAULT_THEME_SETTINGS.preset;

  return {
    port: Number.isInteger(port) && port >= 1 && port <= 65535 ? port : DEFAULT_SETTINGS.port,
    autoStart: input.autoStart === true,
    autoStopMinutes: [0, 60, 120, 240, 480].includes(autoStopMinutes)
      ? autoStopMinutes
      : DEFAULT_SETTINGS.autoStopMinutes,
    requireToken: input.requireToken !== false,
    token: typeof input.token === "string" ? input.token : "",
    sharedNotes: uniqueStrings(input.sharedNotes),
    sharedFolders: uniqueStrings(input.sharedFolders),
    analytics: normalizeAnalyticsSettings(input.analytics),
    analyticsData: normalizeAnalyticsData(input.analyticsData),
    theme: {
      preset,
      accentColor: validColor(rawTheme.accentColor) ? rawTheme.accentColor : DEFAULT_THEME_SETTINGS.accentColor,
      contentWidth: Number.isFinite(contentWidth) ? clamp(contentWidth, 560, 1600) : DEFAULT_THEME_SETTINGS.contentWidth,
      fontFamily: typeof rawTheme.fontFamily === "string" && rawTheme.fontFamily.trim()
        ? rawTheme.fontFamily.trim().slice(0, 240)
        : DEFAULT_THEME_SETTINGS.fontFamily,
      showFilePaths: rawTheme.showFilePaths !== false,
      customCss: typeof rawTheme.customCss === "string" ? rawTheme.customCss.slice(0, 50_000) : "",
    },
  };
}

export function createSecureToken(): string {
  const bytes = new Uint8Array(24);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function uniqueStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string" && item.length > 0))].sort();
}

function validColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, Math.round(value)));
}
