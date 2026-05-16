import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Photo } from '@/types/db';
import { getThumbUrl } from '@/lib/supabase';
import { cn } from '@/utils/cn';

type Props = {
  photo: Photo;
  selectable?: boolean;
  selected?: boolean;
  onClick?: (photo: Photo) => void;
  onSetCover?: (photo: Photo) => void;
};

export function PhotoTile({ photo, selectable, selected, onClick, onSetCover }: Props) {
  const isCover = photo.is_cover;
  const showStar = !selectable && Boolean(onSetCover);

  return (
    <motion.div
      onClick={() => onClick?.(photo)}
      whileHover={{ scale: selectable ? 1 : 1.02 }}
      whileTap={{ scale: 0.97 }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(photo);
        }
      }}
      className={cn(
        'group relative block w-full aspect-square overflow-hidden rounded-tile bg-border/40 dark:bg-border-dark/40 ring-1 transition-all cursor-pointer outline-none focus-visible:ring-accent',
        selected ? 'ring-2 ring-accent dark:ring-accent-dark' : 'ring-border dark:ring-border-dark',
      )}
    >
      <img
        src={getThumbUrl(photo.storage_path, 500)}
        alt={photo.label ?? ''}
        loading="lazy"
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-transform duration-300',
          !selectable && 'group-hover:scale-105',
          selected && 'opacity-90',
        )}
      />

      {selectable ? (
        <span
          className={cn(
            'absolute top-2 left-2 inline-flex h-6 w-6 items-center justify-center rounded-pill border-2 transition-all',
            selected
              ? 'bg-accent border-accent text-white dark:bg-accent-dark dark:border-accent-dark dark:text-bg-dark'
              : 'bg-black/30 border-white/70 text-transparent',
          )}
        >
          <Check size={14} strokeWidth={2} />
        </span>
      ) : null}

      {showStar ? (
        <button
          type="button"
          aria-label={isCover ? 'Current cover photo' : 'Mark as cover'}
          aria-pressed={isCover}
          onClick={(e) => {
            e.stopPropagation();
            if (!isCover) onSetCover?.(photo);
          }}
          className={cn(
            'absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-pill transition-all',
            isCover
              ? 'bg-amber-400 text-bg shadow-lg shadow-black/30'
              : 'bg-black/45 text-white opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-black/60',
          )}
        >
          <Star
            size={14}
            strokeWidth={1.75}
            fill={isCover ? 'currentColor' : 'none'}
          />
        </button>
      ) : null}

      {isCover ? (
        <span className="absolute bottom-1.5 right-1.5 rounded-pill bg-amber-400 px-1.5 py-0.5 text-[10px] font-semibold text-bg shadow-md">
          Cover
        </span>
      ) : null}

      {photo.label ? (
        <span className="absolute bottom-1.5 left-1.5 max-w-[60%] truncate rounded-tile bg-black/55 px-1.5 py-0.5 text-[11px] text-white">
          {photo.label}
        </span>
      ) : null}
    </motion.div>
  );
}
