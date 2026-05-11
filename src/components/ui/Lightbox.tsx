import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { IconButton } from './IconButton';

type Props = {
  open: boolean;
  urls: string[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
};

export function Lightbox({ open, urls, index, onClose, onIndexChange }: Props) {
  const prev = useCallback(() => {
    if (urls.length === 0) return;
    onIndexChange((index - 1 + urls.length) % urls.length);
  }, [index, urls.length, onIndexChange]);

  const next = useCallback(() => {
    if (urls.length === 0) return;
    onIndexChange((index + 1) % urls.length);
  }, [index, urls.length, onIndexChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [open, prev, next, onClose]);

  const url = urls[index];

  return (
    <AnimatePresence>
      {open && url ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        >
          <motion.img
            key={url}
            src={url}
            alt=""
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute top-4 right-4">
            <IconButton ariaLabel="Close" onClick={onClose} variant="surface">
              <X size={18} strokeWidth={1.75} />
            </IconButton>
          </div>
          {urls.length > 1 ? (
            <>
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <IconButton
                  ariaLabel="Previous"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  variant="surface"
                >
                  <ChevronLeft size={20} strokeWidth={1.75} />
                </IconButton>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <IconButton
                  ariaLabel="Next"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  variant="surface"
                >
                  <ChevronRight size={20} strokeWidth={1.75} />
                </IconButton>
              </div>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-pill bg-black/50 text-white text-[12px]">
                {index + 1} / {urls.length}
              </div>
            </>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
