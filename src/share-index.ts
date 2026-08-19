import { TFile, TFolder, type Vault } from "obsidian";
import { normalizeVaultPath } from "./paths";

export class ShareIndex {
  private readonly folderFiles = new Map<string, TFile[]>();
  private cacheKey = "";
  private sharedPaths: string[] = [];

  constructor(private readonly vault: Vault) {}

  invalidate(): void {
    this.folderFiles.clear();
    this.cacheKey = "";
    this.sharedPaths = [];
  }

  invalidateSelection(): void {
    this.cacheKey = "";
    this.sharedPaths = [];
  }

  filesInFolder(folderPath: string): TFile[] {
    const normalized = normalizeVaultPath(folderPath);
    const cached = this.folderFiles.get(normalized);
    if (cached) return cached;

    const entry = normalized ? this.vault.getAbstractFileByPath(normalized) : this.vault.getRoot();
    if (!(entry instanceof TFolder)) return [];

    const files: TFile[] = [];
    this.collectFiles(entry, files);
    this.folderFiles.set(normalized, files);
    return files;
  }

  getSharedPaths(sharedNotes: string[], sharedFolders: string[]): string[] {
    const normalizedFolders = sharedFolders.map(normalizeVaultPath).filter(Boolean).sort();
    const normalizedNotes = sharedNotes.map(normalizeVaultPath).filter(Boolean).sort();
    const key = JSON.stringify([normalizedNotes, normalizedFolders]);
    if (key === this.cacheKey) return this.sharedPaths;

    const paths = new Set(normalizedNotes);
    for (const folder of normalizedFolders) {
      for (const file of this.filesInFolder(folder)) paths.add(file.path);
    }

    this.cacheKey = key;
    this.sharedPaths = [...paths].sort();
    return this.sharedPaths;
  }

  private collectFiles(folder: TFolder, files: TFile[]): void {
    for (const child of folder.children) {
      if (child instanceof TFile) files.push(child);
      else if (child instanceof TFolder) this.collectFiles(child, files);
    }
  }
}
