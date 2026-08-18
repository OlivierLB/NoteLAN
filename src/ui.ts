import { Modal, Notice, PluginSettingTab, Setting, TFile, TFolder, setIcon, type App, type Plugin } from "obsidian";
import { formatCount } from "./i18n";
import { parentFolderPath } from "./paths";
import type { LocalNoteSharePluginApi } from "./plugin-api";
import type { ThemePreset } from "./settings";

export function confirmFolderShare(app: App, plugin: LocalNoteSharePluginApi, folderPath: string, fileCount: number): Promise<boolean> {
  return new Promise((resolve) => {
    new FolderShareConfirmationModal(app, plugin, folderPath, fileCount, resolve).open();
  });
}

function confirmAnalyticsReset(app: App, plugin: LocalNoteSharePluginApi): Promise<boolean> {
  return new Promise((resolve) => {
    new AnalyticsResetConfirmationModal(app, plugin, resolve).open();
  });
}

class AnalyticsResetConfirmationModal extends Modal {
  private resolved = false;

  constructor(
    app: App,
    private readonly plugin: LocalNoteSharePluginApi,
    private readonly resolveChoice: (confirmed: boolean) => void,
  ) {
    super(app);
  }

  onOpen() {
    this.contentEl.empty();
    this.contentEl.createEl("h2", { text: this.plugin.t("analyticsResetTitle") });
    this.contentEl.createEl("p", {
      text: this.plugin.t("analyticsResetBody"),
    });
    new Setting(this.contentEl)
      .addButton((button) => button.setButtonText(this.plugin.t("cancel")).onClick(() => this.finish(false)))
      .addButton((button) => button.setButtonText(this.plugin.t("clear")).setWarning().onClick(() => this.finish(true)));
  }

  onClose() {
    if (!this.resolved) this.resolveChoice(false);
  }

  private finish(confirmed: boolean) {
    this.resolved = true;
    this.resolveChoice(confirmed);
    this.close();
  }
}

class FolderShareConfirmationModal extends Modal {
  private resolved = false;

  constructor(
    app: App,
    private readonly plugin: LocalNoteSharePluginApi,
    private readonly folderPath: string,
    private readonly fileCount: number,
    private readonly resolveChoice: (confirmed: boolean) => void,
  ) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: this.plugin.t("folderShareTitle") });
    contentEl.createEl("p", {
      text: this.plugin.t("folderShareBody", {
        folder: this.folderPath,
        files: formatCount(this.plugin.locale, this.fileCount, "fileCount", "filesCount"),
      }),
    });
    contentEl.createEl("p", {
      cls: "local-note-share-status",
      text: this.plugin.t("folderShareFuture"),
    });

    new Setting(contentEl)
      .addButton((button) => {
        button.setButtonText(this.plugin.t("cancel")).onClick(() => this.finish(false));
      })
      .addButton((button) => {
        button.setButtonText(this.plugin.t("shareFolder")).setWarning().onClick(() => this.finish(true));
      });
  }

  onClose() {
    if (!this.resolved) this.resolveChoice(false);
  }

  private finish(confirmed: boolean) {
    this.resolved = true;
    this.resolveChoice(confirmed);
    this.close();
  }
}

export class CurrentNoteShareModal extends Modal {
  private readonly plugin: LocalNoteSharePluginApi & Plugin;

  constructor(app: App, plugin: LocalNoteSharePluginApi & Plugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: this.plugin.t("localSharing") });

    const file = this.app.workspace.getActiveFile();
    if (!(file instanceof TFile) || file.extension !== "md") {
      contentEl.createDiv({
        cls: "local-note-share-status",
        text: this.plugin.t("openMarkdown"),
      });
      return;
    }

    const isShared = this.plugin.isNoteShared(file);
    const isSharedByFolder = this.plugin.isPathInSharedFolder(file.path);
    contentEl.createDiv({
      cls: "local-note-share-status",
      text: isSharedByFolder
        ? this.plugin.t("noteSharedByFolder")
        : isShared ? this.plugin.t("noteSharedNetwork") : this.plugin.t("noteNotSharedYet"),
    });

    contentEl.createDiv({
      cls: "local-note-share-note-path",
      text: file.path,
    });

    if (isShared) {
      const url = this.plugin.getNoteUrl(file.path);
      contentEl.createDiv({
        cls: "local-note-share-url",
        text: url,
      });

      const actions = new Setting(contentEl)
        .addButton((button) => {
          button.setButtonText(this.plugin.t("copyLink")).setCta().onClick(async () => {
            if (!this.plugin.server) await this.plugin.startServer();
            await this.plugin.copyText(this.plugin.getNoteUrl(file.path));
            new Notice(this.plugin.t("linkCopied"));
            this.close();
          });
        });
      if (!isSharedByFolder) {
        actions.addButton((button) => {
          button.setButtonText(this.plugin.t("removeFromShare")).onClick(async () => {
            await this.plugin.unshareNote(file.path);
            this.close();
          });
        });
      }
      return;
    }

    new Setting(contentEl)
      .addButton((button) => {
        button.setButtonText(this.plugin.t("enableCopyLink")).setCta().onClick(async () => {
          await this.plugin.shareNote(file);
          this.close();
        });
      });
  }
}

export class LocalNoteShareSettingTab extends PluginSettingTab {
  private readonly plugin: LocalNoteSharePluginApi & Plugin;
  private currentFolder = "";

  constructor(app: App, plugin: LocalNoteSharePluginApi & Plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.currentFolder = "";
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "NoteLAN" });
    containerEl.createDiv({
      cls: "local-note-share-status",
      text: this.plugin.server
        ? this.plugin.t("activeServer", { url: this.plugin.getShareUrl() })
        : this.plugin.t("serverOff"),
    });

    new Setting(containerEl)
      .setName(this.plugin.t("localServer"))
      .setDesc(this.plugin.t("localServerDesc"))
      .addButton((button) => {
        button.setButtonText(this.plugin.server ? this.plugin.t("stop") : this.plugin.t("start"));
        if (!this.plugin.server) button.setCta();
        button.onClick(async () => {
          await this.plugin.toggleServer();
          this.display();
        });
      })
      .addButton((button) => {
        button.setButtonText(this.plugin.t("copyUrl")).onClick(() => this.plugin.copyShareUrl());
      });

    new Setting(containerEl)
      .setName(this.plugin.t("port"))
      .setDesc(this.plugin.t("portDesc"))
      .addText((text) => {
        text
          .setPlaceholder("8099")
          .setValue(String(this.plugin.settings.port))
          .onChange(async (value) => {
            const port = Number(value);
            if (!Number.isInteger(port) || port < 1 || port > 65535) return;
            const wasRunning = Boolean(this.plugin.server);
            if (wasRunning) await this.plugin.stopServer();
            this.plugin.settings.port = port;
            await this.plugin.saveSettings();
            if (wasRunning) await this.plugin.startServer();
            this.display();
          });
      });

    new Setting(containerEl)
      .setName(this.plugin.t("startWithObsidian"))
      .setDesc(this.plugin.t("startWithObsidianDesc"))
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.autoStart).onChange(async (value) => {
          this.plugin.settings.autoStart = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName(this.plugin.t("autoStop"))
      .setDesc(this.plugin.t("autoStopDesc"))
      .addDropdown((dropdown) => {
        dropdown
          .addOption("0", this.plugin.t("disabled"))
          .addOption("60", this.plugin.t("afterOneHour"))
          .addOption("120", this.plugin.t("afterHours", { hours: 2 }))
          .addOption("240", this.plugin.t("afterHours", { hours: 4 }))
          .addOption("480", this.plugin.t("afterHours", { hours: 8 }))
          .setValue(String(this.plugin.settings.autoStopMinutes))
          .onChange(async (value) => {
            this.plugin.settings.autoStopMinutes = Number(value);
            await this.plugin.saveSettings();
            this.plugin.scheduleAutoStop();
          });
      });

    new Setting(containerEl)
      .setName(this.plugin.t("urlToken"))
      .setDesc(this.plugin.t("urlTokenDesc"))
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.requireToken).onChange(async (value) => {
          this.plugin.settings.requireToken = value;
          await this.plugin.saveSettings();
          this.display();
        });
      })
      .addButton((button) => {
        button.setButtonText(this.plugin.t("regenerate")).onClick(async () => {
          this.plugin.settings.token = this.plugin.generateToken();
          await this.plugin.saveSettings();
          this.display();
        });
      });

    containerEl.createEl("h3", { text: this.plugin.t("anonymousStats") });
    containerEl.createDiv({
      cls: "local-note-share-status",
      text: this.plugin.t("anonymousStatsDesc"),
    });

    new Setting(containerEl)
      .setName(this.plugin.t("enableCounting"))
      .setDesc(this.plugin.t("enableCountingDesc"))
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.analytics.enabled).onChange(async (value) => {
          this.plugin.settings.analytics.enabled = value;
          await this.plugin.saveSettings();
          this.display();
        });
      });

    new Setting(containerEl)
      .setName(this.plugin.t("ignoreComputer"))
      .setDesc(this.plugin.t("ignoreComputerDesc"))
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.analytics.excludeLocalhost).onChange(async (value) => {
          this.plugin.settings.analytics.excludeLocalhost = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName(this.plugin.t("uniqueRetention"))
      .setDesc(this.plugin.t("uniqueRetentionDesc"))
      .addDropdown((dropdown) => {
        dropdown
          .addOption("7", this.plugin.t("days", { days: 7 }))
          .addOption("30", this.plugin.t("days", { days: 30 }))
          .addOption("90", this.plugin.t("days", { days: 90 }))
          .addOption("365", this.plugin.t("oneYear"))
          .setValue(String(this.plugin.settings.analytics.retentionDays))
          .onChange(async (value) => {
            this.plugin.settings.analytics.retentionDays = Number(value);
            await this.plugin.saveSettings();
            this.display();
          });
      });

    this.renderAnalytics(containerEl);

    containerEl.createEl("h3", { text: this.plugin.t("sharedAppearance") });

    new Setting(containerEl)
      .setName(this.plugin.t("theme"))
      .setDesc(this.plugin.t("themeDesc"))
      .addDropdown((dropdown) => {
        dropdown
          .addOption("royal-velvet", "Royal Velvet")
          .addOption("light", this.plugin.t("light"))
          .addOption("system", this.plugin.t("system"))
          .setValue(this.plugin.settings.theme.preset)
          .onChange(async (value) => {
            this.plugin.settings.theme.preset = value as ThemePreset;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName(this.plugin.t("accentColor"))
      .setDesc(this.plugin.t("accentColorDesc"))
      .addColorPicker((picker) => {
        picker.setValue(this.plugin.settings.theme.accentColor).onChange(async (value) => {
          this.plugin.settings.theme.accentColor = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName(this.plugin.t("contentWidth"))
      .setDesc(this.plugin.t("contentWidthDesc"))
      .addSlider((slider) => {
        slider
          .setLimits(560, 1600, 20)
          .setValue(this.plugin.settings.theme.contentWidth)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.theme.contentWidth = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName(this.plugin.t("showPaths"))
      .setDesc(this.plugin.t("showPathsDesc"))
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.theme.showFilePaths).onChange(async (value) => {
          this.plugin.settings.theme.showFilePaths = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName(this.plugin.t("font"))
      .setDesc(this.plugin.t("fontDesc"))
      .addText((text) => {
        text.setValue(this.plugin.settings.theme.fontFamily);
        text.inputEl.addEventListener("change", async () => {
          const value = text.getValue().trim();
          if (!value) return;
          this.plugin.settings.theme.fontFamily = value;
          await this.plugin.saveSettings();
        });
      });

    const customCssSetting = new Setting(containerEl)
      .setName(this.plugin.t("customCss"))
      .setDesc(this.plugin.t("customCssDesc"))
      .addTextArea((area) => {
        area.setPlaceholder(":root { --page-bg: #111; }").setValue(this.plugin.settings.theme.customCss);
        area.inputEl.rows = 8;
        area.inputEl.addEventListener("change", async () => {
          this.plugin.settings.theme.customCss = area.getValue();
          await this.plugin.saveSettings();
        });
      });
    customCssSetting.controlEl.addClass("local-note-share-custom-css");

    new Setting(containerEl)
      .setName(this.plugin.t("shareActiveNote"))
      .setDesc(this.plugin.t("shareActiveNoteDesc"))
      .addButton((button) => {
        button.setButtonText(this.plugin.t("add")).setCta().onClick(() => {
          const file = this.app.workspace.getActiveFile();
          if (!file) {
            new Notice(this.plugin.t("noActiveNote"));
            return;
          }
          this.plugin.shareNote(file).then(() => this.display());
        });
      });

    this.renderVaultBrowser(containerEl);

    containerEl.createEl("h3", { text: this.plugin.t("sharedFolders") });
    const folderList = containerEl.createDiv({ cls: "local-note-share-list" });

    if (!this.plugin.settings.sharedFolders.length) {
      folderList.createDiv({ cls: "local-note-share-status", text: this.plugin.t("noSharedFolders") });
    }

    for (const folderPath of this.plugin.settings.sharedFolders) {
      const row = folderList.createDiv({ cls: "local-note-share-note" });
      row.createDiv({ cls: "local-note-share-note-path", text: folderPath });
      const actions = row.createDiv();

      new Setting(actions)
        .addButton((button) => {
          button.setButtonText(this.plugin.t("copy")).onClick(() => this.plugin.copyText(this.plugin.getFolderUrl(folderPath)));
        })
        .addButton((button) => {
          button.setButtonText(this.plugin.t("remove")).onClick(async () => {
            await this.plugin.unshareFolder(folderPath);
            this.display();
          });
        });
    }

    containerEl.createEl("h3", { text: this.plugin.t("individuallySharedNotes") });
    const list = containerEl.createDiv({ cls: "local-note-share-list" });

    if (!this.plugin.settings.sharedNotes.length) {
      list.createDiv({ cls: "local-note-share-status", text: this.plugin.t("noIndividualNotes") });
      return;
    }

    for (const notePath of this.plugin.settings.sharedNotes) {
      const row = list.createDiv({ cls: "local-note-share-note" });
      row.createDiv({ cls: "local-note-share-note-path", text: notePath });
      const actions = row.createDiv();

      new Setting(actions)
        .addButton((button) => {
          button.setButtonText(this.plugin.t("copy")).onClick(() => this.plugin.copyText(this.plugin.getNoteUrl(notePath)));
        })
        .addButton((button) => {
          button.setButtonText(this.plugin.t("remove")).onClick(async () => {
            await this.plugin.unshareNote(notePath);
            this.display();
          });
      });
    }
  }

  renderAnalytics(containerEl: HTMLElement) {
    const summary = this.plugin.getAnalyticsSummary();
    const metrics = containerEl.createDiv({ cls: "local-note-share-analytics-metrics" });
    this.renderMetric(metrics, this.plugin.t("views"), summary.totalViews);
    this.renderMetric(metrics, this.plugin.t("uniqueVisitors"), summary.uniqueVisitors);
    this.renderMetric(metrics, this.plugin.t("today"), summary.viewsToday);

    const actions = new Setting(containerEl)
      .setDesc(this.plugin.t("uniqueEstimate", { days: this.plugin.settings.analytics.retentionDays }))
      .addButton((button) => {
        button.setButtonText(this.plugin.t("clearStatistics")).setWarning().onClick(async () => {
          if (!await confirmAnalyticsReset(this.app, this.plugin)) return;
          await this.plugin.resetAnalytics();
          new Notice(this.plugin.t("statisticsCleared"));
          this.display();
        });
      });
    actions.settingEl.addClass("local-note-share-analytics-actions");

    if (!summary.pages.length) {
      containerEl.createDiv({
        cls: "local-note-share-status",
        text: this.plugin.settings.analytics.enabled
          ? this.plugin.t("noRemoteVisit")
          : this.plugin.t("countingDisabled"),
      });
      return;
    }

    const tableWrapper = containerEl.createDiv({ cls: "local-note-share-analytics-table-wrapper" });
    const table = tableWrapper.createEl("table", { cls: "local-note-share-analytics-table" });
    const header = table.createEl("thead").createEl("tr");
    for (const label of [this.plugin.t("page"), this.plugin.t("views"), this.plugin.t("visitors"), this.plugin.t("lastAccess")]) {
      header.createEl("th", { text: label });
    }
    const body = table.createEl("tbody");
    for (const page of summary.pages) {
      const row = body.createEl("tr");
      const pageCell = row.createEl("td");
      pageCell.createDiv({ text: page.title });
      pageCell.createDiv({
        cls: "local-note-share-analytics-path",
        text: page.kind === "index" ? (page.path || "/") : page.path,
      });
      row.createEl("td", { text: String(page.views) });
      row.createEl("td", { text: String(page.uniqueVisitors) });
      row.createEl("td", { text: page.lastAccess ? formatDateTime(page.lastAccess, this.plugin.locale) : "-" });
    }
  }

  renderMetric(containerEl: HTMLElement, label: string, value: number) {
    const metric = containerEl.createDiv({ cls: "local-note-share-analytics-metric" });
    metric.createDiv({ cls: "local-note-share-analytics-value", text: String(value) });
    metric.createDiv({ cls: "local-note-share-analytics-label", text: label });
  }

  renderVaultBrowser(containerEl) {
    containerEl.createEl("h3", { text: this.plugin.t("browseVault") });

    const currentFolder = this.getCurrentFolder();
    const currentPath = currentFolder.path || "";
    const isRoot = !currentPath;
    const browserEl = containerEl.createDiv({ cls: "local-note-share-browser" });
    const headerEl = browserEl.createDiv({ cls: "local-note-share-browser-header" });

    headerEl.createDiv({
      cls: "local-note-share-browser-path",
      text: currentPath || "/",
    });

    const actionsEl = headerEl.createDiv({ cls: "local-note-share-browser-actions" });
    const rootButton = actionsEl.createEl("button", { text: this.plugin.t("root"), cls: "mod-muted" });
    rootButton.disabled = !currentPath;
    rootButton.addEventListener("click", () => {
      this.currentFolder = "";
      this.display();
    });

    const parentButton = actionsEl.createEl("button", { text: this.plugin.t("up"), cls: "mod-muted" });
    parentButton.disabled = !currentPath;
    parentButton.addEventListener("click", () => {
      this.currentFolder = parentFolderPath(currentPath);
      this.display();
    });

    if (!isRoot) {
      const isCurrentFolderShared = this.plugin.isFolderExplicitlyShared(currentPath);
      const folderShareButton = actionsEl.createEl("button", {
        text: isCurrentFolderShared ? this.plugin.t("menuUnshareFolder") : this.plugin.t("shareThisFolder"),
        cls: isCurrentFolderShared ? "mod-muted" : "mod-cta",
      });
      folderShareButton.addEventListener("click", async () => {
        if (isCurrentFolderShared) {
          await this.plugin.unshareFolder(currentPath);
        } else {
          await this.plugin.shareFolder(currentFolder);
        }
        this.display();
      });
    }

    const entriesEl = browserEl.createDiv({ cls: "local-note-share-browser-list" });
    const children = [...currentFolder.children];
    const folders = children
      .filter((child): child is TFolder => child instanceof TFolder)
      .sort((a, b) => a.name.localeCompare(b.name, this.plugin.locale, { sensitivity: "base" }));
    const files = children
      .filter((child): child is TFile => child instanceof TFile && child.extension === "md")
      .sort((a, b) => a.basename.localeCompare(b.basename, this.plugin.locale, { sensitivity: "base" }));
    const visibleFiles = isRoot ? [] : files;

    browserEl.createDiv({
      cls: "local-note-share-browser-count",
      text: `${formatCount(this.plugin.locale, folders.length, "folderCount", "foldersCount")}, ${formatCount(this.plugin.locale, visibleFiles.length, "noteCount", "notesCount")}`,
    });

    if (!folders.length && !visibleFiles.length) {
      entriesEl.createDiv({
        cls: "local-note-share-status",
        text: this.plugin.t("emptyFolder"),
      });
      return;
    }

    for (const folder of folders) {
      const row = entriesEl.createDiv({ cls: "local-note-share-browser-row is-folder" });
      const navButton = row.createEl("button", {
        text: folder.name,
        cls: "local-note-share-browser-entry mod-muted",
      });
      navButton.addEventListener("click", () => {
        this.currentFolder = folder.path;
        this.display();
      });

      const actions = row.createDiv({ cls: "local-note-share-browser-actions" });
      const isShared = this.plugin.isFolderExplicitlyShared(folder.path);
      const isInherited = !isShared && this.plugin.isPathInSharedFolder(folder.path);
      const shareButton = actions.createEl("button", {
        text: isShared ? this.plugin.t("remove") : isInherited ? this.plugin.t("inheritedShare") : this.plugin.t("shareFolder"),
        cls: isShared || isInherited ? "mod-muted" : "mod-cta",
      });
      shareButton.addEventListener("click", async () => {
        if (isShared) {
          await this.plugin.unshareFolder(folder.path);
          this.display();
          return;
        }
        if (isInherited) {
          await this.plugin.copyText(this.plugin.getFolderUrl(folder.path));
          new Notice(this.plugin.t("folderLinkCopied"));
          return;
        }
        await this.plugin.shareFolder(folder);
        this.display();
      });
    }

    for (const file of visibleFiles) {
      const row = entriesEl.createDiv({ cls: "local-note-share-browser-row is-file" });
      row.createDiv({
        cls: "local-note-share-browser-entry",
        text: file.basename,
      });

      const actions = row.createDiv({ cls: "local-note-share-browser-actions" });
      const isShared = this.plugin.isNoteShared(file);

      const shareButton = actions.createEl("button", {
        text: isShared ? this.plugin.t("sharedFeminine") : this.plugin.t("share"),
        cls: isShared ? "mod-muted" : "mod-cta",
      });
      shareButton.addEventListener("click", async () => {
        if (isShared) {
          await this.plugin.copyText(this.plugin.getNoteUrl(file.path));
          new Notice(this.plugin.t("shareUrlCopied"));
          return;
        }

        await this.plugin.shareNote(file);
        this.display();
      });
    }
  }

  getCurrentFolder() {
    if (!this.currentFolder) {
      return this.app.vault.getRoot();
    }

    const folder = this.app.vault.getAbstractFileByPath(this.currentFolder);
    if (folder instanceof TFolder) {
      return folder;
    }

    this.currentFolder = "";
    return this.app.vault.getRoot();
  }
}

function formatDateTime(timestamp: number, locale: "en" | "fr"): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(timestamp));
}
