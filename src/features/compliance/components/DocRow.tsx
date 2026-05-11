import { ExternalLink, FileText, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { ComplianceDocument } from '@/types/db';
import { ExpiryBadge } from '@/components/ui/ExpiryBadge';
import { IconButton } from '@/components/ui/IconButton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { getDocUrl } from '@/lib/supabase';
import { useDeleteDoc } from '../hooks';

type Props = {
  doc: ComplianceDocument;
};

export function DocRow({ doc }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const del = useDeleteDoc();

  const handleDelete = async () => {
    try {
      await del.mutateAsync(doc);
      toast.success('Document deleted');
      setConfirmOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not delete');
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-tile bg-surface border border-border dark:bg-surface-dark dark:border-border-dark">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-tile bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
          <FileText size={16} strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold truncate">{doc.name}</div>
          <div className="mt-0.5">
            <ExpiryBadge expiryDate={doc.expiry_date} />
          </div>
        </div>
        <a
          href={getDocUrl(doc.storage_path)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 w-9 items-center justify-center rounded-button text-muted hover:bg-border/40 dark:text-muted-dark dark:hover:bg-border-dark/40"
          aria-label="Open document"
        >
          <ExternalLink size={16} strokeWidth={1.75} />
        </a>
        <IconButton
          ariaLabel="Delete document"
          variant="danger"
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 size={16} strokeWidth={1.75} />
        </IconButton>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete document"
        message={`Delete "${doc.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={del.isPending}
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
