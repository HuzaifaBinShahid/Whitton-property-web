import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

type Props = {
  label?: string;
  error?: string | null;
  hint?: string;
  className?: string;
  inputClassName?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'>;

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, hint, className, inputClassName, id, ...rest },
  ref,
) {
  const autoId = id ?? `in-${Math.random().toString(36).slice(2, 8)}`;
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
      <input
        ref={ref}
        id={autoId}
        className={cn(
          'h-11 rounded-button border bg-surface px-3.5 text-[15px] text-text outline-none transition-colors',
          'placeholder:text-muted/60 dark:bg-surface-dark dark:text-text-dark dark:placeholder:text-muted-dark/60',
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-border focus:border-accent dark:border-border-dark dark:focus:border-accent-dark',
          inputClassName,
        )}
        {...rest}
      />
      {error ? (
        <span className="text-[12px] text-red-500">{error}</span>
      ) : hint ? (
        <span className="text-[12px] text-muted dark:text-muted-dark">{hint}</span>
      ) : null}
    </div>
  );
});
