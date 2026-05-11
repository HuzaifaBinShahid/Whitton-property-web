import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Props = {
  children: ReactNode;
  className?: string;
  withPaddingBottom?: boolean;
};

export function PageContainer({ children, className, withPaddingBottom = true }: Props) {
  return (
    <div
      className={cn(
        'mx-auto max-w-5xl px-3 sm:px-5 pt-4',
        withPaddingBottom && 'pb-32',
        className,
      )}
    >
      {children}
    </div>
  );
}
