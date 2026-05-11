import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Plus } from 'lucide-react';
import type { ComplianceCategory, ComplianceDocument } from '@/types/db';
import { complianceCategoryMeta } from '../categories';
import { DocRow } from './DocRow';
import { DocUploader } from './DocUploader';
import { ExpiryBadge } from '@/components/ui/ExpiryBadge';
import { daysUntil } from '@/utils/dates';
import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/utils/cn';

type Props = {
  propertyId: string;
  category: ComplianceCategory;
  docs: ComplianceDocument[];
};

export function ComplianceCategorySection({ propertyId, category, docs }: Props) {
  const meta = complianceCategoryMeta(category);
  const [open, setOpen] = useState(false);
  const [uploaderOpen, setUploaderOpen] = useState(false);

  const summary = useMemo(() => {
    if (docs.length === 0) return null;
    const next = docs
      .filter((d) => d.expiry_date)
      .sort((a, b) => (a.expiry_date! < b.expiry_date! ? -1 : 1))[0];
    if (!next) return { expiry_date: null, count: docs.length };
    return { expiry_date: next.expiry_date, count: docs.length, days: daysUntil(next.expiry_date) };
  }, [docs]);

  return (
    <div className="rounded-card border border-border dark:border-border-dark bg-surface dark:bg-surface-dark overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-3.5 py-3 hover:bg-border/30 dark:hover:bg-border-dark/30 transition-colors"
      >
        <div className="flex-1 min-w-0 flex items-center gap-2 text-left">
          <div className="text-[14px] font-semibold truncate">{meta.label}</div>
          <span className="text-[12px] text-muted dark:text-muted-dark">
            {docs.length} {docs.length === 1 ? 'doc' : 'docs'}
          </span>
        </div>
        {summary?.expiry_date ? <ExpiryBadge expiryDate={summary.expiry_date} /> : null}
        <IconButton
          ariaLabel={open ? 'Collapse' : 'Expand'}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
        >
          <ChevronDown
            size={18}
            strokeWidth={1.75}
            className={cn('transition-transform', open && 'rotate-180')}
          />
        </IconButton>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="border-t border-border dark:border-border-dark"
          >
            <div className="p-3 flex flex-col gap-2">
              {docs.length === 0 ? (
                <div className="text-[13px] text-muted dark:text-muted-dark italic px-1">
                  No documents in this category yet.
                </div>
              ) : (
                docs.map((d) => <DocRow key={d.id} doc={d} />)
              )}
              <button
                type="button"
                onClick={() => setUploaderOpen(true)}
                className="mt-1 inline-flex items-center gap-2 self-start text-accent dark:text-accent-dark text-[13px] font-semibold hover:underline"
              >
                <Plus size={14} strokeWidth={1.75} />
                Upload {meta.short} document
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <DocUploader
        propertyId={propertyId}
        category={category}
        open={uploaderOpen}
        onClose={() => setUploaderOpen(false)}
      />
    </div>
  );
}
