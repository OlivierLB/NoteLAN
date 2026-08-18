import { TFile, type Vault } from "obsidian";
import { normalizeVaultPath } from "./paths";

export class ShareIndex {
  private allFiles: TFile[] | null = null;
  private cacheKey = "";
  private sharedPaths: string[] = [];

  constructor(private readonly vault: Vault) {}

  invalidate(): void {
    this.allFiles = null;
    this.cacheKey = "";
    this.sharedPaths = [];
  }

  invalidateSelection(): void {
    this.cacheKey = "";
    this.sharedPaths = [];
  }

  filesInFolder(folderPath: string): TFile[] {
    const normalized = normalizeVaultPath(folderPath);
    const prefix = `${normalized}/`;
    return this.files().filter((file) => file.path.startsWith(prefix));
  }

  getSharedPaths(sharedNotes: string[], sharedFolders: string[]): string[] {
    const normalizedFolders = sharedFolders.map(normalizeVaultPath).filter(Boolean).sort();
    const normalizedNotes = sharedNotes.map(normalizeVaultPath).filter(Boolean).sort();
    const key = JSON.stringify([normalizedNotes, normalizedFolders]);
    if (key === this.cacheKey) return this.sharedPaths;

    const paths = new Set(normalizedNotes);
    if (normalizedFolders.length) {
      for (const file of this.files()) {
        if (normalizedFolders.some((folder) => file.path.startsWith(`${folder}/`))) {
          paths.add(file.path);
        }
      }
    }

    this.cacheKey = key;
    this.sharedPaths = [...paths].sort();
    return this.sharedPaths;
  }

  private files(): TFile[] {
    if (!this.allFiles) this.allFiles = this.vault.getFiles();
    return this.allFiles;
  }
}
