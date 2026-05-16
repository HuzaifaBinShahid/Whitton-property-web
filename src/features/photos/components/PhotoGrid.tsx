import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { Photo } from '@/types/db';
import { PhotoTile } from './PhotoTile';
import { Lightbox } from '@/components/ui/Lightbox';
import { getPhotoUrl } from '@/lib/supabase';

type Props = {
  photos: Photo[];
  selectable?: boolean;
  selectedIds?: Set<string>;
  onTogglePhoto?: (photo: Photo) => void;
  onSetCover?: (photo: Photo) => void;
  trailing?: ReactNode;
};

export function PhotoGrid({
  photos,
  selectable,
  selectedIds,
  onTogglePhoto,
  onSetCover,
  trailing,
}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleClick = (photo: Photo) => {
    if (selectable && onTogglePhoto) {
      onTogglePhoto(photo);
      return;
    }
    const i = photos.findIndex((p) => p.id === photo.id);
    if (i >= 0) setLightboxIndex(i);
  };

  return (
    <>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.03 } },
        }}
      >
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
            }}
          >
            <PhotoTile
              photo={photo}
              selectable={selectable}
              selected={selectedIds?.has(photo.id) ?? false}
              onClick={handleClick}
              onSetCover={onSetCover}
            />
          </motion.div>
        ))}
        {trailing ? <div>{trailing}</div> : null}
      </motion.div>

      <Lightbox
        open={lightboxIndex !== null}
        urls={photos.map((p) => getPhotoUrl(p.storage_path))}
        index={lightboxIndex ?? 0}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  );
}
