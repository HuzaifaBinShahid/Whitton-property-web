import { AlertTriangle, CalendarClock, CheckCircle2 } from 'lucide-react';
import { daysUntil, formatDate } from '@/utils/dates';
import { cn } from '@/utils/cn';

type Props = {
  expiryDate: string | null;
  className?: string;
};

export function ExpiryBadge({ expiryDate, className }: Props) {
  const days = daysUntil(expiryDate);
  if (days === null) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[11px] font-semibold bg-border/50 text-muted dark:bg-border-dark/50 dark:text-muted-dark',
          className,
        )}
      >
        No expiry
      </span>
    );
  }
  if (days < 0) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[11px] font-semibold bg-red-500/15 text-red-600 dark:text-red-400',
          className,
        )}
      >
        <AlertTriangle size={11} strokeWidth={1.75} />
        Expired · {formatDate(expiryDate)}
      </span>
    );
  }
  if (days <= 30) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[11px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400',
          className,
        )}
      >
        <CalendarClock size={11} strokeWidth={1.75} />
        Soon · {days}d
      </span>
    );
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
        className,
      )}
    >
      <CheckCircle2 size={11} strokeWidth={1.75} />
      {formatDate(expiryDate)}
    </span>
  );
}
