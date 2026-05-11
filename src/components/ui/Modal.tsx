import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { motion as tokens } from '@/theme/tokens';
import { IconButton } from './IconButton';
import { cn } from '@/utils/cn';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
};

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-xl',
};

export function Modal({ open, onClose, title, children, footer, size = 'md' }: Props) {
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/60"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={tokens.spring}
            className={cn(
              'relative w-full rounded-card bg-surface border border-border shadow-2xl dark:bg-surface-dark dark:border-border-dark',
              SIZES[size],
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-border dark:border-border-dark">
              <h2 className="text-[16px] font-semibold">{title}</h2>
              <IconButton ariaLabel="Close" onClick={onClose}>
                <X size={18} strokeWidth={1.75} />
              </IconButton>
            </div>
            <div className="p-5">{children}</div>
            {footer ? (
              <div className="flex justify-end gap-2 p-4 border-t border-border dark:border-border-dark">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
