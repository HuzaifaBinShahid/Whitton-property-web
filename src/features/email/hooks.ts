import { useState } from 'react';
import toast from 'react-hot-toast';
import type { ComplianceDocument, Photo } from '@/types/db';
import { buildGmailUrl, copyRichHtmlToClipboard } from './buildGmailUrl';
import { useLogSentEmail } from '@/features/stats/hooks';

type ComposeArgs = {
  photos: Photo[];
  documents?: ComplianceDocument[];
  unitId?: string;
  propertyId?: string;
  unitName?: string;
  propertyName?: string;
};

export function useComposeEmail() {
  const [pending, setPending] = useState(false);
  const log = useLogSentEmail();

  const compose = async ({
    photos,
    documents = [],
    unitId,
    propertyId,
    unitName,
    propertyName,
  }: ComposeArgs) => {
    if (photos.length + documents.length === 0) {
      toast.error('Select at least one photo or document');
      return;
    }
    setPending(true);
    try {
      const subject =
        propertyName && unitName
          ? `${propertyName} — ${unitName}`
          : propertyName ?? unitName ?? '';

      const built = buildGmailUrl({ subject, photos, docs: documents });

      // Automatically copy rich HTML with embedded visual images to clipboard
      const copiedRich = await copyRichHtmlToClipboard(built.html, built.body);

      const opened = window.open(built.url, '_blank', 'noopener,noreferrer');

      if (copiedRich) {
        toast.success(
          'Formatted images & links copied! Press Cmd+V / Ctrl+V in Gmail to paste visual photos.',
          { duration: 6000, icon: '🖼️' },
        );
      } else if (!opened) {
        toast.error('Popup blocked. Allow popups to open Gmail.');
      } else {
        toast.success('Opened Gmail compose');
      }

      await log.mutateAsync({
        property_id: propertyId ?? null,
        unit_id: unitId ?? null,
        subject: subject || null,
        photo_count: photos.length + documents.length,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not open Gmail compose');
      throw e;
    } finally {
      setPending(false);
    }
  };

  return { compose, pending };
}

