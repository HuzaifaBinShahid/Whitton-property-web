import { Check, FileText } from 'lucide-react';
import type { ComplianceDocument } from '@/types/db';
import { ExpiryBadge } from '@/components/ui/ExpiryBadge';
import { cn } from '@/utils/cn';

type Props = {
  doc: ComplianceDocument;
  selected: boolean;
  onClick: () => void;
};

export function SelectableDocRow({ doc, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-tile border transition-colors text-left mb-1.5',
        selected
          ? 'bg-accent/5 border-accent dark:bg-accent-dark/10 dark:border-accent-dark'
          : 'bg-surface border-border dark:bg-surface-dark dark:border-border-dark hover:border-accent/40 dark:hover:border-accent-dark/40',
      )}
    >
      <span
        className={cn(
          'inline-flex h-6 w-6 items-center justify-center rounded-pill border-2 transition-colors',
          selected
            ? 'bg-accent border-accent text-white dark:bg-accent-dark dark:border-accent-dark dark:text-bg-dark'
            : 'bg-transparent border-border dark:border-border-dark text-transparent',
        )}
      >
        <Check size={14} strokeWidth={2} />
      </span>
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-tile bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
        <FileText size={16} strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold truncate">{doc.name}</div>
        <div className="mt-0.5">
          <ExpiryBadge expiryDate={doc.expiry_date} />
        </div>
      </div>
    </button>
  );
}
