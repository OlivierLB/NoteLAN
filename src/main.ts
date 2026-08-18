import { Notice, Plugin, TFile, TFolder, moment, setIcon } from "obsidian";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import {
  createEmptyAnalyticsData,
  getAnonymousVisitorHash,
  isLoopbackAddress,
  recordAnalyticsVisit,
  summarizeAnalytics,
  type AnalyticsPage,
} from "./analytics";
import { contentTypeFor } from "./mime";
import {
  formatCount,
  resolveLocale,
  translate,
  type Locale,
  type TranslationKey,
  type TranslationValues,
} from "./i18n";
import { pageStyles } from "./page-styles";
import { escapeHtml, normalizeVaultPath, parentFolderPath, parseLinkTarget, slugifyHeading } from "./paths";
import { ShareIndex } from "./share-index";
import { createSecureToken, normalizeSettings, type LocalNoteShareSettings } from "./settings";
import { confirmFolderShare, CurrentNoteShareModal, LocalNoteShareSettingTab } from "./ui";

const MEDIA_EXTENSIONS = new Set([
  "avif",
  "bmp",
  "gif",
  "jpeg",
  "jpg",
  "png",
  "svg",
  "webp",
  "pdf",
  "mp3",
  "wav",
  "ogg",
  "m4a",
  "mp4",
  "webm",
  "mov",
]);

export default class LocalNoteSharePlugin extends Plugin {
  declare settings: LocalNoteShareSettings;
  locale: Locale = "en";
  server: http.Server | null = null;
  shareIndex!: ShareIndex;
  notePageCache = new Map<string, { mtime: number; html: string }>();
  autoStopTimer: ReturnType<typeof setTimeout> | null = null;
  analyticsSaveTimer: ReturnType<typeof setTimeout> | null = null;
  statusBarEl!: HTMLElement;
  ribbonIconEl!: HTMLElement;

  async onload() {
    this.locale = resolveLocale(moment.locale());
    await this.loadSettings();
    this.server = null;
    this.shareIndex = new ShareIndex(this.app.vault);
    this.statusBarEl = this.addStatusBarItem();
    this.statusBarEl.addClass("local-note-share-statusbar");

    this.ribbonIconEl = this.addRibbonIcon("share-2", this.t("ribbonShareNote"), () => this.openCurrentNoteShareModal());
    this.ribbonIconEl.addClass("local-note-share-ribbon-button");
    this.updateUiState();
    this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.updateUiState()));
    this.registerEvent(this.app.vault.on("modify", (file) => this.handleVaultModify(file)));
    this.registerEvent(this.app.vault.on("rename", (file, oldPath) => this.handleVaultRename(file, oldPath)));
    this.registerEvent(this.app.vault.on("delete", (file) => this.handleVaultDelete(file)));
    this.registerEvent(this.app.vault.on("create", () => this.shareIndex.invalidate()));
    this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => this.addFileMenuItems(menu, file)));

    this.addCommand({
      id: "manage-current-note-local-share",
      name: this.t("commandManageNote"),
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!file) return false;
        if (!checking) this.openCurrentNoteShareModal();
        return true;
      },
    });

    this.addCommand({
      id: "toggle-local-note-share-server",
      name: this.t("commandToggleServer"),
      callback: () => this.toggleServer(),
    });

    this.addCommand({
      id: "share-current-note-locally",
      name: this.t("commandShareNote"),
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!file) return false;
        if (!checking) this.shareNote(file);
        return true;
      },
    });

    this.addCommand({
      id: "unshare-current-note-locally",
      name: this.t("commandUnshareNote"),
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!file) return false;
        if (!checking) this.unshareNote(file.path);
        return true;
      },
    });

    this.addCommand({
      id: "copy-local-share-url",
      name: this.t("commandCopyUrl"),
      callback: () => this.copyShareUrl(),
    });

    this.addSettingTab(new LocalNoteShareSettingTab(this.app, this));

    if (this.settings.autoStart) {
      this.app.workspace.onLayoutReady(() => this.startServer());
    }
  }

  async onunload() {
    await this.stopServer();
    await this.flushAnalyticsSave();
  }

  async loadSettings() {
    this.settings = normalizeSettings(await this.loadData());
    if (!this.settings.token) {
      this.settings.token = createSecureToken();
      await this.saveSettings();
    }
  }

  t(key: TranslationKey, values?: TranslationValues) {
    return translate(this.locale, key, values);
  }

  async saveSettings() {
    this.settings.sharedNotes = [...new Set(this.settings.sharedNotes)].sort();
    this.settings.sharedFolders = [...new Set(this.settings.sharedFolders.map(normalizeVaultPath).filter(Boolean))].sort();
    this.shareIndex?.invalidateSelection();
    this.notePageCache.clear();
    await this.saveData(this.settings);
  }

  queueAnalyticsSave() {
    if (this.analyticsSaveTimer) return;
    this.analyticsSaveTimer = setTimeout(() => {
      this.analyticsSaveTimer = null;
      void this.saveData(this.settings).catch((error) => {
        console.error("Local Note Share analytics save error", error);
      });
    }, 1_000);
  }

  async flushAnalyticsSave() {
    if (!this.analyticsSaveTimer) return;
    clearTimeout(this.analyticsSaveTimer);
    this.analyticsSaveTimer = null;
    await this.saveData(this.settings);
  }

  getAnalyticsSummary() {
    return summarizeAnalytics(
      this.settings.analyticsData,
      this.settings.analytics.retentionDays,
    );
  }

  async resetAnalytics() {
    this.settings.analyticsData = createEmptyAnalyticsData();
    await this.saveSettings();
  }

  async toggleServer() {
    if (this.server) {
      await this.stopServer();
      new Notice(this.t("serverStopped"));
      return;
    }

    await this.startServer();
  }

  async startServer() {
    if (this.server) return;

    const server = http.createServer((req, res) => {
      this.handleRequest(req, res).catch((error) => {
        console.error("Local Note Share error", error);
        const message = error instanceof Error ? error.message : String(error);
        this.sendHtml(res, 500, this.renderPage(this.t("errorTitle"), `<p>${escapeHtml(message)}</p>`));
      });
    });
    this.server = server;

    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(Number(this.settings.port), "0.0.0.0", () => {
        server.off("error", reject);
        resolve();
      });
    });

    this.scheduleAutoStop();
    const duration = this.settings.autoStopMinutes
      ? this.t("serverDurationHours", { hours: this.settings.autoStopMinutes / 60 })
      : this.t("serverDurationManual");
    const protection = this.settings.requireToken ? this.t("serverProtected") : this.t("serverUnprotected");
    new Notice(this.t("serverStarted", { duration, protection, url: this.getShareUrl() }), 9000);
  }

  async stopServer() {
    this.clearAutoStopTimer();
    if (!this.server) return;

    const server = this.server;
    this.server = null;
    await new Promise((resolve) => server.close(resolve));
  }

  scheduleAutoStop() {
    this.clearAutoStopTimer();
    if (!this.server || this.settings.autoStopMinutes <= 0) return;
    this.autoStopTimer = setTimeout(() => {
      void this.stopServer().then(async () => {
        await this.updateUiState();
        new Notice(this.t("serverAutoStopped"));
      });
    }, this.settings.autoStopMinutes * 60_000);
  }

  clearAutoStopTimer() {
    if (!this.autoStopTimer) return;
    clearTimeout(this.autoStopTimer);
    this.autoStopTimer = null;
  }

  async shareNote(file) {
    if (!(file instanceof TFile) || file.extension !== "md") {
      new Notice(this.t("markdownOnly"));
      return;
    }

    if (!this.settings.sharedNotes.includes(file.path)) {
      this.settings.sharedNotes.push(file.path);
      await this.saveSettings();
    }

    if (!this.server) await this.startServer();
    await this.copyText(this.getNoteUrl(file.path));
    await this.updateUiState();
    new Notice(this.t("noteShared"));
  }

  async unshareNote(filePath) {
    this.settings.sharedNotes = this.settings.sharedNotes.filter((path) => path !== filePath);
    await this.saveSettings();
    await this.updateUiState();
    new Notice(this.t("noteUnshared"));
  }

  async shareFolder(folder) {
    if (!(folder instanceof TFolder) || !folder.path) {
      new Notice(this.t("selectFolder"));
      return;
    }
    if (!this.settings.sharedFolders.includes(folder.path)) {
      const files = this.getFilesInFolder(folder.path);
      const confirmed = await confirmFolderShare(this.app, this, folder.path, files.length);
      if (!confirmed) return;
      this.settings.sharedFolders.push(folder.path);
      await this.saveSettings();
    }
    if (!this.server) await this.startServer();
    await this.copyText(this.getFolderUrl(folder.path));
    await this.updateUiState();
    const fileCount = this.getFilesInFolder(folder.path).length;
    new Notice(this.t("folderShared", {
      files: formatCount(this.locale, fileCount, "fileCount", "filesCount"),
    }));
  }

  async unshareFolder(folderPath) {
    const normalized = normalizeVaultPath(folderPath);
    this.settings.sharedFolders = this.settings.sharedFolders.filter((storedPath) => storedPath !== normalized);
    await this.saveSettings();
    await this.updateUiState();
    new Notice(this.t("folderUnshared"));
  }

  isFolderExplicitlyShared(folderPath) {
    return this.settings.sharedFolders.includes(normalizeVaultPath(folderPath));
  }

  isPathInSharedFolder(filePath) {
    const normalized = normalizeVaultPath(filePath);
    return this.settings.sharedFolders.some((folderPath) => normalized.startsWith(`${folderPath}/`));
  }

  getFilesInFolder(folderPath) {
    return this.shareIndex.filesInFolder(folderPath);
  }

  getSharedFilePaths() {
    return this.shareIndex.getSharedPaths(this.settings.sharedNotes, this.settings.sharedFolders);
  }

  getSharedNotePaths() {
    return this.getSharedFilePaths().filter((filePath) => {
      const file = this.app.vault.getAbstractFileByPath(filePath);
      return file instanceof TFile && file.extension === "md";
    });
  }

  isNotePathShared(filePath) {
    return this.settings.sharedNotes.includes(filePath) || this.isPathInSharedFolder(filePath);
  }

  isNoteExplicitlyShared(filePath) {
    return this.settings.sharedNotes.includes(filePath);
  }

  addFileMenuItems(menu, file) {
    if (!(file instanceof TFolder) || !file.path) return;
    const isShared = this.isFolderExplicitlyShared(file.path);
    menu.addItem((item) => {
      item.setTitle(isShared ? this.t("menuUnshareFolder") : this.t("menuShareFolder"))
        .setIcon(isShared ? "circle-off" : "share-2")
        .onClick(() => isShared ? this.unshareFolder(file.path) : this.shareFolder(file));
    });
    if (isShared || this.isPathInSharedFolder(file.path)) {
      menu.addItem((item) => {
        item.setTitle(this.t("menuCopyFolderLink")).setIcon("link").onClick(async () => {
          if (!this.server) await this.startServer();
          await this.copyText(this.getFolderUrl(file.path));
          new Notice(this.t("folderLinkCopied"));
        });
      });
    }
  }

  openCurrentNoteShareModal() {
    new CurrentNoteShareModal(this.app, this).open();
  }

  isNoteShared(file) {
    return file instanceof TFile && this.isNotePathShared(file.path);
  }

  async updateUiState() {
    this.updateRibbonState();
    await this.updateStatusBar();
  }

  updateRibbonState() {
    if (!this.ribbonIconEl) return;

    const file = this.app.workspace.getActiveFile();
    this.ribbonIconEl.toggleClass("is-shared", this.isNoteShared(file));
  }

  async updateStatusBar() {
    if (!this.statusBarEl) return;

    const file = this.app.workspace.getActiveFile();
    this.statusBarEl.empty();

    if (!(file instanceof TFile) || file.extension !== "md") {
      return;
    }

    const isShared = this.isNoteShared(file);
    const isSharedByFolder = this.isPathInSharedFolder(file.path);

    const shareStateEl = this.statusBarEl.createSpan({
      cls: `local-note-share-status-pill${isShared ? " is-shared" : ""}`,
      text: isSharedByFolder ? this.t("statusSharedFolder") : isShared ? this.t("statusShared") : this.t("statusPrivate"),
    });
    shareStateEl.title = isSharedByFolder
      ? this.t("statusSharedFolderTitle")
      : isShared ? this.t("statusUnshareTitle") : this.t("statusShareTitle");
    shareStateEl.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (isSharedByFolder) {
        if (!this.server) await this.startServer();
        await this.copyText(this.getNoteUrl(file.path));
        new Notice(this.t("linkCopiedFolderManaged"));
      } else if (isShared) {
        await this.unshareNote(file.path);
      } else {
        await this.shareNote(file);
      }
    });

    if (!isShared) return;

    const copyLinkEl = this.statusBarEl.createSpan({
      cls: "local-note-share-status-link",
    });
    setIcon(copyLinkEl, "link");
    copyLinkEl.title = this.t("copySharedLink");
    copyLinkEl.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!this.server) await this.startServer();
      await this.copyText(this.getNoteUrl(file.path));
      new Notice(this.t("linkCopied"));
    });
  }

  async handleVaultModify(file) {
    if (file instanceof TFile) this.notePageCache.delete(file.path);
    const activeFile = this.app.workspace.getActiveFile();
    if (!(file instanceof TFile) || !activeFile || file.path !== activeFile.path) return;
    await this.updateStatusBar();
  }

  async handleVaultRename(file, oldPath) {
    this.shareIndex.invalidate();
    this.notePageCache.delete(oldPath);
    let changed = false;
    const replacePath = (storedPath) => {
      if (storedPath === oldPath) {
        changed = true;
        return file.path;
      }
      if (file instanceof TFolder && storedPath.startsWith(`${oldPath}/`)) {
        changed = true;
        return `${file.path}${storedPath.slice(oldPath.length)}`;
      }
      return storedPath;
    };
    this.settings.sharedNotes = this.settings.sharedNotes.map(replacePath);
    this.settings.sharedFolders = this.settings.sharedFolders.map(replacePath);
    if (changed) await this.saveSettings();
    await this.updateUiState();
  }

  async handleVaultDelete(file) {
    this.shareIndex.invalidate();
    this.notePageCache.delete(file.path);
    const deletedPath = file.path;
    const keepPath = (storedPath) => storedPath !== deletedPath && !storedPath.startsWith(`${deletedPath}/`);
    const sharedNotes = this.settings.sharedNotes.filter(keepPath);
    const sharedFolders = this.settings.sharedFolders.filter(keepPath);
    if (sharedNotes.length === this.settings.sharedNotes.length && sharedFolders.length === this.settings.sharedFolders.length) return;
    this.settings.sharedNotes = sharedNotes;
    this.settings.sharedFolders = sharedFolders;
    await this.saveSettings();
    await this.updateUiState();
  }

  async copyShareUrl() {
    if (!this.server) await this.startServer();
    await this.copyText(this.getShareUrl());
    new Notice(this.t("shareUrlCopied"));
  }

  async copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  }

  async handleRequest(req, res) {
    if (!this.isAllowedRemoteAddress(req.socket.remoteAddress)) {
      this.sendText(res, 403, "Forbidden");
      return;
    }

    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (!this.isAuthorized(url)) {
      this.sendHtml(res, 401, this.renderPage(this.t("protectedTitle"), `<p>${this.t("invalidToken")}</p>`));
      return;
    }

    if (url.pathname === "/" || url.pathname === "/index.html") {
      const folderPath = normalizeVaultPath(url.searchParams.get("folder") || "");
      this.trackPageVisit(req, res, {
        key: `index:${folderPath || "/"}`,
        kind: "index",
        path: folderPath,
        title: folderPath || this.t("home"),
      });
      this.sendHtml(res, 200, this.renderIndex(folderPath));
      return;
    }

    if (url.pathname.startsWith("/note/")) {
      const notePath = normalizeVaultPath(decodeURIComponent(url.pathname.slice("/note/".length)));
      await this.sendNote(req, res, notePath);
      return;
    }

    if (url.pathname === "/asset") {
      const assetPath = normalizeVaultPath(url.searchParams.get("path") || "");
      await this.sendAsset(res, assetPath);
      return;
    }

    this.sendHtml(res, 404, this.renderPage(this.t("notFoundTitle"), `<p>${this.t("pageNotFound")}</p>`));
  }

  isAuthorized(url) {
    return !this.settings.requireToken || url.searchParams.get("token") === this.settings.token;
  }

  isAllowedRemoteAddress(address) {
    if (!address) return false;
    const normalized = address.replace(/^::ffff:/, "");

    if (normalized === "::1" || normalized === "127.0.0.1") return true;
    if (normalized.startsWith("10.")) return true;
    if (normalized.startsWith("192.168.")) return true;

    const match = normalized.match(/^172\.(\d+)\./);
    if (match) {
      const second = Number(match[1]);
      return second >= 16 && second <= 31;
    }

    return normalized.startsWith("fe80:");
  }

  trackPageVisit(req, res, page: AnalyticsPage) {
    if (!this.settings.analytics.enabled || req.method !== "GET") return;
    if (this.settings.analytics.excludeLocalhost && isLoopbackAddress(req.socket.remoteAddress)) return;

    const visitorHash = getAnonymousVisitorHash(req, res, this.settings.token);
    recordAnalyticsVisit(
      this.settings.analyticsData,
      visitorHash,
      page,
      this.settings.analytics.retentionDays,
    );
    this.queueAnalyticsSave();
  }

  async sendNote(req, res, notePath) {
    if (!this.isNotePathShared(notePath)) {
      this.sendHtml(res, 404, this.renderPage(this.t("noteNotSharedTitle"), `<p>${this.t("noteNotShared")}</p>`));
      return;
    }

    const file = this.app.vault.getAbstractFileByPath(notePath);
    if (!(file instanceof TFile)) {
      this.sendHtml(res, 404, this.renderPage(this.t("noteNotFoundTitle"), `<p>${this.t("fileNotFound")}</p>`));
      return;
    }

    this.trackPageVisit(req, res, {
      key: `note:${file.path}`,
      kind: "note",
      path: file.path,
      title: file.basename,
    });

    const cached = this.notePageCache.get(file.path);
    if (cached?.mtime === file.stat.mtime) {
      this.sendHtml(res, 200, cached.html);
      return;
    }

    const markdown = await this.app.vault.read(file);
    const body = this.renderMarkdown(markdown, file.path);
    const html = this.renderPage(file.basename, body, file.path);
    this.notePageCache.set(file.path, { mtime: file.stat.mtime, html });
    this.sendHtml(res, 200, html);
  }

  async sendAsset(res, assetPath) {
    if (!this.isAllowedAsset(assetPath)) {
      this.sendText(res, 404, "Not found");
      return;
    }

    const file = this.app.vault.getAbstractFileByPath(assetPath);
    if (!(file instanceof TFile)) {
      this.sendText(res, 404, "Not found");
      return;
    }

    const buffer = await this.app.vault.adapter.readBinary(file.path);
    res.writeHead(200, {
      "Content-Type": contentTypeFor(file.extension),
      "Cache-Control": "no-store",
    });
    res.end(Buffer.from(buffer));
  }

  isAllowedAsset(assetPath) {
    const file = this.app.vault.getAbstractFileByPath(assetPath);
    if (!(file instanceof TFile)) return false;
    if (this.isPathInSharedFolder(assetPath)) return true;
    if (!MEDIA_EXTENSIONS.has(file.extension.toLowerCase())) return false;

    for (const notePath of this.getSharedNotePaths()) {
      const noteFile = this.app.vault.getAbstractFileByPath(notePath);
      if (!(noteFile instanceof TFile)) continue;

      const cache = this.app.metadataCache.getFileCache(noteFile);
      const embeds = cache?.embeds || [];
      if (embeds.some((embed) => this.resolveLinkTarget(embed.link, noteFile.path)?.path === assetPath)) return true;
    }

    return false;
  }

  renderIndex(folderPath = "") {
    const currentFolder = normalizeVaultPath(folderPath);
    const prefix = currentFolder ? `${currentFolder}/` : "";
    const folderNames = new Set<string>();
    const noteEntries: Array<{ notePath: string; title: string }> = [];
    const fileEntries: Array<{ filePath: string; title: string }> = [];

    for (const filePath of this.getSharedFilePaths()) {
      if (currentFolder) {
        if (!filePath.startsWith(prefix)) continue;
      }

      const relativePath = currentFolder ? filePath.slice(prefix.length) : filePath;
      if (!relativePath || relativePath.startsWith("../")) continue;

      const segments = relativePath.split("/");
      if (segments.length > 1) {
        folderNames.add(segments[0]);
        continue;
      }

      const file = this.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) continue;
      if (file.extension === "md") noteEntries.push({ notePath: filePath, title: file.basename });
      else fileEntries.push({ filePath, title: file.name });
    }

    const folders = [...folderNames].sort((a, b) => a.localeCompare(b, this.locale, { sensitivity: "base" }));
    noteEntries.sort((a, b) => a.title.localeCompare(b.title, this.locale, { sensitivity: "base" }));
    fileEntries.sort((a, b) => a.title.localeCompare(b.title, this.locale, { sensitivity: "base" }));

    const counter = [
      formatCount(this.locale, folders.length, "folderCount", "foldersCount"),
      formatCount(this.locale, noteEntries.length, "noteCount", "notesCount"),
      formatCount(this.locale, fileEntries.length, "fileCount", "filesCount"),
    ].join(" · ");
    const segments = currentFolder ? currentFolder.split("/") : [];
    const breadcrumbs = [
      `<a href="${this.indexHref()}" class="vault-crumb ${!segments.length ? "is-current" : ""}">${this.t("root")}</a>`,
      ...segments.map((segment, index) => {
        const target = segments.slice(0, index + 1).join("/");
        const current = index === segments.length - 1;
        return `<span class="vault-crumb-sep">/</span><a href="${this.indexHref(target)}" class="vault-crumb ${current ? "is-current" : ""}">${escapeHtml(segment)}</a>`;
      }),
    ].join("");
    const nav = `<div class="vault-toolbar">
      <div class="vault-breadcrumbs">${breadcrumbs}</div>
      <div class="vault-toolbar-actions">
        ${currentFolder ? `<a class="vault-button" href="${this.indexHref(parentFolderPath(currentFolder))}">${this.t("up")}</a>` : ""}
      </div>
    </div>`;

    const folderItems = folders
      .map((folder) => {
        const target = currentFolder ? `${currentFolder}/${folder}` : folder;
        return `<li class="entry-row is-folder">
          <a href="${this.indexHref(target)}" class="entry-main">
            <span class="entry-kicker">${this.t("folder")}</span>
            <span class="entry-title">${escapeHtml(folder)}</span>
          </a>
        </li>`;
      })
      .join("");

    const noteItems = noteEntries
      .map(({ notePath, title }) => `<li class="entry-row is-note">
        <a href="${this.noteHref(notePath)}" class="entry-main">
          <span class="entry-kicker">${this.t("note")}</span>
          <span class="entry-title">${escapeHtml(title)}</span>
          ${this.settings.theme.showFilePaths ? `<span class="entry-meta">${escapeHtml(notePath)}</span>` : ""}
        </a>
      </li>`)
      .join("");

    const fileItems = fileEntries
      .map(({ filePath, title }) => `<li class="entry-row is-file">
        <a href="${this.assetHref(filePath)}" class="entry-main">
          <span class="entry-kicker">${this.t("file")}</span>
          <span class="entry-title">${escapeHtml(title)}</span>
          ${this.settings.theme.showFilePaths ? `<span class="entry-meta">${escapeHtml(filePath)}</span>` : ""}
        </a>
      </li>`)
      .join("");

    const sections: string[] = [];
    if (folderItems) {
      sections.push(`<section class="vault-section"><div class="vault-section-head"><h2>${this.t("folders")}</h2></div><ul class="entry-list">${folderItems}</ul></section>`);
    }
    if (noteItems) {
      sections.push(`<section class="vault-section"><div class="vault-section-head"><h2>${this.t("notes")}</h2></div><ul class="entry-list">${noteItems}</ul></section>`);
    }
    if (fileItems) {
      sections.push(`<section class="vault-section"><div class="vault-section-head"><h2>${this.t("files")}</h2></div><ul class="entry-list">${fileItems}</ul></section>`);
    }

    const body = sections.length
      ? `<section class="vault-hero">
          ${nav}
          <p class="vault-label">${this.t("sharedSpace")}</p>
          <div class="vault-hero-main">
            <div>
              <p class="vault-path">${escapeHtml(currentFolder || "/")}</p>
              <p class="vault-count">${counter}</p>
            </div>
          </div>
        </section>${sections.join("")}`
      : `<section class="vault-hero">
          ${nav}
          <p class="vault-label">${this.t("sharedSpace")}</p>
          <div class="vault-hero-main">
            <div>
              <p class="vault-path">${escapeHtml(currentFolder || "/")}</p>
              <p class="vault-count">${counter}</p>
            </div>
          </div>
        </section><p>${this.t("nothingShared")}</p>`;
    return this.renderPage(this.t("sharedFiles"), body);
  }

  stripFrontmatter(markdown) {
    return String(markdown || "").replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  }

  parseSharedSprintTicketTable(markdown) {
    const headingMatch = String(markdown || "").match(/^##\s+Tickets du sprint\b.*$/im);
    if (!headingMatch) return [];

    const lines = markdown.slice(headingMatch.index).split(/\r?\n/).slice(1);
    const tableLines: string[] = [];
    for (const line of lines) {
      if (!line.trim()) {
        if (tableLines.length) break;
        continue;
      }

      if (!line.trim().startsWith("|")) {
        if (tableLines.length) break;
        continue;
      }

      tableLines.push(line);
    }

    if (tableLines.length < 3) return [];

    const headers = tableLines[0]
      .split("|")
      .slice(1, -1)
      .map((cell) => normalizeText(cell));

    const findIndex = (needle, fallbackIndex) => {
      const index = headers.findIndex((header) => header.includes(needle));
      return index >= 0 ? index : fallbackIndex;
    };

    const statusIndex = findIndex("statut", 1);
    const estimateIndex = findIndex("estimate", headers.length - 1);

    const rows: Array<{ status: string; estimateDays: number }> = [];
    for (let index = 2; index < tableLines.length; index += 1) {
      const cells = tableLines[index]
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim());
      if (!cells.length) continue;

      const status = cells[statusIndex] || "";
      const estimateText = cells[estimateIndex] || "";
      const estimateDaysMatch = estimateText.match(/([0-9]+(?:[.,][0-9]+)?)\s*j\.h/i);
      const estimateDays = estimateDaysMatch ? Number(String(estimateDaysMatch[1]).replace(",", ".")) : 0;

      rows.push({ status, estimateDays });
    }

    return rows;
  }

  classifySharedSprintStatus(status) {
    const normalized = normalizeText(status);
    if (normalized === "to do" || normalized === "todo") return "todo";
    if (["done", "complete", "completed"].includes(normalized)) return "done";
    return "active";
  }

  buildShareSquareGrid(count, columns = 4, symbol = "■") {
    if (!count) return "·";
    const cells = Array.from({ length: count }, () => symbol);
    const lines: string[] = [];
    for (let index = 0; index < cells.length; index += columns) {
      lines.push(cells.slice(index, index + columns).join(" "));
    }
    return lines.join("\n");
  }

  renderSharedSprintDashboard(markdown) {
    const tickets = this.parseSharedSprintTicketTable(markdown);
    if (!tickets.length) {
      return `<div class="shared-sprint-empty">${this.t("dashboardUnavailable")}</div>`;
    }

    const columns = {
      todo: { title: this.t("sprintTodo"), symbol: "□", tickets: 0, estimateDays: 0 },
      active: { title: this.t("sprintActive"), symbol: "▧", tickets: 0, estimateDays: 0 },
      done: { title: this.t("sprintDone"), symbol: "■", tickets: 0, estimateDays: 0 }
    };

    for (const ticket of tickets) {
      const bucket = this.classifySharedSprintStatus(ticket.status);
      columns[bucket].tickets += 1;
      columns[bucket].estimateDays += Number(ticket.estimateDays || 0);
    }

    const totalDays = Object.values(columns).reduce((sum, column) => sum + column.estimateDays, 0);
    const doneDays = columns.done.estimateDays;
    const remainingDays = columns.todo.estimateDays + columns.active.estimateDays;
    const items = ["todo", "active", "done"]
      .map((key) => {
        const column = columns[key];
        const squares = Math.max(0, Math.round(column.estimateDays));
        return `
          <section class="shared-sprint-column">
            <h4>${escapeHtml(column.title)}</h4>
            <pre class="shared-sprint-grid">${escapeHtml(`${formatCount(this.locale, column.tickets, "ticket", "tickets")}\n${column.estimateDays.toFixed(1)} ${this.t("dayUnit")}\n\n${this.buildShareSquareGrid(squares, 4, column.symbol)}`)}</pre>
          </section>
        `;
      })
      .join("");

    return `
      <div class="shared-sprint-dashboard">
        <div class="shared-sprint-totals">
          <div>${this.t("sprintTotal")}: ${totalDays.toFixed(1)} ${this.t("dayUnit")}</div>
          <div>${this.t("sprintFinished")}: ${doneDays.toFixed(1)} ${this.t("dayUnit")}</div>
          <div>${this.t("sprintRemaining")}: ${remainingDays.toFixed(1)} ${this.t("dayUnit")}</div>
          <div>${this.t("sprintScale")}</div>
        </div>
        <div class="shared-sprint-columns">${items}</div>
      </div>
    `;
  }

  renderTable(tableLines, sourcePath) {
    if (tableLines.length < 2) return "";
    const rows = tableLines.map((line) =>
      line.trim().split("|").slice(1, -1).map((cell) => cell.trim())
    );
    const headerCells = rows[0];
    const bodyRows = rows.slice(2);

    return `
      <div class="markdown-table-wrap">
        <table class="markdown-table">
          <thead>
            <tr>${headerCells.map((cell) => `<th>${this.renderInline(cell, sourcePath)}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${bodyRows.map((row) => `<tr>${row.map((cell) => `<td>${this.renderInline(cell, sourcePath)}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  renderMarkdown(markdown, sourcePath) {
    const rawMarkdown = this.stripFrontmatter(markdown);
    const lines = rawMarkdown.replace(/\r\n/g, "\n").split("\n");
    const blocks: string[] = [];
    let paragraph: string[] = [];
    let list: { type: "ul" | "ol"; items: string[] } | null = null;
    let inFence = false;
    let code: string[] = [];
    let fenceLang = "";

    const flushParagraph = () => {
      if (!paragraph.length) return;
      blocks.push(`<p>${this.renderInline(paragraph.join(" "), sourcePath)}</p>`);
      paragraph = [];
    };

    const flushList = () => {
      if (!list) return;
      blocks.push(`<${list.type}>${list.items.map((item) => `<li>${this.renderInline(item, sourcePath)}</li>`).join("")}</${list.type}>`);
      list = null;
    };

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      const line = lines[lineIndex];
      if (line.trim().startsWith("```")) {
        if (inFence) {
          if (fenceLang === "gitlab-sprint-dashboard") {
            blocks.push(this.renderSharedSprintDashboard(rawMarkdown));
          } else {
            blocks.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
          }
          inFence = false;
          code = [];
          fenceLang = "";
        } else {
          flushParagraph();
          flushList();
          inFence = true;
          fenceLang = line.trim().slice(3).trim();
        }
        continue;
      }

      if (inFence) {
        code.push(line);
        continue;
      }

      if (!line.trim()) {
        flushParagraph();
        flushList();
        continue;
      }

      if (line.trim().startsWith("|")) {
        flushParagraph();
        flushList();
        const tableLines = [line];
        while (lineIndex + 1 < lines.length && lines[lineIndex + 1].trim().startsWith("|")) {
          lineIndex += 1;
          tableLines.push(lines[lineIndex]);
        }
        blocks.push(this.renderTable(tableLines, sourcePath));
        continue;
      }

      const heading = line.match(/^(#{1,6})\s+(.+)$/);
      if (heading) {
        flushParagraph();
        flushList();
        const level = heading[1].length;
        const headingText = heading[2].trim();
        const headingId = this.headingIdFor(headingText);
        blocks.push(`<h${level} id="${headingId}">${this.renderInline(headingText, sourcePath)}</h${level}>`);
        continue;
      }

      if (/^---+$/.test(line.trim())) {
        flushParagraph();
        flushList();
        blocks.push("<hr>");
        continue;
      }

      const unordered = line.match(/^\s*[-*]\s+(.+)$/);
      const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
      if (unordered || ordered) {
        flushParagraph();
        const type = unordered ? "ul" : "ol";
        if (!list || list.type !== type) flushList();
        if (!list) list = { type, items: [] };
        list!.items.push((unordered || ordered)![1]);
        continue;
      }

      const quote = line.match(/^>\s?(.*)$/);
      if (quote) {
        flushParagraph();
        flushList();
        blocks.push(`<blockquote>${this.renderInline(quote[1], sourcePath)}</blockquote>`);
        continue;
      }

      paragraph.push(line.trim());
    }

    flushParagraph();
    flushList();

    return blocks.join("\n");
  }

  renderInline(text, sourcePath) {
    let value = escapeHtml(text);

    value = value.replace(/!\[\[([^\]]+)]]/g, (_match, target) => {
      const resolved = this.resolveLinkTarget(target, sourcePath);
      if (!resolved?.path || !this.isAllowedAsset(resolved.path)) return "";
      return `<img src="${this.assetHref(resolved.path)}" alt="">`;
    });

    value = value.replace(/\[\[([^\]]+)]]/g, (_match, target) => {
      const [rawTarget, rawAlias] = target.split("|");
      const parsedTarget = parseLinkTarget(rawTarget);
      const label = rawAlias || parsedTarget.path || parsedTarget.subpath;
      if (!parsedTarget.path && parsedTarget.subpath) {
        return `<a class="internal-link" href="#${this.headingIdFor(parsedTarget.subpath)}">${escapeHtml(label)}</a>`;
      }

      const resolved = this.resolveLinkTarget(rawTarget, sourcePath);
      if (resolved?.path && this.isNotePathShared(resolved.path)) {
        return `<a class="internal-link" href="${this.noteHref(resolved.path, resolved.subpath)}">${escapeHtml(label)}</a>`;
      }
      return escapeHtml(label);
    });

    value = value.replace(/!\[([^\]]*)]\(([^)]+)\)/g, (_match, alt, target) => {
      const resolved = this.resolveLinkTarget(target, sourcePath);
      if (!resolved?.path || !this.isAllowedAsset(resolved.path)) return "";
      return `<img src="${this.assetHref(resolved.path)}" alt="${escapeHtml(alt)}">`;
    });

    value = value.replace(/\[([^\]]+)]\(([^)]+)\)/g, (_match, label, target) => {
      const trimmedTarget = String(target || "").trim();
      if (/^https?:\/\//i.test(trimmedTarget)) {
        return `<a class="external-link" href="${escapeHtml(trimmedTarget)}" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
      }
      if (trimmedTarget.startsWith("#")) {
        const fragment = trimmedTarget.slice(1).trim();
        return `<a class="internal-link" href="#${this.headingIdFor(fragment)}">${escapeHtml(label)}</a>`;
      }

      const resolved = this.resolveLinkTarget(trimmedTarget, sourcePath);
      if (resolved?.path && this.isNotePathShared(resolved.path)) {
        return `<a class="internal-link" href="${this.noteHref(resolved.path, resolved.subpath)}">${escapeHtml(label)}</a>`;
      }

      return escapeHtml(label);
    });

    value = value.replace(/`([^`]+)`/g, "<code>$1</code>");
    value = value.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    value = value.replace(/\*([^*]+)\*/g, "<em>$1</em>");

    return value;
  }

  resolveLinkTarget(linkText, sourcePath) {
    const parsed = parseLinkTarget(linkText);
    if (!parsed.path) return null;

    const dest = this.app.metadataCache.getFirstLinkpathDest(parsed.path, sourcePath);
    if (dest) {
      return {
        path: dest.path,
        subpath: parsed.subpath,
      };
    }

    const sourceDir = sourcePath.includes("/") ? sourcePath.slice(0, sourcePath.lastIndexOf("/")) : "";
    const fallbackPath = normalizeVaultPath(path.posix.join(sourceDir, parsed.path));
    if (!fallbackPath) return null;

    return {
      path: fallbackPath,
      subpath: parsed.subpath,
    };
  }

  headingIdFor(text) {
    return slugifyHeading(text);
  }

  renderPage(title, body, notePath = "") {
    const back = notePath ? `<a class="back" href="${this.indexHref()}">${this.t("sharedNotes")}</a>` : "";
    return `<!doctype html>
<html lang="${this.locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>${pageStyles(this.settings.theme)}</style>
</head>
<body>
  <main>
    ${back}
    <h1>${escapeHtml(title)}</h1>
    ${body}
  </main>
</body>
</html>`;
  }

  noteHref(notePath, subpath = "") {
    const hash = subpath ? `#${encodeURIComponent(slugifyHeading(subpath))}` : "";
    return `/note/${encodeURIComponent(notePath)}${this.tokenQuery()}${hash}`;
  }

  assetHref(assetPath) {
    return `/asset?path=${encodeURIComponent(assetPath)}${this.tokenAssetQuery()}`;
  }

  indexHref(folderPath = "") {
    const folder = normalizeVaultPath(folderPath || "");
    if (!folder) return `/${this.tokenQuery()}`;
    const params = new URLSearchParams();
    params.set("folder", folder);
    if (this.settings.requireToken) params.set("token", this.settings.token);
    return `/?${params.toString()}`;
  }

  tokenQuery() {
    return this.settings.requireToken ? `?token=${encodeURIComponent(this.settings.token)}` : "";
  }

  tokenAssetQuery() {
    return this.settings.requireToken ? `&token=${encodeURIComponent(this.settings.token)}` : "";
  }

  getShareUrl() {
    return `http://${this.getLocalIpAddress()}:${this.settings.port}${this.tokenQuery()}`;
  }

  getFolderUrl(folderPath) {
    return `http://${this.getLocalIpAddress()}:${this.settings.port}${this.indexHref(folderPath)}`;
  }

  getNoteUrl(notePath) {
    return `http://${this.getLocalIpAddress()}:${this.settings.port}${this.noteHref(notePath)}`;
  }

  getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const addresses of Object.values(interfaces)) {
      for (const address of addresses || []) {
        if (address.family === "IPv4" && !address.internal) return address.address;
      }
    }
    return "127.0.0.1";
  }

  sendHtml(res, status, html) {
    res.writeHead(status, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; img-src 'self' data:; media-src 'self'; style-src 'unsafe-inline'; font-src 'self' data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(html);
  }

  sendText(res, status, text) {
    res.writeHead(status, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.end(text);
  }

  generateToken() {
    return createSecureToken();
  }
};


function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
