import assert from "node:assert/strict";
import test from "node:test";
import { formatCount, resolveLocale, translate } from "../src/i18n";

test("uses French only for French Obsidian locales", () => {
  assert.equal(resolveLocale("fr"), "fr");
  assert.equal(resolveLocale("fr-ca"), "fr");
  assert.equal(resolveLocale("en"), "en");
  assert.equal(resolveLocale("de"), "en");
  assert.equal(resolveLocale(undefined), "en");
});

test("translates interface text and placeholders", () => {
  assert.equal(translate("en", "serverOff"), "Server stopped");
  assert.equal(translate("fr", "serverOff"), "Serveur arrêté");
  assert.equal(translate("en", "days", { days: 30 }), "30 days");
  assert.equal(translate("fr", "days", { days: 30 }), "30 jours");
});

test("formats localized singular and plural counts", () => {
  assert.equal(formatCount("en", 1, "fileCount", "filesCount"), "1 file");
  assert.equal(formatCount("en", 2, "fileCount", "filesCount"), "2 files");
  assert.equal(formatCount("fr", 2, "fileCount", "filesCount"), "2 fichiers");
});
