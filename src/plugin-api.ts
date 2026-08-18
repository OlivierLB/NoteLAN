import type { TFile, TFolder } from "obsidian";
import type { AnalyticsSummary } from "./analytics";
import type { Locale, TranslationKey, TranslationValues } from "./i18n";
import type { LocalNoteShareSettings } from "./settings";

export interface LocalNoteSharePluginApi {
  settings: LocalNoteShareSettings;
  locale: Locale;
  server: object | null;
  copyShareUrl(): Promise<void>;
  copyText(text: string): Promise<void>;
  generateToken(): string;
  getAnalyticsSummary(): AnalyticsSummary;
  getFolderUrl(folderPath: string): string;
  getNoteUrl(notePath: string): string;
  getShareUrl(): string;
  isFolderExplicitlyShared(folderPath: string): boolean;
  isNoteShared(file: TFile): boolean;
  isPathInSharedFolder(filePath: string): boolean;
  saveSettings(): Promise<void>;
  resetAnalytics(): Promise<void>;
  scheduleAutoStop(): void;
  shareFolder(folder: TFolder): Promise<void>;
  shareNote(file: TFile): Promise<void>;
  startServer(): Promise<void>;
  stopServer(): Promise<void>;
  t(key: TranslationKey, values?: TranslationValues): string;
  toggleServer(): Promise<void>;
  unshareFolder(folderPath: string): Promise<void>;
  unshareNote(filePath: string): Promise<void>;
}
