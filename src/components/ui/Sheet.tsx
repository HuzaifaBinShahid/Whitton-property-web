import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { motion as tokens } from '@/theme/tokens';
import { IconButton } from './IconButton';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export function Sheet({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={onClose} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={tokens.spring}
            className="relative w-full sm:max-w-md bg-surface border-t border-border dark:bg-surface-dark dark:border-border-dark rounded-t-card sm:rounded-card max-h-[85vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border dark:border-border-dark">
              <h2 className="text-[16px] font-semibold">{title}</h2>
              <IconButton ariaLabel="Close" onClick={onClose}>
                <X size={18} strokeWidth={1.75} />
              </IconButton>
            </div>
            <div className="overflow-y-auto p-2">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
