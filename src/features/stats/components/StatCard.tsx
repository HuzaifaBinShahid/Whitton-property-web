import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

type Props = {
  label: string;
  value: number | string;
  icon: ReactNode;
  index?: number;
};

export function StatCard({ label, value, icon, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.04 }}
    >
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-tile bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
            {icon}
          </div>
          <div className="text-[12px] uppercase tracking-wider font-semibold text-muted dark:text-muted-dark">
            {label}
          </div>
        </div>
        <div className="text-[28px] font-semibold leading-tight tabular-nums">{value}</div>
      </Card>
    </motion.div>
  );
}
