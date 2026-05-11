import { cn } from '@/utils/cn';

type Props = {
  className?: string;
};

export function Skeleton({ className }: Props) {
  return <div className={cn('skeleton', className)} />;
}
