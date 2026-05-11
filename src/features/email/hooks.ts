import { useState } from 'react';
import toast from 'react-hot-toast';
import type { ComplianceDocument, Photo } from '@/types/db';
import { buildGmailUrl } from './buildGmailUrl';
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
      const opened = window.open(built.url, '_blank', 'noopener,noreferrer');

      if (!opened) {
        try {
          await navigator.clipboard.writeText(built.body);
          toast.success('Popup blocked — email body copied to clipboard. Paste into Gmail.');
        } catch {
          toast.error('Popup blocked and could not access clipboard. Allow popups and retry.');
        }
      } else if (built.truncated) {
        toast(
          `Body trimmed — ${built.includedCount} link${built.includedCount === 1 ? '' : 's'} included, ${built.omittedCount} omitted.`,
          { icon: '✂️' },
        );
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
