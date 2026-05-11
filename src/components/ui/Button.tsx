import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { AnimatedPressable } from './AnimatedPressable';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

type Props = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent/90 dark:bg-accent-dark dark:text-bg-dark dark:hover:bg-accent-dark/90',
  secondary:
    'bg-surface text-text border border-border hover:bg-border/40 dark:bg-surface-dark dark:text-text-dark dark:border-border-dark dark:hover:bg-border-dark/40',
  ghost:
    'bg-transparent text-text hover:bg-border/40 dark:text-text-dark dark:hover:bg-border-dark/40',
  danger: 'bg-red-500 text-white hover:bg-red-500/90',
};

const SIZES: Record<Size, string> = {
  md: 'h-10 px-4 text-[14px]',
  lg: 'h-12 px-5 text-[15px]',
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading,
    disabled,
    fullWidth,
    leftIcon,
    rightIcon,
    children,
    className,
    type = 'button',
    onClick,
  },
  ref,
) {
  const isDisabled = disabled || loading;
  return (
    <AnimatedPressable
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-button font-semibold transition-colors select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </AnimatedPressable>
  );
});
