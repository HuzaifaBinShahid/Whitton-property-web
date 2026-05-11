import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export function Card({ children, className, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-card bg-surface border border-border dark:bg-surface-dark dark:border-border-dark',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  );
}
