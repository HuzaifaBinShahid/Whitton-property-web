import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

type Props = {
  label?: string;
  error?: string | null;
  className?: string;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>;

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { label, error, className, id, rows = 4, ...rest },
  ref,
) {
  const autoId = id ?? `ta-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label ? (
        <label
          htmlFor={autoId}
          className="text-[12px] font-semibold uppercase tracking-wider text-muted dark:text-muted-dark"
        >
          {label}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={autoId}
        rows={rows}
        className={cn(
          'rounded-button border bg-surface px-3.5 py-2.5 text-[15px] text-text outline-none transition-colors resize-none',
          'placeholder:text-muted/60 dark:bg-surface-dark dark:text-text-dark dark:placeholder:text-muted-dark/60',
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-border focus:border-accent dark:border-border-dark dark:focus:border-accent-dark',
        )}
        {...rest}
      />
      {error ? <span className="text-[12px] text-red-500">{error}</span> : null}
    </div>
  );
});
