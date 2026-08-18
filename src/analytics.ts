import { createHash } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

export type AnalyticsPageKind = "index" | "note";

export interface AnalyticsSettings {
  enabled: boolean;
  retentionDays: number;
  excludeLocalhost: boolean;
}

export interface AnalyticsPageStats {
  kind: AnalyticsPageKind;
  path: string;
  title: string;
  views: number;
  lastAccess: number;
  visitors: Record<string, number>;
  daily: Record<string, number>;
}

export interface AnalyticsData {
  startedAt: number;
  visitors: Record<string, number>;
  daily: Record<string, number>;
  pages: Record<string, AnalyticsPageStats>;
}

export interface AnalyticsPageSummary {
  key: string;
  kind: AnalyticsPageKind;
  path: string;
  title: string;
  views: number;
  uniqueVisitors: number;
  lastAccess: number;
}

export interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  viewsToday: number;
  startedAt: number;
  pages: AnalyticsPageSummary[];
}

export interface AnalyticsPage {
  key: string;
  kind: AnalyticsPageKind;
  path: string;
  title: string;
}

export const DEFAULT_ANALYTICS_SETTINGS: AnalyticsSettings = {
  enabled: true,
  retentionDays: 30,
  excludeLocalhost: true,
};

const COOKIE_NAME = "local_note_share_visitor";
const VISITOR_ID_PATTERN = /^[0-9a-f]{48}$/;
const VISITOR_HASH_PATTERN = /^[0-9a-f]{64}$/;
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const RETENTION_OPTIONS = new Set([7, 30, 90, 365]);

export function createEmptyAnalyticsData(now = Date.now()): AnalyticsData {
  return { startedAt: now, visitors: {}, daily: {}, pages: {} };
}

export function normalizeAnalyticsSettings(value: unknown): AnalyticsSettings {
  const input = isRecord(value) ? value : {};
  const retentionDays = Number(input.retentionDays);
  return {
    enabled: input.enabled !== false,
    retentionDays: RETENTION_OPTIONS.has(retentionDays)
      ? retentionDays
      : DEFAULT_ANALYTICS_SETTINGS.retentionDays,
    excludeLocalhost: input.excludeLocalhost !== false,
  };
}

export function normalizeAnalyticsData(value: unknown, now = Date.now()): AnalyticsData {
  const input = isRecord(value) ? value : {};
  const pagesInput = isRecord(input.pages) ? input.pages : {};
  const pages: Record<string, AnalyticsPageStats> = {};

  for (const [key, rawPage] of Object.entries(pagesInput)) {
    if (!isRecord(rawPage) || (rawPage.kind !== "index" && rawPage.kind !== "note")) continue;
    pages[key] = {
      kind: rawPage.kind,
      path: stringValue(rawPage.path),
      title: stringValue(rawPage.title) || stringValue(rawPage.path) || "Page",
      views: positiveInteger(rawPage.views),
      lastAccess: positiveNumber(rawPage.lastAccess),
      visitors: normalizeVisitorMap(rawPage.visitors),
      daily: normalizeDailyMap(rawPage.daily),
    };
  }

  return {
    startedAt: positiveNumber(input.startedAt) || now,
    visitors: normalizeVisitorMap(input.visitors),
    daily: normalizeDailyMap(input.daily),
    pages,
  };
}

export function getAnonymousVisitorHash(
  req: IncomingMessage,
  res: ServerResponse,
  salt: string,
): string {
  const cookies = parseCookies(req.headers.cookie);
  let visitorId = cookies[COOKIE_NAME];

  if (!visitorId || !VISITOR_ID_PATTERN.test(visitorId)) {
    visitorId = createVisitorId();
    res.setHeader(
      "Set-Cookie",
      `${COOKIE_NAME}=${visitorId}; Max-Age=31536000; Path=/; HttpOnly; SameSite=Strict`,
    );
  }

  return createHash("sha256").update(`${salt}:${visitorId}`).digest("hex");
}

export function recordAnalyticsVisit(
  data: AnalyticsData,
  visitorHash: string,
  page: AnalyticsPage,
  retentionDays: number,
  now = Date.now(),
): void {
  if (!VISITOR_HASH_PATTERN.test(visitorHash)) return;
  pruneAnalytics(data, retentionDays, now);

  const day = dayKey(now);
  data.visitors[visitorHash] = now;
  data.daily[day] = (data.daily[day] || 0) + 1;

  const stats = data.pages[page.key] || {
    kind: page.kind,
    path: page.path,
    title: page.title,
    views: 0,
    lastAccess: 0,
    visitors: {},
    daily: {},
  };
  stats.kind = page.kind;
  stats.path = page.path;
  stats.title = page.title;
  stats.views += 1;
  stats.lastAccess = now;
  stats.visitors[visitorHash] = now;
  stats.daily[day] = (stats.daily[day] || 0) + 1;
  data.pages[page.key] = stats;
}

export function summarizeAnalytics(
  data: AnalyticsData,
  retentionDays: number,
  now = Date.now(),
): AnalyticsSummary {
  pruneAnalytics(data, retentionDays, now);
  const pages = Object.entries(data.pages)
    .map(([key, page]) => ({
      key,
      kind: page.kind,
      path: page.path,
      title: page.title,
      views: page.views,
      uniqueVisitors: Object.keys(page.visitors).length,
      lastAccess: page.lastAccess,
    }))
    .sort((left, right) => right.views - left.views || right.lastAccess - left.lastAccess);

  return {
    totalViews: pages.reduce((total, page) => total + page.views, 0),
    uniqueVisitors: Object.keys(data.visitors).length,
    viewsToday: data.daily[dayKey(now)] || 0,
    startedAt: data.startedAt,
    pages,
  };
}

export function isLoopbackAddress(address: string | undefined): boolean {
  if (!address) return false;
  const normalized = address.replace(/^::ffff:/, "");
  return normalized === "::1" || normalized === "127.0.0.1";
}

function pruneAnalytics(data: AnalyticsData, retentionDays: number, now: number): void {
  const cutoff = now - retentionDays * 86_400_000;
  const cutoffDay = dayKey(cutoff);
  pruneVisitorMap(data.visitors, cutoff);
  pruneDailyMap(data.daily, cutoffDay);

  for (const page of Object.values(data.pages)) {
    pruneVisitorMap(page.visitors, cutoff);
    pruneDailyMap(page.daily, cutoffDay);
  }
}

function pruneVisitorMap(visitors: Record<string, number>, cutoff: number): void {
  for (const [visitorHash, lastSeen] of Object.entries(visitors)) {
    if (lastSeen < cutoff) delete visitors[visitorHash];
  }
}

function pruneDailyMap(daily: Record<string, number>, cutoffDay: string): void {
  for (const day of Object.keys(daily)) {
    if (day < cutoffDay) delete daily[day];
  }
}

function normalizeVisitorMap(value: unknown): Record<string, number> {
  if (!isRecord(value)) return {};
  const visitors: Record<string, number> = {};
  for (const [visitorHash, rawLastSeen] of Object.entries(value)) {
    const lastSeen = positiveNumber(rawLastSeen);
    if (VISITOR_HASH_PATTERN.test(visitorHash) && lastSeen) visitors[visitorHash] = lastSeen;
  }
  return visitors;
}

function normalizeDailyMap(value: unknown): Record<string, number> {
  if (!isRecord(value)) return {};
  const daily: Record<string, number> = {};
  for (const [day, rawViews] of Object.entries(value)) {
    const views = positiveInteger(rawViews);
    if (DAY_PATTERN.test(day) && views) daily[day] = views;
  }
  return daily;
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  const cookies: Record<string, string> = {};
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 1) continue;
    const name = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    cookies[name] = value;
  }
  return cookies;
}

function createVisitorId(): string {
  const bytes = new Uint8Array(24);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function dayKey(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function positiveInteger(value: unknown): number {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : 0;
}

function positiveNumber(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.slice(0, 500) : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
