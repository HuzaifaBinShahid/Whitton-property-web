import { Home } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Property } from '@/types/db';
import { usePropertyCover } from '../hooks';
import { getThumbUrl } from '@/lib/supabase';

type Props = {
  property: Property;
};

export function PropertyHero({ property }: Props) {
  const cover = usePropertyCover(property.id);
  return (
    <div className="relative h-56 sm:h-72 rounded-card overflow-hidden bg-border/40 dark:bg-border-dark/40">
      {cover.data ? (
        <motion.img
          src={getThumbUrl(cover.data, 1200)}
          alt=""
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-muted dark:text-muted-dark">
          <Home size={36} strokeWidth={1.5} />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/30 to-transparent p-4 sm:p-5">
        <div className="text-white text-[24px] sm:text-[28px] font-semibold leading-tight drop-shadow-md">
          {property.name}
        </div>
        {property.address ? (
          <div className="text-white/85 text-[13px] sm:text-[14px] drop-shadow">
            {property.address}
          </div>
        ) : null}
      </div>
    </div>
  );
}
