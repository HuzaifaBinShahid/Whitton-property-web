import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Property } from '@/types/db';
import { usePropertyCover, usePropertyUnitCount } from '../hooks';
import { getThumbUrl } from '@/lib/supabase';

type Props = {
  property: Property;
  index: number;
};

export function PropertyCard({ property, index }: Props) {
  const cover = usePropertyCover(property.id);
  const unitCount = usePropertyUnitCount(property.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: Math.min(index, 8) * 0.03 }}
    >
      <Link
        to={`/property/${property.id}`}
        className="group block rounded-card overflow-hidden bg-surface border border-border dark:bg-surface-dark dark:border-border-dark hover:border-accent/40 dark:hover:border-accent-dark/40 transition-colors"
      >
        <div className="relative aspect-[4/3] bg-border/40 dark:bg-border-dark/40">
          {cover.data ? (
            <img
              src={getThumbUrl(cover.data, 600)}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted dark:text-muted-dark">
              <Home size={28} strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div className="p-3.5">
          <div className="text-[15px] font-semibold truncate">{property.name}</div>
          <div className="text-[12px] text-muted dark:text-muted-dark truncate">
            {property.address || 'No address'}
          </div>
          <div className="mt-1.5 text-[12px] text-muted dark:text-muted-dark">
            {(unitCount.data ?? 0)} {unitCount.data === 1 ? 'unit' : 'units'}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
