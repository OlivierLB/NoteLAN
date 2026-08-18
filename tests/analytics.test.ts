import assert from "node:assert/strict";
import test from "node:test";
import {
  createEmptyAnalyticsData,
  getAnonymousVisitorHash,
  isLoopbackAddress,
  recordAnalyticsVisit,
  summarizeAnalytics,
} from "../src/analytics";

test("counts page views and approximate unique browsers", () => {
  const now = Date.UTC(2026, 7, 18, 10);
  const data = createEmptyAnalyticsData(now);
  const page = { key: "note:Notes/Test.md", kind: "note" as const, path: "Notes/Test.md", title: "Test" };

  recordAnalyticsVisit(data, "a".repeat(64), page, 30, now);
  recordAnalyticsVisit(data, "a".repeat(64), page, 30, now + 1_000);
  recordAnalyticsVisit(data, "b".repeat(64), page, 30, now + 2_000);

  const summary = summarizeAnalytics(data, 30, now + 2_000);
  assert.equal(summary.totalViews, 3);
  assert.equal(summary.uniqueVisitors, 2);
  assert.equal(summary.viewsToday, 3);
  assert.equal(summary.pages[0].uniqueVisitors, 2);
});

test("forgets visitor identifiers after retention without losing cumulative views", () => {
  const now = Date.UTC(2026, 7, 1);
  const data = createEmptyAnalyticsData(now);
  recordAnalyticsVisit(
    data,
    "a".repeat(64),
    { key: "index:/", kind: "index", path: "", title: "Accueil" },
    30,
    now,
  );

  const summary = summarizeAnalytics(data, 30, now + 31 * 86_400_000);
  assert.equal(summary.totalViews, 1);
  assert.equal(summary.uniqueVisitors, 0);
  assert.equal(summary.viewsToday, 0);
});

test("creates an HttpOnly cookie and stores only a salted hash", () => {
  const headers = new Map<string, string>();
  const req = { headers: {}, socket: {} } as never;
  const res = { setHeader: (name: string, value: string) => headers.set(name, value) } as never;
  const visitorHash = getAnonymousVisitorHash(req, res, "private-salt");

  assert.match(visitorHash, /^[0-9a-f]{64}$/);
  assert.match(headers.get("Set-Cookie") || "", /HttpOnly; SameSite=Strict/);
  assert.equal((headers.get("Set-Cookie") || "").includes(visitorHash), false);
});

test("recognizes local preview addresses", () => {
  assert.equal(isLoopbackAddress("127.0.0.1"), true);
  assert.equal(isLoopbackAddress("::ffff:127.0.0.1"), true);
  assert.equal(isLoopbackAddress("192.168.1.20"), false);
});
