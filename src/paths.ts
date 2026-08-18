import path from "node:path";

export function parentFolderPath(folderPath: string): string {
  const normalized = normalizeVaultPath(folderPath);
  if (!normalized || !normalized.includes("/")) return "";
  return normalized.slice(0, normalized.lastIndexOf("/"));
}

export function normalizeVaultPath(value: unknown): string {
  const raw = stringValue(value).replace(/\\/g, "/").replace(/^\/+/, "");
  if (!raw || raw.includes("\0")) return "";
  const normalized = path.posix.normalize(raw);
  if (normalized === "." || normalized === ".." || normalized.startsWith("../")) return "";
  return normalized;
}

export function parseLinkTarget(value: unknown): { path: string; subpath: string } {
  const clean = stringValue(value).split("|")[0].trim().replace(/^<|>$/g, "");
  if (!clean) return { path: "", subpath: "" };
  const [rawPath, ...rawSubpath] = clean.split("#");
  return { path: rawPath.trim(), subpath: rawSubpath.join("#").trim() };
}

export function slugifyHeading(value: unknown): string {
  return stringValue(value)
    .trim().toLowerCase().replace(/<[^>]+>/g, "").replace(/[`*_~[\]\\]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export function escapeHtml(value: unknown): string {
  return stringValue(value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}
