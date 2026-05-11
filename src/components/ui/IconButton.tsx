import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import { AnimatedPressable } from './AnimatedPressable';
import { cn } from '@/utils/cn';

type Props = {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
  variant?: 'ghost' | 'surface' | 'danger';
};

const VARIANTS = {
  ghost:
    'text-text hover:bg-border/40 dark:text-text-dark dark:hover:bg-border-dark/40',
  surface:
    'bg-surface border border-border text-text hover:bg-border/40 dark:bg-surface-dark dark:border-border-dark dark:text-text-dark dark:hover:bg-border-dark/40',
  danger: 'text-red-500 hover:bg-red-500/10',
};

export const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { children, onClick, ariaLabel, disabled, className, variant = 'ghost' },
  ref,
) {
  return (
    <AnimatedPressable
      ref={ref}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      type="button"
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-button transition-colors disabled:opacity-50',
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </AnimatedPressable>
  );
});
