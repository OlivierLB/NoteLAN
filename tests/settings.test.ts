import assert from "node:assert/strict";
import test from "node:test";
import { createSecureToken, normalizeSettings } from "../src/settings";

test("migrates legacy settings without losing the existing security choice", () => {
  const settings = normalizeSettings({
    port: 8123,
    requireToken: false,
    sharedNotes: ["B.md", "A.md", "A.md"],
  });

  assert.equal(settings.port, 8123);
  assert.equal(settings.requireToken, false);
  assert.equal(settings.autoStopMinutes, 0);
  assert.equal(settings.analytics.enabled, true);
  assert.equal(settings.analytics.retentionDays, 30);
  assert.equal(settings.analytics.excludeLocalhost, true);
  assert.deepEqual(settings.sharedNotes, ["A.md", "B.md"]);
  assert.equal(settings.theme.preset, "royal-velvet");
});

test("uses secure defaults for a new installation", () => {
  const settings = normalizeSettings(undefined);
  assert.equal(settings.requireToken, true);
  assert.equal(settings.port, 8099);
  assert.equal(settings.autoStopMinutes, 0);
});

test("accepts only supported automatic-stop durations", () => {
  assert.equal(normalizeSettings({ autoStopMinutes: 120 }).autoStopMinutes, 120);
  assert.equal(normalizeSettings({ autoStopMinutes: 17 }).autoStopMinutes, 0);
});

test("creates random 192-bit hexadecimal tokens", () => {
  const first = createSecureToken();
  const second = createSecureToken();
  assert.match(first, /^[0-9a-f]{48}$/);
  assert.notEqual(first, second);
});
