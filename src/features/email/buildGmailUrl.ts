import type { ComplianceDocument, Photo } from '@/types/db';
import { getDocUrl, getPhotoUrl } from '@/lib/supabase';

const GMAIL_BASE = 'https://mail.google.com/mail/?view=cm&fs=1';
const MAX_BODY = 1800;
const FOOTER_RESERVE = 80;

type Input = {
  subject: string;
  photos: Photo[];
  docs: ComplianceDocument[];
};

export type BuildResult = {
  url: string;
  body: string;
  truncated: boolean;
  includedCount: number;
  omittedCount: number;
};

export function buildGmailUrl({ subject, photos, docs }: Input): BuildResult {
  const lines: string[] = [];
  for (const p of photos) lines.push(getPhotoUrl(p.storage_path));
  for (const d of docs) lines.push(`${d.name}: ${getDocUrl(d.storage_path)}`);

  const fullBody = lines.join('\n');

  if (fullBody.length <= MAX_BODY) {
    return {
      url: composeUrl(subject, fullBody),
      body: fullBody,
      truncated: false,
      includedCount: lines.length,
      omittedCount: 0,
    };
  }

  const fit: string[] = [];
  let used = 0;
  for (const line of lines) {
    if (used + line.length + 1 > MAX_BODY - FOOTER_RESERVE) break;
    fit.push(line);
    used += line.length + 1;
  }
  const omitted = lines.length - fit.length;
  const body = `${fit.join('\n')}\n\n+${omitted} more — open the app to view`;

  return {
    url: composeUrl(subject, body),
    body,
    truncated: true,
    includedCount: fit.length,
    omittedCount: omitted,
  };
}

function composeUrl(subject: string, body: string): string {
  return `${GMAIL_BASE}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
