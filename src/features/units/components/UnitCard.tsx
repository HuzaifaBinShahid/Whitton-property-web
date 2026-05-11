import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DoorOpen } from 'lucide-react';
import type { Unit } from '@/types/db';
import { UnitCategoryBadge } from './UnitCategoryBadge';

type Props = {
  unit: Unit;
  index: number;
};

export function UnitCard({ unit, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: Math.min(index, 8) * 0.03 }}
    >
      <Link
        to={`/unit/${unit.id}`}
        className="group block rounded-card bg-surface border border-border dark:bg-surface-dark dark:border-border-dark hover:border-accent/40 dark:hover:border-accent-dark/40 transition-colors p-3.5"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-tile bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
            <DoorOpen size={16} strokeWidth={1.75} />
          </div>
          <div className="text-[15px] font-semibold truncate flex-1 min-w-0">{unit.name}</div>
        </div>
        <UnitCategoryBadge value={unit.category} short />
      </Link>
    </motion.div>
  );
}
