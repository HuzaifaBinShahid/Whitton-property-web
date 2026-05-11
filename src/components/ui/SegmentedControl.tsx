import { motion } from 'framer-motion';
import { motion as tokens } from '@/theme/tokens';
import { cn } from '@/utils/cn';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: readonly Option<T>[];
  className?: string;
};

export function SegmentedControl<T extends string>({ value, onChange, options, className }: Props<T>) {
  return (
    <div
      className={cn(
        'relative inline-flex p-1 rounded-button bg-border/40 dark:bg-border-dark/40',
        className,
      )}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            type="button"
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              'relative z-10 px-3 h-8 rounded-button text-[13px] font-semibold transition-colors',
              active ? 'text-text dark:text-text-dark' : 'text-muted dark:text-muted-dark',
            )}
          >
            {active ? (
              <motion.span
                layoutId="segmented-pill"
                transition={tokens.spring}
                className="absolute inset-0 -z-10 rounded-button bg-surface shadow-sm dark:bg-surface-dark"
              />
            ) : null}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
