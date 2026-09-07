import type { ComplianceDocument, Photo } from "@/types/db";
import { getDocUrl, getPhotoUrl } from "@/lib/supabase";

const GMAIL_BASE = "https://mail.google.com/mail/?view=cm&fs=1";
const MAX_BODY = 1800;
const FOOTER_RESERVE = 80;

type Input = { subject: string; photos: Photo[]; docs: ComplianceDocument[]; };
export type BuildResult = { url: string; body: string; html: string; truncated: boolean; includedCount: number; omittedCount: number; };

export function buildGmailUrl({ subject, photos, docs }: Input): BuildResult {
  const lines: string[] = [];
  if (photos.length > 0) {
    lines.push(`📷 PHOTOS (${photos.length}):`);
    photos.forEach((p, idx) => {
      const label = p.label ? ` (${p.label})` : p.position ? ` (${p.position})` : "";
      lines.push(`${idx + 1}. Photo${label}: ${getPhotoUrl(p.storage_path)}`);
    });
    lines.push("");
  }
  if (docs.length > 0) {
    lines.push(`📄 COMPLIANCE DOCUMENTS (${docs.length}):`);
    docs.forEach((d, idx) => { lines.push(`${idx + 1}. ${d.name}: ${getDocUrl(d.storage_path)}`); });
    lines.push("");
  }
  const fullBody = lines.join("\n").trim();
  const html = buildHtmlEmail({ subject, photos, docs });
  if (fullBody.length <= MAX_BODY) {
    return { url: composeUrl(subject, fullBody), body: fullBody, html, truncated: false, includedCount: photos.length + docs.length, omittedCount: 0 };
  }
  const fit: string[] = []; let used = 0;
  for (const line of lines) {
    if (used + line.length + 1 > MAX_BODY - FOOTER_RESERVE) break;
    fit.push(line); used += line.length + 1;
  }
  const omitted = photos.length + docs.length - fit.length;
  const body = `${fit.join("\n")}\n\n+${omitted} more items — open the app to view`;
  return { url: composeUrl(subject, body), body, html, truncated: true, includedCount: fit.length, omittedCount: omitted };
}

export function buildHtmlEmail({ subject, photos, docs }: Input): string {
  const photoItems = photos.map((p, idx) => {
    const url = getPhotoUrl(p.storage_path);
    const label = p.label || p.position || `Photo ${idx + 1}`;
    return `<div style="margin-bottom: 16px; display: inline-block; vertical-align: top; margin-right: 12px;"><p style="font-size: 13px; font-weight: 600; color: #374151; margin: 0 0 6px 0;">${label}</p><a href="${url}" target="_blank"><img src="${url}" alt="${label}" width="320" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #E5E7EB; display: block;" /></a></div>`;
  }).join("");
  const docItems = docs.map((d) => `<li style="margin-bottom: 8px;"><a href="${getDocUrl(d.storage_path)}" target="_blank" style="font-size: 14px; color: #2563EB; font-weight: 500;">📄 ${d.name} ↗</a></li>`).join("");
  return `<div style="font-family: sans-serif; color: #1F2937; max-width: 680px; padding: 12px;"><h2 style="font-size: 18px; font-weight: 700;">${subject}</h2>${photos.length > 0 ? `<h3 style="font-size: 14px; font-weight: 600; text-transform: uppercase; color: #6B7280;">📷 Photos (${photos.length})</h3><div>${photoItems}</div>` : ""}${docs.length > 0 ? `<h3 style="font-size: 14px; font-weight: 600; text-transform: uppercase; color: #6B7280;">📄 Documents (${docs.length})</h3><ul style="padding-left: 20px;">${docItems}</ul>` : ""}</div>`;
}

export async function copyRichHtmlToClipboard(html: string, plainText: string): Promise<boolean> {
  if (!navigator.clipboard || !window.ClipboardItem) { await navigator.clipboard.writeText(plainText); return false; }
  try {
    await navigator.clipboard.write([new ClipboardItem({ "text/html": new Blob([html], { type: "text/html" }), "text/plain": new Blob([plainText], { type: "text/plain" }) })]);
    return true;
  } catch { await navigator.clipboard.writeText(plainText); return false; }
}

function composeUrl(subject: string, body: string): string { return `${GMAIL_BASE}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; }
