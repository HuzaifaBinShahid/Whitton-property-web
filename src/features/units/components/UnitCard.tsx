import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DoorOpen } from 'lucide-react';
import type { Unit } from '@/types/db';
import { UnitCategoryBadge } from './UnitCategoryBadge';
import { useUnitCover } from '@/features/properties/hooks';
import { getThumbUrl } from '@/lib/supabase';

type Props = {
  unit: Unit;
  index: number;
};

export function UnitCard({ unit, index }: Props) {
  const cover = useUnitCover(unit.id);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: Math.min(index, 8) * 0.03 }}
    >
      <Link
        to={`/unit/${unit.id}`}
        className="group block rounded-card overflow-hidden bg-surface border border-border dark:bg-surface-dark dark:border-border-dark hover:border-accent/40 dark:hover:border-accent-dark/40 transition-colors"
      >
        <div className="relative aspect-[4/3] bg-border/40 dark:bg-border-dark/40">
          {cover.data ? (
            <img
              src={getThumbUrl(cover.data, 500)}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted dark:text-muted-dark">
              <DoorOpen size={22} strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div className="p-3.5">
          <div className="text-[15px] font-semibold truncate mb-1.5">{unit.name}</div>
          <UnitCategoryBadge value={unit.category} short />
        </div>
      </Link>
    </motion.div>
  );
}
